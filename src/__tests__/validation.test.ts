import { describe, expect, test } from "bun:test"
import {
  validateConfirmPassword,
  validateEmail,
  validateOtp,
  validatePassword,
} from "../lib/validation"

describe("validateEmail", () => {
  test("returns null for valid email", () => {
    expect(validateEmail("user@example.com")).toBeNull()
  })

  test("returns error for empty string", () => {
    expect(validateEmail("")).not.toBeNull()
  })

  test("returns error for missing @", () => {
    expect(validateEmail("userexample.com")).not.toBeNull()
  })

  test("returns error for missing domain", () => {
    expect(validateEmail("user@")).not.toBeNull()
  })
})

describe("validatePassword", () => {
  test("returns null for valid password", () => {
    expect(validatePassword("password123")).toBeNull()
  })

  test("returns error for empty string", () => {
    expect(validatePassword("")).not.toBeNull()
  })

  test("returns error for password under 8 chars", () => {
    expect(validatePassword("short")).not.toBeNull()
  })

  test("accepts exactly 8 characters", () => {
    expect(validatePassword("exactly8")).toBeNull()
  })
})

describe("validateConfirmPassword", () => {
  test("returns null when passwords match", () => {
    expect(validateConfirmPassword("password123", "password123")).toBeNull()
  })

  test("returns error when passwords don't match", () => {
    expect(validateConfirmPassword("password123", "different")).not.toBeNull()
  })

  test("returns error for empty confirm", () => {
    expect(validateConfirmPassword("password123", "")).not.toBeNull()
  })
})

describe("validateOtp", () => {
  test("returns null for valid 6-digit OTP", () => {
    expect(validateOtp("123456")).toBeNull()
  })

  test("returns error for empty string", () => {
    expect(validateOtp("")).not.toBeNull()
  })

  test("returns error for non-numeric characters", () => {
    expect(validateOtp("12345a")).not.toBeNull()
  })

  test("returns error for less than 6 digits", () => {
    expect(validateOtp("12345")).not.toBeNull()
  })

  test("returns error for more than 6 digits", () => {
    expect(validateOtp("1234567")).not.toBeNull()
  })
})
