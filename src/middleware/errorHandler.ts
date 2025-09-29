import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/HttpError';
import HttpCode, { getErrorCode } from '../constants/httpCode';

// Extend Express Request interface
interface RequestWithControllerName extends Request {
  controllerName?: string;
}

// Middleware that is triggered when a HttpError object is thrown
export const errorHandler = (
  error: HttpError,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const statusCode = error.code || HttpCode.INTERNAL_SERVER_ERROR;
  const errorMessage = error.message || 'An unknown error occurred';

  // Get the controller name from the request
  const controllerName = (request as RequestWithControllerName).controllerName;
  // Log the error that comes from either the controller function or the route itself
  if (controllerName) {
    console.error(
      `Error in ${controllerName} controller function: ${errorMessage}`,
    );
  } else {
    console.error(`Error: ${errorMessage}`);
  }

  // Prevents errors when trying to send a response after headers have already been sent to the client.
  if (response.headersSent) {
    return next(error);
  }
  response.status(statusCode);

  // Check if this is a legacy route
  const isLegacyRoute = !request.path.startsWith('/api/v1');

  if (isLegacyRoute) {
    // Legacy format: { error: "message" }
    response.json({ error: errorMessage });
  } else {
    // New format: { error: { status, code, message } }
    response.json({
      error: {
        status: statusCode,
        code: getErrorCode(statusCode),
        message: errorMessage,
      },
    });
  }
};
