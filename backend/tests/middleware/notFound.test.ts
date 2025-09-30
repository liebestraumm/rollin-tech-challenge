import { notFound } from '../../src/middleware/notFound';
import { HttpError } from '../../src/lib/HttpError';
import HttpCode from '../../src/constants/httpCode';
import { createMockReqResNext } from '../helpers/mockHelpers';

describe('Not Found Middleware', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('404 error handling', () => {
    it('should create HttpError with NOT_FOUND status and correct message', () => {
      const { request, response, next } = createMockReqResNext({ originalUrl: '/api/unknown' });

      notFound(request, response, next);

      expect(next).toHaveBeenCalledTimes(1);
      const mockNext = next as jest.Mock;
      const error = mockNext.mock.calls[0][0];
      expect(error).toBeInstanceOf(HttpError);
      expect(error.message).toBe('The API route /api/unknown does not exist');
      expect(error.code).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe('deprecation headers handling', () => {
    it('should remove deprecation headers for new API routes', () => {
      const { request, response, next } = createMockReqResNext({ originalUrl: '/api/v1/tasks' });

      notFound(request, response, next);

      expect(response.removeHeader).toHaveBeenCalledWith('Warning');
      expect(response.removeHeader).toHaveBeenCalledWith('X-Deprecated');
      expect(response.removeHeader).toHaveBeenCalledWith('X-Sunset-Date');
      expect(response.removeHeader).toHaveBeenCalledWith('X-Alternative-Endpoint');
    });

    it('should not remove headers for legacy routes', () => {
      const { request, response, next } = createMockReqResNext({ originalUrl: '/api/tasks' });

      notFound(request, response, next);

      expect(response.removeHeader).not.toHaveBeenCalled();
    });
  });
});
