import { z } from 'zod';
import { zodDateInput } from '../utils';

export const createTaskSchema = z
  .object({
    title: z
      .string({ message: 'Title must be a string' })
      .min(1, 'Title is required'),
    description: z
      .string({ message: 'Description must be a string' })
      .optional(),
    complete: z
      .boolean({ message: 'Complete must be a boolean' })
      .optional()
      .default(false),
    due: zodDateInput('Due'),
  })
  .refine(
    (data) => {
      if (!data.due) return true;
      return data.due > new Date();
    },
    {
      message:
        'Due date cannot be before or at the same time as the created date',
      path: ['due'],
    },
  );

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
