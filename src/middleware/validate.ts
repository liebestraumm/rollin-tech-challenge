import { RequestHandler } from 'express';
import { z, ZodError } from 'zod';
import { HttpError } from '../lib/HttpError';
import HttpCode from '../constants/httpCode';

export const validate = (schema: z.ZodSchema): RequestHandler => {
  return (request, response, next) => {
    try {
      // Validate the request body using the provided schema
      const validatedData = schema.parse(request.body);

      // Replace the request body with the validated and transformed data
      request.body = validatedData;

      next();
    } catch (error: unknown) {
      // Check if it's a ZodError
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: z.ZodIssue) => ({
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

      // Handle other errors - check if error message is a JSON string
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid request data';

      // If the error message looks like a JSON array, try to parse it
      if (
        typeof errorMessage === 'string' &&
        errorMessage.startsWith('[') &&
        errorMessage.endsWith(']')
      ) {
        try {
          const parsedErrors: Array<{ message?: string }> =
            JSON.parse(errorMessage);
          if (Array.isArray(parsedErrors)) {
            const messages = parsedErrors
              .map((err) => err.message || 'Validation error')
              .join(', ');
            const formattedMessage = `Validation failed: ${messages}`;
            const parsedError = new HttpError(
              formattedMessage,
              HttpCode.UNPROCESSABLE_ENTITY,
            );
            return next(parsedError);
          }
        } catch (parseError) {
          console.log('Failed to parse error message:', parseError);
        }
      }

      // If the error is not a ZodError or a JSON array, return a fallback error
      const fallbackError = new HttpError(
        errorMessage,
        HttpCode.UNPROCESSABLE_ENTITY,
      );
      return next(fallbackError);
    }
  };
};
