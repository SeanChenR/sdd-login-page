import { passkeyClient } from "@better-auth/passkey/client"
import { createAuthClient } from "better-auth/react"
import { emailOTPClient, twoFactorClient } from "better-auth/client/plugins"

// Module-level callback so the React state machine can respond to 2FA redirects
let twoFactorRedirectFn: (() => void) | undefined

export function onTwoFactorRedirect(fn: () => void) {
  twoFactorRedirectFn = fn
}

export function callTwoFactorRedirect() {
  twoFactorRedirectFn?.()
}

export const authClient = createAuthClient({
  baseURL: window.location.origin,
  plugins: [
    emailOTPClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        twoFactorRedirectFn?.()
      },
    }),
    passkeyClient(),
  ],
})

export type Session = typeof authClient.$Infer.Session
