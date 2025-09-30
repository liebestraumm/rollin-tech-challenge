import { z } from 'zod';
import { zodDateInput } from '../utils/zodDateInput';

export const createTaskSchema = z
  .object({
    title: z
      .string({ message: 'Title must be a string' })
      .min(1, 'Title is required')
      .max(100, 'Title must be less than 100 characters'),
    description: z
      .string({ message: 'Description must be a string' })
      .max(2000, 'Description must be less than 2000 characters')
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
