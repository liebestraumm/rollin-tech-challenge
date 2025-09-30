import { RequestHandler } from 'express';
import { z, ZodError } from 'zod';
import { HttpError } from '../lib/HttpError';
import HttpCode from '../constants/httpCode';

export const validate = (schema: z.ZodSchema): RequestHandler => {
  return (request, _, next) => {
    try {
      // Validate the request body using the provided schema
      const validatedData = schema.parse(request.body);

      // Replace the request body with the validated and transformed data
      request.body = validatedData;

      next();
    } catch (error: unknown) {
      // Check if it's a ZodError
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: z.core.$ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const zodErrorMessages = errorMessages
          .map((e: { message: string }) => e.message)
          .join(', ');

        const zodError = new HttpError(
          `Validation failed: ${zodErrorMessages}`,
          HttpCode.UNPROCESSABLE_ENTITY,
        );
        return next(zodError);
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Invalid request data';
      const fallbackError = new HttpError(
        errorMessage,
        HttpCode.UNPROCESSABLE_ENTITY,
      );
      return next(fallbackError);
    }
  };
};
