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
- GitHub Actions does not deploy with the Vercel CLI; it only validates quality before merge.
- `VERCEL_TOKEN` is not required in GitHub while native Vercel Git deployment is used.

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
