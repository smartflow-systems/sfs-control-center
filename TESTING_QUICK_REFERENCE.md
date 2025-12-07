# Testing Quick Reference

## Commands

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests only
npm run test:e2e              # E2E tests with Playwright

# Coverage and reporting
npm run test:coverage         # Generate coverage report
npm run playwright:report     # View Playwright HTML report

# Development
npm run test:watch            # Watch mode for TDD
npm run test:verbose          # Detailed output
npm run test:debug            # Debug with Node inspector

# E2E specific
npm run test:e2e:ui           # Playwright UI mode
npm run playwright:install    # Install browsers
```

## Test Structure

```
tests/
├── unit/              # Fast, isolated tests
├── integration/       # Component interaction tests
├── e2e/              # Full user journey tests
├── fixtures/         # Reusable test data
├── mocks/            # Mock implementations
└── setup.js          # Global configuration
```

## Writing Tests

### Unit Test Template
```javascript
const request = require('supertest');
const express = require('express');

describe('Feature Name', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.get('/endpoint', (req, res) => {
      res.json({ data: 'value' });
    });
  });

  it('should return expected data', async () => {
    const response = await request(app).get('/endpoint');
    expect(response.status).toBe(200);
    expect(response.body.data).toBe('value');
  });
});
```

### E2E Test Template
```javascript
const { test, expect } = require('@playwright/test');

test('user journey', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

## Coverage Thresholds

- Lines: 70%
- Statements: 70%
- Functions: 70%
- Branches: 70%

## CI/CD

Runs automatically on:
- Push to `main` or `develop`
- Pull requests
- Manual trigger

View results in GitHub Actions tab

## File Locations

| File | Purpose |
|------|---------|
| `jest.config.js` | Jest configuration |
| `playwright.config.js` | Playwright configuration |
| `.github/workflows/test.yml` | CI/CD pipeline |
| `tests/setup.js` | Global test setup |
| `TESTING.md` | Full documentation |

## Troubleshooting

**Tests failing locally?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (need 18+)
- Clear Jest cache: `npx jest --clearCache`

**E2E tests failing?**
- Install browsers: `npm run playwright:install`
- Check server is running
- Review Playwright report: `npm run playwright:report`

**Coverage too low?**
- Write tests for new code
- Check what's not covered: `open coverage/index.html`

## Quick Apply to Another Repo

```bash
# 1. Install deps
npm install --save-dev jest supertest @playwright/test playwright

# 2. Copy config
cp /path/to/sfs-control-center/jest.config.js .
cp /path/to/sfs-control-center/playwright.config.js .

# 3. Copy templates
mkdir -p tests/{unit,integration,e2e,fixtures,mocks}
cp /path/to/sfs-control-center/tests/setup.js tests/

# 4. Add scripts to package.json (see TESTING.md)

# 5. Copy CI/CD
mkdir -p .github/workflows
cp /path/to/sfs-control-center/.github/workflows/test.yml .github/workflows/

# 6. Write tests and run
npm test
```

## Key Principles

1. **Descriptive names**: "should do something specific"
2. **AAA pattern**: Arrange, Act, Assert
3. **Isolation**: Each test is independent
4. **Mock externals**: Fast, reliable tests
5. **Edge cases**: Test boundaries and errors

---

See `TESTING.md` for complete documentation
