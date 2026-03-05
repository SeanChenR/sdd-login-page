## MODIFIED Requirements

### Requirement: better-auth server is initialized with SQLite adapter

The system SHALL initialize a better-auth instance in `src/server/auth.ts` using the `bun:sqlite` database adapter. The database file SHALL be stored at `./data/auth.db`. better-auth SHALL manage all schema migrations automatically. The `passkey` plugin SHALL be included, adding a `passkey` table to the schema.

#### Scenario: Server starts with valid config

- **WHEN** the Bun server starts with all required environment variables set
- **THEN** better-auth SHALL initialize successfully and the SQLite database file SHALL be created if it does not exist, including the `passkey` table

#### Scenario: Missing required environment variable

- **WHEN** `BETTER_AUTH_SECRET` is absent at startup
- **THEN** the server SHALL throw an error at initialization time and SHALL NOT start

## ADDED Requirements

### Requirement: Passkey plugin is enabled on the auth server

The system SHALL configure the `passkey()` plugin from `@better-auth/passkey` in the better-auth config. The plugin SHALL be initialized with `rpID` derived from the `BETTER_AUTH_URL` hostname and `origin` set to `BETTER_AUTH_URL`.

#### Scenario: Passkey registration endpoint is available

- **WHEN** an authenticated client sends a request to `/api/auth/passkey/add-passkey`
- **THEN** better-auth SHALL process the WebAuthn registration ceremony and return the appropriate response

#### Scenario: Passkey sign-in endpoint is available

- **WHEN** a client sends a request to `/api/auth/sign-in/passkey`
- **THEN** better-auth SHALL process the WebAuthn authentication ceremony and return a session on success
