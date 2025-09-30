import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
  updateTask,
} from '../controllers/taskController';
import { catchAsync } from '../utils';
import { createTaskSchema } from '../validators/taskValidator';
import { validate } from '../middleware';

const taskRoutes = Router();

taskRoutes.get('/tasks', catchAsync(getAllTasks, 'getAllTasks'));
taskRoutes.get('/tasks/:id', catchAsync(getTaskById, 'getTaskById'));
taskRoutes.post(
  '/tasks',
  validate(createTaskSchema),
  catchAsync(createTask, 'createTask'),
);
taskRoutes.delete('/tasks/:id', catchAsync(deleteTask, 'deleteTask'));
taskRoutes.patch(
  '/tasks/:id',
  validate(createTaskSchema),
  catchAsync(updateTask, 'updateTask'),
);

export default taskRoutes;
