import { catchAsync } from '../../src/utils/catchAsync';
import { createMockReqResNext } from '../helpers/mockHelpers';

describe('catchAsync', () => {
  it('should forward errors to next', async () => {
    const error = new Error('Something went wrong');
    const fn = jest.fn().mockRejectedValue(error);

    const { request, response, next } = createMockReqResNext();

    const handler = catchAsync(fn, 'testController');
    await handler(request, response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should attach controllerName to the request when provided', async () => {
    const error = new Error('DB error');
    const fn = jest.fn().mockRejectedValue(error);

    const { request, response, next } = createMockReqResNext();

    const handler = catchAsync(fn, 'deleteTask');
    await handler(request, response, next);

    expect((request as any).controllerName).toBe('deleteTask');
    expect(next).toHaveBeenCalledWith(error);
  });
});
