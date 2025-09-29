import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/HttpError';
import HttpCode from '../constants/httpCode';

// Middleware to handle 404 routes
export const routeMiddleware = (
  request: Request,
  _: Response,
  next: NextFunction,
) => {
  const error = new HttpError(
    `The API route ${request.originalUrl} does not exist`,
    HttpCode.NOT_FOUND,
  );
  next(error);
};
