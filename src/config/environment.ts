import dotenv from "dotenv";
import { z } from "zod";

// Solo cargar dotenv en desarrollo local
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const envSchema = z.object({
  // Server
  PORT: z.string().default("3000"),
  // Database
  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_PORT: z.string().default("5432"),
  DB_NAME: z.string().min(1, "DB_NAME is required"),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
});

const parseEnv = () => {
  const env = envSchema.safeParse(process.env);
  
  if (!env.success) {
    console.error("Invalid environment variables:", env.error?.format());
    console.error("Available env vars:", Object.keys(process.env).filter(k => k.startsWith('DB_')));
    throw new Error("Invalid environment variables");
  }
  
  return env.data;
};

const envData = parseEnv();

export const config = {
  // Server
  PORT: parseInt(envData.PORT, 10),
  // Database
  DB_HOST: envData.DB_HOST,
  DB_PORT: envData.DB_PORT,
  DB_NAME: envData.DB_NAME,
  DB_USER: envData.DB_USER,
  DB_PASSWORD: envData.DB_PASSWORD,
} as const;