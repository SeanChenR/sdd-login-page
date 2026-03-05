## 1. Dependencies & Server Setup

- [x] 1.1 Install `@better-auth/passkey` via `bun add @better-auth/passkey`
- [x] 1.2 Add `passkey()` plugin to `src/server/auth.ts` with `rpID` and `origin` derived from `BETTER_AUTH_URL`
- [x] 1.3 Run `bun scripts/migrate.ts` to create the `passkey` table in SQLite

## 2. Auth Client

- [x] 2.1 Add `passkeyClient()` from `@better-auth/passkey/client` to the plugins array in `src/lib/auth-client.ts`

## 3. Login Screen — Passkey Sign-In

- [x] 3.1 Add `autocomplete="username webauthn"` to the email input in `LoginPage.tsx` to enable browser conditional UI
- [x] 3.2 Add "Sign in with passkey" button to `LoginPage.tsx`
- [x] 3.3 Wire the button to `authClient.signIn.passkey()` — on success call `onLoggedIn()` (bypass 2FA)
- [x] 3.4 Handle cancellation and errors from the WebAuthn prompt with an inline error message

## 4. Home Screen — Passkey Management

- [x] 4.1 Add passkey management section to `HomePage.tsx` using `authClient.passkey.listUserPasskeys()`
- [x] 4.2 Render each passkey entry with name, creation date, and a "Delete" button
- [x] 4.3 Wire "Add passkey" button to `authClient.passkey.addPasskey()` and refresh the list on success
- [x] 4.4 Wire "Delete" button to `authClient.passkey.deletePasskey({ id })` with inline confirmation and list refresh
- [x] 4.5 Render empty state when user has no passkeys

## 5. Integration Testing

- [x] 5.1 Manual smoke test: log in with email+2FA → add passkey → sign out → sign in with passkey → verify landing on home screen
- [x] 5.2 Manual smoke test: delete passkey → attempt passkey sign-in → verify browser shows no credential

## 6. Code Quality

- [x] 6.1 Run `bun lint` (oxlint) and fix all warnings on changed files
- [x] 6.2 Run `oxfmt` formatter on all new and modified files
- [x] 6.3 Verify no new secrets appear in source files
