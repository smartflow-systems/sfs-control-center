require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 6000;

// Security headers
app.use(helmet());

// CORS — restrict to same-origin by default; override via CORS_ORIGIN env var
const allowedOrigin = process.env.CORS_ORIGIN || false;
app.use(cors({
  origin: allowedOrigin,
  credentials: false
}));

// Rate limiting
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(defaultLimiter);

app.use(express.json({ limit: '50kb' }));
app.use(express.static('public'));

// Admin API key middleware
function requireAdminKey(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return res.status(503).json({ error: 'Admin access not configured' });
  }
  const providedKey = req.headers['x-admin-key'] || req.query.key;
  if (!providedKey || providedKey !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// SFS Service Registry — URLs come from env vars, no hardcoded fallbacks leak to client
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

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Services status — admin only (exposes internal URLs)
app.get('/api/services/status', requireAdminKey, async (_req, res) => {
  try {
    const statusPromises = SFS_SERVICES.map(async (service) => {
      try {
        const healthUrl = `${service.url}/health`;
        const response = await fetch(healthUrl, { timeout: 5000 });
        const data = await response.json();
        return {
          name: service.name,
          category: service.category,
          description: service.description,
          status: 'online',
          healthy: data.ok === true,
          lastChecked: new Date().toISOString()
        };
      } catch {
        return {
          name: service.name,
          category: service.category,
          description: service.description,
          status: 'offline',
          healthy: false,
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
    console.error('Status check error:', error.message);
    res.status(500).json({ error: 'Failed to fetch service status' });
  }
});

// Deployments status — admin only
app.get('/api/deployments/status', requireAdminKey, (_req, res) => {
  res.json({
    message: 'GitHub Actions integration coming soon',
    count: SFS_SERVICES.length
  });
});

// Aggregate metrics — admin only
app.get('/api/metrics/aggregate', requireAdminKey, (_req, res) => {
  res.json({
    totalUsers: 0,
    totalRevenue: 0,
    activeDeployments: SFS_SERVICES.length,
    avgResponseTime: '150ms',
    timestamp: new Date().toISOString()
  });
});

// Serve dashboard
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`SFS Control Center running on port ${PORT}`);
  console.log(`Monitoring ${SFS_SERVICES.length} services`);
});
