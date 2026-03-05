import { getMigrations } from "better-auth/db/migration"
import { auth } from "../src/server/auth"

const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options)

if (toBeCreated.length === 0 && toBeAdded.length === 0) {
  console.log("Database is up to date.")
  process.exit(0)
}

console.log(
  "Tables to create:",
  toBeCreated.map((t) => t.table),
)
console.log(
  "Fields to add:",
  toBeAdded.map((t) => `${t.table}: ${Object.keys(t.fields).join(", ")}`),
)

await runMigrations()
console.log("Migration complete.")
