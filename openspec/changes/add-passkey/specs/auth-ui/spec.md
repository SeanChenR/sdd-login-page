## MODIFIED Requirements

### Requirement: Login screen collects email and password

The system SHALL render a login form with email and password fields and a submit button. It SHALL also include a link to navigate to the registration screen. The email input SHALL include `autocomplete="username webauthn"` to enable browser passkey autofill (conditional UI). A separate "Sign in with passkey" button SHALL be rendered below the form as an alternative login path.

#### Scenario: Form renders with empty state

- **WHEN** user navigates to the login screen
- **THEN** empty email and password fields SHALL be visible

#### Scenario: Navigation to registration

- **WHEN** user clicks the "Create account" or "Sign up" link
- **THEN** the UI SHALL navigate to the registration screen

#### Scenario: Passkey sign-in button is visible

- **WHEN** user navigates to the login screen
- **THEN** a "Sign in with passkey" button SHALL be visible as an alternative to the email+password form

## ADDED Requirements

### Requirement: Home screen displays passkey management section

The system SHALL render a passkey management section on the home screen. The section SHALL include the user's passkey list, an "Add passkey" button, and a delete action per passkey entry.

#### Scenario: Passkey section visible on home screen

- **WHEN** an authenticated user views the home screen
- **THEN** a "Passkeys" section SHALL be visible showing current passkeys and an option to add a new one

#### Scenario: Add passkey button triggers registration

- **WHEN** user clicks "Add passkey"
- **THEN** the browser WebAuthn registration prompt SHALL appear
