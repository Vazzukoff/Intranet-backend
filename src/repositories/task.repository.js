"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewTask = createNewTask;
exports.updateTaskStatusFromDB = updateTaskStatusFromDB;
exports.getTaskByTitle = getTaskByTitle;
exports.saveTaskFile = saveTaskFile;
exports.getTasksFromDB = getTasksFromDB;
exports.deleteTaskFromDB = deleteTaskFromDB;
exports.getDueDatesFromDB = getDueDatesFromDB;
exports.assignTaskToUser = assignTaskToUser;
exports.getPendingTasksFromDB = getPendingTasksFromDB;
exports.assignTaskToAllEmployeesInDB = assignTaskToAllEmployeesInDB;
const connection_1 = require("../db/connection");
function createNewTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, dueDate } = task;
        const result = yield connection_1.pool.query(`INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4) 
        RETURNING id, title, description, status, due_date AS dueDate`, [title, description, 'pending', dueDate]);
        return result.rows[0];
    });
}
function updateTaskStatusFromDB(userId, taskId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`UPDATE user_tasks 
       SET status = $1 
       WHERE user_id = $2 AND task_id = $3 
       RETURNING *`, [status, userId, taskId]);
        return result.rows[0] || null;
    });
}
function getTaskByTitle(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM tasks WHERE title = $1', [title]);
        return result.rows[0];
    });
}
function saveTaskFile(taskId, fileUuid, originalName, mimeType, sizeBytes, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`INSERT INTO task_files
    (task_id, file_uuid, original_name, mime_type, size_bytes, uploaded_by)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING id, task_id, file_uuid, original_name, mime_type, size_bytes, uploaded_by, uploaded_at`, [taskId, fileUuid, originalName, mimeType, sizeBytes, userId]);
        return result.rows[0];
    });
}
function getTasksFromDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT * FROM tasks');
        return result.rows;
    });
}
function deleteTaskFromDB(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error('Tarea no encontrada');
        }
    });
}
function getDueDatesFromDB(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query('SELECT due_date FROM tasks WHERE id = $1', [taskId]);
        if (result.rows.length === 0) {
            throw new Error('Tarea no encontrada');
        }
        return result.rows.map(row => row.due_date);
    });
}
function assignTaskToUser(userId, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield connection_1.pool.query('INSERT INTO user_tasks (user_id, task_id) VALUES ($1, $2)', [userId, taskId]);
    });
}
function getPendingTasksFromDB(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield connection_1.pool.query(`SELECT t.id, t.title, t.description, ut.status, t.due_date AS "dueDate"
			FROM tasks t
			JOIN user_tasks ut ON t.id = ut.task_id
			WHERE ut.user_id = $1 AND ut.status = 'pending'`, [userId]);
        return result.rows;
    });
}
function assignTaskToAllEmployeesInDB(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connection_1.pool.connect();
        try {
            yield client.query('BEGIN');
            const employeesResult = yield client.query('SELECT id FROM users WHERE role = $1', ['employee']);
            const employeeIds = employeesResult.rows.map((row) => row.id);
            for (const userId of employeeIds) {
                yield client.query('INSERT INTO user_tasks (user_id, task_id, status) VALUES ($1, $2, $3)', [userId, taskId, 'pending']);
            }
            yield client.query('COMMIT');
        }
        catch (error) {
            yield client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    });
}
