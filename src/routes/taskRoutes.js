import { getAllTasks, getTaskById, createTask, deleteTask, updateTask } from '../controllers/taskController.js';

const setupTaskRoutes = (server, router) => {
    server.get("/tasks", getAllTasks(router));
    server.get("/tasks/:id", getTaskById(router));
    server.post("/tasks", createTask(router));
    server.delete("/tasks/:id", deleteTask(router));
    server.patch("/tasks/:id", updateTask(router));
};

export default setupTaskRoutes;