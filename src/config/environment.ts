import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    // Server
    PORT: z.string().default("3000"),
    
    // Database
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
})

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error("Invalid environment variables:", env.error?.format());
    throw new Error("Invalid environment variables");
}

export const config = {
    // Server
    PORT: parseInt(env.data.PORT, 10),
     
    //Database
    DB_HOST: env.data.DB_HOST,
    DB_PORT:env.data.DB_PORT,
    DB_NAME:env.data.DB_NAME,
    DB_USER:env.data.DB_USER,
    DB_PASSWORD:env.data.DB_PASSWORD,
} as const