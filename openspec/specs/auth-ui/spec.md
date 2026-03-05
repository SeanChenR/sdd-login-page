## ADDED Requirements

### Requirement: Auth screens use Liquid Glass visual design

All auth screens SHALL render using Liquid Glass aesthetics: frosted glass card panels with `backdrop-filter: blur`, semi-transparent backgrounds, soft drop shadows, and Tailwind v4 utility classes. No inline styles or CSS-in-JS.

#### Scenario: Glass card renders on all screens

- **WHEN** any auth screen (register, verify, login, OTP) is displayed
- **THEN** the primary card SHALL have a frosted glass appearance with visible blur effect over the background

### Requirement: Registration screen collects email and password

The system SHALL render a registration form with email and password fields, a confirm password field, and a submit button. Client-side validation SHALL run before any server call.

#### Scenario: Form renders with empty state

- **WHEN** user navigates to the registration screen
- **THEN** empty email, password, and confirm-password fields SHALL be visible with clear labels

#### Scenario: Submit button is disabled while loading

- **WHEN** the form is submitted and the server request is in-flight
- **THEN** the submit button SHALL be disabled and show a loading indicator

### Requirement: Email verification screen displays OTP input

After registration, the system SHALL render a screen prompting the user to enter the 6-digit OTP sent to their email. The screen SHALL display the email address the OTP was sent to and include a "Resend code" action.

#### Scenario: OTP input accepts 6 digits

- **WHEN** user types a 6-digit numeric code
- **THEN** each digit SHALL fill sequentially into individual input boxes or a single 6-character input

#### Scenario: Resend action is available

- **WHEN** the verification screen is displayed
- **THEN** a "Resend code" link or button SHALL be visible and actionable

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

### Requirement: Home screen displays passkey management section

The system SHALL render a passkey management section on the home screen. The section SHALL include the user's passkey list, an "Add passkey" button, and a delete action per passkey entry.

#### Scenario: Passkey section visible on home screen

- **WHEN** an authenticated user views the home screen
- **THEN** a "Passkeys" section SHALL be visible showing current passkeys and an option to add a new one

#### Scenario: Add passkey button triggers registration

- **WHEN** user clicks "Add passkey"
- **THEN** the browser WebAuthn registration prompt SHALL appear

### Requirement: 2FA screen displays OTP input after credential step

After the first login step passes, the system SHALL render an OTP entry screen identical in structure to the email verification screen, prompting the user to enter the code sent to their email.

#### Scenario: 2FA OTP screen shows correct context

- **WHEN** user completes the credential step of login
- **THEN** the OTP screen SHALL display a message indicating a code was sent to their email

### Requirement: Error messages are displayed inline

All server-side and client-side errors SHALL be displayed inline within the relevant form, not as separate error pages or alert dialogs. Errors SHALL be visible without scrolling.

#### Scenario: Server error on submission

- **WHEN** the server returns an error response to a form submission
- **THEN** a human-readable error message SHALL appear inline below the form fields within 300ms

### Requirement: Auth UI is accessible

All interactive elements SHALL have appropriate ARIA attributes, keyboard navigation support, and sufficient color contrast ratios (WCAG AA minimum).

#### Scenario: Form is operable by keyboard

- **WHEN** user navigates the auth form using Tab and Enter keys only
- **THEN** all fields SHALL be reachable and the form SHALL be submittable without a mouse
