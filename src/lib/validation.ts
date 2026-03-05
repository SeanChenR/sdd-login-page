export function validateEmail(email: string): string | null {
  if (!email) return "Email is required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address"
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required"
  if (password.length < 8) return "Password must be at least 8 characters"
  return null
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return "Please confirm your password"
  if (password !== confirm) return "Passwords do not match"
  return null
}

export function validateOtp(otp: string): string | null {
  if (!otp) return "Code is required"
  if (!/^\d{6}$/.test(otp)) return "Code must be 6 digits"
  return null
}
