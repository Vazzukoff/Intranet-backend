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
exports.getPendingTasks = exports.getTasks = exports.getDueDates = exports.deleteTask = exports.createAndAssignTask = void 0;
exports.handleCompleteTask = handleCompleteTask;
const tasks_service_1 = require("../services/tasks.service");
const task_repository_1 = require("../repositories/task.repository");
const createAndAssignTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield (0, tasks_service_1.createTask)(req.body);
        yield (0, tasks_service_1.assignTaskToAllEmployees)(task.id);
        res.status(201).json({
            message: 'Tarea creada y asignada a rodos los empleados.',
            task,
        });
    }
    catch (error) {
        console.error('[createAndAssignTask Error', error);
        res.status(400).json({
            error: error instanceof Error ? error.message : 'An unexpected error ocurred',
        });
    }
});
exports.createAndAssignTask = createAndAssignTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, task_repository_1.deleteTaskFromDB)(Number(id));
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
});
exports.deleteTask = deleteTask;
const getDueDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const dueDates = yield (0, task_repository_1.getDueDatesFromDB)(Number(taskId));
        res.status(200).json(dueDates);
    }
    catch (error) {
        console.error('[get-due-dates] Error:', error);
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
});
exports.getDueDates = getDueDates;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield (0, task_repository_1.getTasksFromDB)();
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error('[get-tasks] Error:', error);
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
});
exports.getTasks = getTasks;
const getPendingTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ error: 'No autenticado' });
            return;
        }
        const tasks = yield (0, task_repository_1.getPendingTasksFromDB)(userId);
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error('[tasks/pending] Error:', error);
        res.status(500).json({ error: 'Error obteniendo tareas pendientes' });
    }
});
exports.getPendingTasks = getPendingTasks;
function handleCompleteTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const taskId = Number(req.params.taskId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { status } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        try {
            const updatedTask = yield (0, tasks_service_1.completeUserTask)(userId, taskId, status);
            return res.json({ task: Object.assign({}, updatedTask) });
        }
        catch (error) {
            console.error('🔴 Error atrapado en controller:', error);
            if ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('no pertenece')) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
