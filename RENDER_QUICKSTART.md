# 🚀 Quick Start: Deploy EKYC Platform to Render.com

This is a streamlined guide to get your EKYC Platform deployed to Render.com in **under 30 minutes**.

## 🎯 Quick Overview

We'll deploy to **3 free services**:
1. **Render.com** - Backend + Frontend (Free)
2. **MongoDB Atlas** - Database (Free 512MB)
3. **CloudAMQP** - RabbitMQ (Free plan)

## ⚡ Fast Track Steps

### 1️⃣ Setup External Services (10 minutes)

#### MongoDB Atlas
```bash
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create account → Create FREE cluster
3. Setup Database User:
   - Username: ekyc_user
   - Generate password → SAVE IT!
4. Network Access: Allow 0.0.0.0/0
5. Get connection string → SAVE IT!
   Format: mongodb+srv://ekyc_user:PASSWORD@cluster.mongodb.net/ekyc_db
```

#### CloudAMQP
```bash
1. Visit: https://customer.cloudamqp.com/signup
2. Create account → Create instance
3. Plan: Lemur (FREE)
4. Get AMQP URL → SAVE IT!
   Format: amqps://user:pass@host.cloudamqp.com/vhost
```

#### Generate JWT Secret
```bash
# Run this command:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or visit: https://www.uuidgenerator.net/
# SAVE the generated secret!
```

### 2️⃣ Prepare GitHub Repository (2 minutes)

```bash
# If not already on GitHub:
git init
git add .
git commit -m "Deploy to Render"
git remote add origin https://github.com/YOUR_USERNAME/EKYC-Platform.git
git push -u origin master
```

### 3️⃣ Deploy to Render (5 minutes)

#### Option A: Using render.yaml (Easiest)

```bash
1. Login to: https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect GitHub → Select "EKYC-Platform" repo
4. Render detects render.yaml → Click "Apply"
5. Services are created automatically!
```

#### Option B: Manual (More Control)

**Backend Service:**
```bash
1. New + → Web Service
2. Repository: EKYC-Platform
3. Name: ekyc-backend
4. Runtime: Node
5. Build: cd backend && npm install
6. Start: cd backend && npm start
7. Plan: Free
```

**Frontend Service:**
```bash
1. New + → Static Site
2. Repository: EKYC-Platform
3. Name: ekyc-frontend
4. Build: cd frontend && npm install && npm run build
5. Publish: frontend/build
6. Plan: Free
7. Add Rewrite: /* → /index.html
```

### 4️⃣ Configure Environment Variables (5 minutes)

Go to **Backend Service** → **Environment** → Add:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://ekyc_user:YOUR_PASSWORD@cluster.mongodb.net/ekyc_db
RABBITMQ_URL=amqps://user:pass@host.cloudamqp.com/vhost
JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://YOUR-FRONTEND.onrender.com
```

Go to **Frontend Service** → **Environment** → Add:

```env
REACT_APP_API_URL=https://YOUR-BACKEND.onrender.com/api
```

### 5️⃣ Verify Deployment (5 minutes)

```bash
# Test backend health:
curl https://YOUR-BACKEND.onrender.com/api/health

# Should return:
{"status":"healthy","timestamp":"..."}

# Visit frontend:
https://YOUR-FRONTEND.onrender.com
```

### 6️⃣ Create First Admin (2 minutes)

```bash
curl -X POST https://YOUR-BACKEND.onrender.com/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

## ✅ Done! Your App is Live!

**Access your app:**
- Frontend: `https://YOUR-FRONTEND.onrender.com`
- Backend API: `https://YOUR-BACKEND.onrender.com/api`

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check logs → Verify package.json → Clear cache & redeploy |
| DB connection error | Verify MongoDB URI → Check IP whitelist (0.0.0.0/0) |
| CORS errors | Update FRONTEND_URL in backend env vars |
| White screen | Check REACT_APP_API_URL → Ensure rewrite rule exists |
| Service sleeping | Normal for free tier → First request takes 30s |

## 📊 Free Tier Limits

- **Render**: 750 hours/month (= 1 service 24/7)
- **MongoDB Atlas**: 512MB storage
- **CloudAMQP**: Limited connections
- **Services sleep** after 15 min inactivity

**Pro Tip**: Use [UptimeRobot](https://uptimerobot.com) (free) to ping your app every 14 minutes to prevent sleeping.

## 📚 Need More Help?

- Full Guide: `RENDER_DEPLOYMENT_GUIDE.md`
- Environment Setup: `RENDER_ENV_GUIDE.md`
- Configuration: `render.yaml`

## 🎉 Next Steps

1. ✅ Add custom domain (optional)
2. ✅ Setup monitoring (UptimeRobot)
3. ✅ Enable auto-deploy from GitHub
4. ✅ Test all features thoroughly
5. ✅ Share your app!

---

**Need help?** Check the full documentation or reach out to Render support!

Happy deploying! 🚀
