# DeFi Infrastructure Guardian - Deployment Guide

## 🚀 **Recommended Deployment: Vercel + Render**

### **Architecture:**
- **Frontend:** Vercel (React/Vite app)
- **Backend:** Render (Node.js API)
- **Database:** PostgreSQL (Render Postgres - optional)
- **Cache:** Redis (Render Redis - optional)

---

## 📋 **Prerequisites**

1. **GitHub Account** with the repository
2. **Vercel Account** ([vercel.com](https://vercel.com))
3. **Render Account** ([render.com](https://render.com))

---

## 🎨 **Frontend Deployment (Vercel)**

### **Step 1: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"New Project"**
3. Import your repository: `abjR265/DeFi-Infrastructure-Guardian`
4. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### **Step 2: Set Environment Variables**
In Vercel project settings → Environment Variables:
```
VITE_API_URL=https://your-render-api-url.onrender.com
VITE_WS_URL=wss://your-render-api-url.onrender.com
```

### **Step 3: Deploy**
Click **"Deploy"** - Vercel will automatically build and deploy your frontend.

---

## 🔧 **Backend Deployment (Render)**

### **Step 1: Deploy API Service**
1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your repository: `abjR265/DeFi-Infrastructure-Guardian`
4. **Configure:**
   - **Name:** `defi-guardian-api`
   - **Root Directory:** `railway-api`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

### **Step 2: Set Environment Variables**
In Render service settings → Environment:
```
NODE_ENV=production
PORT=3001
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/demo
JWT_SECRET=your_jwt_secret_here
API_KEY=your_api_key_here
```

### **Step 3: Deploy**
Click **"Create Web Service"** - Render will build and deploy your API.

---

## 🔗 **Connect Frontend to Backend**

### **Step 1: Get Backend URL**
After Render deployment, copy your API URL (e.g., `https://defi-guardian-api.onrender.com`)

### **Step 2: Update Frontend Environment**
In Vercel → Project Settings → Environment Variables:
```
VITE_API_URL=https://defi-guardian-api.onrender.com
VITE_WS_URL=wss://defi-guardian-api.onrender.com
```

### **Step 3: Redeploy Frontend**
Vercel will automatically redeploy with the new environment variables.

---

## 🗄️ **Database Setup (Optional)**

### **PostgreSQL on Render**
1. In Render dashboard, click **"New"** → **"PostgreSQL"**
2. **Configure:**
   - **Name:** `defi-guardian-db`
   - **Plan:** Free
3. Copy the **Internal Database URL**
4. Add to API environment variables:
   ```
   DATABASE_URL=postgresql://...
   ```

### **Redis on Render (Optional)**
1. In Render dashboard, click **"New"** → **"Redis"**
2. **Configure:**
   - **Name:** `defi-guardian-redis`
   - **Plan:** Free
3. Copy the **Internal Redis URL**
4. Add to API environment variables:
   ```
   REDIS_URL=redis://...
   ```

---

## 🔐 **Security Configuration**

### **Environment Variables**
Ensure these are set in Render (API service):
```
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
API_KEY=your_secure_api_key
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### **CORS Configuration**
The API is configured to accept requests from your Vercel domain.

---

## 📊 **Monitoring & Logs**

### **Vercel (Frontend)**
- **Logs:** Project → Functions → View Function Logs
- **Analytics:** Project → Analytics
- **Performance:** Project → Speed Insights

### **Render (Backend)**
- **Logs:** Service → Logs tab
- **Metrics:** Service → Metrics tab
- **Health Checks:** Service → Health tab

---

## 🔄 **Continuous Deployment**

Both Vercel and Render automatically deploy when you push to the `main` branch.

### **Deployment Flow:**
1. Push changes to GitHub
2. Vercel automatically deploys frontend
3. Render automatically deploys backend
4. Both services are updated simultaneously

---

## 🚨 **Troubleshooting**

### **Frontend Issues (Vercel)**
- **Build Failures:** Check Vercel build logs
- **Environment Variables:** Verify `VITE_API_URL` is set correctly
- **CORS Errors:** Ensure API CORS is configured for Vercel domain

### **Backend Issues (Render)**
- **Build Failures:** Check Render build logs
- **Runtime Errors:** Check Render service logs
- **Environment Variables:** Verify all required variables are set

### **Connection Issues**
- **API Not Found:** Check `VITE_API_URL` points to correct Render URL
- **WebSocket Issues:** Ensure `VITE_WS_URL` uses `wss://` protocol
- **CORS Errors:** Verify API CORS configuration

---

## 📈 **Scaling**

### **Vercel (Frontend)**
- **Free Tier:** 100GB bandwidth/month
- **Pro Plan:** Unlimited bandwidth, custom domains
- **Enterprise:** Advanced features, priority support

### **Render (Backend)**
- **Free Tier:** 750 hours/month, sleeps after 15 minutes
- **Paid Plans:** Always-on, custom domains, SSL
- **Auto-scaling:** Available on paid plans

---

## 🔧 **Local Development**

### **Frontend (Vercel)**
```bash
cd apps/web
npm install
npm run dev
```

### **Backend (Render)**
```bash
cd railway-api
npm install
npm run dev
```

### **Environment Variables**
Create `.env` files for local development:
- `apps/web/.env.local`
- `railway-api/.env`

---

## 📞 **Support**

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Render Documentation:** [render.com/docs](https://render.com/docs)
- **GitHub Issues:** [github.com/abjR265/DeFi-Infrastructure-Guardian/issues](https://github.com/abjR265/DeFi-Infrastructure-Guardian/issues)

---

## 🎯 **Success Metrics**

After deployment, verify:
- ✅ Frontend loads at `https://your-app.vercel.app`
- ✅ API responds at `https://your-api.onrender.com`
- ✅ Frontend can connect to API
- ✅ Real-time WebSocket connections work
- ✅ Health checks pass
- ✅ Logs show no errors
