"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = require("../../src/middleware/notFound");
const HttpError_1 = require("../../src/lib/HttpError");
const httpCode_1 = __importDefault(require("../../src/constants/httpCode"));
const mockHelpers_1 = require("../helpers/mockHelpers");
describe('Not Found Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('404 error handling', () => {
        it('should create HttpError with NOT_FOUND status and correct message', () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ originalUrl: '/api/unknown' });
            (0, notFound_1.notFound)(request, response, next);
            expect(next).toHaveBeenCalledTimes(1);
            const mockNext = next;
            const error = mockNext.mock.calls[0][0];
            expect(error).toBeInstanceOf(HttpError_1.HttpError);
            expect(error.message).toBe('The API route /api/unknown does not exist');
            expect(error.code).toBe(httpCode_1.default.NOT_FOUND);
        });
    });
    describe('deprecation headers handling', () => {
        it('should remove deprecation headers for new API routes', () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ originalUrl: '/api/v1/tasks' });
            (0, notFound_1.notFound)(request, response, next);
            expect(response.removeHeader).toHaveBeenCalledWith('Warning');
            expect(response.removeHeader).toHaveBeenCalledWith('X-Deprecated');
            expect(response.removeHeader).toHaveBeenCalledWith('X-Sunset-Date');
            expect(response.removeHeader).toHaveBeenCalledWith('X-Alternative-Endpoint');
        });
        it('should not remove headers for legacy routes', () => {
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ originalUrl: '/api/tasks' });
            (0, notFound_1.notFound)(request, response, next);
            expect(response.removeHeader).not.toHaveBeenCalled();
        });
    });
});
