## Why

Users currently must log in with email + password followed by an email OTP every time, which is slow and requires access to email on every login. Passkeys offer a faster, more secure, phishing-resistant alternative using device biometrics (Face ID, Touch ID, Windows Hello) that satisfies both authentication factors in a single gesture.

## What Changes

- Add `@better-auth/passkey` plugin to the server auth config
- Add `passkeyClient()` to the auth client
- Add "Sign in with passkey" button to the LoginPage (alternative to email+password)
- Add passkey management UI to HomePage (add, list, delete passkeys)
- Run database migration to create the `passkey` table
- Passkey sign-in bypasses email OTP 2FA (passkey is inherently multi-factor)

## Capabilities

### New Capabilities

- `passkey-management`: User can register new passkeys, view their existing passkeys, and delete passkeys from the home screen after signing in

### Modified Capabilities

- `auth-server`: Add `passkey` plugin configuration (rpID, rpName, origin); migrate DB schema
- `auth-ui`: Login screen adds passkey sign-in button; home screen adds passkey management section
- `user-login`: Add alternative passkey sign-in path that skips the email OTP 2FA step

## Impact

- **New dependency**: `@better-auth/passkey` (npm package, wraps SimpleWebAuthn)
- **Database**: New `passkey` table added via migration
- **`src/server/auth.ts`**: Add `passkey()` plugin
- **`src/lib/auth-client.ts`**: Add `passkeyClient()` plugin
- **`src/pages/LoginPage.tsx`**: Add passkey sign-in button and conditional UI (autocomplete hint)
- **`src/pages/HomePage.tsx`**: Add passkey management section
- **`src/App.tsx`**: No new screens needed (browser handles WebAuthn dialogs natively)
- **`.env` / `.env.example`**: No new variables (rpID/origin derived from `BETTER_AUTH_URL`)
