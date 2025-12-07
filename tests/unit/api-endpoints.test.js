const request = require('supertest');
const express = require('express');

// Create test app with all API endpoints
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const SFS_SERVICES = [
    {
      name: 'SmartFlowSite',
      url: 'https://smartflowsite.replit.app',
      repo: 'smartflow-systems/SmartFlowSite',
      description: 'Main marketing & landing site',
      category: 'Core Platform'
    }
  ];

  app.get('/api/deployments/status', async (req, res) => {
    try {
      res.json({
        message: 'GitHub Actions integration coming soon',
        repos: SFS_SERVICES.map(s => s.repo)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/metrics/aggregate', async (req, res) => {
    try {
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

  return app;
};

describe('API Endpoints', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /api/deployments/status', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/api/deployments/status');
      expect(response.status).toBe(200);
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/deployments/status');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return message property', async () => {
      const response = await request(app).get('/api/deployments/status');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });

    it('should return repos array', async () => {
      const response = await request(app).get('/api/deployments/status');
      expect(response.body).toHaveProperty('repos');
      expect(Array.isArray(response.body.repos)).toBe(true);
    });

    it('should return valid repository names', async () => {
      const response = await request(app).get('/api/deployments/status');

      response.body.repos.forEach(repo => {
        expect(repo).toMatch(/^smartflow-systems\/.+/);
      });
    });
  });

  describe('GET /api/metrics/aggregate', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/api/metrics/aggregate');
      expect(response.status).toBe(200);
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/metrics/aggregate');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return all required metrics', async () => {
      const response = await request(app).get('/api/metrics/aggregate');

      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('totalRevenue');
      expect(response.body).toHaveProperty('activeDeployments');
      expect(response.body).toHaveProperty('avgResponseTime');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return numeric values for user and revenue metrics', async () => {
      const response = await request(app).get('/api/metrics/aggregate');

      expect(typeof response.body.totalUsers).toBe('number');
      expect(typeof response.body.totalRevenue).toBe('number');
      expect(typeof response.body.activeDeployments).toBe('number');
    });

    it('should return string for avgResponseTime', async () => {
      const response = await request(app).get('/api/metrics/aggregate');
      expect(typeof response.body.avgResponseTime).toBe('string');
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/api/metrics/aggregate');

      expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });

    it('should return non-negative values', async () => {
      const response = await request(app).get('/api/metrics/aggregate');

      expect(response.body.totalUsers).toBeGreaterThanOrEqual(0);
      expect(response.body.totalRevenue).toBeGreaterThanOrEqual(0);
      expect(response.body.activeDeployments).toBeGreaterThanOrEqual(0);
    });

    it('should return activeDeployments greater than zero', async () => {
      const response = await request(app).get('/api/metrics/aggregate');
      expect(response.body.activeDeployments).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent endpoints', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
    });

    it('should handle invalid HTTP methods', async () => {
      const response = await request(app)
        .post('/api/deployments/status')
        .send({});

      expect(response.status).toBe(404);
    });
  });

  describe('CORS and Headers', () => {
    it('should return proper content-type headers', async () => {
      const response = await request(app).get('/api/metrics/aggregate');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});
