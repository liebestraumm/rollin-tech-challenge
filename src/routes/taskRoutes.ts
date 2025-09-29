import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/taskController";

const taskRoutes = Router();

taskRoutes.get("/tasks", getAllTasks);
taskRoutes.get("/tasks/:id", getTaskById);
taskRoutes.post("/tasks", createTask);
taskRoutes.delete("/tasks/:id", deleteTask);
taskRoutes.patch("/tasks/:id", updateTask);

export default taskRoutes;
