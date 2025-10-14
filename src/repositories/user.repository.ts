import { pool } from "../db/connection"
import { User, CreateUserDTO } from "../interfaces/user.interface"

export async function createUser(
    user: CreateUserDTO,
    role: string = 'employee'
): Promise<User> {
    const { username, password } = user;

    const result = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
        [username, password, role]
    );
    return result.rows[0];
}

export async function getUserbyUsername(
    username: string
): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', 
        [username]   
    );
    return result.rows[0] || null;
}

export async function getUserById(
    userId: number
) {
    const result = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
        throw new Error('Usuario no encontrado');
    }
    return result.rows[0];
}
  