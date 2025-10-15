import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect(); // obtenemos una conexión del pool
    await client.query("SELECT 1"); // consulta de prueba
    client.release(); // liberamos la conexión
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};