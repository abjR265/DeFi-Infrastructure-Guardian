# Railway Deployment Guide - DeFi Infrastructure Guardian

This guide shows how to deploy both the **API backend** and **frontend website** to Railway.

## 🚀 **Railway Deployment Options**

### **Option 1: Deploy Both Services (Recommended)**

Railway can host both your API and frontend as separate services. Here's how:

#### **Step 1: Deploy API Service**
1. Go to [Railway Dashboard](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository: `abjR265/DeFi-Infrastructure-Guardian`
4. **Rename the service** to `api`
5. Set **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=3001
   ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/demo
   JWT_SECRET=your-production-secret
   API_KEY=your-api-key
   ```

#### **Step 2: Deploy Frontend Service**
1. In the same project, click **"New Service"** → **"GitHub Repo"**
2. Select the same repository: `abjR265/DeFi-Infrastructure-Guardian`
3. **Rename the service** to `web`
4. Set **Environment Variables**:
   ```env
   VITE_API_URL=https://your-api-service.railway.app
   VITE_WS_URL=wss://your-api-service.railway.app
   PORT=3000
   ```

#### **Step 3: Configure Build Settings**
- **API Service**: Uses `railway-api.json` configuration
- **Web Service**: Uses `railway-web.json` configuration

### **Option 2: Deploy Only API (Current Setup)**

If you only want the API on Railway and frontend elsewhere:

1. **API URL**: `https://your-api-service.railway.app`
2. **Health Check**: `https://your-api-service.railway.app/health`
3. **Demo Scan**: `https://your-api-service.railway.app/api/scan/demo`

## 🌐 **Frontend Deployment Alternatives**

### **Vercel (Recommended for Frontend)**
```bash
# Deploy frontend to Vercel
npm run deploy:vercel
```

### **Netlify**
```bash
# Deploy frontend to Netlify
npm run build
# Upload dist/ folder to Netlify
```

### **GitHub Pages**
```bash
# Deploy to GitHub Pages
npm run build
# Push dist/ to gh-pages branch
```

## 🔧 **Environment Configuration**

### **For Full-Stack Railway Deployment**

#### **API Service Variables:**
```env
NODE_ENV=production
PORT=3001
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/demo
JWT_SECRET=your-super-secret-production-key
API_KEY=your-production-api-key
FRONTEND_URL=https://your-web-service.railway.app
```

#### **Web Service Variables:**
```env
VITE_API_URL=https://your-api-service.railway.app
VITE_WS_URL=wss://your-api-service.railway.app
PORT=3000
```

## 📊 **Service URLs**

After deployment, you'll get:

### **API Service:**
- **URL**: `https://your-api-service.railway.app`
- **Health**: `https://your-api-service.railway.app/health`
- **Demo**: `https://your-api-service.railway.app/api/scan/demo`

### **Web Service:**
- **URL**: `https://your-web-service.railway.app`
- **Dashboard**: `https://your-web-service.railway.app`

## 🎯 **Recommended Setup**

### **For MVP/Demo:**
- **API**: Railway
- **Frontend**: Vercel (easier, faster)

### **For Production:**
- **API**: Railway
- **Frontend**: Railway (same project, easier management)

## 🔍 **Testing Your Deployment**

### **API Endpoints:**
```bash
# Health check
curl https://your-api-service.railway.app/health

# Demo scan
curl https://your-api-service.railway.app/api/scan/demo

# WebSocket status
curl https://your-api-service.railway.app/api/ws/status
```

### **Frontend:**
- Visit your web service URL
- Test the dashboard functionality
- Check WebSocket connections

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Build fails**: Check platform dependencies
2. **Healthcheck fails**: Verify start command
3. **WebSocket issues**: Check CORS settings
4. **API not responding**: Check environment variables

### **Logs:**
- Check Railway logs for each service
- Verify environment variables are set
- Test endpoints individually

---

**Ready to deploy! Choose your preferred option above.** 🚀
