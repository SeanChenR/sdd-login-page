## ADDED Requirements

### Requirement: Authenticated user can register a passkey

The system SHALL allow an authenticated user to register a new passkey by calling `authClient.passkey.addPasskey()`. The browser SHALL prompt the user to complete the WebAuthn registration gesture (biometric, PIN, or security key). On success, the passkey SHALL be stored and appear in the user's passkey list.

#### Scenario: Successful passkey registration

- **WHEN** an authenticated user clicks "Add passkey" on the home screen
- **THEN** the browser SHALL show a native WebAuthn registration prompt
- **AND** on successful gesture, the passkey SHALL be saved and the list SHALL refresh to include the new entry

#### Scenario: User cancels the registration prompt

- **WHEN** the user dismisses the browser's WebAuthn prompt
- **THEN** the system SHALL handle the cancellation gracefully, display a neutral message, and leave the existing passkey list unchanged

### Requirement: Authenticated user can view their registered passkeys

The system SHALL display a list of the user's registered passkeys on the home screen. Each entry SHALL show the passkey name (or a default label if unnamed) and the registration date.

#### Scenario: Passkey list is populated

- **WHEN** an authenticated user with one or more registered passkeys views the home screen
- **THEN** all their passkeys SHALL be listed with name and creation date

#### Scenario: Passkey list is empty

- **WHEN** an authenticated user has no registered passkeys
- **THEN** the home screen SHALL display an empty state with an invitation to add a passkey

### Requirement: Authenticated user can delete a passkey

The system SHALL allow an authenticated user to delete any of their registered passkeys. After deletion, the passkey SHALL no longer be usable for sign-in.

#### Scenario: Successful passkey deletion

- **WHEN** user clicks "Delete" on a passkey entry and confirms the action
- **THEN** the system SHALL call the delete API and remove the passkey from the list immediately

#### Scenario: Passkey deletion shows confirmation

- **WHEN** user clicks "Delete" on a passkey entry
- **THEN** the system SHALL require confirmation before proceeding with deletion, to prevent accidental removal
