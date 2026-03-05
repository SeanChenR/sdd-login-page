import { useEffect, useState } from "react"
import { GlassCard } from "../components/GlassCard"
import { authClient } from "../lib/auth-client"

interface HomePageProps {
  onSignedOut: () => void
}

type Passkey = {
  id: string
  name?: string | null
  createdAt: Date
}

export function HomePage({ onSignedOut }: HomePageProps) {
  const { data: session } = authClient.useSession()
  const [passkeys, setPasskeys] = useState<Passkey[]>([])
  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [passkeyError, setPasskeyError] = useState<string | null>(null)

  async function loadPasskeys() {
    const { data } = await authClient.passkey.listUserPasskeys()
    setPasskeys((data ?? []) as Passkey[])
  }

  useEffect(() => {
    loadPasskeys()
  }, [])

  async function handleSignOut() {
    await authClient.signOut()
    onSignedOut()
  }

  async function handleAddPasskey() {
    setPasskeyError(null)
    setPasskeyLoading(true)
    const { error } = await authClient.passkey.addPasskey()
    setPasskeyLoading(false)
    if (error) {
      if (
        !error.message?.toLowerCase().includes("cancel") &&
        !error.message?.toLowerCase().includes("abort")
      ) {
        setPasskeyError(error.message ?? "Failed to add passkey.")
      }
      return
    }
    await loadPasskeys()
  }

  async function handleDeletePasskey(id: string) {
    setPasskeyError(null)
    const { error } = await authClient.passkey.deletePasskey({ id })
    if (error) {
      setPasskeyError(error.message ?? "Failed to delete passkey.")
      return
    }
    setDeleteConfirmId(null)
    await loadPasskeys()
  }

  return (
    <div className="auth-bg">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">You&apos;re in</h1>
        <p className="text-white/50 text-sm text-center mb-8">
          Signed in as <span className="text-white/80 font-medium">{session?.user.email}</span>
        </p>

        {/* Passkey management */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white/70 text-sm font-medium">Passkeys</h2>
            <button
              type="button"
              onClick={handleAddPasskey}
              disabled={passkeyLoading}
              className="text-white/60 hover:text-white text-xs underline transition-colors disabled:opacity-50"
            >
              {passkeyLoading ? "Adding…" : "+ Add passkey"}
            </button>
          </div>

          {passkeyError && <p className="text-red-400 text-xs mb-2">{passkeyError}</p>}

          {passkeys.length === 0 ? (
            <p className="text-white/30 text-xs text-center py-3">
              No passkeys yet. Add one to sign in faster next time.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {passkeys.map((pk) => (
                <li
                  key={pk.id}
                  className="flex items-center justify-between glass-input rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-white/80 text-xs font-medium">{pk.name ?? "Passkey"}</p>
                    <p className="text-white/40 text-xs">
                      {new Date(pk.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {deleteConfirmId === pk.id ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeletePasskey(pk.id)}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-white/40 hover:text-white/70 text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(pk.id)}
                      className="text-white/30 hover:text-red-400 text-xs transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="h-px bg-white/10 mb-6" />

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
