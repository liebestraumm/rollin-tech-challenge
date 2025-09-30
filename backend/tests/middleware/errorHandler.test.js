"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../../src/middleware/errorHandler");
const HttpError_1 = require("../../src/lib/HttpError");
const httpCode_1 = __importDefault(require("../../src/constants/httpCode"));
const mockHelpers_1 = require("../helpers/mockHelpers");
describe('Error Handler Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('basic error handling', () => {
        it('should handle HttpError with correct status code and message', () => {
            const error = new HttpError_1.HttpError('Task not found', httpCode_1.default.NOT_FOUND);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/api/tasks' });
            (0, errorHandler_1.errorHandler)(error, request, response, next);
            expect(response.status).toHaveBeenCalledWith(httpCode_1.default.NOT_FOUND);
            expect(response.json).toHaveBeenCalledWith({ error: 'Task not found' });
            expect(next).not.toHaveBeenCalled();
        });
        it('should use default status code when error code is missing', () => {
            const error = new HttpError_1.HttpError('Unknown error', httpCode_1.default.INTERNAL_SERVER_ERROR);
            error.code = undefined;
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/api/tasks' });
            (0, errorHandler_1.errorHandler)(error, request, response, next);
            expect(response.status).toHaveBeenCalledWith(httpCode_1.default.INTERNAL_SERVER_ERROR);
        });
        it('should use default message when error message is missing', () => {
            const error = new HttpError_1.HttpError('', httpCode_1.default.BAD_REQUEST);
            error.message = '';
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/api/tasks' });
            (0, errorHandler_1.errorHandler)(error, request, response, next);
            expect(response.json).toHaveBeenCalledWith({ error: 'An unknown error occurred' });
        });
    });
    describe('headers sent handling', () => {
        it('should call next if headers are already sent', () => {
            const error = new HttpError_1.HttpError('Error', httpCode_1.default.BAD_REQUEST);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/api/tasks' });
            Object.defineProperty(response, 'headersSent', { value: true });
            (0, errorHandler_1.errorHandler)(error, request, response, next);
            expect(next).toHaveBeenCalledWith(error);
            expect(response.status).not.toHaveBeenCalled();
            expect(response.json).not.toHaveBeenCalled();
        });
    });
    describe('legacy vs new API format', () => {
        it('should return legacy format for non-v1 routes', () => {
            const error = new HttpError_1.HttpError('Validation error', httpCode_1.default.BAD_REQUEST);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/api/tasks' });
            (0, errorHandler_1.errorHandler)(error, request, response, next);
            expect(response.json).toHaveBeenCalledWith({ error: 'Validation error' });
        });
        it('should return new format for v1 API routes', () => {
            const error = new HttpError_1.HttpError('Validation error', httpCode_1.default.BAD_REQUEST);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/api/v1/tasks' });
            (0, errorHandler_1.errorHandler)(error, request, response, next);
            expect(response.json).toHaveBeenCalledWith({
                error: {
                    status: httpCode_1.default.BAD_REQUEST,
                    code: 'BAD_REQUEST',
                    message: 'Validation error',
                },
            });
        });
    });
    describe('console logging', () => {
        it('should log error with controller name when present', () => {
            const error = new HttpError_1.HttpError('Error', httpCode_1.default.INTERNAL_SERVER_ERROR);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({
                path: '/api/tasks',
                controllerName: 'TaskController'
            });
            (0, errorHandler_1.errorHandler)(error, request, response, next);
            expect(console.error).toHaveBeenCalledWith('Error in TaskController controller function: Error');
        });
        it('should log error without controller name when not present', () => {
            const error = new HttpError_1.HttpError('Error', httpCode_1.default.INTERNAL_SERVER_ERROR);
            const { request, response, next } = (0, mockHelpers_1.createMockReqResNext)({ path: '/api/tasks' });
            (0, errorHandler_1.errorHandler)(error, request, response, next);
            expect(console.error).toHaveBeenCalledWith('Error: Error');
        });
    });
});
