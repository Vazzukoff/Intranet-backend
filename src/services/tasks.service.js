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
exports.createTask = createTask;
exports.completeUserTask = completeUserTask;
exports.assignTaskToAllEmployees = assignTaskToAllEmployees;
const task_repository_1 = require("../repositories/task.repository");
function createTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, status, dueDate } = task;
        const existingTask = yield (0, task_repository_1.getTaskByTitle)(title);
        if (existingTask) {
            throw new Error("La tarea ya existe");
        }
        const newTask = yield (0, task_repository_1.createNewTask)({ title, description, status, dueDate });
        return newTask;
    });
}
function completeUserTask(userId, taskId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!taskId || !status) {
            throw new Error('Datos incompletos para actualizar la tarea');
        }
        const updatedTask = yield (0, task_repository_1.updateTaskStatusFromDB)(userId, taskId, status);
        if (!updatedTask) {
            throw new Error('Tarea no encontrada o no pertenece al usuario');
        }
        return updatedTask;
    });
}
function assignTaskToAllEmployees(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[assignTaskToAllEmployees] Iniciando asignación de tareas…');
        try {
            yield (0, task_repository_1.assignTaskToAllEmployeesInDB)(taskId);
        }
        catch (error) {
            console.error('Error asignando tarea a empleados:', error);
            throw error;
        }
    });
}
