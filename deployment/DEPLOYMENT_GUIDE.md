# 🚀 Deployment Guide for Refugee Learning Platform

This guide provides step-by-step instructions for deploying your Digital Learning Platform to various Platform-as-a-Service (PaaS) providers.

## 📋 Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally (for testing)
- Account on your chosen deployment platform

## 🎯 Quick Deploy Options

### 1. Railway (Recommended for Beginners)

**Deploy with one click:**
1. Push your code to GitHub
2. Visit [railway.app](https://railway.app)
3. Click "Start a New Project"
4. Connect your GitHub repository
5. Railway will auto-detect and deploy both services

**Manual setup:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add PostgreSQL database
railway add postgresql

# Deploy
railway up
```

**Environment Variables to Set:**
- `JWT_SECRET` - Generate a secure random string
- `NODE_ENV` - Set to "production"
- Database variables are auto-configured

### 2. Render (Great Free Tier)

**Deploy via Dashboard:**
1. Connect your GitHub repository to Render
2. Import the `render.yaml` file (included in root)
3. Render will automatically:
   - Create backend service
   - Create frontend service  
   - Set up PostgreSQL database
   - Configure environment variables

**Manual setup:**
1. Create new "Web Service" for backend:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node
2. Create new "Static Site" for dashboard:
   - Build Command: `cd dashboard && npm install && npm run build`
   - Publish Directory: `dashboard/build`
3. Create PostgreSQL database
4. Link services with environment variables

### 3. Heroku (Enterprise Ready)

**One-click deploy:**
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

**Manual deployment:**
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create refugee-learning-platform

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Add Redis (optional)
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Deploy
git push heroku main
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
DB_TYPE=pg
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_secret_key
```

### Dashboard (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 🗄️ Database Setup

### PostgreSQL Migration
After deployment, run migrations:
```bash
# On Railway
railway run npm run migrate

# On Render (via dashboard or CLI)
render exec npm run migrate

# On Heroku
heroku run npm run migrate
```

### Seed Data (Optional)
```bash
# Add sample data
npm run seed
```

## 📱 Mobile App Configuration

Update the API URL in your mobile app:
```javascript
// mobile-app/src/config/api.js
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 🔒 SSL & Custom Domain

### Railway
- SSL is automatic
- Custom domain: Settings → Domains → Add Domain

### Render  
- SSL is automatic
- Custom domain: Service → Settings → Custom Domains

### Heroku
- SSL is automatic on paid plans
- Custom domain: `heroku domains:add your-domain.com`

## 🚦 Health Checks

All platforms include health check endpoints:
- Backend: `GET /health`
- Dashboard: `GET /` (returns 200 if app is loaded)

## 📊 Monitoring & Logs

### Railway
```bash
railway logs
```

### Render
- View logs in dashboard
- Real-time logging available

### Heroku
```bash
heroku logs --tail
```

## 🔄 CI/CD Setup

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
      - name: Deploy to Railway
        run: |
          # Your deployment commands here
```

## 🧪 Testing Deployment

1. **Backend API Test:**
```bash
curl https://your-backend-url.com/health
```

2. **Dashboard Test:**
   - Open browser to your frontend URL
   - Verify dashboard loads correctly
   - Test login functionality

3. **Database Connection:**
   - Register a new user
   - Create test content
   - Verify data persistence

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Failed:**
   - Check environment variables
   - Verify database is running
   - Check firewall settings

2. **API Not Loading:**
   - Verify CORS configuration
   - Check API URL in frontend
   - Confirm backend is running

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are included
   - Review build logs

### Platform-Specific Issues:

**Railway:**
- If build fails, check build logs in dashboard
- Verify Nixpacks detection is correct

**Render:**
- Static site builds can take 5-15 minutes
- Check build command matches your setup

**Heroku:**
- Ensure Procfile is in root directory
- Check dyno is not sleeping (free tier)

## 💰 Cost Estimates

| Platform | Backend | Database | Frontend | Total/Month |
|----------|---------|----------|----------|-------------|
| Railway  | $5      | $5       | Free     | $10         |
| Render   | Free    | Free     | Free     | $0          |
| Heroku   | $7      | $9       | Free     | $16         |

*Free tiers have limitations on usage and uptime*

## 📞 Support

- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)
- Heroku: [devcenter.heroku.com](https://devcenter.heroku.com)

## 🔄 Updates & Maintenance

### Updating Your App:
1. Push changes to your Git repository
2. Platforms will automatically redeploy
3. Monitor deployment logs for any issues

### Database Backups:
- Railway: Automatic backups included
- Render: Manual backups via dashboard  
- Heroku: `heroku pg:backups:capture`

---

## 🎉 Next Steps

After successful deployment:
1. Set up custom domain
2. Configure email notifications
3. Set up monitoring and alerts
4. Plan for scaling as user base grows
5. Implement proper backup strategies

For questions or issues, check the troubleshooting section or contact support.
