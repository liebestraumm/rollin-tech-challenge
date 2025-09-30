import { errorHandler } from '../../src/middleware/errorHandler';
import { HttpError } from '../../src/lib/HttpError';
import HttpCode from '../../src/constants/httpCode';
import { createMockReqResNext } from '../helpers/mockHelpers';

describe('Error Handler Middleware', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('basic error handling', () => {
    it('should handle HttpError with correct status code and message', () => {
      const error = new HttpError('Task not found', HttpCode.NOT_FOUND);
      const { request, response, next } = createMockReqResNext({ path: '/api/tasks' });

      errorHandler(error, request, response, next);

      expect(response.status).toHaveBeenCalledWith(HttpCode.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith({ error: 'Task not found' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should use default status code when error code is missing', () => {
      const error = new HttpError('Unknown error', HttpCode.INTERNAL_SERVER_ERROR);
      error.code = undefined as unknown as number;
      const { request, response, next } = createMockReqResNext({ path: '/api/tasks' });

      errorHandler(error, request, response, next);

      expect(response.status).toHaveBeenCalledWith(HttpCode.INTERNAL_SERVER_ERROR);
    });

    it('should use default message when error message is missing', () => {
      const error = new HttpError('', HttpCode.BAD_REQUEST);
      error.message = '';
      const { request, response, next } = createMockReqResNext({ path: '/api/tasks' });

      errorHandler(error, request, response, next);

      expect(response.json).toHaveBeenCalledWith({ error: 'An unknown error occurred' });
    });
  });

  describe('headers sent handling', () => {
    it('should call next if headers are already sent', () => {
      const error = new HttpError('Error', HttpCode.BAD_REQUEST);
      const { request, response, next } = createMockReqResNext({ path: '/api/tasks' });
      Object.defineProperty(response, 'headersSent', { value: true });

      errorHandler(error, request, response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
    });
  });

  describe('legacy vs new API format', () => {
    it('should return legacy format for non-v1 routes', () => {
      const error = new HttpError('Validation error', HttpCode.BAD_REQUEST);
      const { request, response, next } = createMockReqResNext({ path: '/api/tasks' });

      errorHandler(error, request, response, next);

      expect(response.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });

    it('should return new format for v1 API routes', () => {
      const error = new HttpError('Validation error', HttpCode.BAD_REQUEST);
      const { request, response, next } = createMockReqResNext({ path: '/api/v1/tasks' });

      errorHandler(error, request, response, next);

      expect(response.json).toHaveBeenCalledWith({
        error: {
          status: HttpCode.BAD_REQUEST,
          code: 'BAD_REQUEST',
          message: 'Validation error',
        },
      });
    });
  });

  describe('console logging', () => {
    it('should log error with controller name when present', () => {
      const error = new HttpError('Error', HttpCode.INTERNAL_SERVER_ERROR);
      const { request, response, next } = createMockReqResNext({ 
        path: '/api/tasks',
        controllerName: 'TaskController'
      } as any);

      errorHandler(error, request, response, next);

      expect(console.error).toHaveBeenCalledWith(
        'Error in TaskController controller function: Error'
      );
    });

    it('should log error without controller name when not present', () => {
      const error = new HttpError('Error', HttpCode.INTERNAL_SERVER_ERROR);
      const { request, response, next } = createMockReqResNext({ path: '/api/tasks' });

      errorHandler(error, request, response, next);

      expect(console.error).toHaveBeenCalledWith('Error: Error');
    });
  });
});
