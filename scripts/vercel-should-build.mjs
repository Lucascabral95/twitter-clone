#!/usr/bin/env node

const BUILD = 1;
const SKIP_DEPLOY = 0;

const gatedBranch = process.env.VERCEL_GATED_BRANCH || "main";
const branch = process.env.VERCEL_GIT_COMMIT_REF;
const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const owner = process.env.VERCEL_GIT_REPO_OWNER;
const repo = process.env.VERCEL_GIT_REPO_SLUG;
const token = process.env.GITHUB_ACTIONS_READ_TOKEN || process.env.GITHUB_TOKEN;
const requiredWorkflowName = process.env.GITHUB_REQUIRED_WORKFLOW_NAME || "CI";
const timeoutMs = Number(process.env.VERCEL_CI_GATE_TIMEOUT_MS || 15 * 60 * 1000);
const pollIntervalMs = Number(process.env.VERCEL_CI_GATE_POLL_INTERVAL_MS || 15 * 1000);

function log(message) {
  console.log(`[vercel-ci-gate] ${message}`);
}

function continueBuild(message) {
  log(`${message}. Continuing Vercel build.`);
  process.exit(BUILD);
}

function skipDeploy(message) {
  log(`${message}. Skipping Vercel build.`);
  process.exit(SKIP_DEPLOY);
}

function assertPositiveNumber(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    skipDeploy(`${name} must be a positive number`);
  }
}

async function getWorkflowRuns() {
  const url = new URL(`https://api.github.com/repos/${owner}/${repo}/actions/runs`);
  url.searchParams.set("head_sha", sha);
  url.searchParams.set("per_page", "20");

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "twitter-clone-vercel-ci-gate",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API returned ${response.status}: ${body}`);
  }

  return response.json();
}

function findRequiredRun(workflowRuns) {
  return workflowRuns
    .filter((run) => run.name === requiredWorkflowName)
    .filter((run) => run.head_branch === gatedBranch)
    .filter((run) => run.event === "push")
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())[0];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForRequiredWorkflow() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const data = await getWorkflowRuns();
    const requiredRun = findRequiredRun(data.workflow_runs || []);

    if (!requiredRun) {
      log(`No ${requiredWorkflowName} push run found yet for ${sha}; waiting...`);
      await sleep(pollIntervalMs);
      continue;
    }

    log(`${requiredWorkflowName} run ${requiredRun.id} is ${requiredRun.status}/${requiredRun.conclusion || "pending"}`);

    if (requiredRun.status !== "completed") {
      await sleep(pollIntervalMs);
      continue;
    }

    if (requiredRun.conclusion === "success") {
      continueBuild(`${requiredWorkflowName} succeeded for ${sha}`);
    }

    skipDeploy(`${requiredWorkflowName} concluded with ${requiredRun.conclusion || "unknown"}`);
  }

  skipDeploy(`Timed out waiting for ${requiredWorkflowName} to pass for ${sha}`);
}

async function main() {
  if (!branch) {
    continueBuild("VERCEL_GIT_COMMIT_REF is not set");
  }

  if (branch !== gatedBranch) {
    continueBuild(`Branch ${branch} is not gated branch ${gatedBranch}`);
  }

  if (!sha || !owner || !repo) {
    skipDeploy("Missing Vercel Git metadata for gated production branch");
  }

  if (!token) {
    skipDeploy("Missing GITHUB_ACTIONS_READ_TOKEN for gated production branch");
  }

  assertPositiveNumber(timeoutMs, "VERCEL_CI_GATE_TIMEOUT_MS");
  assertPositiveNumber(pollIntervalMs, "VERCEL_CI_GATE_POLL_INTERVAL_MS");

  await waitForRequiredWorkflow();
}

main().catch((error) => {
  skipDeploy(error instanceof Error ? error.message : String(error));
});
