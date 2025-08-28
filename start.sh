#!/bin/bash

# Set default port if not provided
export PORT=${PORT:-3001}

# Navigate to API directory
cd apps/api

# Build the API if dist doesn't exist
if [ ! -d "dist" ]; then
  echo "Building API..."
  npm run build
fi

# Start the API service
echo "Starting API on port $PORT..."
npm start
