import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
  updateTask,
} from '../controllers/taskController';
import { catchAsync } from '../utils/catchAsync';

const taskRoutes = Router();

taskRoutes.get('/tasks', catchAsync(getAllTasks, 'getAllTasks'));
taskRoutes.get('/tasks/:id', catchAsync(getTaskById, 'getTaskById'));
taskRoutes.post('/tasks', catchAsync(createTask, 'createTask'));
taskRoutes.delete('/tasks/:id', catchAsync(deleteTask, 'deleteTask'));
taskRoutes.patch('/tasks/:id', catchAsync(updateTask, 'updateTask'));

export default taskRoutes;
