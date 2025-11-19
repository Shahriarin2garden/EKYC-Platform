# 🚀 EKYC Platform - Render.com Deployment Guide

Complete step-by-step guide for deploying the EKYC Platform to Render.com (Free Tier).

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture on Render](#architecture-on-render)
- [Pre-Deployment Setup](#pre-deployment-setup)
- [Deployment Methods](#deployment-methods)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**Render.com** is a modern cloud platform that offers free hosting for web applications. This guide will help you deploy the full EKYC Platform stack including:

- ✅ **Backend API** (Node.js/Express)
- ✅ **Frontend** (React/TypeScript)
- ✅ **MongoDB Database** (via MongoDB Atlas - free tier)
- ✅ **RabbitMQ** (via CloudAMQP - free tier)

### Why Render.com?

- 🆓 **Generous Free Tier**: 750 hours/month for web services
- 🔄 **Auto-Deploy**: Automatic deployments from Git
- 🐳 **Docker Support**: Native Docker container support
- 🌐 **Free SSL**: Automatic HTTPS certificates
- 📊 **Built-in Monitoring**: Logs and metrics included
- 🚀 **Zero DevOps**: No server management needed

---

## ✅ Prerequisites

### Required Accounts (All Free)

1. **GitHub Account** - For code repository
   - Sign up: https://github.com/join

2. **Render Account** - For hosting
   - Sign up: https://render.com/

3. **MongoDB Atlas Account** - For database
   - Sign up: https://www.mongodb.com/cloud/atlas/register

4. **CloudAMQP Account** - For message queue
   - Sign up: https://customer.cloudamqp.com/signup

### Required Tools

- Git (for version control)
- Text editor (VS Code recommended)
- Web browser

---

## 🏗️ Architecture on Render

```
┌─────────────────────────────────────────────────────────────┐
│                         Render.com                          │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │  Frontend (Free) │         │  Backend (Free)  │        │
│  │   Static Site    │────────▶│   Web Service    │        │
│  │  React + Nginx   │         │   Node.js API    │        │
│  └──────────────────┘         └──────────────────┘        │
│                                        │                    │
└────────────────────────────────────────┼────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
         ┌──────────▼────────┐  ┌───────▼────────┐          │
         │  MongoDB Atlas    │  │   CloudAMQP    │          │
         │  (External-Free)  │  │ (External-Free)│          │
         │    Database       │  │  Message Queue │          │
         └───────────────────┘  └────────────────┘          │
                                                             │
                    External Free Services                   │
                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Pre-Deployment Setup

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Add GitHub remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/EKYC-Platform.git

# Push to GitHub
git push -u origin master
```

### Step 2: Setup MongoDB Atlas

1. **Create Account & Cluster**:
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Click "Create" → "Shared" (Free tier)
   - Choose **AWS** provider and nearest region
   - Cluster name: `ekyc-cluster`
   - Click "Create Cluster"

2. **Configure Database Access**:
   - Go to "Database Access" → "Add New Database User"
   - Username: `ekyc_user`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

3. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://ekyc_user:<password>@ekyc-cluster.xxxxx.mongodb.net/ekyc_db?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Save this connection string!

### Step 3: Setup CloudAMQP (RabbitMQ)

1. **Create Account**:
   - Go to https://customer.cloudamqp.com/signup
   - Sign up (free account)

2. **Create Instance**:
   - Click "Create New Instance"
   - Name: `ekyc-rabbitmq`
   - Plan: **Lemur** (Free)
   - Region: Choose nearest
   - Click "Create instance"

3. **Get Connection URL**:
   - Click on your instance name
   - Copy the **AMQP URL**
   - Format: `amqps://user:pass@xxx.cloudamqp.com/xxx`
   - Save this URL!

### Step 4: Generate JWT Secret

Generate a strong JWT secret:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Online generator
# Visit: https://www.uuidgenerator.net/
```

Save the generated secret!

### Step 5: (Optional) Get OpenRouter API Key

If you want AI-powered KYC analysis:

1. Go to https://openrouter.ai/keys
2. Sign up and create an API key
3. Save the key

---

## 🚀 Deployment Methods

### Method 1: Using render.yaml (Recommended - Easiest)

This method uses Infrastructure as Code to deploy everything automatically.

#### Step 1: Verify render.yaml

The `render.yaml` file is already created in your repository. It defines:
- Backend web service
- Frontend static site
- Environment variables
- Service dependencies

#### Step 2: Deploy to Render

1. **Login to Render**:
   - Go to https://dashboard.render.com/

2. **Create New Blueprint**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub account if not already connected
   - Select your repository: `EKYC-Platform`
   - Render will detect `render.yaml`
   - Click "Apply"

3. **Add Environment Variables**:
   
   Render will create services automatically, but you need to add secrets:
   
   **For Backend Service**:
   - Go to "ekyc-backend" service
   - Click "Environment" tab
   - Add these variables:
   
   ```
   MONGODB_URI=mongodb+srv://ekyc_user:YOUR_PASSWORD@ekyc-cluster.xxxxx.mongodb.net/ekyc_db
   RABBITMQ_URL=amqps://user:pass@xxx.cloudamqp.com/xxx
   JWT_SECRET=your_generated_secret_here
   OPENROUTER_API_KEY=your_api_key_here (optional)
   ```

4. **Trigger Deployment**:
   - Services will automatically build and deploy
   - Wait for build to complete (5-10 minutes)

#### Step 3: Get Service URLs

After deployment completes:
- Backend URL: `https://ekyc-backend.onrender.com`
- Frontend URL: `https://ekyc-frontend.onrender.com`

### Method 2: Manual Service Creation

If you prefer manual control:

#### Create Backend Service

1. **New Web Service**:
   - Click "New +" → "Web Service"
   - Connect repository: `EKYC-Platform`
   - Name: `ekyc-backend`
   - Region: Oregon (Free)
   - Branch: `master`
   - Root Directory: Leave empty
   - Runtime: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Plan: **Free**

2. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://ekyc_user:PASSWORD@cluster.mongodb.net/ekyc_db
   RABBITMQ_URL=amqps://user:pass@host.cloudamqp.com/vhost
   JWT_SECRET=your_secret_here
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://ekyc-frontend.onrender.com
   OPENROUTER_API_KEY=your_key (optional)
   ```

3. **Add Health Check**:
   - Health Check Path: `/api/health`

4. **Click "Create Web Service"**

#### Create Frontend Service

1. **New Static Site**:
   - Click "New +" → "Static Site"
   - Connect repository: `EKYC-Platform`
   - Name: `ekyc-frontend`
   - Branch: `master`
   - Root Directory: Leave empty
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
   - Plan: **Free**

2. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://ekyc-backend.onrender.com/api
   ```
   
   **Important**: Replace with your actual backend URL!

3. **Configure Routes** (for SPA):
   - Add Rewrite Rule:
   - Source: `/*`
   - Destination: `/index.html`

4. **Click "Create Static Site"**

---

## ⚙️ Post-Deployment Configuration

### Step 1: Verify Backend Deployment

Test backend health endpoint:

```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### Step 2: Update CORS Settings

If you get CORS errors:

1. Update `FRONTEND_URL` in backend environment variables
2. Set it to your actual frontend URL: `https://ekyc-frontend.onrender.com`
3. Redeploy backend (click "Manual Deploy" → "Clear build cache & deploy")

### Step 3: Test Frontend

1. Visit: `https://your-frontend.onrender.com`
2. Try accessing the admin login page
3. Test API connectivity

### Step 4: Create First Admin User

Use a tool like Postman or curl:

```bash
curl -X POST https://your-backend.onrender.com/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```

### Step 5: Test Complete Flow

1. Login as admin
2. Create a KYC request
3. Verify PDF generation works
4. Check RabbitMQ processing

---

## 📊 Monitoring and Maintenance

### View Logs

**Backend Logs**:
1. Go to Render Dashboard
2. Click on "ekyc-backend" service
3. Click "Logs" tab
4. View real-time logs

**Frontend Logs**:
1. Static sites don't have runtime logs
2. Build logs available in "Events" tab

### Monitor Service Health

**Render Dashboard**:
- Shows service status (Running/Failed)
- Request metrics
- Response times
- Error rates

### Auto-Deploy Setup

**Already configured** if using render.yaml:
- Any push to `master` branch triggers auto-deploy
- Pull request previews can be enabled

### Scaling (Future)

When ready to scale:
- Upgrade to paid plans for better performance
- Add custom domains
- Enable CDN for frontend
- Add database replicas

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failed

**Symptom**: Build fails during npm install

**Solutions**:
- Check `package.json` is present
- Verify Node version compatibility
- Check build logs for specific errors
- Try: "Manual Deploy" → "Clear build cache & deploy"

#### 2. Database Connection Failed

**Symptom**: Backend logs show MongoDB connection error

**Solutions**:
- Verify MongoDB URI format
- Check username/password are correct
- Ensure IP whitelist includes `0.0.0.0/0` in Atlas
- Test connection string locally first

#### 3. RabbitMQ Connection Error

**Symptom**: RabbitMQ connection timeout

**Solutions**:
- Verify CloudAMQP URL is correct
- Check CloudAMQP instance is active
- Ensure using `amqps://` (with 's') for SSL
- Test in CloudAMQP dashboard

#### 4. CORS Errors

**Symptom**: Frontend can't connect to backend

**Solutions**:
- Verify `FRONTEND_URL` in backend matches actual frontend URL
- Check both services are deployed and running
- Ensure frontend is using correct `REACT_APP_API_URL`
- Redeploy both services if URLs changed

#### 5. Frontend Shows White Screen

**Symptom**: Frontend loads but shows nothing

**Solutions**:
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Ensure rewrite rule is configured: `/* → /index.html`
- Check frontend build logs for errors

#### 6. Service Sleeps/Slow Start

**Symptom**: First request takes 30+ seconds

**Solution**:
- This is normal for Render free tier
- Services sleep after 15 minutes of inactivity
- First request "wakes up" the service
- Consider paid plan for always-on services

### Get Help

**Render Support**:
- Community Forum: https://community.render.com/
- Documentation: https://render.com/docs
- Status Page: https://status.render.com/

**MongoDB Atlas**:
- Support: https://www.mongodb.com/cloud/atlas/support
- Documentation: https://docs.atlas.mongodb.com/

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Backend service is running
- [ ] Frontend site is accessible
- [ ] Health check endpoint responds
- [ ] Database connection works
- [ ] RabbitMQ connection works
- [ ] Admin can register
- [ ] Admin can login
- [ ] KYC form can be submitted
- [ ] PDF generation works
- [ ] All API endpoints respond correctly

---

## 🚀 Next Steps

1. **Custom Domain** (Optional):
   - Add your custom domain in Render
   - Update DNS settings
   - SSL automatically configured

2. **Monitoring** (Optional):
   - Setup UptimeRobot for uptime monitoring
   - Configure Sentry for error tracking
   - Add Google Analytics

3. **CI/CD** (Optional):
   - Setup GitHub Actions for tests
   - Add pre-deployment checks
   - Configure staging environment

4. **Performance**:
   - Enable caching
   - Optimize images
   - Use CDN for static assets

5. **Security**:
   - Review security headers
   - Setup rate limiting
   - Enable 2FA for accounts
   - Regular dependency updates

---

## 📚 Additional Resources

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **CloudAMQP Docs**: https://www.cloudamqp.com/docs/
- **React Deployment**: https://create-react-app.dev/docs/deployment/
- **Express Production Best Practices**: https://expressjs.com/en/advanced/best-practice-performance.html

---

## 💡 Tips for Free Tier

1. **Service Sleep**: Services sleep after 15 min inactivity
   - Use UptimeRobot to ping your service every 14 minutes
   - Free: https://uptimerobot.com/

2. **Build Minutes**: Limited build time per month
   - Optimize build process
   - Avoid unnecessary rebuilds
   - Use caching effectively

3. **Database Size**: MongoDB Atlas free tier is 512MB
   - Monitor database size
   - Implement data retention policies
   - Archive old records

4. **Bandwidth**: Render free tier includes 100GB/month
   - Optimize asset sizes
   - Use image compression
   - Implement lazy loading

---

## 🎊 Congratulations!

Your EKYC Platform is now live on Render.com! 🚀

**Your URLs**:
- Frontend: `https://ekyc-frontend.onrender.com`
- Backend: `https://ekyc-backend.onrender.com`

Share your application and start processing KYC requests!

For questions or issues, refer to the troubleshooting section or reach out to Render support.

Happy deploying! 🎉
