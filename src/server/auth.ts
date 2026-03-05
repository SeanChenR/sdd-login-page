import { betterAuth } from "better-auth"
import { emailOTP, twoFactor } from "better-auth/plugins"
import { Database } from "bun:sqlite"
import nodemailer from "nodemailer"
import { Resend } from "resend"

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET environment variable is required")
}

const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com"

// Use Mailpit (local SMTP) when SMTP_HOST is set, otherwise use Resend
async function sendEmail(to: string, subject: string, text: string) {
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 1025),
      secure: false,
    })
    await transporter.sendMail({ from: fromEmail, to, subject, text })
  } else {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({ from: fromEmail, to, subject, text })
  }
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: new Database("./data/auth.db"),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subjects: Record<string, string> = {
          "email-verification": "Verify your email",
          "sign-in": "Your sign-in code",
          "forget-password": "Reset your password",
        }
        await sendEmail(email, subjects[type] ?? "Your verification code", `Your code is: ${otp}\n\nThis code expires in 10 minutes.`)
      },
    }),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendEmail(user.email, "Your login verification code", `Your login code is: ${otp}\n\nThis code expires in 10 minutes.`)
        },
      },
    }),
  ],
})

export type Auth = typeof auth
