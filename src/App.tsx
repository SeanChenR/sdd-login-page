import { useEffect, useState } from "react"
import "./index.css"
import { authClient, onTwoFactorRedirect } from "./lib/auth-client"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { TwoFactorPage } from "./pages/TwoFactorPage"
import { VerifyEmailPage } from "./pages/VerifyEmailPage"

type Screen = "login" | "register" | "verify-email" | "two-factor" | "home" | "loading"

export function App() {
  const [screen, setScreen] = useState<Screen>("loading")
  const [pendingEmail, setPendingEmail] = useState("")

  // Register the 2FA redirect callback so twoFactorClient can navigate us
  useEffect(() => {
    onTwoFactorRedirect(() => setScreen("two-factor"))
  }, [])

  // Restore session on mount
  useEffect(() => {
    authClient.getSession().then((result) => {
      setScreen(result.data?.session ? "home" : "login")
    })
  }, [])

  if (screen === "loading") {
    return (
      <div className="auth-bg">
        <p className="text-white/40 text-sm">Loading…</p>
      </div>
    )
  }

  if (screen === "home") {
    return <HomePage onSignedOut={() => setScreen("login")} />
  }

  if (screen === "register") {
    return (
      <RegisterPage
        onRegistered={(email) => {
          setPendingEmail(email)
          setScreen("verify-email")
        }}
        onNavigateLogin={() => setScreen("login")}
      />
    )
  }

  if (screen === "verify-email") {
    return <VerifyEmailPage email={pendingEmail} onVerified={() => setScreen("login")} />
  }

  if (screen === "two-factor") {
    return <TwoFactorPage onVerified={() => setScreen("home")} />
  }

  return (
    <LoginPage
      onNavigateRegister={() => setScreen("register")}
      onLoggedIn={() => setScreen("home")}
      onNeedsTwoFactor={() => setScreen("two-factor")}
      onUnverifiedEmail={(email) => {
        setPendingEmail(email)
        setScreen("verify-email")
      }}
    />
  )
}

export default App
