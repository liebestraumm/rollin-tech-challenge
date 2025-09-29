import { RequestHandler } from 'express';
import Task from '../models/Task';
import { HttpError } from '../lib/HttpError';
import HttpCode from '../constants/httpCode';

// Gets all tasks
export const getAllTasks: RequestHandler = async (_, response) => {
  const tasks = await Task.findAll();
  response.status(HttpCode.OK).json(tasks);
};

// Gets a task by id
export const getTaskById: RequestHandler = async (request, response) => {
  const task = await Task.findByPk(request.params.id);
  if (!task) {
    throw new HttpError('Task not found', HttpCode.NOT_FOUND);
  }
  response.status(HttpCode.OK).json(task);
};

// Creates a task
export const createTask: RequestHandler = async (request, response) => {
  if (!request.body || Object.keys(request.body).length === 0) {
    throw new HttpError('Task data is required', HttpCode.BAD_REQUEST);
  }

  const task = await Task.create(request.body);
  response.status(HttpCode.CREATED).json(task);
};

// Deletes a task
export const deleteTask: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const deleted = await Task.destroy({ where: { id } });

  if (!deleted) {
    throw new HttpError('Task not found', HttpCode.NOT_FOUND);
  }

  response.status(HttpCode.OK).json({ message: 'Task has been deleted.' });
};

// Updates a task
export const updateTask: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const [updated] = await Task.update(request.body, { where: { id } });

  if (!updated) {
    throw new HttpError('Task not found', HttpCode.NOT_FOUND);
  }

  const task = await Task.findByPk(id);
  response.status(HttpCode.OK).json(task);
};
