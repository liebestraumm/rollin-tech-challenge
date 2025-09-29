import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/HttpError';
import HttpCode from '../constants/httpCode';

// Middleware to handle 404 routes
export const notFound = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // Only clear deprecation headers for new API routes (not legacy routes)
  const isNewApiRoute = request.originalUrl.startsWith('/api/v1');

  if (isNewApiRoute) {
    // Clear any deprecation headers that might have been set for new API routes
    response.removeHeader('Warning');
    response.removeHeader('X-Deprecated');
    response.removeHeader('X-Sunset-Date');
    response.removeHeader('X-Alternative-Endpoint');
  }

  const error = new HttpError(
    `The API route ${request.originalUrl} does not exist`,
    HttpCode.NOT_FOUND,
  );
  next(error);
};
