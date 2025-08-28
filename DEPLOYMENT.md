# DeFi Infrastructure Guardian - Deployment Guide

This guide covers deploying the DeFi Infrastructure Guardian to various platforms.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run deploy:vercel
```

### 2. Railway (Full Stack)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
npm run deploy:railway
```

### 3. Render (Full Stack)
```bash
# Connect your GitHub repo to Render
# Render will auto-deploy from the render.yaml config
```

### 4. Heroku (Full Stack)
```bash
# Install Heroku CLI
npm i -g heroku

# Deploy
npm run deploy:heroku
```

## 🐳 Docker Deployment

### Production with Docker Compose
```bash
# Build and start production services
docker-compose -f docker/docker-compose.prod.yml up -d

# View logs
docker-compose -f docker/docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.prod.yml down
```

### Individual Services
```bash
# Build API
docker build -f docker/Dockerfile.api -t defi-guardian-api .

# Build Web
docker build -f docker/Dockerfile.web -t defi-guardian-web .

# Run API
docker run -p 3001:3001 --env-file .env defi-guardian-api

# Run Web
docker run -p 3000:3000 --env-file .env defi-guardian-web
```

## 🔧 Environment Configuration

### Required Environment Variables

#### API (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379

# Blockchain
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY

# Security
JWT_SECRET=your-super-secret-key
API_KEY=your-api-key

# Frontend
FRONTEND_URL=https://your-domain.com
```

#### Web (.env)
```env
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
```

## 📊 Database Setup

### PostgreSQL
```sql
-- Create database
CREATE DATABASE defi_guardian_prod;

-- Create user
CREATE USER defi_guardian_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE defi_guardian_prod TO defi_guardian_user;
```

### Redis
```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server

# Test connection
redis-cli ping
```

## 🔒 Security Checklist

### Before Production Deployment
- [ ] Set strong JWT_SECRET
- [ ] Configure API_KEY for external access
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS origins
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure database backups
- [ ] Set up monitoring and logging

### Environment Variables
- [ ] All sensitive data in environment variables
- [ ] No hardcoded secrets in code
- [ ] Production database credentials
- [ ] API keys for external services
- [ ] WebSocket URLs for real-time features

## 📈 Monitoring & Health Checks

### Health Check Endpoints
- **API Health**: `GET /health`
- **WebSocket Status**: `GET /api/ws/status`
- **Demo Scan**: `GET /api/scan/demo`

### Monitoring Setup
```bash
# Check API health
curl https://your-api-domain.com/health

# Check WebSocket status
curl https://your-api-domain.com/api/ws/status
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm run deploy:vercel
```

## 🌐 Domain & SSL Setup

### Custom Domain
1. Configure DNS records
2. Set up SSL certificates (Let's Encrypt)
3. Update environment variables
4. Configure reverse proxy (Nginx)

### SSL Certificate
```bash
# Using Let's Encrypt
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Performance Optimization

### Frontend
- [ ] Enable gzip compression
- [ ] Optimize bundle size
- [ ] Implement caching strategies
- [ ] Use CDN for static assets

### Backend
- [ ] Database connection pooling
- [ ] Redis caching
- [ ] Rate limiting
- [ ] Load balancing

## 🚨 Troubleshooting

### Common Issues

#### API Not Starting
```bash
# Check logs
docker-compose logs api

# Check environment variables
docker-compose exec api env

# Check database connection
docker-compose exec api npm run test:db
```

#### WebSocket Connection Issues
```bash
# Check WebSocket status
curl https://your-api-domain.com/api/ws/status

# Check firewall settings
sudo ufw status

# Test WebSocket connection
wscat -c wss://your-api-domain.com
```

#### Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check Redis connection
redis-cli -u $REDIS_URL ping
```

## 📞 Support

For deployment issues:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Test health endpoints
4. Check network connectivity
5. Review security configurations

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker/docker-compose.prod.yml down
docker-compose -f docker/docker-compose.prod.yml up -d --build
```

### Database Migrations
```bash
# Run migrations
docker-compose exec api npm run migrate

# Backup before migration
docker-compose exec postgres pg_dump -U postgres defi_guardian_prod > backup.sql
```

---

**Ready for Production! 🚀**
