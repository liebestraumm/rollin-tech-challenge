import { z } from 'zod';

export const zodDateInput = (field: string) =>
  z.preprocess(
    (value) => {
      if (value instanceof Date) return value;

      if (typeof value === 'string') {
        // ISO date
        if (!isNaN(Date.parse(value))) {
          return new Date(value);
        }

        // Regex to accept dates in the format DD/MM/YYYY or DD-MM-YYYY as included in legacy data
        const match = value.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
        if (match) {
          const [, day, month, year] = match;
          const parsed = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
          );
          return isNaN(parsed.getTime()) ? undefined : parsed;
        }
      }

      return value;
    },
    z.date({ message: `${field} must be a valid date` }),
  );
