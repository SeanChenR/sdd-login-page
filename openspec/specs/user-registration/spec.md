## ADDED Requirements

### Requirement: User can register with email and password

The system SHALL allow a new user to create an account by submitting a valid email address and password. Upon successful submission, better-auth SHALL create the user record and immediately send a verification OTP to the provided email.

#### Scenario: Successful registration submission

- **WHEN** user submits the registration form with a valid email and a password meeting minimum requirements
- **THEN** the system creates the user account, sends a verification OTP email, and navigates the user to the email verification screen

#### Scenario: Registration with duplicate email

- **WHEN** user submits a registration form with an email address already registered
- **THEN** the system SHALL display an inline error message indicating the email is already in use and SHALL NOT create a duplicate account

#### Scenario: Registration with invalid password

- **WHEN** user submits a registration form with a password shorter than 8 characters
- **THEN** the system SHALL display a validation error before submission and SHALL NOT call the server

### Requirement: User must verify email before access

The system SHALL require email verification before the user can access any authenticated routes. An unverified user SHALL be redirected to the verification screen.

#### Scenario: OTP entry — correct code

- **WHEN** user enters the 6-digit OTP received by email within the expiry window
- **THEN** the system SHALL mark the email as verified and navigate the user to the authenticated home screen

#### Scenario: OTP entry — incorrect code

- **WHEN** user enters an incorrect OTP
- **THEN** the system SHALL display an error message and allow the user to retry

#### Scenario: OTP entry — expired code

- **WHEN** user enters an OTP after it has expired
- **THEN** the system SHALL display an expiry message and offer a "Resend OTP" action

### Requirement: User can request a new verification OTP

The system SHALL allow users on the email verification screen to request a new OTP if the original has expired or was not received.

#### Scenario: Resend OTP

- **WHEN** user clicks "Resend code" on the verification screen
- **THEN** the system SHALL send a fresh OTP to the registered email and display a confirmation message
