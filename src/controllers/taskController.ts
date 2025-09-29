import { RequestHandler } from "express";
import Task from "../models/Task";

export const getAllTasks: RequestHandler = async (_, response) => {
  const tasks = await Task.findAll();
  response.status(200).json(tasks);
};

export const getTaskById: RequestHandler = async (request, response) => {
  const task = await Task.findByPk(request.params.id);
  if (task) {
    response.status(200).json(task);
  } else {
    response.sendStatus(404);
  }
};

export const createTask: RequestHandler = async (request, response) => {
  const task = await Task.create(request.body);
  response.status(201).json(task);
};

export const deleteTask: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const deleted = await Task.destroy({ where: { id } });

  if (deleted) {
    response.status(200).json({ message: "Task has been deleted." });
  } else {
    response.sendStatus(404);
  }
};

export const updateTask: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const [updated] = await Task.update(request.body, { where: { id } });

  if (updated) {
    const task = await Task.findByPk(id);
    response.status(200).json(task);
  } else {
    response.sendStatus(404);
  }
};