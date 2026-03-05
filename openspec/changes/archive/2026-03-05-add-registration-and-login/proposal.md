## Why

This project needs a secure authentication layer to allow users to create accounts and sign in. Registration requires email verification to confirm ownership, and login requires a two-step email OTP to protect against compromised passwords.

## What Changes

- **New**: Registration page — email + password form, submits to better-auth, triggers verification email
- **New**: Email verification flow — user clicks link or enters OTP from email to activate account
- **New**: Login page — email + password form, submits to better-auth first step
- **New**: Two-factor login flow — after credentials pass, user enters email OTP to complete sign-in
- **New**: better-auth server setup — database adapter (bun:sqlite), session config, email plugin
- **New**: Auth client — browser-side better-auth client for React components
- **New**: UI — Liquid Glass frosted-glass panels for all auth screens, Tailwind v4

## Non-goals

- OAuth / social login (Google, GitHub, etc.)
- TOTP authenticator app (2FA is email OTP only)
- Password reset / forgot password flow
- User profile or account management pages
- Role-based access control

## Capabilities

### New Capabilities

- `user-registration`: Email + password sign-up with post-registration email verification (OTP or magic link)
- `user-login`: Two-step login — credentials first, then email OTP to complete authentication
- `auth-server`: better-auth server configuration, SQLite adapter, email plugin, session management
- `auth-ui`: Liquid Glass React components for registration, email verification, login, and OTP entry screens

### Modified Capabilities

_(none — this is a greenfield auth implementation)_

## Impact

- **New dependencies**: `better-auth`, email provider (e.g. Resend or Nodemailer)
- **New files**: `src/server/auth.ts`, `src/lib/auth-client.ts`, auth page components, route handlers
- **Bun.serve() routes**: `/api/auth/*` forwarded to better-auth handler
- **Environment variables**: `BETTER_AUTH_SECRET`, `DATABASE_URL`, email provider credentials
- **Database**: SQLite via `bun:sqlite` — better-auth manages schema migrations automatically
