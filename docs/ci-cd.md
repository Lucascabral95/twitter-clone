# CI/CD

This project uses GitHub Actions as a quality gate and Vercel as the deployment platform. The production branch is `main`.

## Pull Request Flow

1. Open a pull request targeting `main`.
2. GitHub Actions runs `CI / Quality gate`:

   ```bash
   npm ci --prefer-offline --no-audit
   npm run lint
   npm test -- --runInBand
   npm run build
   ```

3. Vercel creates a Preview Deployment for the pull request.
4. Merge only when CI and the Vercel deployment check are green.

## Production Deploy

- Vercel deploys production automatically when `main` receives the merge.
- Production deployments are gated by Vercel's Ignored Build Step.
- GitHub Actions does not deploy with the Vercel CLI; it validates quality before Vercel is allowed to build production.
- `VERCEL_TOKEN` is not required in GitHub while native Vercel Git deployment is used.

## Vercel Production Gate

Configure this in Vercel Project Settings:

1. Open `Settings > Git`.
2. Set `Ignored Build Step` to:

   ```bash
   node scripts/vercel-should-build.mjs
   ```

3. Add this Vercel environment variable to Production:

   ```bash
   GITHUB_ACTIONS_READ_TOKEN=<github-token-with-actions-read-access>
   ```

The token must be able to read GitHub Actions workflow runs for this repository. A fine-grained GitHub token scoped to this repository with Actions read access is enough.

The script gates only `main` by default. For production commits on `main`, Vercel waits until the GitHub Actions workflow named `CI` finishes successfully for the same commit SHA. If CI fails, is cancelled, cannot be found, or times out, Vercel skips the production build.

Optional variables:

- `VERCEL_GATED_BRANCH`: defaults to `main`.
- `GITHUB_REQUIRED_WORKFLOW_NAME`: defaults to `CI`.
- `VERCEL_CI_GATE_TIMEOUT_MS`: defaults to 15 minutes.
- `VERCEL_CI_GATE_POLL_INTERVAL_MS`: defaults to 15 seconds.

## Recommended Branch Protection

Configure a branch protection rule or ruleset for `main` with:

- Require a pull request before merging.
- Require at least 1 approval.
- Dismiss stale approvals when new commits are pushed.
- Require conversations to be resolved before merging.
- Require status checks: `CI / Quality gate` and the Vercel deployment check.
- Block direct pushes, force pushes, and branch deletion.
- Require linear history if it matches the repository workflow.

## Vercel Environment Variables

Configure Production and Preview with the keys from `.env.example`:

- `JWT_SECRET`
- `DATABASE_URL`
- `ORIGINAL_URL`
- `CLOUDINARY_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Optional `DB_POOL_*` variables when pool tuning is needed.

Preview should use a separate Neon database from Production. If Preview points to the production database, pull requests can write real data and the setup should not be considered production-grade.

## Database Migrations

- CI/CD does not run database migrations automatically.
- Run `npm run db:migrate` in a controlled step when a pull request changes `sql/migrations`.
- Never run `npm run db:reset` in CI/CD or against Production.
