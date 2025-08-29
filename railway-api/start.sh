#!/bin/bash

# Set default port if not provided
export PORT=${PORT:-3001}

# Start the API service
echo "Starting API on port $PORT..."
npm start
