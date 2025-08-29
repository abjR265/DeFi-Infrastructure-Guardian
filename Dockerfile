FROM node:20-alpine

WORKDIR /app

# Copy the railway-api directory
COPY railway-api/ ./railway-api/

# Set working directory to railway-api
WORKDIR /app/railway-api

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# List files to debug
RUN ls -la
RUN ls -la dist/

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
