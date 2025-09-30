"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../../src/database', () => ({
    sequelize: {
        authenticate: jest.fn().mockResolvedValue(undefined),
        sync: jest.fn().mockResolvedValue(undefined),
    },
}));
const mockTask = {
    id: 1,
    created: new Date('2024-01-01T00:00:00.000Z'),
    title: 'Test Task',
    description: 'Test Description',
    complete: false,
    due: new Date('2024-12-31T23:59:59.000Z'),
};
const mockTaskModel = {
    findAll: jest.fn(),
    findByPk: jest.fn().mockImplementation(async (id) => {
        return id === '1' ? mockTask : null;
    }),
    create: jest.fn(),
    update: jest.fn().mockImplementation(async (data, options) => {
        return options.where.id === '1' ? [1] : [0];
    }),
    destroy: jest.fn().mockImplementation(async (options) => {
        return options.where.id === '1' ? 1 : 0;
    }),
};
jest.mock('../../src/models/Task', () => mockTaskModel);
const taskController_1 = require("../../src/controllers/taskController");
const HttpError_1 = require("../../src/lib/HttpError");
const httpCode_1 = __importDefault(require("../../src/constants/httpCode"));
const mockHelpers_1 = require("../helpers/mockHelpers");
describe('Task Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllTasks', () => {
        it('should return all tasks successfully', async () => {
            mockTaskModel.findAll.mockResolvedValue([mockTask]);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)();
            await (0, taskController_1.getAllTasks)(request, response, next);
            expect(mockTaskModel.findAll).toHaveBeenCalledTimes(1);
            expect(response.status).toHaveBeenCalledWith(httpCode_1.default.OK);
            expect(response.json).toHaveBeenCalledWith([mockTask]);
        });
        it('should throw error when database fails', async () => {
            const error = new Error('DB fail');
            mockTaskModel.findAll.mockRejectedValue(error);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)();
            await expect((0, taskController_1.getAllTasks)(request, response, next)).rejects.toThrow('DB fail');
            expect(mockTaskModel.findAll).toHaveBeenCalledTimes(1);
            expect(response.status).not.toHaveBeenCalled();
            expect(response.json).not.toHaveBeenCalled();
        });
    });
    describe('getTaskById', () => {
        it('should return a task by ID', async () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                params: { id: '1' },
            });
            await (0, taskController_1.getTaskById)(request, response, next);
            expect(mockTaskModel.findByPk).toHaveBeenCalledWith('1');
            expect(response.status).toHaveBeenCalledWith(httpCode_1.default.OK);
            expect(response.json).toHaveBeenCalledWith(mockTask);
        });
        it('should throw HttpError if task not found', async () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                params: { id: '2' },
            });
            await expect((0, taskController_1.getTaskById)(request, response, next)).rejects.toThrow(HttpError_1.HttpError);
            expect(mockTaskModel.findByPk).toHaveBeenCalledWith('2');
            expect(response.status).not.toHaveBeenCalled();
            expect(response.json).not.toHaveBeenCalled();
        });
    });
    describe('createTask', () => {
        it('should create a task with valid data', async () => {
            const newTaskData = { title: 'New Task', complete: false };
            const createdTask = { ...mockTask, ...newTaskData };
            mockTaskModel.create.mockResolvedValue(createdTask);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                body: newTaskData,
            });
            await (0, taskController_1.createTask)(request, response, next);
            expect(mockTaskModel.create).toHaveBeenCalledWith(newTaskData);
            expect(response.status).toHaveBeenCalledWith(httpCode_1.default.CREATED);
            expect(response.json).toHaveBeenCalledWith(createdTask);
        });
        it('should throw HttpError when body is empty', async () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                body: {},
            });
            await expect((0, taskController_1.createTask)(request, response, next)).rejects.toThrow(HttpError_1.HttpError);
            expect(mockTaskModel.create).not.toHaveBeenCalled();
            expect(response.status).not.toHaveBeenCalled();
            expect(response.json).not.toHaveBeenCalled();
        });
    });
    describe('updateTask', () => {
        it('should update an existing task', async () => {
            const updateData = { title: 'Updated Task' };
            const updatedTask = { ...mockTask, ...updateData };
            mockTaskModel.findByPk.mockResolvedValue(updatedTask);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                params: { id: '1' },
                body: updateData,
            });
            await (0, taskController_1.updateTask)(request, response, next);
            expect(mockTaskModel.update).toHaveBeenCalledWith(updateData, {
                where: { id: '1' },
            });
            expect(response.status).toHaveBeenCalledWith(httpCode_1.default.OK);
            expect(response.json).toHaveBeenCalledWith(updatedTask);
        });
        it('should throw HttpError if task not found', async () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                params: { id: '99' },
                body: { title: 'X' },
            });
            await expect((0, taskController_1.updateTask)(request, response, next)).rejects.toThrow(HttpError_1.HttpError);
            expect(mockTaskModel.update).toHaveBeenCalledWith({ title: 'X' }, { where: { id: '99' } });
            expect(response.status).not.toHaveBeenCalled();
            expect(response.json).not.toHaveBeenCalled();
        });
    });
    describe('deleteTask', () => {
        it('should delete an existing task', async () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                params: { id: '1' },
            });
            await (0, taskController_1.deleteTask)(request, response, next);
            expect(mockTaskModel.destroy).toHaveBeenCalledWith({
                where: { id: '1' },
            });
            expect(response.status).toHaveBeenCalledWith(httpCode_1.default.OK);
            expect(response.json).toHaveBeenCalledWith({
                message: 'Task has been deleted.',
            });
        });
        it('should throw HttpError if task does not exist', async () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                params: { id: '99' },
            });
            await expect((0, taskController_1.deleteTask)(request, response, next)).rejects.toThrow(HttpError_1.HttpError);
            expect(mockTaskModel.destroy).toHaveBeenCalledWith({
                where: { id: '99' },
            });
            expect(response.status).not.toHaveBeenCalled();
            expect(response.json).not.toHaveBeenCalled();
        });
    });
});
