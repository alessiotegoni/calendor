import { configDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";

configDotenv({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  strict: true,
  verbose: true,
  dbCredentials: { url: process.env.DATABASE_URL! },
});
