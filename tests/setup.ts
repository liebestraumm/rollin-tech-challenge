import dotenv from 'dotenv';

// Set timezone to UTC to prevent timezone-related test issues
process.env.TZ = 'UTC';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';

// Increase timeout for async operations
jest.setTimeout(10000);