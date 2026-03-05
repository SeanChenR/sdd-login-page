## Context

The project currently has no authentication. We need to add a complete auth layer for a web app served by Bun.serve(). All auth logic is handled by better-auth — a TypeScript-first auth library that owns the database schema, session management, and email flows. The UI uses React 19 with Tailwind v4 Liquid Glass styling.

## Goals / Non-Goals

**Goals:**

- Server-side auth handler via better-auth mounted at `/api/auth/*`
- Registration: email + password → email verification (OTP)
- Login: email + password → email OTP 2FA to complete sign-in
- Session management (cookie-based, handled by better-auth)
- Liquid Glass auth UI components

**Non-Goals:**

- OAuth / social providers
- TOTP authenticator apps
- Password reset flow
- Role-based access control
- Server-side rendering (CSR-only via React in HTML import)

## Decisions

### 1. better-auth as the single auth source of truth

**Decision**: Use better-auth to handle all auth logic — schema, sessions, email flows, and API routes.

**Rationale**: better-auth is TypeScript-native, supports SQLite via bun:sqlite, and ships built-in plugins for email verification and email OTP. Rolling our own auth is high-risk for a correctness-critical domain. better-auth removes all that complexity.

**Alternative considered**: Auth.js (NextAuth) — rejected because it targets Next.js RSC patterns and doesn't integrate cleanly with Bun.serve().

### 2. SQLite via bun:sqlite as the database

**Decision**: Use `bun:sqlite` with better-auth's SQLite adapter. Database file stored at `./data/auth.db`.

**Rationale**: Zero external infrastructure, fast local dev, bun:sqlite is built-in. better-auth runs its own migrations via `auth.api.getMigrations()` or the CLI — no separate migration tool needed.

**Alternative considered**: PostgreSQL — rejected as overengineered for this project scope.

### 3. Email OTP for both verification and 2FA

**Decision**: Use better-auth's `emailOTP` plugin for both post-registration email verification and the second factor in login.

**Rationale**: Unified plugin, single email code path. User experience is consistent — same OTP entry UI for both flows. No separate TOTP infrastructure needed.

**Alternative considered**: Magic link for verification, OTP for 2FA — rejected because two different mechanisms adds implementation complexity with no meaningful UX benefit.

### 4. Bun.serve() with `/api/auth/*` wildcard route

**Decision**: Mount better-auth's fetch handler at `"/api/auth/*"` in Bun.serve() routes.

**Rationale**: better-auth exposes a standard fetch `Request → Response` handler (`auth.handler`). Bun.serve() routes accept any fetch-compatible handler, making integration direct with no adapter layer.

```ts
routes: {
  "/api/auth/*": auth.handler,
}
```

### 5. Auth client as a singleton module

**Decision**: Export a single `authClient` from `src/lib/auth-client.ts`, imported by all React components that need auth state or actions.

**Rationale**: Single instance avoids duplicate session polling. Components import `useSession`, `signUp`, `signIn`, etc. directly from this module.

### 6. Liquid Glass UI — standalone components, no component library

**Decision**: Build auth UI as standalone React components using Tailwind v4 utility classes with backdrop-blur / glass effects. No shadcn-ui or other component library.

**Rationale**: The Liquid Glass design requires specific blur, translucency, and shadow layers that are easier to control directly in Tailwind than to override from a library. Scope is small (4 screens).

## Risks / Trade-offs

- **Email deliverability in dev** → Use Resend with a sandbox key, or configure nodemailer with Ethereal for local testing. Document in README.
- **SQLite concurrency** → Single-writer model is fine for this scale; not a risk unless concurrent writes at scale are needed.
- **better-auth version stability** → Pin the version in package.json. Review changelog before upgrading.
- **OTP expiry UX** → OTPs expire (default 5–10 min). Show a countdown or "resend" CTA to avoid user confusion.

## Migration Plan

1. Install dependencies (`better-auth`, email provider)
2. Add environment variables to `.env` (never commit)
3. Initialize better-auth server (`src/server/auth.ts`)
4. Run better-auth migration to create SQLite schema
5. Mount `/api/auth/*` route in `src/index.ts`
6. Create auth client (`src/lib/auth-client.ts`)
7. Build React auth screens with Liquid Glass UI
8. Wire routing (hash-based or simple state machine) between screens
9. Smoke test full registration and login flows end-to-end

## Open Questions

- **Email provider**: Resend (simple API key) vs Nodemailer (more flexible)? → Recommend Resend for simplicity; swap if needed.
- **Routing strategy**: Hash router (`#/login`, `#/register`) or simple React state machine? → State machine is simpler for 4 screens with no URL-sharing requirement.
