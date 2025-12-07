# CI/CD Integration Guide for SFS Testing Infrastructure

## Overview

This guide explains how to integrate the testing infrastructure into GitHub Actions CI/CD pipelines for all SmartFlow Systems repositories.

---

## Quick Start

### 1. Ensure GitHub Workflow Exists

The test workflow is located at `.github/workflows/test.yml`. If it doesn't exist, create it from the template:

```bash
mkdir -p .github/workflows
cp .testing-templates/github-workflow.template.yml .github/workflows/test.yml
```

### 2. Verify Package.json Scripts

Ensure your `package.json` includes the required test scripts:

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

### 3. Commit and Push

```bash
git add .github/workflows/test.yml
git commit -m "Add CI/CD test automation"
git push origin main
```

Tests will now run automatically on every push and pull request.

---

## Workflow Structure

### Jobs Overview

The test workflow includes 5 jobs that run in parallel (where possible):

```
unit-tests ────┐
               ├──→ coverage ──→ test-summary
integration-tests ─┘

e2e-tests ──────────────────────→ test-summary
```

### 1. Unit Tests Job

**Purpose**: Run fast, isolated unit tests across multiple Node versions

**Matrix Strategy**:
- Node 18.x
- Node 20.x

**Steps**:
1. Checkout code
2. Setup Node.js with caching
3. Install dependencies (`npm ci`)
4. Run unit tests (`npm run test:unit`)
5. Upload test results as artifacts

**Artifacts**: `unit-test-results-{node-version}`

### 2. Integration Tests Job

**Purpose**: Test component interactions and workflows

**Node Version**: 20.x

**Steps**:
1. Checkout code
2. Setup Node.js with caching
3. Install dependencies
4. Run integration tests (`npm run test:integration`)
5. Upload test results

**Artifacts**: `integration-test-results`

### 3. E2E Tests Job

**Purpose**: Full user journey testing with Playwright

**Node Version**: 20.x

**Steps**:
1. Checkout code
2. Setup Node.js with caching
3. Install dependencies
4. Install Playwright browsers (`npx playwright install --with-deps`)
5. Run E2E tests (`npm run test:e2e`)
6. Upload Playwright HTML report
7. Upload test results

**Artifacts**:
- `playwright-report` (HTML report, 30-day retention)
- `e2e-test-results`

### 4. Coverage Job

**Purpose**: Generate and enforce code coverage standards

**Dependencies**: Waits for unit-tests and integration-tests to complete

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run tests with coverage
5. Generate coverage report in GitHub summary
6. Upload coverage as artifact
7. Check coverage thresholds (fail if below 70%)

**Artifacts**: `coverage-report`

**Coverage Display**:
```markdown
## Test Coverage Report

| Metric | Coverage |
|--------|----------|
| Lines | 85% |
| Statements | 87% |
| Functions | 82% |
| Branches | 78% |
```

### 5. Test Summary Job

**Purpose**: Aggregate all test results into a single summary

**Dependencies**: Waits for all other jobs to complete

**Always Runs**: Even if other jobs fail

**Output**: Creates a summary table in GitHub PR/commit:

```markdown
# Test Results Summary

| Test Type | Status |
|-----------|--------|
| Unit Tests | success |
| Integration Tests | success |
| E2E Tests | success |
| Coverage Check | success |
```

---

## Trigger Events

### Automatic Triggers

**Push Events**:
- Pushes to `main` branch
- Pushes to `develop` branch

**Pull Request Events**:
- PRs targeting `main` branch
- PRs targeting `develop` branch

**Manual Trigger**:
- `workflow_dispatch` allows manual workflow runs from GitHub UI

### Customizing Triggers

Edit `.github/workflows/test.yml`:

```yaml
on:
  push:
    branches: [ main, develop, staging ]  # Add more branches
  pull_request:
    branches: [ main ]                     # Restrict PR testing
  schedule:
    - cron: '0 0 * * *'                   # Daily at midnight
  workflow_dispatch:                       # Manual trigger
```

