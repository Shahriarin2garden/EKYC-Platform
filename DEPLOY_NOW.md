# 🚀 DEPLOY NOW - Step-by-Step Instructions

## ✅ Prerequisites Ready

You have:
- ✅ CloudAMQP URL configured
- ✅ Code pushed to GitHub
- ✅ JWT Secret generated

## 📋 Your Configuration

### CloudAMQP (RabbitMQ) - ✅ READY
```
RABBITMQ_URL=amqps://jfbevait:RqDZw0lHLnuG2zAqNiNPYz7GmMPC5kwa@fuji.lmq.cloudamqp.com/jfbevait
```

### JWT Secret - ✅ GENERATED
```
JWT_SECRET=1e1313b8776d23f0450e3749e73243812bcc9e200f73d2a2e415c0b30fc906ef
```

### MongoDB Atlas - ⚠️ NEEDS SETUP

## 🎯 Step 1: Setup MongoDB Atlas (5 minutes)

### Option A: If you already have MongoDB Atlas

If you have an existing MongoDB connection string, skip to Step 2.

### Option B: Create new MongoDB Atlas cluster

1. **Sign up for MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Free Cluster**
   - Click "Build a Database"
   - Choose "Shared" (FREE tier)
   - Provider: AWS
   - Region: Choose closest to you
   - Cluster Name: `ekyc-cluster`
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `ekyc_user`
   - Password: Click "Autogenerate Secure Password" → **COPY IT!**
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string
   - Format: `mongodb+srv://ekyc_user:<password>@ekyc-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://ekyc_user:PASSWORD@ekyc-cluster.xxxxx.mongodb.net/ekyc_db?retryWrites=true&w=majority`
   - **SAVE THIS CONNECTION STRING!**

## 🚀 Step 2: Deploy to Render.com (10 minutes)

### 2.1 Sign Up & Connect GitHub

1. **Create Render Account**
   - Go to: https://render.com/
   - Click "Get Started for Free"
   - Sign up with GitHub (recommended) or email

2. **Connect GitHub**
   - If you signed up with email, go to Account Settings
   - Connect your GitHub account
   - Authorize Render to access your repositories

### 2.2 Deploy Using Blueprint (Easiest Method)

1. **Navigate to Dashboard**
   - Go to: https://dashboard.render.com/

2. **Create New Blueprint**
   - Click "New +" button (top right)
   - Select "Blueprint"
   
3. **Connect Repository**
   - Repository: Select `EKYC-Platform`
   - Branch: `master`
   - Render will automatically detect `render.yaml`
   - Click "Apply"

4. **Wait for Services to Be Created**
   - Render will create:
     - `ekyc-backend` (Web Service)
     - `ekyc-frontend` (Static Site)
   - This takes about 2-3 minutes

### 2.3 Configure Backend Environment Variables

1. **Go to Backend Service**
   - In Render dashboard, click on `ekyc-backend` service

2. **Add Environment Variables**
   - Click "Environment" tab (left sidebar)
   - Click "Add Environment Variable" for each:

```env
NODE_ENV=production
PORT=5000

MONGODB_URI=mongodb+srv://ekyc_user:YOUR_PASSWORD@ekyc-cluster.xxxxx.mongodb.net/ekyc_db?retryWrites=true&w=majority

RABBITMQ_URL=amqps://jfbevait:RqDZw0lHLnuG2zAqNiNPYz7GmMPC5kwa@fuji.lmq.cloudamqp.com/jfbevait

JWT_SECRET=1e1313b8776d23f0450e3749e73243812bcc9e200f73d2a2e415c0b30fc906ef

JWT_EXPIRES_IN=7d

FRONTEND_URL=https://ekyc-frontend.onrender.com

OPENROUTER_API_KEY=
```

   **IMPORTANT**: Replace `YOUR_PASSWORD` in MONGODB_URI with your actual MongoDB password!

3. **Save Changes**
   - Scroll down and click "Save Changes"
   - Backend will automatically redeploy

### 2.4 Configure Frontend Environment Variables

1. **Get Backend URL First**
   - Go to `ekyc-backend` service
   - Copy the URL (top of page): `https://ekyc-backend-XXXX.onrender.com`

2. **Go to Frontend Service**
   - In Render dashboard, click on `ekyc-frontend` service

3. **Add Environment Variable**
   - Click "Environment" tab
   - Add this variable:

```env
REACT_APP_API_URL=https://ekyc-backend-XXXX.onrender.com/api
```

   **IMPORTANT**: Replace with your actual backend URL!

4. **Save Changes**
   - Click "Save Changes"
   - Frontend will automatically rebuild and redeploy

### 2.5 Update Backend FRONTEND_URL

1. **Get Frontend URL**
   - Go to `ekyc-frontend` service
   - Copy the URL: `https://ekyc-frontend-XXXX.onrender.com`

2. **Update Backend**
   - Go back to `ekyc-backend` service
   - Click "Environment" tab
   - Update `FRONTEND_URL` with your actual frontend URL
   - Save changes

