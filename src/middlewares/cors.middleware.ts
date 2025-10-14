import cors from "cors";
import dotenv from "dotenv"

dotenv.config();

export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
});