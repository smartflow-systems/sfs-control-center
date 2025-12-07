/**
 * Jest Configuration Template for SFS Projects
 *
 * This template can be used across all SmartFlow Systems repositories
 * to maintain consistent testing standards.
 *
 * Usage:
 * 1. Copy this file to your project root as jest.config.js
 * 2. Adjust paths and patterns as needed for your project structure
 * 3. Update coverage thresholds based on project maturity
 */

module.exports = {
  // Test environment - use 'node' for backend, 'jsdom' for frontend
  testEnvironment: 'node',

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // Coverage thresholds - enforce minimum coverage standards
  coverageThresholds: {
    global: {
      branches: 70,    // Adjust based on project needs (70-80% recommended)
      functions: 70,   // Adjust based on project needs
      lines: 70,       // Adjust based on project needs
      statements: 70   // Adjust based on project needs
    }
  },

  // Files to collect coverage from
  collectCoverageFrom: [
    '**/*.js',
    '**/*.ts',
    '**/*.jsx',
    '**/*.tsx',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/*.config.js',
    '!**/*.config.ts'
  ],

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.js',
    '**/tests/**/*.spec.ts',
    '**/__tests__/**/*.js',
    '**/__tests__/**/*.ts'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Verbose output for better debugging
  verbose: true,

  // Test timeout (10 seconds)
  testTimeout: 10000,

  // Clear mocks between tests for isolation
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Module paths
  moduleDirectories: ['node_modules', 'src'],

  // Transform configuration (if using TypeScript)
  // Uncomment and install @swc/jest or ts-jest if needed
  // transform: {
  //   '^.+\\.(ts|tsx)$': '@swc/jest',
  // },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/'
  ],

  // Module name mapper (for handling static assets in frontend tests)
  // moduleNameMapper: {
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  //   '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/mocks/fileMock.js'
  // },

  // Watch plugins for better DX
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ].filter(Boolean),

  // Collect coverage from all files, even if not tested
  collectCoverageFrom: [
    'src/**/*.{js,ts,jsx,tsx}',
    'server.js',
    'app.js',
    '!src/**/*.d.ts',
    '!src/**/*.config.{js,ts}',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**'
  ],
};
