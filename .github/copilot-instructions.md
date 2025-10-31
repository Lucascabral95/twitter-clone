# Copilot Instructions for AI Agents

## Project Overview
- **Type:** Twitter-like social platform built with Next.js, TypeScript, Zustand, Neon Serverless PostgreSQL, and SASS.
- **Key Features:** User profiles, posts, reposts, comments, likes, followers/following, secure JWT authentication, global state with Zustand.
- **Architecture:**
  - `src/app/`: Next.js app directory (routing, layouts, pages, API endpoints)
  - `src/components/`: Reusable UI components (Header, Footer, Navbar, etc.)
  - `src/infrastructure/`: Core logic, interfaces, and services for data access
  - `src/models/DAO/`: Data access objects for domain logic
  - `src/presentation/`: Presentation layer (hooks, view logic)
  - `public/`: Static assets

## Developer Workflows
- **Install & Run:**
  ```bash
  npm install
  npm run dev
  ```
- **API:** All backend logic is handled via Next.js API routes in `src/app/api/`. Calls are made using Axios (see `userService.service.ts`).
- **State Management:** Use Zustand (`src/zustand.tsx`) for global state. Hooks in `src/presentation/hooks/` interact with stores and services.
- **Type Safety:** All data models and API responses are typed in `src/infrastructure/interfaces/`.
- **Styling:** Use SASS modules for component styles. Global styles in `src/app/globals.css`.

## Project-Specific Patterns
- **Service Pattern:**
  - All API calls are abstracted in `src/infrastructure/services/` (e.g., `userService.service.ts`).
  - Services return `{ success, data, error }` objects. Always check for `result && result.success` before accessing data.
- **Error Handling:**
  - API errors are surfaced via the `error` property in service results. UI hooks/components should display these.
- **User Data Fetching:**
  - Use the `useUserData` hook for profile and post data. Example:
    ```typescript
    const { dataUser, error, loading } = useUserData();
    ```
- **Authentication:**
  - JWT via cookies, handled in API routes and checked in middleware (`src/middleware.ts`).
- **Database:**
  - Neon Serverless PostgreSQL is used. All DB access is via API routes/services, not directly from the client.

## Integration & Conventions
- **API Integration:**
  - Use Axios for all HTTP requests. Endpoints are under `/api/`.
- **Component Structure:**
  - Each major UI feature has its own folder in `src/components/`.
- **Naming:**
  - Spanish is used for most variable, file, and folder names (e.g., `posteosUser`, `SeguidosSeguidores`).
- **Validation:**
  - Use Zod for schema validation in API routes.

## Examples
- **Service Usage:**
  ```typescript
  const result = await userService.getUserById(id);
  if (result && result.success) {
    // use result.data
  }
  ```
- **Global State:**
  ```typescript
  const { getTweetsByIDUser, posteosUser } = useStore();
  ```

## Key Files
- `src/infrastructure/services/userService.service.ts`: User API logic
- `src/presentation/hooks/useUserData.ts`: User data fetching pattern
- `src/zustand.tsx`: Global state store
- `src/app/api/`: All backend endpoints
- `src/infrastructure/interfaces/`: Type definitions

---
For questions about project structure or conventions, see `README.md` or ask the project maintainer.