## ⏱️ Wait for Deployment (5-10 minutes)

Both services will now build and deploy:

1. **Monitor Backend Deployment**
   - Go to `ekyc-backend` → "Logs" tab
   - Watch for "Build succeeded"
   - Watch for "Your service is live"
   - Look for: "MongoDB connected" and "RabbitMQ connected"

2. **Monitor Frontend Deployment**
   - Go to `ekyc-frontend` → "Logs" tab
   - Watch for "Build succeeded"
   - Watch for "Your service is live"

## ✅ Step 3: Verify Deployment (5 minutes)

### 3.1 Test Backend Health

Open PowerShell and run:

```powershell
# Replace with your actual backend URL
curl https://ekyc-backend-XXXX.onrender.com/api/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"2024-11-20T..."}
```

### 3.2 Test Frontend

1. Visit your frontend URL in browser: `https://ekyc-frontend-XXXX.onrender.com`
2. Page should load with EKYC Platform UI
3. Check browser console (F12) for any errors

### 3.3 Create First Admin User

In PowerShell:

```powershell
# Replace with your actual backend URL
$body = @{
    name = "Admin User"
    email = "admin@example.com"
    password = "SecurePassword123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://ekyc-backend-XXXX.onrender.com/api/admin/register" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "message": "Admin registered successfully",
  "admin": {...}
}
```

### 3.4 Test Admin Login

1. Go to frontend: `https://ekyc-frontend-XXXX.onrender.com`
2. Navigate to Admin Login
3. Login with:
   - Email: `admin@example.com`
   - Password: `SecurePassword123!`
4. Should redirect to dashboard

## 🎉 SUCCESS! Your App is Live!

### Your Live URLs:

```
Frontend: https://ekyc-frontend-XXXX.onrender.com
Backend:  https://ekyc-backend-XXXX.onrender.com
```

### Save These for Reference:

```env
# Backend Environment Variables
MONGODB_URI=mongodb+srv://ekyc_user:YOUR_PASSWORD@cluster.mongodb.net/ekyc_db
RABBITMQ_URL=amqps://jfbevait:RqDZw0lHLnuG2zAqNiNPYz7GmMPC5kwa@fuji.lmq.cloudamqp.com/jfbevait
JWT_SECRET=1e1313b8776d23f0450e3749e73243812bcc9e200f73d2a2e415c0b30fc906ef
FRONTEND_URL=https://ekyc-frontend-XXXX.onrender.com

# Frontend Environment Variables
REACT_APP_API_URL=https://ekyc-backend-XXXX.onrender.com/api

# Admin Credentials
Email: admin@example.com
Password: SecurePassword123!
```

## 🐛 Troubleshooting

### Backend Build Fails
- Check Logs tab for specific error
- Verify all environment variables are set
- Try "Manual Deploy" → "Clear build cache & deploy"

### MongoDB Connection Error
- Verify MongoDB URI is correct (no typos)
- Check password doesn't have special characters (or URL encode them)
- Ensure IP whitelist includes 0.0.0.0/0 in Atlas

### RabbitMQ Connection Error
- Your URL looks correct: `amqps://jfbevait:...@fuji.lmq.cloudamqp.com/jfbevait`
- Verify in CloudAMQP dashboard that instance is active

### CORS Errors
- Verify FRONTEND_URL in backend matches actual frontend URL
- Redeploy backend after updating

### Frontend White Screen
- Verify REACT_APP_API_URL is correct
- Check browser console for errors
- Verify rewrite rule exists (should be automatic)

### Service Takes Long to Start (30+ seconds)
- This is normal for Render free tier
- Services sleep after 15 minutes of inactivity
- First request "wakes up" the service
- Use UptimeRobot (free) to ping every 14 minutes to keep alive

## 📊 Monitor Your App

### Render Dashboard
- View logs in real-time
- Check metrics and performance
- Monitor request counts

### Recommended: Setup UptimeRobot
1. Go to: https://uptimerobot.com (free)
2. Add monitor for backend: `https://ekyc-backend-XXXX.onrender.com/api/health`
3. Check interval: Every 14 minutes
4. Prevents service from sleeping

## 🔄 Making Updates

After deployment, any push to `master` branch will trigger auto-deploy:

```powershell
git add .
git commit -m "Your update message"
git push origin master
```

Render will automatically rebuild and redeploy both services.

## 🎊 What's Next?

1. ✅ Test all features thoroughly
2. ✅ Setup monitoring (UptimeRobot)
3. ✅ Add custom domain (optional)
4. ✅ Configure error tracking (Sentry)
5. ✅ Setup analytics (Google Analytics)
6. ✅ Share your app!

---

**Need Help?**
- Check `RENDER_DEPLOYMENT_GUIDE.md` for detailed info
- Visit Render Community: https://community.render.com
- Check logs in Render dashboard

**Congratulations! Your EKYC Platform is now live! 🚀**
