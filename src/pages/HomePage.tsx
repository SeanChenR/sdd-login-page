import { GlassCard } from "../components/GlassCard"
import { authClient } from "../lib/auth-client"

interface HomePageProps {
  onSignedOut: () => void
}

export function HomePage({ onSignedOut }: HomePageProps) {
  const { data: session } = authClient.useSession()

  async function handleSignOut() {
    await authClient.signOut()
    onSignedOut()
  }

  return (
    <div className="auth-bg">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">You&apos;re in</h1>
        <p className="text-white/50 text-sm text-center mb-8">
          Signed in as <span className="text-white/80 font-medium">{session?.user.email}</span>
        </p>

        <button
          type="button"
          onClick={handleSignOut}
          className="glass-button rounded-xl py-3 w-full"
        >
          Sign out
        </button>
      </GlassCard>
    </div>
  )
}
