import { useState } from "react"
import { GlassCard } from "../components/GlassCard"
import { authClient } from "../lib/auth-client"
import { validateOtp } from "../lib/validation"

interface VerifyEmailPageProps {
  email: string
  onVerified: () => void
}

export function VerifyEmailPage({ email, onVerified }: VerifyEmailPageProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "sent" | "sending">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const otpErr = validateOtp(otp)
    if (otpErr) return setError(otpErr)

    setLoading(true)
    const { error: verifyError } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    })
    setLoading(false)

    if (verifyError) {
      setError(verifyError.message ?? "Invalid or expired code. Please try again.")
      return
    }

    setVerified(true)
  }

  async function handleResend() {
    setResendStatus("sending")
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    })
    setResendStatus("sent")
    setTimeout(() => setResendStatus("idle"), 5000)
  }

  if (verified) {
    return (
      <div className="auth-bg">
        <GlassCard>
          <p className="text-green-400 text-center font-medium mb-6">Email verified!</p>
          <button
            type="button"
            onClick={onVerified}
            className="glass-button glass-button-primary rounded-xl py-3 w-full"
          >
            Continue to sign in
          </button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="auth-bg">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Check your email</h1>
        <p className="text-white/50 text-sm text-center mb-1">We sent a 6-digit code to</p>
        <p className="text-white/80 text-sm font-medium text-center mb-8">{email}</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="otp" className="text-white/70 text-sm font-medium">
              Verification code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="glass-input rounded-xl px-4 py-3 text-sm w-full tracking-widest text-center"
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
            {loading ? "Verifying…" : "Verify email"}
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-6">
          Didn't receive it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendStatus !== "idle"}
            className="text-white/70 underline hover:text-white transition-colors disabled:opacity-50 disabled:no-underline"
          >
            {resendStatus === "sent"
              ? "Code sent!"
              : resendStatus === "sending"
                ? "Sending…"
                : "Resend code"}
          </button>
        </p>
      </GlassCard>
    </div>
  )
}
