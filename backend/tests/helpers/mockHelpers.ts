import { Request, Response, NextFunction } from 'express';

export const createMockReqResNext = (reqData: Partial<Request> = {}) => {
  const request = { ...reqData } as Request;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    setHeader: jest.fn(),
    removeHeader: jest.fn(),
    headersSent: false,
  } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { request, response, next };
};