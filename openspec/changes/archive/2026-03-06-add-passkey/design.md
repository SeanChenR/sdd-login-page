## Context

The current auth system uses email+password with mandatory email OTP 2FA (via better-auth's `twoFactor` plugin). Passkeys are added as an **opt-in alternative** login path — users who register a passkey can use it instead of email+password+OTP. Users without a passkey continue to use the existing flow unchanged.

better-auth's passkey support is provided by the separate `@better-auth/passkey` package, which wraps [SimpleWebAuthn](https://simplewebauthn.dev/) for WebAuthn/FIDO2 operations.

## Goals / Non-Goals

**Goals**

- Let users sign in with passkey (biometrics/device PIN) without needing email OTP
- Let authenticated users add, view, and delete their passkeys from the home screen
- Enable browser conditional UI (autofill passkey prompt on email input)

**Non-Goals**

- Passkey-only registration (first login still requires email+password)
- Replacing email+2FA for users who don't have a passkey
- Cross-device passkey sync UI (handled natively by OS/browser)
- Passkey enforcement (remains entirely opt-in)

## Decisions

### Decision 1: Passkey sign-in skips email OTP 2FA

**Chosen**: When `signIn.passkey()` succeeds, navigate directly to home. Do not call `twoFactor.sendOtp()`.

**Rationale**: A passkey is already a two-factor credential — it proves possession of the device (something you have) and biometric verification (something you are/know). Stacking email OTP on top adds friction with no security benefit for passkey users.

**Alternative considered**: Require 2FA for all logins including passkey — rejected because it degrades the primary benefit of passkeys (speed/convenience) and the security model already satisfies MFA requirements.

### Decision 2: Passkey registration requires an existing authenticated session

**Chosen**: Users must log in (via email+password+2FA or passkey) before they can add a passkey. The "Add passkey" button lives on the home screen.

**Rationale**: `authClient.passkey.addPasskey()` requires an active session. This is a better-auth constraint. It also prevents unauthorized passkey enrollment.

**Alternative considered**: Offer passkey setup during the registration flow — rejected because it complicates the onboarding UX and the browser WebAuthn dialog sequence would interrupt the email verification flow.

### Decision 3: rpID and origin derived from BETTER_AUTH_URL

**Chosen**: Parse `rpID` from `BETTER_AUTH_URL` hostname (e.g., `localhost`). Pass `origin` as `BETTER_AUTH_URL` value directly.

**Rationale**: Avoids introducing new environment variables. `BETTER_AUTH_URL` already encodes the deployment origin.

**Alternative considered**: Separate `PASSKEY_RP_ID` and `PASSKEY_ORIGIN` env vars — over-engineered for a single-origin app.

### Decision 4: No new Screen state for passkey

**Chosen**: No new entries in the `Screen` type in `App.tsx`. Passkey sign-in goes directly `login → home`. Passkey management lives within the existing `home` screen.

**Rationale**: The browser's WebAuthn dialog handles all passkey UX natively. No custom OTP entry screens are needed. Management UI is lightweight enough to embed in `HomePage` rather than warrant a dedicated screen.

## Risks / Trade-offs

- **WebAuthn requires HTTPS in production** → In dev, `localhost` works without HTTPS. For production deployment, the origin must be HTTPS. `BETTER_AUTH_URL` must be set to the correct HTTPS origin.
- **Browser support** → WebAuthn is supported in all modern browsers (Chrome, Safari, Firefox). IE and old mobile browsers are not supported — acceptable given target audience.
- **First login still requires email+2FA** → Passkeys can only be registered after first login. This is intentional but means the passkey benefit only applies from the second login onward.
- **`@better-auth/passkey` is a separate package** → If better-auth updates break the passkey API, both packages need updating together.

## Migration Plan

1. `bun add @better-auth/passkey`
2. Add `passkey()` plugin to `src/server/auth.ts`
3. Run `bun scripts/migrate.ts` — creates the `passkey` table
4. Add `passkeyClient()` to `src/lib/auth-client.ts`
5. Update `LoginPage` and `HomePage`
6. Rollback: remove plugin + client, drop `passkey` table — no impact on existing email+2FA users

## Open Questions

- None. Scope is well-defined and better-auth passkey API is stable.
