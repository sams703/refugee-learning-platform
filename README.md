# Digital Learning Platform for Refugee and Rural Communities

## Overview
An offline-first, low-bandwidth digital learning platform designed specifically for refugee camps and rural areas. This platform provides quality education, digital skills training, and empowers marginalized communities with equal learning opportunities.

## Features
- **Offline Access**: Learning materials accessible without constant internet
- **Multilingual Content**: Support for local languages, English, and Swahili
- **Gamified Learning**: Quizzes, badges, and progress tracking for motivation
- **Digital Skills Training**: Coding, ICT, and entrepreneurship modules
- **Teacher Dashboard**: Analytics and progress monitoring tools
- **Low Bandwidth**: Optimized for areas with limited internet connectivity

## Architecture
```
├── backend/           # Node.js/Express API server
├── mobile-app/        # React Native mobile application
├── dashboard/         # Teacher/Admin web dashboard
├── content-cms/       # Content Management System
├── docs/             # Documentation and specifications
└── deployment/       # Docker and deployment configurations
```

## Technology Stack
- **Backend**: Node.js, Express, SQLite/PostgreSQL
- **Mobile**: React Native with offline storage
- **Web Dashboard**: React, TypeScript
- **Database**: SQLite for offline, PostgreSQL for server
- **Sync**: Custom offline-first synchronization

## Getting Started

### Prerequisites
- Node.js 18+ 
- React Native CLI
- Android Studio (for mobile development)
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd refugee-learning-platform

# Install backend dependencies
cd backend
npm install

# Install mobile app dependencies  
cd ../mobile-app
npm install

# Install dashboard dependencies
cd ../dashboard
npm install
```

## 🚀 Deployment

### One-Click Deploy Options

#### Railway (Recommended)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

#### Render (Free Tier)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

#### Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Manual Deployment
```bash
# Using our deployment script (Windows PowerShell)
.\deploy.ps1 -Platform railway
# or
.\deploy.ps1 -Platform render  
# or
.\deploy.ps1 -Platform heroku
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)

### Environment Setup
Copy the example environment files and configure:
```bash
# Backend configuration
cp backend/.env.example backend/.env
# Dashboard configuration  
cp dashboard/.env.example dashboard/.env
```

## SDG Alignment
This project directly contributes to:
- **SDG 4**: Quality Education - Inclusive and equitable quality education
- **SDG 8**: Decent Work - Skills for productive employment
- **SDG 10**: Reduced Inequalities - Equal digital opportunities

## License
MIT License - See LICENSE file for details

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
