import { Task } from '../interfaces/task.interface';
import { pool } from '../db/connection';
import { createNewTask, getTaskByTitle, updateTaskStatusFromDB, assignTaskToAllEmployeesInDB } from '../repositories/task.repository';


export async function createTask(
  task: Omit<Task, 'id'>
): Promise<Task> {
  const { title, description, status, dueDate } = task;

  const existingTask = await getTaskByTitle(title)

  if (existingTask) {
    throw new Error("La tarea ya existe");
  }

  const newTask = await createNewTask({ title, description, status, dueDate });

  return newTask;
}

export async function completeUserTask(
  userId: number,
  taskId: number,
  status: 'pending' | 'completed'
) {
  if (!taskId || !status) {
    throw new Error('Datos incompletos para actualizar la tarea');
  }

  const updatedTask = await updateTaskStatusFromDB(userId, taskId, status);
  if (!updatedTask) {
    throw new Error('Tarea no encontrada o no pertenece al usuario');
  }

  return updatedTask;
}

export async function assignTaskToAllEmployees(
  taskId: number
): Promise<void> {
  console.log('[assignTaskToAllEmployees] Iniciando asignación de tareas…');
  try {
    await assignTaskToAllEmployeesInDB(taskId);
  } catch (error) {
    console.error('Error asignando tarea a empleados:', error);
    throw error;
  }
}