"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockReqResNext = void 0;
const createMockReqResNext = (reqData = {}) => {
    const request = { ...reqData };
    const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
        removeHeader: jest.fn(),
        headersSent: false,
    };
    const next = jest.fn();
    return { request, response, next };
};
exports.createMockReqResNext = createMockReqResNext;
