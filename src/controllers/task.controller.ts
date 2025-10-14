import { Request, Response } from 'express';
import { createTask, assignTaskToAllEmployees, completeUserTask } from '../services/tasks.service';
import { getTasksFromDB, deleteTaskFromDB, getDueDatesFromDB, getPendingTasksFromDB } from '../repositories/task.repository'
import { AuthenticatedRequest } from '../interfaces/auth.interface';

export const createAndAssignTask = async (
    req: Request,
    res: Response
) => {
    try {
        const task = await createTask(req.body);
        await assignTaskToAllEmployees(task.id);

        res.status(201).json({
            message: 'Tarea creada y asignada a rodos los empleados.',
            task,
        });
    }   catch (error) {
        console.error('[createAndAssignTask Error', error);
        res.status(400).json({
            error: error instanceof Error ? error.message : 'An unexpected error ocurred',
        });
    }
}

export const deleteTask = async (
    req: Request,
    res: Response
) => {
    const { id }= req.params;

    try {
        await deleteTaskFromDB(Number(id));
        res.status(204).send();
    }catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
}

export const getDueDates = async (
    req: Request,
    res: Response
) => {
    const { taskId } = req.params;
    try {
        const dueDates = await getDueDatesFromDB(Number(taskId));
        res.status(200).json(dueDates);
    } catch (error) {
        console.error('[get-due-dates] Error:', error);
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
}

export const getTasks = async (
    req: Request,
    res: Response
) => {
    try {
        const tasks = await getTasksFromDB();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('[get-tasks] Error:', error);  
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
}

export const getPendingTasks = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
          res.status(401).json({ error: 'No autenticado' });
          return;
        }
        const tasks = await getPendingTasksFromDB(userId);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('[tasks/pending] Error:', error);
        res.status(500).json({ error: 'Error obteniendo tareas pendientes' });
    }
}

export async function handleCompleteTask(
    req: AuthenticatedRequest,
    res: Response
) {
    const taskId = Number(req.params.taskId);
    const userId = req.user?.id;
    const { status } = req.body;
  
    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
  
    try {
      const updatedTask = await completeUserTask(userId, taskId, status);
  
      return res.json({ task: { ...updatedTask } });
    } catch (error: any) {
      console.error('🔴 Error atrapado en controller:', error);
  
      if (error.message?.includes('no pertenece')) {
        return res.status(404).json({ error: error.message });
      }
  
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
}