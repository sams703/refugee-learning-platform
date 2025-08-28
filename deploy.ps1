# PowerShell Deployment Script for Refugee Learning Platform
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("railway", "render", "heroku")]
    [string]$Platform,
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "refugee-learning-platform"
)

Write-Host "🚀 Deploying Refugee Learning Platform to $Platform" -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not initialized. Please run 'git init' first." -ForegroundColor Red
    exit 1
}

# Check if all files are committed
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes. Please commit all changes first." -ForegroundColor Yellow
    Write-Host "Uncommitted files:" -ForegroundColor Yellow
    git status --short
    exit 1
}

switch ($Platform) {
    "railway" {
        Write-Host "🚂 Deploying to Railway..." -ForegroundColor Cyan
        
        # Check if Railway CLI is installed
        if (-not (Get-Command "railway" -ErrorAction SilentlyContinue)) {
            Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
            npm install -g @railway/cli
        }
        
        # Login check
        try {
            railway whoami | Out-Null
        } catch {
            Write-Host "Please login to Railway first: railway login" -ForegroundColor Red
            exit 1
        }
        
        # Deploy
        Write-Host "Deploying to Railway..." -ForegroundColor Green
        railway up
        Write-Host "✅ Deployment to Railway completed!" -ForegroundColor Green
    }
    
    "render" {
        Write-Host "🎨 Deploying to Render..." -ForegroundColor Cyan
        Write-Host "Please follow these steps:" -ForegroundColor Yellow
        Write-Host "1. Go to https://render.com and connect your GitHub repository" -ForegroundColor White
        Write-Host "2. Import the render.yaml file from your repository root" -ForegroundColor White
        Write-Host "3. Render will automatically create all services and databases" -ForegroundColor White
        Write-Host "4. Monitor the deployment in the Render dashboard" -ForegroundColor White
        
        # Open browser to Render
        Start-Process "https://render.com"
    }
    
    "heroku" {
        Write-Host "🟣 Deploying to Heroku..." -ForegroundColor Cyan
        
        # Check if Heroku CLI is installed
        if (-not (Get-Command "heroku" -ErrorAction SilentlyContinue)) {
            Write-Host "❌ Heroku CLI not found. Please install it first:" -ForegroundColor Red
            Write-Host "https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Blue
            exit 1
        }
        
        # Login check
        try {
            heroku whoami | Out-Null
        } catch {
            Write-Host "Please login to Heroku first: heroku login" -ForegroundColor Red
            exit 1
        }
        
        # Check if app exists
        $appExists = heroku apps:info $AppName 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Creating new Heroku app: $AppName" -ForegroundColor Yellow
            heroku create $AppName
        }
        
        # Add addons
        Write-Host "Adding PostgreSQL database..." -ForegroundColor Yellow
        heroku addons:create heroku-postgresql:mini --app $AppName
        
        Write-Host "Adding Redis cache..." -ForegroundColor Yellow
        heroku addons:create heroku-redis:mini --app $AppName
        
        # Set environment variables
        Write-Host "Setting environment variables..." -ForegroundColor Yellow
        heroku config:set NODE_ENV=production --app $AppName
        
        # Generate JWT secret
        $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        heroku config:set JWT_SECRET=$jwtSecret --app $AppName
        
        # Deploy
        Write-Host "Deploying to Heroku..." -ForegroundColor Green
        git push heroku main
        
        # Run migrations
        Write-Host "Running database migrations..." -ForegroundColor Yellow
        heroku run "cd backend && npm run migrate" --app $AppName
        
        Write-Host "✅ Deployment to Heroku completed!" -ForegroundColor Green
        Write-Host "🌐 Your app is available at: https://$AppName.herokuapp.com" -ForegroundColor Blue
    }
}

Write-Host "`n🎉 Deployment process completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test your deployment by visiting the provided URL" -ForegroundColor White
Write-Host "2. Set up your custom domain if needed" -ForegroundColor White
Write-Host "3. Configure any additional environment variables" -ForegroundColor White
Write-Host "4. Set up monitoring and alerts" -ForegroundColor White
