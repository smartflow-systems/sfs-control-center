# SFS Testing Templates

This directory contains reusable testing templates for all SmartFlow Systems repositories. These templates help maintain consistent testing standards across the entire SFS ecosystem.

## Templates Included

### 1. Jest Configuration (`jest.config.template.js`)

A comprehensive Jest configuration that includes:
- Code coverage reporting with HTML, LCOV, and JSON formats
- Coverage thresholds (70% by default)
- Test environment setup
- Module resolution
- Transform configuration for TypeScript

**Usage:**
```bash
cp .testing-templates/jest.config.template.js jest.config.js
```

Then customize the configuration for your project's specific needs.

### 2. Test Setup (`setup.template.js`)

Global test setup file that configures:
- Environment variables for testing
- Console mocking to reduce noise
- Global test utilities
- Cleanup hooks

**Usage:**
```bash
mkdir -p tests
cp .testing-templates/setup.template.js tests/setup.js
```

### 3. GitHub Actions Workflow (`github-workflow.template.yml`)

Complete CI/CD pipeline for testing that includes:
- Unit tests across multiple Node.js versions
- Integration tests
- E2E tests with Playwright
- Code coverage reporting
- Automated test summaries

**Usage:**
```bash
mkdir -p .github/workflows
cp .testing-templates/github-workflow.template.yml .github/workflows/test.yml
```

### 4. Package.json Scripts (`package.json.template`)

Standard test scripts for SFS projects:
- `test`: Run all Jest tests
- `test:unit`: Run only unit tests
- `test:integration`: Run only integration tests
- `test:e2e`: Run E2E tests with Playwright
- `test:coverage`: Generate coverage report
- `test:watch`: Watch mode for development
- `test:debug`: Debug mode with Node inspector

**Usage:**
Copy the scripts section into your project's package.json.

## Quick Start Guide

### For New Projects

1. **Install dependencies:**
   ```bash
   npm install --save-dev jest supertest @types/jest @types/supertest \
     jest-environment-node @playwright/test playwright
   ```

2. **Copy templates:**
   ```bash
   cp .testing-templates/jest.config.template.js jest.config.js
   mkdir -p tests
   cp .testing-templates/setup.template.js tests/setup.js
   mkdir -p .github/workflows
   cp .testing-templates/github-workflow.template.yml .github/workflows/test.yml
   ```

3. **Add test scripts to package.json:**
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:unit": "jest tests/unit",
       "test:integration": "jest tests/integration",
       "test:e2e": "playwright test",
       "test:coverage": "jest --coverage"
     }
   }
   ```

4. **Create test directory structure:**
   ```bash
   mkdir -p tests/{unit,integration,e2e,fixtures,mocks}
   ```

5. **Write your first test:**
   ```javascript
   // tests/unit/example.test.js
   describe('Example Test', () => {
     it('should pass', () => {
       expect(true).toBe(true);
     });
   });
   ```

6. **Run tests:**
   ```bash
   npm test
   ```

### For Existing Projects

1. **Install testing dependencies** (if not already installed)

2. **Copy templates** and merge with existing configuration

3. **Update package.json** scripts

4. **Gradually add tests** for existing code

## Testing Standards for SFS Projects

### Coverage Requirements

All SFS projects should maintain:
- **Lines:** 70% minimum
- **Statements:** 70% minimum
- **Functions:** 70% minimum
- **Branches:** 70% minimum

Mature projects should aim for 80%+ coverage.

### Test Organization

```
tests/
├── unit/           # Fast, isolated tests for individual functions
├── integration/    # Tests for component interactions
├── e2e/           # End-to-end user journey tests
├── fixtures/      # Test data and mock objects
├── mocks/         # Mock implementations
└── setup.js       # Global test configuration
```

### Naming Conventions

- Test files: `*.test.js` or `*.spec.js`
- Unit tests: `tests/unit/[module-name].test.js`
- Integration tests: `tests/integration/[feature].test.js`
- E2E tests: `tests/e2e/[user-journey].spec.js`

### Test Structure (AAA Pattern)

```javascript
describe('Feature Name', () => {
  it('should do something specific', async () => {
    // Arrange - Set up test data and conditions
    const testData = { name: 'test' };

    // Act - Execute the code under test
    const result = await functionUnderTest(testData);

    // Assert - Verify the outcome
    expect(result).toEqual(expectedValue);
  });
});
```

### Best Practices

1. **Write descriptive test names** that explain what is being tested
2. **Test behavior, not implementation** details
3. **Keep tests independent** - no shared state between tests
4. **Use meaningful variable names** in tests
5. **Mock external dependencies** to ensure test isolation
6. **Test edge cases** and error conditions
7. **Keep tests fast** - unit tests should run in milliseconds
8. **Use fixtures** for complex test data
9. **Clean up after tests** to prevent state leakage
10. **Run tests in CI/CD** to catch issues early

## Project-Specific Customization

### For Backend Projects (Node.js, Express)

- Use `testEnvironment: 'node'` in Jest config
- Use `supertest` for API endpoint testing
- Mock database connections and external services

### For Frontend Projects (React, TypeScript)

- Use `testEnvironment: 'jsdom'` in Jest config
- Add React Testing Library: `@testing-library/react`
- Add TypeScript support: `ts-jest` or `@swc/jest`
- Mock CSS imports with `identity-obj-proxy`

### For Full-Stack Projects

- Separate backend and frontend test configurations
- Use monorepo structure with separate test scripts
- Share common test utilities across packages

## Common Testing Patterns

### API Endpoint Testing

```javascript
const request = require('supertest');
const app = require('../app');

describe('GET /api/resource', () => {
  it('should return 200 and resource data', async () => {
    const response = await request(app).get('/api/resource');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
```

### Async Function Testing

```javascript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Error Handling Testing

```javascript
it('should throw error for invalid input', async () => {
  await expect(functionThatThrows()).rejects.toThrow('Expected error message');
});
```

### Mocking External Services

```javascript
jest.mock('node-fetch');
const fetch = require('node-fetch');

it('should handle external API calls', async () => {
  fetch.mockResolvedValue({
    json: async () => ({ data: 'mocked' })
  });

  const result = await fetchData();
  expect(result.data).toBe('mocked');
});
```

## Troubleshooting

### Tests Timing Out

- Increase timeout: `jest.setTimeout(15000)`
- Check for unresolved promises
- Ensure async operations complete

### Coverage Not Generated

- Verify `collectCoverage: true` in jest.config.js
- Check `collectCoverageFrom` patterns
- Ensure source files are being tested

### Playwright Tests Failing

- Install browsers: `npx playwright install`
- Check baseURL in playwright.config.js
- Verify server is running during tests

## Contributing

When creating new testing utilities or patterns:

1. Update templates in this directory
2. Document the new pattern in this README
3. Share with the SFS team
4. Apply to existing projects gradually

## Support

For questions or issues with testing:
- Check the SFS knowledge base
- Review example tests in sfs-control-center
- Ask in the SFS developer channel

---

**Last Updated:** 2025-11-30
**Maintained By:** SmartFlow Systems Testing Team
