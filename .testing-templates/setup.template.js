/**
 * Test Setup Template for SFS Projects
 *
 * This file runs before each test suite and configures the test environment.
 *
 * Usage:
 * 1. Copy this file to tests/setup.js in your project
 * 2. Customize environment variables for your project
 * 3. Add project-specific setup logic as needed
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Configure test-specific environment variables
// Adjust these based on your project's needs
process.env.PORT = process.env.TEST_PORT || '6001';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'sqlite::memory:';
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests

// Increase timeout for async operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in test output
// Keep error and warn for debugging purposes
global.console = {
  ...console,
  log: jest.fn(),      // Mock log
  debug: jest.fn(),    // Mock debug
  info: jest.fn(),     // Mock info
  // Keep these for debugging
  warn: console.warn,
  error: console.error,
};

// Global test utilities
global.testUtils = {
  /**
   * Helper to wait for async operations
   * @param {number} ms - Milliseconds to wait
   */
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Helper to create a mock timestamp
   * @param {number} offsetMs - Offset from current time in milliseconds
   */
  mockTimestamp: (offsetMs = 0) => {
    const date = new Date(Date.now() + offsetMs);
    return date.toISOString();
  },

  /**
   * Helper to generate random test data
   */
  randomString: (length = 10) => {
    return Math.random().toString(36).substring(2, length + 2);
  },

  /**
   * Helper to generate random number in range
   */
  randomInt: (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Helper to create mock service data (customize for your domain)
   */
  mockService: (overrides = {}) => ({
    name: 'Test Service',
    url: 'https://test.example.com',
    description: 'Test service description',
    status: 'online',
    healthy: true,
    ...overrides
  }),

  /**
   * Helper to create mock user data (customize for your domain)
   */
  mockUser: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    role: 'user',
    ...overrides
  }),
};

// Clean up after each test
afterEach(() => {
  // Clear all timers
  jest.clearAllTimers();

  // Clear all mocks
  jest.clearAllMocks();
});

// Global teardown
afterAll(() => {
  // Add any cleanup logic here
  // e.g., close database connections, cleanup temp files
});
