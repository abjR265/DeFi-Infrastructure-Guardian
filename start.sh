#!/bin/bash

# Set default port if not provided
export PORT=${PORT:-3001}

# Navigate to railway-api directory and start the API
echo "Starting API from railway-api directory on port $PORT..."
cd railway-api && npm start
