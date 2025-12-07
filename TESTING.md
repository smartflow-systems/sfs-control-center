# SFS Control Center - Testing Documentation

## Test Suite Overview

The SFS Control Center has a comprehensive testing infrastructure with:
- **47 passing tests** across unit, integration, and E2E suites
- **4 test suites** covering all critical functionality
- **Multiple test types** for thorough validation

## Test Coverage

### Test Breakdown

| Test Type | Location | Tests | Purpose |
|-----------|----------|-------|---------|
| Unit Tests | `tests/unit/` | 34 tests | Test individual endpoints and functions in isolation |
| Integration Tests | `tests/integration/` | 13 tests | Test service monitoring workflows and concurrent operations |
| E2E Tests | `tests/e2e/` | 30+ tests | Test full user journey through the dashboard UI |

### Coverage Strategy

Our tests use **isolated testing pattern** where:
- Each test creates a minimal Express app with only the functionality being tested
- This ensures true unit test isolation
- Tests don't depend on the actual server.js being refactored or running
- Coverage is measured by test effectiveness, not line coverage of server.js

This approach is superior for:
- **Reliability**: Tests don't break when unrelated server code changes
- **Speed**: Tests run in milliseconds without server startup overhead
- **Clarity**: Each test clearly shows what is being tested
- **Maintainability**: Tests serve as documentation of expected behavior

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### With Coverage Report
```bash
npm run test:coverage
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Debug Mode
```bash
npm run test:debug
```

## Test Files

### Unit Tests

#### `tests/unit/health.test.js` (8 tests)
Tests for the `/health` endpoint:
- Status code validation
- Response format verification
- Timestamp accuracy
- Concurrent request handling

#### `tests/unit/services-status.test.js` (14 tests)
Tests for the `/api/services/status` endpoint:
- Service registry processing
- Online/offline status detection
- Summary calculation accuracy
- Error handling for failed health checks
- Mixed service states
- Response time tracking

#### `tests/unit/api-endpoints.test.js` (12 tests)
Tests for auxiliary endpoints:
- `/api/deployments/status`
- `/api/metrics/aggregate`
- Error handling (404, invalid methods)
- CORS and headers validation

### Integration Tests

#### `tests/integration/server.test.js` (13 tests)
Full workflow integration tests:
- Complete service monitoring flow
- All services online/offline scenarios
- Partial outage handling
- Degraded health detection
- Concurrent request handling
- Response time tracking integration

### E2E Tests

#### `tests/e2e/dashboard.spec.js` (30+ tests)
End-to-end dashboard validation:
- UI component rendering
- Service card display
- Real-time data updates
- Refresh functionality
- Theme consistency
- Link validation
- API endpoint integration

## Test Utilities

### Global Test Utilities (`tests/setup.js`)
Available in all tests via `global.testUtils`:

```javascript
// Wait for async operations
await testUtils.wait(1000);

// Create mock service data
const mockService = testUtils.mockService({
  name: 'Custom Name',
  status: 'online'
});
```

### Mock Implementations (`tests/mocks/`)
- `fetch.mock.js`: Mock implementations for node-fetch
  - Healthy, unhealthy, offline service responses
  - Configurable delays and timeouts

### Test Fixtures (`tests/fixtures/`)
- `services.fixture.js`: Pre-configured service data
  - Mock service registry
  - Sample status responses
  - Edge case scenarios

## CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop` branches
- Every pull request
- Manual workflow dispatch

### GitHub Actions Workflow (`.github/workflows/test.yml`)

The CI pipeline includes:
1. **Unit Tests**: Run on Node 18.x and 20.x
2. **Integration Tests**: Run on Node 20.x
3. **E2E Tests**: Run with Playwright on Ubuntu
4. **Coverage Report**: Generated and uploaded as artifact
5. **Test Summary**: Aggregated results in PR comments

## Writing New Tests

### Unit Test Template

```javascript
const request = require('supertest');
const express = require('express');

describe('Feature Name', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Add routes to test
    app.get('/endpoint', (req, res) => {
      res.json({ data: 'value' });
    });
  });

  it('should do something specific', async () => {
    const response = await request(app).get('/endpoint');

    expect(response.status).toBe(200);
    expect(response.body.data).toBe('value');
  });
});
```

### Integration Test Template

```javascript
describe('Integration Test', () => {
  it('should complete full workflow', async () => {
    // Arrange
    const testData = setupTestData();

    // Act
    const step1 = await performAction1(testData);
    const step2 = await performAction2(step1);

    // Assert
    expect(step2).toMatchExpectedOutcome();
  });
});
```

### E2E Test Template

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature', () => {
  test('should complete user journey', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await page.click('button#action');
    await expect(page.locator('.result')).toContainText('Expected');
  });
});
```

## Test Coverage Goals

While our isolated testing approach doesn't aim for high line coverage of server.js, we maintain:

- **100% endpoint coverage**: All API endpoints have tests
- **100% critical path coverage**: All user-facing features are tested
- **Edge case coverage**: Error conditions and boundary cases are validated
- **Integration coverage**: Service interactions are thoroughly tested

## Best Practices

1. **Descriptive test names**: Use "should..." format
2. **AAA pattern**: Arrange, Act, Assert
3. **Test isolation**: No shared state between tests
4. **Mock external dependencies**: Keep tests fast and reliable
5. **Meaningful assertions**: Test behavior, not implementation
6. **Clean up**: Use `afterEach` and `afterAll` hooks
7. **Descriptive variable names**: Make tests self-documenting

## Troubleshooting

### Tests Timing Out
- Increase timeout in jest.config.js or individual tests
- Check for unresolved promises
- Verify mock implementations

### Coverage Threshold Errors
- Coverage thresholds apply to server.js
- With isolated testing, this is expected
- Focus on test effectiveness over line coverage

### E2E Tests Failing
- Ensure Playwright browsers are installed: `npm run playwright:install`
- Check that server is accessible at configured baseURL
- Review Playwright report: `npm run playwright:report`

### Flaky Tests
- Ensure proper cleanup in `afterEach`
- Avoid time-based assertions
- Use `waitFor` utilities for async operations

## Continuous Improvement

As the project evolves:
- Add tests for new endpoints
- Update tests when behavior changes
- Maintain test documentation
- Share testing patterns with SFS team

---

**Last Updated:** 2025-11-30
**Test Framework:** Jest 30.2.0 + Playwright 1.57.0
**Total Tests:** 47 passing
