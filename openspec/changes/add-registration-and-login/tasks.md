## 1. Dependencies & Environment

- [x] 1.1 Install `better-auth` and email provider (`resend` or `nodemailer`) via `bun add`
- [x] 1.2 Create `.env` with `BETTER_AUTH_SECRET`, `DATABASE_URL`, and email provider credentials
- [x] 1.3 Add `.env` to `.gitignore` (verify it is already excluded)

## 2. Auth Server Setup

- [x] 2.1 Create `src/server/auth.ts` — initialize better-auth with bun:sqlite adapter pointing to `./data/auth.db`
- [x] 2.2 Add `emailOTP` plugin to better-auth config with email send function wired to the chosen provider
- [x] 2.3 Run better-auth migration to generate the SQLite schema (`bun scripts/migrate.ts`)
- [x] 2.4 Mount `/api/auth/*` route in `src/index.ts` pointing to `auth.handler`

## 3. Auth Client

- [x] 3.1 Create `src/lib/auth-client.ts` — export singleton `authClient` using `createAuthClient()` from better-auth
- [x] 3.2 Verify `authClient.useSession()` is exported and typesafe

## 4. Liquid Glass Base Component

- [x] 4.1 Create `src/components/GlassCard.tsx` — reusable frosted glass panel (backdrop-blur, semi-transparent bg, shadow)
- [x] 4.2 Add Tailwind v4 tokens for glass surface colors to the CSS layer (if not already present)

## 5. Registration Screen

- [x] 5.1 Create `src/pages/RegisterPage.tsx` — form with email, password, confirm-password fields using `GlassCard`
- [x] 5.2 Wire form submit to `authClient.signUp.email()` with loading state and inline error display
- [x] 5.3 Write `bun test` for client-side validation logic (password length, email format, confirm match)

## 6. Email Verification Screen

- [x] 6.1 Create `src/pages/VerifyEmailPage.tsx` — OTP input (6 digits), shows target email, "Resend code" button
- [x] 6.2 Wire OTP submit to `authClient.emailOtp.verifyEmail()` with error handling
- [x] 6.3 Wire "Resend code" to `authClient.emailOtp.sendVerificationOtp()`
- [x] 6.4 Write `bun test` for OTP input state (digit entry, resend cooldown logic)

## 7. Login Screen

- [x] 7.1 Create `src/pages/LoginPage.tsx` — form with email and password fields, link to registration
- [x] 7.2 Wire form submit to `authClient.signIn.email()` — on success, navigate to 2FA screen
- [x] 7.3 Handle unverified account response: redirect to verification screen with email pre-filled

## 8. 2FA OTP Screen

- [x] 8.1 Create `src/pages/TwoFactorPage.tsx` — OTP input identical in structure to VerifyEmailPage, "Resend code" button
- [x] 8.2 Wire OTP submit to complete the login flow via `authClient.twoFactor.verifyOtp()`
- [x] 8.3 Wire "Resend code" to resend the 2FA OTP

## 9. App Routing

- [x] 9.1 Update `src/App.tsx` — implement simple React state machine routing between: `login | register | verify-email | two-factor | home`
- [x] 9.2 Read session on mount via `authClient.getSession()` — redirect authenticated users away from auth screens

## 10. Integration Testing

- [x] 10.1 Write `bun test` for auth server: verify `/api/auth/sign-up/email` returns expected response shape
- [x] 10.2 Write `bun test` for auth server: verify `/api/auth/sign-in/email` returns expected response shape
- [x] 10.3 Manual smoke test: full registration → email verify → login → OTP → home flow

## 11. Code Quality

- [x] 11.1 Run `bun lint` (oxlint) and fix all warnings
- [x] 11.2 Run `oxfmt` formatter across all new files
- [x] 11.3 Verify no secrets appear in any source file
