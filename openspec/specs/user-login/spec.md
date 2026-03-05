## ADDED Requirements

### Requirement: User can sign in with email and password (step 1)

The system SHALL allow a registered and verified user to initiate login by submitting their email and password. On success, the system SHALL transition to the OTP verification step without establishing a full session.

#### Scenario: Valid credentials — proceed to OTP

- **WHEN** user submits the login form with correct email and password for a verified account
- **THEN** the system SHALL send a one-time OTP to the user's email and navigate to the OTP entry screen

#### Scenario: Invalid credentials

- **WHEN** user submits the login form with incorrect email or password
- **THEN** the system SHALL display a generic error ("Invalid email or password") and SHALL NOT reveal which field is incorrect

#### Scenario: Unverified account login attempt

- **WHEN** user submits credentials for an account with an unverified email
- **THEN** the system SHALL send a new verification OTP and redirect the user to the email verification screen

### Requirement: User must complete email OTP to finish login (step 2)

After successful credential verification, the system SHALL require the user to enter a time-limited OTP sent to their email before a session is established.

#### Scenario: Correct OTP — session established

- **WHEN** user enters the correct 6-digit OTP on the 2FA screen within the expiry window
- **THEN** the system SHALL create an authenticated session and navigate the user to the home screen

#### Scenario: Incorrect OTP

- **WHEN** user enters an incorrect OTP on the 2FA screen
- **THEN** the system SHALL display an error and allow retry without restarting the full login flow

#### Scenario: Expired OTP

- **WHEN** user enters an OTP after it has expired
- **THEN** the system SHALL display an expiry message and offer a "Resend OTP" action

### Requirement: User can resend the login OTP

The system SHALL allow the user to request a fresh OTP from the 2FA screen if the original expired or was not received.

#### Scenario: Resend login OTP

- **WHEN** user clicks "Resend code" on the 2FA screen
- **THEN** the system SHALL send a new OTP to the user's email and display a confirmation message

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

### Requirement: Authenticated session persists across page reloads

The system SHALL maintain the authenticated session via an HttpOnly cookie set by better-auth. The session SHALL be restored on page reload without requiring re-authentication.

#### Scenario: Page reload while authenticated

- **WHEN** an authenticated user reloads the page
- **THEN** the system SHALL restore the session and display the home screen without prompting for login
