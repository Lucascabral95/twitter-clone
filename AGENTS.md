# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 14, React 18, and TypeScript Twitter clone. Application routes and API handlers live in `src/app`, reusable UI in `src/components`, custom hooks in `src/presentation/hooks`, services in `src/services`, shared utilities in `src/utils`, domain/data interfaces in `src/infrastructure`, and DAO-style data access in `src/models`. Global Zustand state is in `src/zustand.tsx`, middleware is in `src/middleware.ts`, database scripts are in `scripts`, SQL migrations are in `sql/migrations`, public assets are in `public`, and Jest mocks are in `test/__mocks__`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server.
- `npm run build`: create the production build and run Next.js checks.
- `npm run start`: serve the production build locally.
- `npm run lint`: run the Next.js ESLint configuration.
- `npm test`: run the Jest test suite once.
- `npm run test:watch`: run Jest in watch mode while developing.
- `npm run test:coverage`: generate a Jest coverage report.
- `npm run db:migrate`, `npm run db:seed`, `npm run db:reset`: run database migration and seed scripts using `.env`.

## Coding Style & Naming Conventions

Use TypeScript for application code and keep components, hooks, services, and data access responsibilities separated. Prefer descriptive names such as `usePostForm`, `PosteoFeed`, and `DAOPosteos`; React components use `PascalCase`, hooks use `useCamelCase`, and tests use `.test.ts` or `.test.tsx`. Follow the existing SCSS-per-component pattern. ESLint extends `next/core-web-vitals` and `next/typescript`; unused variables are warnings, but should still be removed before submitting.

## Testing Guidelines

Tests use Jest 30, `jest-environment-jsdom`, React Testing Library, and `@testing-library/jest-dom`. Place hook tests near the hook or in `__tests__`, and keep mocks in `test/__mocks__` when they are shared. Mock external services, Zustand, CSS/SCSS, and browser-only dependencies instead of requiring live infrastructure. Run `npm test` for normal validation and `npm run test:coverage` when changing shared hooks, API behavior, or services.

## Commit & Pull Request Guidelines

No strict commit convention is enforced in the available project metadata, so use short imperative commit messages, for example `Add image upload validation`. Pull requests should include a clear summary, linked issue when available, test results, database migration notes if `sql/migrations` changes, and screenshots or recordings for visible UI changes.

## Security & Configuration Tips

Do not commit secrets. Keep required environment keys documented in `.env.example`, and use `.env` only for local values. Database and media-service changes should validate missing or invalid configuration explicitly instead of failing silently.
