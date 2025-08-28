# Static Deployment Guide for Render

Instead of using the blueprint (render.yaml), deploy each service individually as static/web services.

## 📋 Deployment Steps

### 1. 🗄️ Set Up External Database (Free Options)

Choose one of these free database services:
- **Supabase**: Go to supabase.com, create project, get connection string
- **Railway**: Go to railway.app, create PostgreSQL service 
- **Neon**: Go to neon.tech, create database
- **PlanetScale**: Go to planetscale.com (MySQL)

### 2. 🚀 Deploy Backend (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `refugee-learning-platform`
4. Configure:
   - **Name**: `refugee-learning-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm ci`
   - **Start Command**: `npm start` 
   - **Plan**: `Starter (Free)`
   - **Root Directory**: `backend`
   - **Branch**: `main`

5. **Environment Variables**:
   ```
   NODE_ENV = production
   DB_TYPE = pg
   DATABASE_URL = postgresql://user:pass@host:port/dbname
   JWT_SECRET = (let Render auto-generate)
   ```

### 3. 🌐 Deploy Frontend (Static Site)

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository: `refugee-learning-platform`
3. Configure:
   - **Name**: `refugee-learning-dashboard`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `build`
   - **Root Directory**: `dashboard`
   - **Branch**: `main`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://refugee-learning-backend.onrender.com/api
   ```
   *(Replace with your actual backend URL)*

### 4. ✅ Verify Deployment

- Backend will be available at: `https://refugee-learning-backend.onrender.com`
- Frontend will be available at: `https://refugee-learning-dashboard.onrender.com`
- Static sites are always-on and free
- Web services (backend) sleep after 15 minutes of inactivity

## 🆓 Cost Breakdown

- **Frontend (Static Site)**: Completely free, always-on
- **Backend (Web Service)**: Free starter plan, sleeps when inactive  
- **Database**: Free external service (500MB-1GB typically)

## 📝 Notes

- Remove `render.yaml` from root since you're not using blueprints
- Each service deploys independently
- Easier to manage and troubleshoot individual services
- No blueprint validation issues
