# Copilot Instructions

## Architecture & Data Flow

- Full-stack React Router v7 (framework mode) app with server-side rendering (`ssr: true` in `react-router.config.ts`).
- Authentication is handled server-side using Better Auth with a custom SQLite adapter (`app/lib/sqlite-adapter.ts`).
- All authentication flows (sign in, sign up, sign out, session) are routed through server actions in `app/routes/`.
- Tailwind CSS v4 is used for all styling (`app.css`).

## Key Patterns & Conventions

- TypeScript: strict functional style, no comments, use interfaces, prefer immutability, concise inlining, and destructuring in function signatures.
- All SQL is lowercased.
- Imports follow:  
  `import type { AppLoadContext, Session } from 'react-router'`  
  `import { auth } from "~/lib/auth";`
- Authentication logic is always accessed via the exported `auth` instance (`app/lib/auth.ts`), which wires up the SQLite adapter.
- Route modules (`app/routes/*.tsx`) use React Router's data APIs (`loader`, `action`) and always return/redirect using the response from `auth.api.*`.
- UI components are colocated with routes and use Tailwind utility classes.

## Developer Workflows

- **Dev server:** `npm run dev` (or `pnpm run dev`) — runs with HMR at `http://localhost:5173`
- **Build:** `npm run build` — outputs to `build/`
- **Typecheck:** `npm run typecheck`
- **Test:** Use `vitest` (v3.2.4). See https://vitest.dev/api/
- **Migrations:**
  - Generate: `npx @better-auth/cli generate`
  - Migrate: `npx @better-auth/cli migrate`
- **Secret generation:** `npx @better-auth/cli secret`

## Integration Points

- Better Auth config and DB adapter: `app/lib/auth.ts`, `app/lib/sqlite-adapter.ts`
- All authentication flows: `app/routes/signin.tsx`, `app/routes/signup.tsx`, `app/routes/signout.ts`
- Session/user data: always loaded via `auth.api.getSession` in route loaders
- Tailwind config: see `vite.config.ts` for plugin setup

## Documentation

- Your knowledge is out of date so always consult the latest docs:
  - React Router: use the mcp tool
  - Better Auth: https://www.better-auth.com/llms.txt
  - DB adapters: https://www.better-auth.com/docs/guides/create-a-db-adapter

## Examples

- See `app/routes/_index.tsx` for session-aware home, `app/routes/signin.tsx` and `app/routes/signup.tsx` for auth flows.

## Testing

- Use vitest version 3.2.4.
- Your vitest knowledge is out of date so always consult the vitest documentation.
- Dcoumentation links for vitest
  - Api: https://vitest.dev/api/
  - Configuration: https://vitest.dev/config/
  - Expect: https://vitest.dev/api/expect.html
  - Assert: https://vitest.dev/api/assert.html
