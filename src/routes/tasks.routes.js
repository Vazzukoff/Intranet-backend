"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const router = (0, express_1.Router)();
// Global routes
router.get('/due-dates/:taskId', task_controller_1.getDueDates);
// Admin routes
router.post('/create-tasks', task_controller_1.createAndAssignTask);
router.delete('/delete-task/:id', task_controller_1.deleteTask);
router.get('/tasks', task_controller_1.getTasks);
router.get('/pending', task_controller_1.getPendingTasks);
// Employee 
router.patch('/update-tasks/:taskId', task_controller_1.handleCompleteTask);
exports.default = router;
