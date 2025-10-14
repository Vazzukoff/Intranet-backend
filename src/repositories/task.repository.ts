import { pool } from "../db/connection";
import { Task, CreateTaskDTO } from "../interfaces/task.interface";
import { FileRecord } from "../interfaces/file.interface";

export async function createNewTask(
    task: CreateTaskDTO
): Promise<Task> {
    const { title, description, dueDate } = task;

    const result = await pool.query(
        `INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4) 
        RETURNING id, title, description, status, due_date AS dueDate`,
        [title, description, 'pending', dueDate]
    );

    return result.rows[0];
}

export async function updateTaskStatusFromDB(
    userId: number,
    taskId: number,
    status: 'pending' | 'completed'
) {
    const result = await pool.query(
      `UPDATE user_tasks 
       SET status = $1 
       WHERE user_id = $2 AND task_id = $3 
       RETURNING *`,
      [status, userId, taskId]
    );
  
    return result.rows[0] || null;
}

export async function getTaskByTitle(
    title: string
): Promise<Task | null> {
    const result = await pool.query('SELECT * FROM tasks WHERE title = $1', 
        [title]
    );
    return result.rows[0];
}

export async function saveTaskFile(
taskId: number,
fileUuid: string,
originalName: string,
mimeType: string,
sizeBytes: number,
userId: number
): Promise<FileRecord> {
const result = await pool.query<FileRecord>(
    `INSERT INTO task_files
    (task_id, file_uuid, original_name, mime_type, size_bytes, uploaded_by)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING id, task_id, file_uuid, original_name, mime_type, size_bytes, uploaded_by, uploaded_at`,
    [taskId, fileUuid, originalName, mimeType, sizeBytes, userId]
);
return result.rows[0];
}

export async function getTasksFromDB(): Promise<Task[]> {
    const result = await pool.query('SELECT * FROM tasks');
    return result.rows;
}

export async function deleteTaskFromDB(
    id: number
): Promise<void> {
    const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1',
        [id]
    );

    if (result.rowCount === 0) {
        throw new Error('Tarea no encontrada');
    }
}

export async function getDueDatesFromDB(
    taskId: number
): Promise<string[]> {
    const result = await pool.query(
      'SELECT due_date FROM tasks WHERE id = $1',
      [taskId]
    );
  
    if (result.rows.length === 0) {
      throw new Error('Tarea no encontrada');
    }
  
    return result.rows.map(row => row.due_date);
}

export async function assignTaskToUser(
    userId: number,
    taskId: number
): Promise<void> {
    await pool.query(
      'INSERT INTO user_tasks (user_id, task_id) VALUES ($1, $2)',
      [userId, taskId]
    );
}

export async function getPendingTasksFromDB(
    userId: number
): Promise<Task[]> {
    const result = await pool.query(
		`SELECT t.id, t.title, t.description, ut.status, t.due_date AS "dueDate"
			FROM tasks t
			JOIN user_tasks ut ON t.id = ut.task_id
			WHERE ut.user_id = $1 AND ut.status = 'pending'`,
		[userId]
	);
    return result.rows;
}

export async function assignTaskToAllEmployeesInDB(
    taskId: number
): Promise<void> {
	const client = await pool.connect();
	try {
			await client.query('BEGIN');

			const employeesResult = await client.query(
					'SELECT id FROM users WHERE role = $1',
					['employee']
			);

			const employeeIds = employeesResult.rows.map((row) => row.id);

			for (const userId of employeeIds) {
					await client.query(
							'INSERT INTO user_tasks (user_id, task_id, status) VALUES ($1, $2, $3)',
							[userId, taskId, 'pending']
					);
			}

			await client.query('COMMIT');
	} catch (error) {
			await client.query('ROLLBACK');
			throw error;
	} finally {
			client.release();
	}
}