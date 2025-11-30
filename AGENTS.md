# Agent Notes: SFS Control Center

## Purpose
Unified monitoring and management dashboard for all SmartFlow Systems services. This is the central command center for the SFS ecosystem.

## Project Overview

### What It Does
- Monitors health status of 10+ SFS services in real-time
- Provides unified dashboard with service availability indicators
- Tracks deployment status across all repositories
- Aggregates metrics from the entire SFS ecosystem
- Offers quick access to services and repositories

### Tech Stack
- **Backend:** Node.js 18+, Express 4.18
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Monitoring:** Custom health check polling system
- **Theme:** SmartFlow brown/black/gold signature colors
- **Deployment:** Replit, GitHub Actions CI/CD

## File Structure

```
sfs-control-center/
├── server.js                    # Express server with API endpoints
├── package.json                 # Dependencies and scripts
├── public/
│   └── index.html              # Dashboard UI with real-time status
├── scripts/
│   └── health.sh               # Health check script
├── .github/workflows/
│   └── sfs-ci-deploy.yml       # CI/CD pipeline
├── .env.example                # Environment variables template
├── .gitignore                  # Git exclusions
├── AGENTS.md                   # This file
└── README.md                   # Documentation
```

## Key Files

### [server.js]
- Express server running on port 6000 (configurable via PORT env var)
- Service registry with 10 SFS services
- Health check endpoint: `GET /health`
- API endpoints:
  - `GET /api/services/status` - Real-time status of all services
  - `GET /api/deployments/status` - GitHub Actions workflow status
  - `GET /api/metrics/aggregate` - Combined metrics

### [public/index.html]
- Dashboard UI with auto-refreshing service cards
- Real-time health status indicators
- SmartFlow brown/black/gold theme
- Glass morphism card effects
- Responsive design

### [.github/workflows/sfs-ci-deploy.yml]
- Complete CI/CD pipeline with lint, test, build, security scan
- Automated deployment to Replit on push to main
- Health check validation
- SFS diagnostic reports

## Environment Variables

Required in production:
```bash
PORT=6000                        # Server port (default: 6000)

# Optional: Override default service URLs
SMARTFLOWSITE_URL=https://smartflowsite.replit.app
SFS_MARKETING_URL=https://sfs-marketing-and-growth.replit.app
# ... see .env.example for all 10 services
```

Required GitHub secrets:
- `SFS_PAT` - SmartFlow Personal Access Token for GitHub API
- `REPLIT_TOKEN` - Replit deployment token

## Monitored Services

The Control Center tracks these SFS services:

1. **SmartFlowSite** - Main marketing site
2. **Marketing & Growth** - Booking and marketing platform
3. **Data Query Engine** - Natural language SQL
4. **Social Scale Booster AI** - AI social bot builder
5. **CRM Demo** - Customer relationship management
6. **Data Scrape Insights** - Web scraping platform
7. **Social Scale Booster** - Social media automation
8. **Barber Booker** - Service booking system
9. **Website Builder** - Website builder platform
10. **CodeGPT** - AI code assistant showcase

## Development Workflow

### Starting the Server
```bash
npm install          # Install dependencies
npm run dev          # Start development server
```

### Adding New Services
1. Edit `server.js`
2. Add service to `SFS_SERVICES` array
3. Include: name, url, repo, description, category
4. Update `public/index.html` if needed
5. Add environment variable to `.env.example`

### Running Health Checks
```bash
npm run health       # Run local health check
curl http://localhost:6000/health
curl http://localhost:6000/api/services/status
```

### Deployment
```bash
git add .
git commit -m "Update control center"
git push origin main    # Triggers CI/CD pipeline
```

## API Documentation

### GET /health
Returns service health status.

**Response:**
```json
{
  "ok": true,
  "service": "sfs-control-center",
  "timestamp": "2024-11-30T12:00:00.000Z"
}
```

### GET /api/services/status
Returns health status for all monitored services.

