import { RequestHandler, Request } from 'express';

// Extend Express Request interface
interface RequestWithControllerName extends Request {
  controllerName?: string;
}

// Wrapper utility that is used to catch async errors and pass them to the error handler
export const catchAsync =
  (fn: RequestHandler, functionName?: string): RequestHandler =>
  (request, response, next) => {
    Promise.resolve(fn(request, response, next)).catch((error) => {
      // Attach function name to request for error logging
      if (functionName) {
        (request as RequestWithControllerName).controllerName = functionName;
      }
      next(error);
    });
  };
