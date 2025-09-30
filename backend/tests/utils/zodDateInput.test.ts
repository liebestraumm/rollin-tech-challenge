import { zodDateInput } from '../../src/utils/zodDateInput';
import { z, ZodError } from 'zod';

describe('zodDateInput Utility', () => {
  const schema = z.object({
    testDate: zodDateInput('Test Date'),
  });

  describe('valid date handling', () => {
    it('should accept Date objects', () => {
      const date = new Date('2024-12-31');
      const result = schema.parse({ testDate: date });

      expect(result.testDate).toBeInstanceOf(Date);
      expect(result.testDate).toEqual(date);
    });

    it('should parse ISO date strings', () => {
      const result = schema.parse({ testDate: '2024-12-31T23:59:59.000Z' });
      expect(result.testDate.toISOString()).toBe('2024-12-31T23:59:59.000Z');
    });

    it('should parse DD/MM/YYYY format', () => {
      const result = schema.parse({ testDate: '31/12/2024' });

      expect(result.testDate).toBeInstanceOf(Date);
      expect(result.testDate.getDate()).toBe(31);
      expect(result.testDate.getMonth()).toBe(11);
      expect(result.testDate.getFullYear()).toBe(2024);
    });

    it('should parse DD-MM-YYYY format', () => {
      const result = schema.parse({ testDate: '31-12-2024' });

      expect(result.testDate).toBeInstanceOf(Date);
      expect(result.testDate.getDate()).toBe(31);
      expect(result.testDate.getMonth()).toBe(11);
      expect(result.testDate.getFullYear()).toBe(2024);
    });
  });

  describe('invalid date handling', () => {
    it('should throw error for invalid date string', () => {
      expect(() => schema.parse({ testDate: 'invalid-date' })).toThrow(
        ZodError,
      );

      try {
        schema.parse({ testDate: 'invalid-date' });
      } catch (error) {
        if (error instanceof ZodError) {
          expect(error.issues[0].message).toBe(
            'Test Date must be a valid date',
          );
        }
      }
    });

    it('should throw error for a date that does not exist', () => {
      expect(() => schema.parse({ testDate: '2024/12/32' })).toThrow(ZodError);
    });

    it('should throw error for non-date values', () => {
      expect(() => schema.parse({ testDate: 12345 })).toThrow(ZodError);
    });
  });
});
