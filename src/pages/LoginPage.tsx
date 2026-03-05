import { useState } from "react"
import { GlassCard } from "../components/GlassCard"
import { authClient } from "../lib/auth-client"
import { validateEmail, validatePassword } from "../lib/validation"

interface LoginPageProps {
  onNavigateRegister: () => void
  onUnverifiedEmail: (email: string) => void
  onLoggedIn: () => void
  onNeedsTwoFactor: () => void
}

export function LoginPage({ onNavigateRegister, onUnverifiedEmail, onLoggedIn, onNeedsTwoFactor }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const emailErr = validateEmail(email)
    if (emailErr) return setError(emailErr)
    const passErr = validatePassword(password)
    if (passErr) return setError(passErr)

    setLoading(true)
    const { error: signInError } = await authClient.signIn.email({
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
    // No error and no 2FA redirect — first login (2FA not yet enabled for this user).
    // Enable 2FA now so future logins require OTP, then send the first OTP.
    const { error: enableError } = await authClient.twoFactor.enable({ password })
    if (enableError) {
      // If enable fails (e.g. already enabled), go directly home
      onLoggedIn()
      return
    }
    await authClient.twoFactor.sendOtp()
    onNeedsTwoFactor()
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
              autoComplete="email"
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
