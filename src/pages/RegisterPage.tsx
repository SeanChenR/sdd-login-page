import { useState } from "react"
import { GlassCard } from "../components/GlassCard"
import { authClient } from "../lib/auth-client"
import { validateConfirmPassword, validateEmail, validatePassword } from "../lib/validation"

interface RegisterPageProps {
  onRegistered: (email: string) => void
  onNavigateLogin: () => void
}

export function RegisterPage({ onRegistered, onNavigateLogin }: RegisterPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const emailErr = validateEmail(email)
    if (emailErr) return setError(emailErr)
    const passErr = validatePassword(password)
    if (passErr) return setError(passErr)
    const confirmErr = validateConfirmPassword(password, confirm)
    if (confirmErr) return setError(confirmErr)

    setLoading(true)
    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0] ?? email,
    })
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message ?? "Registration failed. Please try again.")
      return
    }

    // Send verification OTP
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    })

    onRegistered(email)
  }

  return (
    <div className="auth-bg">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Create account</h1>
        <p className="text-white/50 text-sm text-center mb-8">Enter your details to get started</p>

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
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input rounded-xl px-4 py-3 text-sm w-full"
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-white/70 text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-white/70 underline hover:text-white transition-colors"
          >
            Sign in
          </button>
        </p>
      </GlassCard>
    </div>
  )
}