---

## Artifacts and Reports

### Viewing Artifacts

1. Go to GitHub Actions tab
2. Click on a workflow run
3. Scroll to "Artifacts" section
4. Download reports

### Available Artifacts

| Artifact | Contains | Retention |
|----------|----------|-----------|
| `unit-test-results-{version}` | Jest coverage for unit tests | 90 days |
| `integration-test-results` | Jest coverage for integration tests | 90 days |
| `playwright-report` | HTML report with screenshots/traces | 30 days |
| `e2e-test-results` | Raw E2E test results | 90 days |
| `coverage-report` | Complete coverage report (HTML/LCOV) | 90 days |

### Viewing Playwright Reports

**Option 1: Download Artifact**
1. Download `playwright-report` artifact
2. Extract the zip file
3. Open `index.html` in browser

**Option 2: Use Playwright's Built-in Server**
```bash
npx playwright show-report
```

---

## Coverage Enforcement

### Current Thresholds

Minimum coverage required (configurable in `jest.config.js`):

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

### How It Works

1. Tests run with `--coverage` flag
2. Coverage data saved to `coverage/coverage-summary.json`
3. Node.js script checks each metric against threshold
4. Job fails if any metric is below threshold
5. Coverage report appears in GitHub summary

### Adjusting Thresholds

