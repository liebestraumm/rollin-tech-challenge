// Mock the database connection
jest.mock('../../src/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock Task model
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
    // only return mockTask if id matches
    return id === '1' ? mockTask : null;
  }),
  create: jest.fn(),
  update: jest.fn().mockImplementation(async (data, options) => {
    // pretend update only works if id === '1'
    return options.where.id === '1' ? [1] : [0];
  }),
  destroy: jest.fn().mockImplementation(async (options) => {
    // pretend delete only works if id === '1'
    return options.where.id === '1' ? 1 : 0;
  }),
};

jest.mock('../../src/models/Task', () => mockTaskModel);

// Import the controller after mocking
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../../src/controllers/taskController';
import { HttpError } from '../../src/lib/HttpError';
import HttpCode from '../../src/constants/httpCode';

describe('Task Controller', () => {
  const createMockReqResNext = (reqData: any = {}) => {
    const req = { ...reqData } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    const next = jest.fn();
    return { req, res, next };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks successfully', async () => {
      mockTaskModel.findAll.mockResolvedValue([mockTask]);
      const { req, res, next } = createMockReqResNext();

      await getAllTasks(req, res, next);

      expect(mockTaskModel.findAll).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HttpCode.OK);
      expect(res.json).toHaveBeenCalledWith([mockTask]);
    });

    it('should throw error when database fails', async () => {
      const error = new Error('DB fail');
      mockTaskModel.findAll.mockRejectedValue(error);
      const { req, res, next } = createMockReqResNext();

      await expect(getAllTasks(req, res, next)).rejects.toThrow('DB fail');
      expect(mockTaskModel.findAll).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const { req, res, next } = createMockReqResNext({ params: { id: '1' } });

      await getTaskById(req, res, next);

      expect(mockTaskModel.findByPk).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpCode.OK);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should throw HttpError if task not found', async () => {
      const { req, res, next } = createMockReqResNext({ params: { id: '2' } });

      await expect(getTaskById(req, res, next)).rejects.toThrow(HttpError);
      expect(mockTaskModel.findByPk).toHaveBeenCalledWith('2');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      const newTaskData = { title: 'New Task', complete: false };
      const createdTask = { ...mockTask, ...newTaskData };
      mockTaskModel.create.mockResolvedValue(createdTask);

      const { req, res, next } = createMockReqResNext({ body: newTaskData });

      await createTask(req, res, next);

      expect(mockTaskModel.create).toHaveBeenCalledWith(newTaskData);
      expect(res.status).toHaveBeenCalledWith(HttpCode.CREATED);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });

    it('should throw HttpError when body is empty', async () => {
      const { req, res, next } = createMockReqResNext({ body: {} });

      await expect(createTask(req, res, next)).rejects.toThrow(HttpError);
      expect(mockTaskModel.create).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updateData = { title: 'Updated Task' };
      const updatedTask = { ...mockTask, ...updateData };
      mockTaskModel.findByPk.mockResolvedValue(updatedTask);

      const { req, res, next } = createMockReqResNext({
        params: { id: '1' },
        body: updateData,
      });

      await updateTask(req, res, next);

      expect(mockTaskModel.update).toHaveBeenCalledWith(updateData, {
        where: { id: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(HttpCode.OK);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it('should throw HttpError if task not found', async () => {
      const { req, res, next } = createMockReqResNext({
        params: { id: '99' },
        body: { title: 'X' },
      });

      await expect(updateTask(req, res, next)).rejects.toThrow(HttpError);
      expect(mockTaskModel.update).toHaveBeenCalledWith(
        { title: 'X' },
        { where: { id: '99' } },
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      const { req, res, next } = createMockReqResNext({ params: { id: '1' } });

      await deleteTask(req, res, next);

      expect(mockTaskModel.destroy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(HttpCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task has been deleted.',
      });
    });

    it('should throw HttpError if task does not exist', async () => {
      const { req, res, next } = createMockReqResNext({ params: { id: '99' } });

      await expect(deleteTask(req, res, next)).rejects.toThrow(HttpError);
      expect(mockTaskModel.destroy).toHaveBeenCalledWith({
        where: { id: '99' },
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
