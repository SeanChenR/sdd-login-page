import { useEffect, useState } from "react"
import { GlassCard } from "../components/GlassCard"
import { authClient, callTwoFactorRedirect } from "../lib/auth-client"
import { validateEmail, validatePassword } from "../lib/validation"

interface LoginPageProps {
  onNavigateRegister: () => void
  onUnverifiedEmail: (email: string) => void
  onLoggedIn: () => void
}

export function LoginPage({ onNavigateRegister, onUnverifiedEmail, onLoggedIn }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passkeyLoading, setPasskeyLoading] = useState(false)

  // Enable browser conditional UI (passkey autofill on the email input)
  useEffect(() => {
    if (!PublicKeyCredential?.isConditionalMediationAvailable) return
    PublicKeyCredential.isConditionalMediationAvailable().then((available) => {
      if (!available) return
      authClient.signIn.passkey({ autoFill: true }).then(({ error: err }) => {
        if (!err) onLoggedIn()
      })
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const emailErr = validateEmail(email)
    if (emailErr) return setError(emailErr)
    const passErr = validatePassword(password)
    if (passErr) return setError(passErr)

    setLoading(true)
    const { data: signInData, error: signInError } = await authClient.signIn.email({
      email,
      password,
    })
    setLoading(false)

    if (signInError) {
      // Check if email verification is required
      if (
        signInError.message?.toLowerCase().includes("email") &&
        signInError.message?.toLowerCase().includes("verif")
      ) {
        await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "email-verification",
        })
        onUnverifiedEmail(email)
        return
      }
      // When 2FA is required, twoFactorClient fires onTwoFactorRedirect and
      // returns a specific error — don't show a generic error in that case
      if (signInError.message?.toLowerCase().includes("two")) return
      setError("Invalid email or password.")
      return
    }

    // If no error but also no session, twoFactorClient handled the 2FA redirect
    // internally without returning an error — do nothing here
    if (!signInData?.token) return

    // No error and full session — first login (2FA not yet enabled for this user).
    // Enable 2FA then immediately go through 2FA verification to get a proper
    // full session (so refresh after login stays on home screen).
    const { error: enableError } = await authClient.twoFactor.enable({ password })
    if (enableError) {
      console.error("twoFactor.enable failed:", enableError.message)
      onLoggedIn()
      return
    }
    callTwoFactorRedirect()
  }

  async function handlePasskeySignIn() {
    setError(null)
    setPasskeyLoading(true)
    const { error: err } = await authClient.signIn.passkey()
    setPasskeyLoading(false)
    if (err) {
      // User cancelled or no credential available — show message only for unexpected errors
      if (
        !err.message?.toLowerCase().includes("cancel") &&
        !err.message?.toLowerCase().includes("abort")
      ) {
        setError(err.message ?? "Passkey sign-in failed. Try signing in with email instead.")
      }
      return
    }
    onLoggedIn()
  }

  return (
    <div className="auth-bg">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Welcome back</h1>
        <p className="text-white/50 text-sm text-center mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-white/70 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username webauthn"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input rounded-xl px-4 py-3 text-sm w-full"
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-white/70 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input rounded-xl px-4 py-3 text-sm w-full"
              aria-required="true"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="glass-button glass-button-primary rounded-xl py-3 mt-2 w-full"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handlePasskeySignIn}
          disabled={passkeyLoading}
          className="glass-button rounded-xl py-3 mt-3 w-full flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="4" />
            <path d="M16 8h6" />
            <path d="M19 5v6" />
            <path d="M14 16a4 4 0 0 0-8 0v2h8z" />
          </svg>
          {passkeyLoading ? "Verifying…" : "Sign in with passkey"}
        </button>

        <p className="text-white/40 text-sm text-center mt-6">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onNavigateRegister}
            className="text-white/70 underline hover:text-white transition-colors"
          >
            Create account
          </button>
        </p>
      </GlassCard>
    </div>
  )
}