**For the entire project**:
Edit `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 80,  // Increase to 80%
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

**For specific files**:
```javascript
coverageThreshold: {
  global: { /* ... */ },
  './src/critical-module.js': {
    branches: 90,
    functions: 95,
    lines: 90,
    statements: 90
  }
}
```

**Temporarily lower thresholds** (not recommended):
```javascript
coverageThreshold: {
  global: {
    branches: 50,  // Lower during initial implementation
    functions: 50,
    lines: 50,
    statements: 50
  }
}
```

---

## Status Badges

### Adding Test Status Badge to README

Add to your `README.md`:

```markdown
![Tests](https://github.com/smartflow-systems/your-repo/workflows/Test%20Suite/badge.svg)
```

### Coverage Badge

**Option 1: Using Codecov**
1. Sign up at codecov.io
2. Add repository
3. Add to workflow:
   ```yaml
   - name: Upload to Codecov
     uses: codecov/codecov-action@v3
     with:
       files: ./coverage/lcov.info
   ```
4. Add badge to README:
   ```markdown
   ![Coverage](https://codecov.io/gh/smartflow-systems/your-repo/branch/main/graph/badge.svg)
   ```

**Option 2: Using Coveralls**
Similar process with coveralls.io

**Option 3: Manual Badge**
Use shields.io with coverage percentage

---

## Troubleshooting

### Tests Pass Locally But Fail in CI

**Common Causes**:
1. Environment variables not set
2. Different Node.js versions
3. Missing dependencies
4. Race conditions in tests

**Solutions**:
```yaml
# Add environment variables
env:
  NODE_ENV: test
  DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

# Pin Node.js version
node-version: '20.x'

# Use npm ci instead of npm install
- run: npm ci

# Increase test timeout
- run: npm test -- --testTimeout=30000
```

### Playwright Tests Failing in CI

**Issue**: Browsers not installed or outdated

**Solution**: Already included in workflow
```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps
```

**Issue**: Server not starting in time

**Solution**: Configure `webServer` in `playwright.config.js`:
```javascript
webServer: {
  command: 'npm run start',
  url: 'http://localhost:6000/health',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000  // 2 minutes
}
```

### Coverage Threshold Failures

**Issue**: New code added without tests

**Solution**: Add tests for new code or adjust thresholds temporarily

**Bypass** (not recommended):
```bash
npm run test:coverage -- --coverageThreshold='{}'
```

### Workflow Not Triggering

**Check**:
1. Workflow file is in `.github/workflows/`
2. File has `.yml` or `.yaml` extension
3. YAML syntax is valid (use yamllint.com)
4. Branch names match trigger configuration

### Slow Test Execution

**Optimize**:
1. Use `npm ci` instead of `npm install` (faster)
2. Cache `node_modules`:
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```
3. Run jobs in parallel (already configured)
4. Skip E2E tests for draft PRs

---

## Advanced Configuration

### Running Tests Only on Specific Paths

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'tests/**'
      - 'package.json'
```

### Matrix Testing Across OS

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    node-version: [18.x, 20.x]
runs-on: ${{ matrix.os }}
```

### Conditional Job Execution

```yaml
# Only run E2E tests on main branch
e2e-tests:
  if: github.ref == 'refs/heads/main'
```

### Secrets Management

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
  DATABASE_URL: ${{ secrets.TEST_DB_URL }}
```

Add secrets in: Repository Settings → Secrets and variables → Actions

---

## Performance Optimization

### Current Performance

- Unit tests: ~300ms
- Integration tests: ~200ms
- E2E tests: ~10s
- Total pipeline: ~2-3 minutes

### Optimization Tips

1. **Cache Dependencies**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```

2. **Parallel Execution**
   - Already configured for independent jobs

3. **Skip E2E on Draft PRs**
   ```yaml
   if: github.event.pull_request.draft == false
   ```

4. **Incremental Testing**
   - Run only affected tests (requires additional tooling)

5. **Test Sharding** (for large E2E suites)
   ```yaml
   strategy:
     matrix:
       shard: [1, 2, 3, 4]
   ```
   ```bash
   npx playwright test --shard=${{ matrix.shard }}/4
   ```

---

## Monitoring and Notifications

### GitHub Checks

Test results automatically appear in:
- Pull request checks
- Commit status checks
- Branch protection requirements

### Email Notifications

Configured per user in GitHub settings:
- Settings → Notifications → Actions

### Slack Integration

**Option 1: GitHub Slack App**
1. Install GitHub Slack app
2. Subscribe to repository: `/github subscribe owner/repo`

**Option 2: Workflow Action**
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Tests completed'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Migration Guide for Existing Projects

### Step 1: Backup Current Setup
```bash
git checkout -b add-testing-infrastructure
```

### Step 2: Copy Files from Template
```bash
cp -r /path/to/sfs-control-center/.testing-templates/* .
mv jest.config.template.js jest.config.js
mv setup.template.js tests/setup.js
mv github-workflow.template.yml .github/workflows/test.yml
```

### Step 3: Install Dependencies
```bash
npm install --save-dev jest supertest @types/jest \
  @types/supertest jest-environment-node \
  @playwright/test playwright
```

### Step 4: Update package.json
Add test scripts from template

### Step 5: Write Initial Tests
Start with critical path tests

### Step 6: Test Locally
```bash
npm test
npm run test:e2e
```

### Step 7: Commit and Push
```bash
git add .
git commit -m "Add comprehensive testing infrastructure"
git push origin add-testing-infrastructure
```

### Step 8: Create Pull Request
Review CI/CD results in PR

---

## Best Practices

1. **Run tests locally before pushing**
2. **Keep tests fast** (unit tests < 100ms each)
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Clean up after tests**
6. **Maintain coverage thresholds**
7. **Review test failures immediately**
8. **Update tests when behavior changes**
9. **Document test patterns**
10. **Share improvements with team**

---

## Support and Resources

### Documentation
- Jest: https://jestjs.io/docs/getting-started
- Playwright: https://playwright.dev/docs/intro
- GitHub Actions: https://docs.github.com/en/actions

### SFS Resources
- Testing templates: `.testing-templates/`
- Example tests: `tests/` in sfs-control-center
- Team knowledge base: SFS confluence/wiki

### Getting Help
- Review test failures in GitHub Actions
- Check Playwright reports for E2E failures
- Ask in SFS developer channel
- Review this documentation

---

**Last Updated**: 2025-11-30
**Maintained By**: SmartFlow Systems DevOps Team
