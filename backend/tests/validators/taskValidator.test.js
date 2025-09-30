"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskValidator_1 = require("../../src/validators/taskValidator");
const zod_1 = require("zod");
describe('Task Validator', () => {
    describe('createTaskSchema', () => {
        describe('title validation', () => {
            it('should validate a task with valid title', () => {
                const validData = {
                    title: 'Valid Task',
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.title).toBe('Valid Task');
                expect(result.complete).toBe(false);
            });
            it('should throw error when title is empty', () => {
                const invalidData = {
                    title: '',
                    due: new Date(Date.now() + 86400000),
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
                try {
                    taskValidator_1.createTaskSchema.parse(invalidData);
                }
                catch (error) {
                    expect(error).toBeInstanceOf(zod_1.ZodError);
                    if (error instanceof zod_1.ZodError) {
                        expect(error.issues[0].message).toBe('Title is required');
                    }
                }
            });
            it('should throw error when title is missing', () => {
                const invalidData = {
                    due: new Date(Date.now() + 86400000),
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
            });
            it('should throw error when title exceeds 100 characters', () => {
                const invalidData = {
                    title: 'a'.repeat(101),
                    due: new Date(Date.now() + 86400000),
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
                try {
                    taskValidator_1.createTaskSchema.parse(invalidData);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        expect(error.issues[0].message).toBe('Title must be less than 100 characters');
                    }
                }
            });
            it('should throw error when title is not a string', () => {
                const invalidData = {
                    title: 123,
                    due: new Date(Date.now() + 86400000),
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
            });
        });
        describe('description validation', () => {
            it('should validate a task with valid description', () => {
                const validData = {
                    title: 'Task',
                    description: 'This is a valid description',
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.description).toBe('This is a valid description');
            });
            it('should validate a task without description', () => {
                const validData = {
                    title: 'Task',
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.description).toBeUndefined();
            });
            it('should throw error when description exceeds 2000 characters', () => {
                const invalidData = {
                    title: 'Task',
                    description: 'a'.repeat(2001),
                    due: new Date(Date.now() + 86400000),
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
                try {
                    taskValidator_1.createTaskSchema.parse(invalidData);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        expect(error.issues[0].message).toBe('Description must be less than 2000 characters');
                    }
                }
            });
            it('should throw error when description is not a string', () => {
                const invalidData = {
                    title: 'Task',
                    description: 123,
                    due: new Date(Date.now() + 86400000),
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
            });
        });
        describe('complete validation', () => {
            it('should default complete to false when not provided', () => {
                const validData = {
                    title: 'Task',
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.complete).toBe(false);
            });
            it('should validate a task with complete set to true', () => {
                const validData = {
                    title: 'Task',
                    complete: true,
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.complete).toBe(true);
            });
            it('should validate a task with complete set to false', () => {
                const validData = {
                    title: 'Task',
                    complete: false,
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.complete).toBe(false);
            });
            it('should throw error when complete is not a boolean', () => {
                const invalidData = {
                    title: 'Task',
                    complete: 'not-a-boolean',
                    due: new Date(Date.now() + 86400000),
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
            });
        });
        describe('due date validation', () => {
            it('should validate a task with future due date', () => {
                const futureDate = new Date(Date.now() + 86400000);
                const validData = {
                    title: 'Task',
                    due: futureDate,
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.due).toBeInstanceOf(Date);
                expect(result.due?.getTime()).toBeGreaterThan(Date.now());
            });
            it('should validate a task with due date as ISO string', () => {
                const futureDate = new Date(Date.now() + 86400000);
                const validData = {
                    title: 'Task',
                    due: futureDate.toISOString(),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.due).toBeInstanceOf(Date);
            });
            it('should throw error when due date is in the past', () => {
                const pastDate = new Date(Date.now() - 86400000);
                const invalidData = {
                    title: 'Task',
                    due: pastDate,
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
                try {
                    taskValidator_1.createTaskSchema.parse(invalidData);
                }
                catch (error) {
                    if (error instanceof zod_1.ZodError) {
                        expect(error.issues[0].message).toBe('Due date cannot be before or at the same time as the created date');
                        expect(error.issues[0].path).toEqual(['due']);
                    }
                }
            });
            it('should throw error when due date is now', () => {
                const now = new Date();
                const invalidData = {
                    title: 'Task',
                    due: now,
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
            });
            it('should throw error when due date is invalid', () => {
                const invalidData = {
                    title: 'Task',
                    due: 'invalid-date',
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
            });
            it('should throw error when due date is missing', () => {
                const invalidData = {
                    title: 'Task',
                };
                expect(() => taskValidator_1.createTaskSchema.parse(invalidData)).toThrow(zod_1.ZodError);
            });
        });
        describe('complete task validation', () => {
            it('should validate a complete task with all fields', () => {
                const validData = {
                    title: 'Complete Task',
                    description: 'Full description',
                    complete: true,
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.title).toBe('Complete Task');
                expect(result.description).toBe('Full description');
                expect(result.complete).toBe(true);
                expect(result.due).toBeInstanceOf(Date);
            });
            it('should validate a minimal task with only required fields', () => {
                const validData = {
                    title: 'Minimal Task',
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(validData);
                expect(result.title).toBe('Minimal Task');
                expect(result.description).toBeUndefined();
                expect(result.complete).toBe(false);
                expect(result.due).toBeInstanceOf(Date);
            });
        });
        describe('type inference', () => {
            it('should correctly infer CreateTaskInput type', () => {
                const taskData = {
                    title: 'Type Test',
                    description: 'Testing type inference',
                    complete: false,
                    due: new Date(Date.now() + 86400000),
                };
                const result = taskValidator_1.createTaskSchema.parse(taskData);
                expect(result).toEqual(taskData);
            });
        });
    });
});
