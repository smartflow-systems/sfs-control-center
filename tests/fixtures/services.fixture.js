// Test fixtures for SFS services

const mockHealthyService = {
  name: 'Healthy Service',
  url: 'https://healthy.example.com',
  repo: 'smartflow-systems/healthy-service',
  description: 'A service that is always healthy',
  category: 'Testing',
  status: 'online',
  healthy: true,
  responseTime: '120ms',
  lastChecked: new Date().toISOString()
};

const mockUnhealthyService = {
  name: 'Unhealthy Service',
  url: 'https://unhealthy.example.com',
  repo: 'smartflow-systems/unhealthy-service',
  description: 'A service that is unhealthy',
  category: 'Testing',
  status: 'online',
  healthy: false,
  responseTime: '500ms',
  lastChecked: new Date().toISOString()
};

const mockOfflineService = {
  name: 'Offline Service',
  url: 'https://offline.example.com',
  repo: 'smartflow-systems/offline-service',
  description: 'A service that is offline',
  category: 'Testing',
  status: 'offline',
  healthy: false,
  error: 'Connection refused',
  lastChecked: new Date().toISOString()
};

const mockServiceRegistry = [
  {
    name: 'SmartFlowSite',
    url: 'https://smartflowsite.replit.app',
    repo: 'smartflow-systems/SmartFlowSite',
    description: 'Main marketing & landing site',
    category: 'Core Platform'
  },
  {
    name: 'Marketing & Growth',
    url: 'https://sfs-marketing-and-growth.replit.app',
    repo: 'smartflow-systems/sfs-marketing-and-growth',
    description: 'Booking & marketing automation',
    category: 'Marketing'
  },
  {
    name: 'Data Query Engine',
    url: 'https://sfsdataqueryengine.replit.app',
    repo: 'smartflow-systems/SFSDataQueryEngine',
    description: 'Natural language SQL queries',
    category: 'Data & Analytics'
  }
];

const mockServiceStatusResponse = {
  services: [
    { ...mockServiceRegistry[0], status: 'online', healthy: true, responseTime: '100ms', lastChecked: new Date().toISOString() },
    { ...mockServiceRegistry[1], status: 'online', healthy: true, responseTime: '120ms', lastChecked: new Date().toISOString() },
    { ...mockServiceRegistry[2], status: 'offline', healthy: false, error: 'Timeout', lastChecked: new Date().toISOString() }
  ],
  summary: {
    total: 3,
    online: 2,
    offline: 1,
    healthy: 2
  },
  timestamp: new Date().toISOString()
};

const mockHealthResponse = {
  ok: true
};

const mockUnhealthyResponse = {
  ok: false
};

module.exports = {
  mockHealthyService,
  mockUnhealthyService,
  mockOfflineService,
  mockServiceRegistry,
  mockServiceStatusResponse,
  mockHealthResponse,
  mockUnhealthyResponse
};
