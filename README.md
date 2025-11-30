# 🎯 SFS Control Center

**Unified monitoring and management dashboard for all SmartFlow Systems services**

[![CI/CD](https://github.com/smartflow-systems/sfs-control-center/actions/workflows/sfs-ci-deploy.yml/badge.svg)](https://github.com/smartflow-systems/sfs-control-center/actions)
[![Health Check](https://img.shields.io/badge/health-online-success)](https://sfs-control-center.replit.app/health)

## Overview

SFS Control Center is the command center for the entire SmartFlow Systems ecosystem. It provides:

- **Real-time Service Monitoring** - Health status for all 10+ SFS services
- **Unified Dashboard** - Single view of the entire SFS infrastructure
- **Quick Actions** - One-click access to services and repositories
- **Deployment Tracking** - Monitor CI/CD pipeline status
- **Aggregate Metrics** - Combined analytics across all platforms

## Features

### 🎨 SmartFlow Theme
- Signature brown/black/gold color scheme
- Glass morphism card effects
- Responsive design for all devices
- Auto-refreshing status indicators

### 📊 Monitored Services

1. **SmartFlowSite** - Main marketing & landing site
2. **Marketing & Growth** - Booking & marketing automation
3. **Data Query Engine** - Natural language SQL queries
4. **Social Scale Booster AI** - AI social media bot builder
5. **CRM Demo** - Customer relationship management
6. **Data Scrape Insights** - Web scraping & analysis
7. **Social Scale Booster** - Social media automation
8. **Barber Booker** - Service booking system
9. **Website Builder** - Website builder platform
10. **CodeGPT** - AI code assistant showcase

### ⚡ Real-time Features
- Health check polling every 30 seconds
- Service status indicators (online/offline/healthy)
- Response time tracking
- Auto-refresh capabilities

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/smartflow-systems/sfs-control-center.git
cd sfs-control-center

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm run dev
```

### Environment Variables

```env
PORT=6000

# Override service URLs if needed (optional)
SMARTFLOWSITE_URL=https://smartflowsite.replit.app
SFS_MARKETING_URL=https://sfs-marketing-and-growth.replit.app
# ... see .env.example for all options
```

## Usage

### Start the Dashboard

```bash
npm start
```

Open your browser to `http://localhost:6000`

### Health Check

```bash
curl http://localhost:6000/health
# Returns: {"ok":true,"service":"sfs-control-center","timestamp":"..."}
```

### API Endpoints

#### Get All Services Status
```bash
GET /api/services/status
```

Returns health status, response times, and availability for all monitored services.

#### Get Deployment Status
```bash
GET /api/deployments/status
```

Returns GitHub Actions workflow status for all repositories.

#### Get Aggregate Metrics
```bash
GET /api/metrics/aggregate
```

Returns combined metrics across the entire SFS ecosystem.

## Development

### Project Structure

```
sfs-control-center/
├── server.js              # Express server & API
├── package.json           # Dependencies & scripts
├── public/
│   └── index.html        # Dashboard UI
├── scripts/
│   └── health.sh         # Health check script
├── .github/
│   └── workflows/
│       └── sfs-ci-deploy.yml  # CI/CD pipeline
├── .env.example          # Environment template
└── README.md             # This file
```

### Adding New Services

Edit `server.js` and add to the `SFS_SERVICES` array:

```javascript
{
  name: 'Your Service',
  url: process.env.YOUR_SERVICE_URL || 'https://your-service.replit.app',
  repo: 'smartflow-systems/your-service',
  description: 'Service description',
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

## Deployment

### Replit Deployment

1. Push to GitHub (triggers automatic deployment):
```bash
git push origin main
```

2. GitHub Actions will automatically deploy to Replit

### Manual Deployment

```bash
npm run build
npm start
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Trigger**: Push to `main` branch
- **Actions**: Lint, test, build, deploy to Replit
- **Status**: Check badge at top of README

## Monitoring & Alerts

The Control Center monitors:
- Service availability (online/offline)
- Health check responses
- Response times
- Deployment status

Future features:
- Email/SMS alerts for service outages
- Slack/Discord notifications
- Performance trend analysis
- Automated incident response

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Monitoring**: Custom health check polling
- **Deployment**: Replit, GitHub Actions
- **Theme**: SmartFlow brown/black/gold

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: [SmartFlow Systems Knowledge Base](https://github.com/smartflow-systems/sfs-knowledge-base)
- **Issues**: [GitHub Issues](https://github.com/smartflow-systems/sfs-control-center/issues)
- **Organization**: [SmartFlow Systems](https://github.com/smartflow-systems)

---

**Part of the SmartFlow Systems Ecosystem**

🎯 Built with precision. Monitored with care. Deployed with confidence.
