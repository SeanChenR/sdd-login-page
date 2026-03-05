# sdd-login-page

A full-stack authentication UI built with Bun + React, featuring a Liquid Glass design system. This project was developed using **Spec-Driven Development (SDD)** via [OpenSpec](https://openspec.dev) — specs and change proposals live in `openspec/`.

## Features

- User registration with email verification (OTP)
- Login with email + password
- Two-factor authentication (email OTP) on every login
- **Passkey authentication** — sign in with biometrics/device PIN (WebAuthn)
- Passkey management — add, view, and delete passkeys from the home screen
- Browser conditional UI — passkey autofill on the email input
- Liquid Glass design system (frosted glass cards, inputs, buttons)
- State machine routing — no router library needed

## Tech Stack

| Layer        | Choice                                                                |
| ------------ | --------------------------------------------------------------------- |
| Runtime      | [Bun](https://bun.sh)                                                 |
| Frontend     | React 19                                                              |
| Styling      | Tailwind CSS v4 + Liquid Glass design                                 |
| Auth         | [better-auth](https://better-auth.com) (emailOTP + twoFactor + passkey plugins) |
| Database     | SQLite via `bun:sqlite`                                               |
| Email (dev)  | [Mailpit](https://github.com/axllent/mailpit) (local SMTP)            |
| Email (prod) | [Resend](https://resend.com)                                          |

## Development Workflow

This project uses **Spec-Driven Development (SDD)** with OpenSpec:

```
discuss? → propose → apply → archive
```

Change proposals, specs, and task lists are stored in `openspec/changes/`. Before writing any code, a change goes through:

1. **proposal.md** — what & why
2. **design.md** — technical decisions
3. **specs/** — detailed requirements (SHALL statements + scenarios)
4. **tasks.md** — implementation checklist

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+
- [Mailpit](https://github.com/axllent/mailpit) for local email testing

```bash
brew install mailpit
```

### Setup

```bash
bun install
cp .env.example .env
# Fill in BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
```

### Database migration

```bash
bun scripts/migrate.ts
```

### Run

Start Mailpit (in a separate terminal):

```bash
mailpit
```

Start the dev server:

```bash
bun dev
```

- App: http://localhost:3000
- Mailpit inbox: http://localhost:8025

## Email Configuration

| Mode       | Config                                                                                  |
| ---------- | --------------------------------------------------------------------------------------- |
| Local dev  | Set `SMTP_HOST=localhost` and `SMTP_PORT=1025` in `.env` — all emails go to Mailpit     |
| Production | Remove `SMTP_HOST` from `.env`, set `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL` |

## Testing

```bash
bun test
```

## Project Structure

```
src/
  server/       # Bun server + better-auth setup
  pages/        # LoginPage, RegisterPage, VerifyEmailPage, TwoFactorPage, HomePage
  components/   # GlassCard
  lib/          # auth-client, validation
openspec/
  changes/      # SDD change history (proposals, specs, tasks)
scripts/        # Database migration
```
