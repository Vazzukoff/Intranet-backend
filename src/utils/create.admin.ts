import { hashPassword } from './security';
import { User } from '../interfaces/user.interface';
import { pool } from "../db/connection";

async function createAdmin(username: string, password: string): Promise<void> {
  try {
    const hashedPassword = await hashPassword(password);

    const query = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, 'admin')
      RETURNING *;
    `;
    const result = await pool.query<User>(query, [username, hashedPassword]);
    console.log('Usuario admin creado:', result.rows[0]);
  } catch (err) {
    console.error('Error creando usuario admin:', err);
  } finally {
    await pool.end();
  }
}

createAdmin('admin', 'admin');