## ADDED Requirements

### Requirement: User can sign in with a passkey

The system SHALL allow a user with a registered passkey to sign in by clicking "Sign in with passkey". The browser SHALL present the native WebAuthn authentication prompt. On success, the system SHALL establish a full authenticated session and navigate directly to the home screen, without requiring the email OTP 2FA step.

#### Scenario: Successful passkey sign-in

- **WHEN** user clicks "Sign in with passkey" and completes the browser's biometric/PIN prompt
- **THEN** the system SHALL establish an authenticated session and navigate to the home screen

#### Scenario: Passkey sign-in skips email OTP

- **WHEN** user signs in successfully via passkey
- **THEN** the system SHALL NOT require email OTP verification, as passkey authentication is inherently multi-factor

#### Scenario: No passkey available on device

- **WHEN** user clicks "Sign in with passkey" but no passkey is registered or available on the device
- **THEN** the browser SHALL indicate no credential is available and the user SHALL be able to fall back to the email+password form

#### Scenario: User cancels WebAuthn prompt

- **WHEN** the user dismisses the passkey sign-in prompt
- **THEN** the system SHALL handle the cancellation gracefully and return focus to the login form
