require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// SFS Service Registry
const SFS_SERVICES = [
  {
    name: 'SmartFlowSite',
    url: process.env.SMARTFLOWSITE_URL || 'https://smartflowsite.replit.app',
    repo: 'smartflow-systems/SmartFlowSite',
    description: 'Main marketing & landing site',
    category: 'Core Platform'
  },
  {
    name: 'Marketing & Growth',
    url: process.env.SFS_MARKETING_URL || 'https://sfs-marketing-and-growth.replit.app',
    repo: 'smartflow-systems/sfs-marketing-and-growth',
    description: 'Booking & marketing automation',
    category: 'Marketing'
  },
  {
    name: 'Data Query Engine',
    url: process.env.SFS_DATA_QUERY_URL || 'https://sfsdataqueryengine.replit.app',
    repo: 'smartflow-systems/SFSDataQueryEngine',
    description: 'Natural language SQL queries',
    category: 'Data & Analytics'
  },
  {
    name: 'Social Scale Booster AI',
    url: process.env.SOCIAL_AI_URL || 'https://socialscaleboosteraibot.replit.app',
    repo: 'smartflow-systems/SocialScaleBoosterAIbot',
    description: 'AI social media bot builder',
    category: 'Social Media'
  },
  {
    name: 'CRM Demo',
    url: process.env.SFS_CRM_URL || 'https://sfsapdemocrm.replit.app',
    repo: 'smartflow-systems/SFSAPDemoCRM',
    description: 'Customer relationship management',
    category: 'Business Management'
  },
  {
    name: 'Data Scrape Insights',
    url: process.env.DATA_SCRAPE_URL || 'https://datascrapeinsights.replit.app',
    repo: 'smartflow-systems/DataScrapeInsights',
    description: 'Web scraping & analysis',
    category: 'Data & Analytics'
  },
  {
    name: 'Social Scale Booster',
    url: process.env.SOCIAL_BOOSTER_URL || 'https://socialscalebooster.replit.app',
    repo: 'smartflow-systems/SocialScaleBooster',
    description: 'Social media automation',
    category: 'Social Media'
  },
  {
    name: 'Barber Booker',
    url: process.env.BARBER_BOOKER_URL || 'https://barber-booker.replit.app',
    repo: 'smartflow-systems/Barber-booker-tempate-v1',
    description: 'Service booking system',
    category: 'Business Management'
  },
  {
    name: 'Website Builder',
    url: process.env.WEBSITE_BUILDER_URL || 'https://websitebuilder.replit.app',
    repo: 'smartflow-systems/WebsiteBuilder',
    description: 'Website builder platform',
    category: 'Content & Media'
  },
  {
    name: 'CodeGPT',
    url: process.env.CODEGPT_URL || 'https://codegpt.replit.app',
    repo: 'smartflow-systems/codegpt',
    description: 'AI code assistant showcase',
    category: 'Developer Tools'
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'sfs-control-center', timestamp: new Date().toISOString() });
});

// Get all services status
app.get('/api/services/status', async (req, res) => {
  try {
    const statusPromises = SFS_SERVICES.map(async (service) => {
      try {
        const healthUrl = `${service.url}/health`;
        const response = await fetch(healthUrl, { timeout: 5000 });
        const data = await response.json();

        return {
          ...service,
          status: 'online',
          healthy: data.ok === true,
          responseTime: response.headers.get('x-response-time') || 'N/A',
          lastChecked: new Date().toISOString()
        };
      } catch (error) {
        return {
          ...service,
          status: 'offline',
          healthy: false,
          error: error.message,
          lastChecked: new Date().toISOString()
        };
      }
    });

    const results = await Promise.all(statusPromises);

    const summary = {
      total: results.length,
      online: results.filter(s => s.status === 'online').length,
      offline: results.filter(s => s.status === 'offline').length,
      healthy: results.filter(s => s.healthy).length
    };

    res.json({ services: results, summary, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get GitHub Actions status for all repos
app.get('/api/deployments/status', async (req, res) => {
  try {
    // This would integrate with GitHub API to get workflow status
    // For now, return placeholder
    res.json({
      message: 'GitHub Actions integration coming soon',
      repos: SFS_SERVICES.map(s => s.repo)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get aggregate metrics
app.get('/api/metrics/aggregate', async (req, res) => {
  try {
    // Placeholder for aggregate metrics
    res.json({
      totalUsers: 0,
      totalRevenue: 0,
      activeDeployments: SFS_SERVICES.length,
      avgResponseTime: '150ms',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎯 SFS Control Center running on port ${PORT}`);
  console.log(`📊 Monitoring ${SFS_SERVICES.length} services`);
  console.log(`🌐 Open http://localhost:${PORT}`);
});
