"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deprecate_1 = require("../../src/middleware/deprecate");
const mockHelpers_1 = require("../helpers/mockHelpers");
describe('Deprecate Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('deprecation headers', () => {
        it('should set all deprecation headers with default message', () => {
            const middleware = (0, deprecate_1.deprecate)();
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/tasks' });
            middleware(request, response, next);
            expect(response.setHeader).toHaveBeenCalledWith('Warning', '299 - "This endpoint is deprecated. Please use /api/v1 instead."');
            expect(response.setHeader).toHaveBeenCalledWith('X-Deprecated', 'true');
            expect(response.setHeader).toHaveBeenCalledWith('X-Sunset-Date', '2025-10-31');
            expect(response.setHeader).toHaveBeenCalledWith('X-Alternative-Endpoint', '/api/v1/tasks');
            expect(next).toHaveBeenCalledTimes(1);
        });
        it('should set custom deprecation message', () => {
            const customMessage = 'Use new endpoint instead';
            const middleware = (0, deprecate_1.deprecate)(customMessage);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/tasks' });
            middleware(request, response, next);
            expect(response.setHeader).toHaveBeenCalledWith('Warning', `299 - "${customMessage}"`);
            expect(next).toHaveBeenCalledTimes(1);
        });
        it('should call next to continue middleware chain', () => {
            const middleware = (0, deprecate_1.deprecate)();
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/tasks' });
            middleware(request, response, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith();
        });
    });
});