**Response:**
```json
{
  "services": [
    {
      "name": "SmartFlowSite",
      "url": "https://smartflowsite.replit.app",
      "status": "online",
      "healthy": true,
      "responseTime": "120ms",
      "lastChecked": "2024-11-30T12:00:00.000Z"
    }
  ],
  "summary": {
    "total": 10,
    "online": 9,
    "offline": 1,
    "healthy": 9
  },
  "timestamp": "2024-11-30T12:00:00.000Z"
}
```

### GET /api/deployments/status
Returns GitHub Actions workflow status (planned feature).

### GET /api/metrics/aggregate
Returns aggregate metrics across all services (planned feature).

## Common Tasks

### Adding a New Service to Monitor
1. Add to `SFS_SERVICES` in `server.js`
2. Ensure service has `/health` endpoint
3. Add environment variable override option
4. Update documentation

### Debugging Service Status
```bash
# Check individual service
curl https://SERVICE_URL/health

# Check all services via Control Center
curl http://localhost:6000/api/services/status
```

### Updating Dashboard UI
- Edit `public/index.html`
- Maintain SmartFlow brown/black/gold theme
- Keep responsive design patterns
- Test auto-refresh functionality

## Important Notes

### For AI Assistants

- **VERIFY Before Changes:** Always check current service status before modifications
- **File Paths:** Always use absolute paths: `/home/garet/SFS/sfs-control-center/[file]`
- **Theme Consistency:** Maintain brown/black/gold color scheme
- **Health Checks:** All services must have `/health` endpoint returning `{"ok": true}`
- **No Breaking Changes:** This is a critical monitoring service - don't break it
- **Bash Scripts:** Always use `set -euo pipefail` in shell scripts

### Service Registry Pattern
All services follow this structure:
```javascript
{
  name: 'Service Name',
  url: process.env.SERVICE_URL || 'default-url',
  repo: 'smartflow-systems/repo-name',
  description: 'Brief description',
  category: 'Category Name'
}
```

### Categories
- Core Platform
- Marketing
- Data & Analytics
- Social Media
- Business Management
- Content & Media
- Developer Tools

## CI/CD Pipeline

### Workflow Steps
1. **Lint** - Validate code quality
2. **Test** - Run test suite (when configured)
3. **Build** - Build application
4. **Security** - npm audit for vulnerabilities
5. **Diagnose** - SFS-specific checks
6. **Deploy** - Push to Replit (main branch only)

### Status Badges
The README includes CI/CD status badge:
```markdown
[![CI/CD](https://github.com/smartflow-systems/sfs-control-center/actions/workflows/sfs-ci-deploy.yml/badge.svg)](https://github.com/smartflow-systems/sfs-control-center/actions)
```

## Deployment Configuration

### GitHub Repository
- **Name:** sfs-control-center
- **Organization:** smartflow-systems
- **Visibility:** Public
- **Branch Protection:** main branch requires PR reviews

### Required Secrets
Configure in GitHub Settings > Secrets:
- `SFS_PAT` - GitHub Personal Access Token with repo access
- `REPLIT_TOKEN` - Replit deployment authentication

### Replit Configuration
- **Port:** 6000 (configurable)
- **Node Version:** 18+
- **Auto-deploy:** On push to main via GitHub Actions

## Future Enhancements

Planned features:
- GitHub Actions integration for deployment tracking
- Real-time WebSocket updates
- Alert notifications (email/SMS/Slack)
- Performance trend analysis
- Incident response automation
- Custom dashboard widgets
- Multi-user access controls

## Support & Resources

- **Repository:** https://github.com/smartflow-systems/sfs-control-center
- **Organization:** https://github.com/smartflow-systems
- **Documentation:** See README.md
- **Issues:** Use GitHub Issues for bug reports

---

**Last Updated:** 2024-11-30
**Maintained By:** SmartFlow Systems Team
**Status:** Production Ready
