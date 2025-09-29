import { Request, Response, NextFunction, RequestHandler } from 'express';

export const deprecate = (
  message: string = "This endpoint is deprecated. Please use /api/v1 instead."
): RequestHandler => {
  return (request: Request, response: Response, next: NextFunction) => {
    response.setHeader("Warning", `299 - "${message}"`);
    response.setHeader("X-Deprecated", "true");
    response.setHeader("X-Sunset-Date", "2025-10-31");
    response.setHeader("X-Alternative-Endpoint", "/api/v1" + request.path);
    
    next();
  };
};