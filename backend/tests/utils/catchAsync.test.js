"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = require("../../src/utils/catchAsync");
const mockHelpers_1 = require("../helpers/mockHelpers");
describe('catchAsync', () => {
    it('should forward errors to next', async () => {
        const error = new Error('Something went wrong');
        const fn = jest.fn().mockRejectedValue(error);
        const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)();
        const handler = (0, catchAsync_1.catchAsync)(fn, 'testController');
        await handler(request, response, next);
        expect(next).toHaveBeenCalledWith(error);
    });
    it('should attach controllerName to the request when provided', async () => {
        const error = new Error('DB error');
        const fn = jest.fn().mockRejectedValue(error);
        const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)();
        const handler = (0, catchAsync_1.catchAsync)(fn, 'deleteTask');
        await handler(request, response, next);
        expect(request.controllerName).toBe('deleteTask');
        expect(next).toHaveBeenCalledWith(error);
    });
});
