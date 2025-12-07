// Mock implementations for node-fetch

const createMockFetchResponse = (data, options = {}) => {
  const {
    status = 200,
    ok = true,
    headers = {},
    delay = 0
  } = options;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!ok) {
        reject(new Error(data.error || 'Request failed'));
        return;
      }

      resolve({
        ok,
        status,
        json: async () => data,
        text: async () => JSON.stringify(data),
        headers: {
          get: (headerName) => headers[headerName] || null
        }
      });
    }, delay);
  });
};

const mockHealthyFetch = () => {
  return createMockFetchResponse(
    { ok: true },
    { headers: { 'x-response-time': '100ms' } }
  );
};

const mockUnhealthyFetch = () => {
  return createMockFetchResponse(
    { ok: false },
    { headers: { 'x-response-time': '500ms' } }
  );
};

const mockOfflineFetch = () => {
  return Promise.reject(new Error('ECONNREFUSED'));
};

const mockTimeoutFetch = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, 5100); // Longer than typical timeout
  });
};

const mockSlowFetch = (delay = 2000) => {
  return createMockFetchResponse(
    { ok: true },
    { delay, headers: { 'x-response-time': `${delay}ms` } }
  );
};

const createMockFetchSequence = (responses) => {
  let callIndex = 0;

  return jest.fn(() => {
    const response = responses[callIndex % responses.length];
    callIndex++;
    return response();
  });
};

module.exports = {
  createMockFetchResponse,
  mockHealthyFetch,
  mockUnhealthyFetch,
  mockOfflineFetch,
  mockTimeoutFetch,
  mockSlowFetch,
  createMockFetchSequence
};
