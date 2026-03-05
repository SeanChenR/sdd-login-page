interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return <div className={`glass-card rounded-2xl p-8 w-full max-w-md ${className}`}>{children}</div>
}
