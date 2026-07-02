import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGO_URI: z.string(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  AES_SECRET_KEY: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(envParsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = envParsed.data;
