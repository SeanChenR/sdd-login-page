## ADDED Requirements

### Requirement: better-auth server is initialized with SQLite adapter

The system SHALL initialize a better-auth instance in `src/server/auth.ts` using the `bun:sqlite` database adapter. The database file SHALL be stored at `./data/auth.db`. better-auth SHALL manage all schema migrations automatically. The `passkey` plugin SHALL be included, adding a `passkey` table to the schema.

#### Scenario: Server starts with valid config

- **WHEN** the Bun server starts with all required environment variables set
- **THEN** better-auth SHALL initialize successfully and the SQLite database file SHALL be created if it does not exist, including the `passkey` table

#### Scenario: Missing required environment variable

- **WHEN** `BETTER_AUTH_SECRET` is absent at startup
- **THEN** the server SHALL throw an error at initialization time and SHALL NOT start

### Requirement: better-auth handles all requests at /api/auth/\*

The system SHALL mount better-auth's fetch handler at the `/api/auth/*` wildcard route in `Bun.serve()`. All auth API calls (sign-up, sign-in, OTP, session) SHALL be handled by this route.

#### Scenario: Auth route receives a valid request

- **WHEN** a client sends a POST to `/api/auth/sign-up/email`
- **THEN** better-auth SHALL process the request and return the appropriate JSON response

### Requirement: Email OTP plugin is enabled

The system SHALL configure the `emailOTP` plugin from better-auth to handle OTP generation and delivery for both email verification (post-registration) and 2FA (post-login credential step).

#### Scenario: OTP email is sent after registration

- **WHEN** a new user completes registration
- **THEN** the email provider SHALL receive a send request with a 6-digit OTP within 2 seconds

#### Scenario: OTP email is sent after credential verification at login

- **WHEN** a user passes the first login step (credentials)
- **THEN** the email provider SHALL receive a send request with a fresh 6-digit OTP

### Requirement: Passkey plugin is enabled on the auth server

The system SHALL configure the `passkey()` plugin from `@better-auth/passkey` in the better-auth config. The plugin SHALL be initialized with `rpID` derived from the `BETTER_AUTH_URL` hostname and `origin` set to `BETTER_AUTH_URL`.

#### Scenario: Passkey registration endpoint is available

- **WHEN** an authenticated client sends a request to `/api/auth/passkey/add-passkey`
- **THEN** better-auth SHALL process the WebAuthn registration ceremony and return the appropriate response

#### Scenario: Passkey sign-in endpoint is available

- **WHEN** a client sends a request to `/api/auth/sign-in/passkey`
- **THEN** better-auth SHALL process the WebAuthn authentication ceremony and return a session on success

### Requirement: Auth secrets are managed via environment variables

The system SHALL read all sensitive configuration (auth secret, email provider credentials) from environment variables. No secrets SHALL be hardcoded in source files.

#### Scenario: Secrets loaded from .env

- **WHEN** the server starts with a valid `.env` file containing required variables
- **THEN** better-auth and the email provider SHALL initialize without any hardcoded fallback values
