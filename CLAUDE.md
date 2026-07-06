# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Start dev server (localhost:3000)
npm run build           # Production build
npm start                # Serve production build
npm run lint             # next lint

npm test                 # Run full Jest suite
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npx jest path/to/file.test.ts        # Run a single test file
npx jest -t "test name substring"    # Run tests matching a name

npm run db:migrate       # Apply pending sql/migrations/*.sql (idempotent, safe to re-run)
npm run db:seed          # Seed demo users/posts/comments/follows (idempotent, safe to re-run)
npm run db:reset         # DESTRUCTIVE: drop all known tables/views, then migrate + seed (asks for "yes" confirmation)
```

There is no separate typecheck script; `tsc` runs implicitly via `next build`/`next lint`.

## Architecture

This is a Next.js 14 (App Router) Twitter clone with a layered, DAO-based backend and a single Zustand store as the client-side data layer. Most identifiers (variables, functions, file names) are in **Spanish** — follow that convention when adding code in existing files.

### Request flow (client → DB)

```
Component/hook → src/zustand.tsx (Zustand store, axios calls)
              → src/app/api/**/route.tsx (Next.js Route Handlers)
              → src/models/DAO/*.tsx (DAO classes, raw SQL via neon)
              → src/services/neon.jsx (neon() client factory)
```

- `src/services/neon.jsx` exports a `db()` factory that creates a fresh `neon(DATABASE_URL)` tagged-SQL client per call — DAOs call `await db()` then use it as a template-tag query function (e.g. `` data`select * from usuarios_posteos where posteo_id = ${id}` ``).
- DAO classes (`src/models/DAO/DAO*.tsx`) are exported as singleton instances (`export default new DAOPosteos()`) and throw `{ error, status }` objects on failure, which route handlers catch and translate into `NextResponse.json({ error }, { status })`.
- API routes always respond with `{ result }` on success or `{ error }` on failure — keep this envelope shape when adding endpoints.
- There is a second, thinner service layer under `src/infrastructure/services/*.service.ts` (e.g. `userService`, `authService`, `postService`, `postDetailService`) used by presentation hooks that don't go through the Zustand store. These return `{ success: boolean; data?: T; error?: string }` and wrap `axios` + `AxiosError` handling — check `result.success` before reading `result.data`.

### Database schema & migrations

- There is no ORM. The full schema (8 tables: `usuarios`, `posteos`, `comentarios`, `reposteos`, `seguimientos`, `seguidores`, `datos_personales`, `refresh_tokens`; plus 4 read-only views: `usuarios_posteos`, `comentarios_de_posteos_new`, `seguimientos_usuarios`, `reposteos_usuarios`) is versioned as plain SQL in `sql/migrations/*.sql`, applied by `scripts/migrate.mjs` (tracked in a `schema_migrations` table, idempotent — safe to re-run).
- To change database/host: point `DATABASE_URL` at the new instance and run `npm run db:migrate` (see README "Base de datos y migraciones" for the full workflow, including `db:seed` and `db:reset`).
- When a DAO needs a new column/table, add a new `sql/migrations/00N_*.sql` file (idempotent statements: `create table if not exists`, `create or replace view`, etc.) instead of editing `001_initial_schema.sql`.

### State management (`src/zustand.tsx`)

One global store (`useStore`) holds nearly all client state: posts (`posteos`, `posteosUser`, `posteosHome`), auth session (`datosLogueo`), followers/following (`misSeguidos`, `seguidores`, `esMiAmigo`), search results (`arrayDeBusqueda`), and UI flags (`loading`, `error`, `change`, `limit`). Actions call `axios` directly against `/api/*` routes and `set()` the result — there's no separate API-client abstraction here (unlike `infrastructure/services`).

- `change` is a boolean toggle flipped after mutations (`addTweet`, `seguirUsuario`, `eliminarSeguimiento`) purely to trigger re-fetching effects in components that depend on it — it carries no other meaning.
- Session data (`datosLogueo`) is fetched via `getCookieLogueo()` / `obtenerDatosDeCookie()`, which hit `/api/auth/datasesion` to decode the JWT cookie server-side.

### Presentation hooks (`src/presentation/hooks/`)

Feature-specific hooks (`useFeed`, `usePostForm`, `useHomeData`, `useUserData`, `usePostDetail`, `useSearch`, `useLogin`, `useRegister`, `useAuthModals`, `useModalDismiss`, `useDebounce`, `useBusquedaUsuarios`) wrap store actions and/or `infrastructure/services` calls, adding loading/error state, form handling (`react-hook-form` + Zod for auth forms), and `react-hot-toast` feedback. Prefer extending an existing hook over adding store logic directly into components.

### Auth

- Two-token JWT/refresh scheme, both signed/managed via `src/infrastructure/auth/{session,constants}.ts`:
  - **Access token** (`myToken` cookie, `jose`-signed, 15m expiry) — what `getSessionUser()` and `src/middleware.ts` verify.
  - **Refresh token** (`refreshToken` cookie, opaque random string, 30d) — hashed (sha256) and persisted in the `refresh_tokens` table (`src/models/DAO/DAORefreshTokens.tsx`), rotated on every use.
- `POST /api/auth/refresh` verifies+rotates the refresh token and reissues both cookies. `src/presentation/providers/AuthRefreshProvider.tsx` (mounted in the root layout) is an axios response interceptor that transparently calls `/api/auth/refresh` on a 401 and retries the original request once; if refresh fails it just lets the 401 propagate (no forced redirect — many 401s here are passive "am I logged in?" checks on public pages, not real session expiry).
- `src/middleware.ts` guards `/home/:path*`, `/feed`, and `/api/:path*` (except `/api/auth/{login,register,logout,refresh}`) — verifies the access token and redirects to `/` (pages) or 401s (API) on failure/missing cookie. Add new protected routes to its `matcher` config.
- `src/app/api/auth/` holds login/register/logout/refresh/datasesion routes; `authService.service.ts` is the client wrapper. **Register auto-logs the user in** (issues both cookies, same as login) and the UI redirects straight to `/home` — it does not just reopen the login modal.
- Login/Register UI (`src/components/Register/{Login,Register}.tsx`) use `react-hook-form` + `zodResolver` against `src/infrastructure/validation/{loginSchema,registerSchema}.ts`; password rules live once in `passwordRules.ts` and back both Zod validation and the live `PasswordChecklist` component. Modals close on outside-click/Escape via `useModalDismiss` (`src/presentation/hooks/useModalDismiss.ts`), which also locks body scroll while open.

### Path aliases & env

- `@/*` maps to `src/*` (see `tsconfig.json`).
- Required env vars: `JWT_SECRET`, `DATABASE_URL` (Neon Postgres connection string), `ORIGINAL_URL`.

## Testing

- Jest is configured via `next/jest` (`jest.config.ts`), `testEnvironment: jsdom`.
- Key `moduleNameMapper` rewrites to know about when editing tests or mocks:
  - `@/zustand` → `test/__mocks__/zustand.ts` (a hand-rolled store mock with `__setMockState`/`__resetMockState`/`__getMockState` helpers — use these to seed state per-test instead of mocking individual actions).
  - `zustand` (the package itself) → `test/__mocks__/zustand-create-shim.ts`.
  - `avvvatars-react` → `test/__mocks__/avvvatars-react.tsx`.
  - `*.css|scss|sass` → `test/__mocks__/styleMock.ts`.
- Hook tests live in `src/presentation/hooks/__tests__/`; component/DAO/service tests are colocated as `*.test.ts(x)` next to their source file.
- Tests mock `infrastructure/services` and the Zustand store directly rather than hitting real HTTP/DB, so hook/component tests are isolated from Next.js API routes and Neon.
- API route tests (`src/app/api/**/route.test.ts`) need `/** @jest-environment node */` at the top, `jest.mock('next/headers', () => ({ cookies: () => mockCookieStore }))` for cookie get/set/delete, and `jest.mock('@/services/neon', ...)` returning a mock tagged-template `sql` function when a DAO isn't mocked directly — see `src/app/api/auth/{login,refresh}/route.test.ts` or `src/app/api/posteo/route.test.ts` for the pattern.
- react-hook-form gotcha: `formState.errors` is a lazily-subscribed proxy — in a `renderHook` test, read `result.current.formState.errors` once *before* triggering validation/submit, otherwise the internal state updates but the hook never re-renders and `result.current` stays stale (see `useLogin.test.ts`/`useRegister.test.ts`).
