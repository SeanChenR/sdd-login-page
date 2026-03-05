import { useEffect, useRef, useState } from "react"
import { GlassCard } from "../components/GlassCard"
import { authClient } from "../lib/auth-client"
import { validateOtp } from "../lib/validation"

interface TwoFactorPageProps {
  onVerified: () => void
}

export function TwoFactorPage({ onVerified }: TwoFactorPageProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "sent" | "sending">("idle")
  const hasSentOtp = useRef(false)

  // Send OTP on mount. useRef guard prevents double-send in React Strict Mode.
  useEffect(() => {
    if (hasSentOtp.current) return
    hasSentOtp.current = true
    authClient.twoFactor.sendOtp()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const otpErr = validateOtp(otp)
    if (otpErr) return setError(otpErr)

    setLoading(true)
    const { error: verifyError } = await authClient.twoFactor.verifyOtp({
      code: otp,
    })
    setLoading(false)

    if (verifyError) {
      setError(verifyError.message ?? "Invalid or expired code. Please try again.")
      return
    }

    onVerified()
  }

  async function handleResend() {
    setResendStatus("sending")
    await authClient.twoFactor.sendOtp()
    setResendStatus("sent")
    setTimeout(() => setResendStatus("idle"), 5000)
  }

  return (
    <div className="auth-bg">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Two-factor verification</h1>
        <p className="text-white/50 text-sm text-center mb-8">
          A 6-digit code was sent to your email
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="otp-2fa" className="text-white/70 text-sm font-medium">
              Verification code
            </label>
            <input
              id="otp-2fa"
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
            {loading ? "Verifying…" : "Verify"}
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-6">
          Didn&apos;t receive it?{" "}
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
