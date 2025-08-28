# Digital Learning Platform Installation Guide

## Overview
This guide will help you set up and deploy the Digital Learning Platform for Refugee and Rural Communities.

## Prerequisites
- Node.js 18+ 
- Docker and Docker Compose (for production deployment)
- Git
- Android Studio (for mobile app development)
- PostgreSQL (for production) or SQLite will work for development

## Quick Start (Development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd refugee-learning-platform
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# For development, you can use the defaults (SQLite database)

# Run database migrations
npm run migrate

# Seed database with initial data
npm run seed

# Start development server
npm run dev
```

The backend will be running at `http://localhost:3001`

### 3. Mobile App Setup (React Native)
```bash
cd mobile-app

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### 4. Teacher Dashboard Setup
```bash
cd dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update REACT_APP_API_URL to point to your backend
# REACT_APP_API_URL=http://localhost:3001/api

# Start development server
npm start
```

The dashboard will be running at `http://localhost:3000`

## Production Deployment

### Using Docker Compose (Recommended)

1. **Prepare Environment Variables**
   ```bash
   # Copy docker-compose.yml and update environment variables
   # Change default passwords and JWT secrets
   ```

2. **Deploy with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up -d

   # View logs
   docker-compose logs -f

   # Stop services
   docker-compose down
   ```

3. **Access the Application**
   - API: `http://localhost:3001`
   - Dashboard: `http://localhost:3000`
   - Database: `localhost:5432`

### Manual Production Deployment

#### Backend Deployment
```bash
cd backend

# Install production dependencies
npm ci --only=production

# Set environment variables
export NODE_ENV=production
export DB_TYPE=pg
export DB_HOST=your-postgres-host
export DB_PORT=5432
export DB_NAME=refugee_learning_platform
export DB_USER=your-db-user
export DB_PASSWORD=your-db-password
export JWT_SECRET=your-secure-jwt-secret

# Run migrations
npm run migrate

# Start production server
npm start
```

#### Dashboard Deployment
```bash
cd dashboard

# Install dependencies
npm install

# Build for production
npm run build

# Serve with nginx or your preferred web server
# Copy build/ directory to your web server
```

### Mobile App Deployment

#### Android APK Build
```bash
cd mobile-app

# Generate signed APK
npm run build:android

# The APK will be generated in:
# android/app/build/outputs/apk/release/app-release.apk
```

#### iOS Build (macOS only)
```bash
cd mobile-app

# Open Xcode project
open ios/RefugeeLearningPlatform.xcworkspace

# Build and archive in Xcode for App Store deployment
```

## Configuration

### Database Configuration
- **Development**: SQLite (default, no setup required)
- **Production**: PostgreSQL (recommended)

### Environment Variables
Key environment variables to configure:

**Backend (.env):**
```
NODE_ENV=production
PORT=3001
DB_TYPE=pg
DB_HOST=localhost
DB_PORT=5432
DB_NAME=refugee_learning_platform
DB_USER=username
DB_PASSWORD=password
JWT_SECRET=your-super-secure-secret
```

**Dashboard (.env):**
```
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENVIRONMENT=production
```

## Security Considerations

### Production Checklist
- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set up regular database backups
- [ ] Enable API rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets

### SSL/HTTPS Setup
For production deployment, enable HTTPS:
```bash
# Install certbot for Let's Encrypt
sudo apt-get install certbot

# Generate SSL certificates
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx with SSL (see deployment/nginx/nginx.conf)
```

## Monitoring and Maintenance

### Health Checks
- Backend health endpoint: `GET /health`
- Database connection monitoring
- Log aggregation with Docker logs

### Backup Strategy
```bash
# Database backup
pg_dump refugee_learning_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql refugee_learning_platform < backup_file.sql
```

### Updates
```bash
# Update backend
cd backend
git pull origin main
npm install
npm run migrate
docker-compose restart backend

# Update mobile app
# Rebuild and redistribute APK/iOS app
```

## Offline Functionality

The platform is designed to work offline:
- Mobile app stores content locally using SQLite
- Automatic sync when connectivity is restored
- Content can be pre-downloaded for areas with limited internet

## Scaling Considerations

For larger deployments:
- Use PostgreSQL with read replicas
- Implement Redis for caching
- Use CDN for static content
- Implement horizontal scaling with load balancers
- Consider Kubernetes deployment for container orchestration

## Support and Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Ensure database server is running
   - Verify network connectivity

2. **Mobile App Build Errors**
   - Clean and rebuild: `npx react-native clean`
   - Check Node.js version compatibility
   - Ensure Android SDK is properly configured

3. **API Endpoints Not Working**
   - Check backend logs: `docker-compose logs backend`
   - Verify environment variables
   - Check firewall and network settings

### Getting Help
- Check application logs
- Review error messages
- Consult the troubleshooting section in README.md
- Open GitHub issues for bugs or feature requests

## Contributing
Please read CONTRIBUTING.md for guidelines on contributing to this project.

## License
This project is licensed under the MIT License - see LICENSE file for details.
