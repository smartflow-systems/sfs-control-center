#!/bin/bash
set -euo pipefail

# SFS Control Center Health Check Script

PORT=${PORT:-6000}
HEALTH_URL="http://localhost:$PORT/health"

echo "Checking SFS Control Center health..."

if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
  echo "✓ Service is healthy"
  exit 0
else
  echo "✗ Service is unhealthy"
  exit 1
fi
