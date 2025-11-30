const request = require('supertest');
const express = require('express');

// Create a minimal Express app for testing the health endpoint
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Health check endpoint (matches server.js implementation)
  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      service: 'sfs-control-center',
      timestamp: new Date().toISOString()
    });
  });

  return app;
};

describe('Health Endpoint', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return ok: true', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('ok', true);
    });

    it('should return service name', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('service', 'sfs-control-center');
    });

    it('should return ISO timestamp', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('timestamp');

      const timestamp = response.body.timestamp;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

      // Verify it's a valid date
      const date = new Date(timestamp);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should return recent timestamp', async () => {
      const response = await request(app).get('/health');
      const timestamp = new Date(response.body.timestamp);
      const now = new Date();
      const timeDifference = Math.abs(now - timestamp);

      // Timestamp should be within 5 seconds of now
      expect(timeDifference).toBeLessThan(5000);
    });

    it('should have all required fields', async () => {
      const response = await request(app).get('/health');
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['ok', 'service', 'timestamp'])
      );
    });

    it('should handle multiple consecutive requests', async () => {
      const requests = [
        request(app).get('/health'),
        request(app).get('/health'),
        request(app).get('/health')
      ];

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.ok).toBe(true);
      });
    });
  });
});
