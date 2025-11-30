// Test setup file
// Runs before each test suite

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '6001'; // Use different port for testing

// Increase timeout for async operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for debugging
  error: console.error,
};

// Global test utilities
global.testUtils = {
  // Helper to wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to generate mock service data
  mockService: (overrides = {}) => ({
    name: 'Test Service',
    url: 'https://test.example.com',
    repo: 'smartflow-systems/test-repo',
    description: 'Test service description',
    category: 'Testing',
    ...overrides
  })
};
