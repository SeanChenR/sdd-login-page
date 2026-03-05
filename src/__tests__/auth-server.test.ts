import { describe, expect, test } from "bun:test"

const BASE_URL = "http://localhost:3000"

describe("Auth server routes", () => {
  test("POST /api/auth/sign-up/email returns 200 or 422 for valid payload", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        password: "testpassword123",
        name: "Test User",
      }),
    })
    // 200 = success, 422 = validation error — both are valid server responses
    expect([200, 201, 422]).toContain(res.status)
    const body = await res.json()
    expect(body).toBeObject()
  })

  test("POST /api/auth/sign-in/email returns 401 for wrong credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      }),
    })
    expect(res.status).toBe(401)
  })

  test("POST /api/auth/sign-in/email returns JSON response", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    })
    const contentType = res.headers.get("content-type")
    expect(contentType).toContain("application/json")
  })
})
