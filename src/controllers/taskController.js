import Task from '../models/Task.js';

export const getAllTasks = (router) => async (req, res) => {
    const tasks = await router.db.get("tasks").value();
    res.status(200).json(tasks);
};

export const getTaskById = (router) => async (req, res) => {
    const task = await router.db.get("tasks").find({ id: req.params.id }).value();
    if (task) {
        res.status(200).json(task);
    } else {
        res.sendStatus(404);
    }
};

export const createTask = (router) => async (req, res) => {
    const db = router.db;
    const newTask = req.body;
    if (!newTask || Object.keys(newTask).length === 0) {
        return res.status(400).json({ error: "task need to be required." });
    }
    const tasks = db.get("tasks");
    const id = Date.now().toString();
    const taskWithId = { id, ...newTask };
    await tasks.push(taskWithId).write();
    res.status(201).json(taskWithId);
};

export const deleteTask = (router) => async (req, res) => {
    const db = router.db;
    const { id } = req.params;
    const task = await db.get("tasks").find({ id }).value();

    if (task) {
        await db.get("tasks").remove({ id }).write();
        res.status(200).json({ message: "Task has been deleted." });
    } else {
        res.sendStatus(404);
    }
};

export const updateTask = (router) => async (req, res) => {
    const db = router.db;
    const { id } = req.params;
    const task = await db.get("tasks").find({ id }).value();

    if (task) {
        const updated = { ...task, ...req.body };
        await db.get("tasks").find({ id }).assign(updated).write();
        res.status(200).json(updated);
    } else {
        res.sendStatus(404);
    }
};