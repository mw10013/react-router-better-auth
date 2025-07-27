# Copilot Instructions

## Architecture & Data Flow

- Full-stack React Router v7 (framework mode) app with server-side rendering (`ssr: true` in `react-router.config.ts`).
- Authentication is handled server-side using Better Auth with a custom SQLite adapter (`app/lib/sqlite-adapter.ts`).
- All authentication flows (sign in, sign up, sign out, session) are routed through server actions in `app/routes/`.
- Tailwind CSS v4 is used for all styling (`app.css`).

## Key Patterns & Conventions

- TypeScript: strict functional style, no comments, use interfaces, prefer immutability, concise inlining, and destructuring in function signatures.
- All SQL is lowercased.
- Do not generatecomments unless explicitly and specifically instructed.
- Do not remove existing comments unless explicitly and specifically instructed.

## Developer Workflows

- Always use pnpm for all install, add, remove, and script commands (e.g., pnpm install, pnpm test).
- **Dev server:** `pnpm dev` — runs with HMR at `http://localhost:5173`
- **Test:** `pnpm test` — runs vitest tests
- **Build:** `pnpm build` — outputs to `build/`
- **Typecheck:** `pnpm typecheck`

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

## Testing

- Use vitest version 3.x
- Your vitest knowledge is out of date so always consult the vitest documentation.
- Dcoumentation links for vitest
  - Api: https://vitest.dev/api/
  - Configuration: https://vitest.dev/config/
  - Expect: https://vitest.dev/api/expect.html
  - Assert: https://vitest.dev/api/assert.html
