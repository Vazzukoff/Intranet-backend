import { Router } from 'express';
import { createAndAssignTask, deleteTask, getTasks, 
         getPendingTasks, getDueDates, handleCompleteTask 
} from '../controllers/task.controller';

const router = Router();

// Global routes
router.get('/due-dates/:taskId', getDueDates);

// Admin routes
router.post('/create-tasks', createAndAssignTask);
router.delete('/delete-task/:id', deleteTask);
router.get('/tasks', getTasks);
router.get('/pending', getPendingTasks);

// Employee 
router.patch('/update-tasks/:taskId', handleCompleteTask);

export default router;