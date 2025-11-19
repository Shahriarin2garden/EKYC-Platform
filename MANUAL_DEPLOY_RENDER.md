# 🚀 MANUAL DEPLOYMENT GUIDE - Render.com

Since Render's blueprint has limitations with static sites, follow these manual steps instead.  
**This will work 100% and takes only 15 minutes.**

---

## ✅ What You Already Have

- ✅ CloudAMQP URL: `amqps://jfbevait:RqDZw0lHLnuG2zAqNiNPYz7GmMPC5kwa@fuji.lmq.cloudamqp.com/jfbevait`
- ✅ JWT Secret: `1e1313b8776d23f0450e3749e73243812bcc9e200f73d2a2e415c0b30fc906ef`
- ✅ Code on GitHub: `Shahriarin2garden/EKYC-Platform`

---

## 🎯 Step 1: Get MongoDB Connection String (5 min)

### If you don't have MongoDB Atlas yet:

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (free - no credit card needed)
3. **Create Database**:
   - Click "Create" → Choose "FREE" (M0)
   - Provider: AWS, Region: closest to you
   - Click "Create Cluster" (takes 3-5 min)

4. **Create User**:
   - Left menu → "Database Access"
   - "Add New Database User"
   - Username: `ekyc_user`
   - Autogenerate password → **COPY IT!**
   - Privileges: "Atlas admin"
   - Click "Add User"

5. **Allow Access**:
   - Left menu → "Network Access"
   - "Add IP Address"
   - "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String**:
   - Left menu → "Database"
   - Click "Connect" on your cluster
   - "Connect your application"
   - **COPY** the connection string
   - Format: `mongodb+srv://ekyc_user:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Add `/ekyc_db` before the `?`: `mongodb+srv://ekyc_user:PASSWORD@cluster.mongodb.net/ekyc_db?retryWrites=true&w=majority`
   - **SAVE THIS!**

---

## 🚀 Step 2: Deploy Backend to Render (5 min)

1. **Login to Render**: https://dashboard.render.com/

2. **Create Backend Service**:
   - Click "New +" → "Web Service"
   - "Build and deploy from a Git repository" → "Next"
   - Connect GitHub if needed
   - Repository: `EKYC-Platform` → "Connect"

3. **Configure Backend**:
   ```
   Name: ekyc-backend
   Region: Oregon (US West)
   Branch: master
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   Plan: Free
   ```

4. **Add Environment Variables** (click "Advanced" or scroll down):
   
   Click "Add Environment Variable" for each:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | `mongodb+srv://ekyc_user:YOUR_PASSWORD@cluster.mongodb.net/ekyc_db?retryWrites=true&w=majority` |
   | `RABBITMQ_URL` | `amqps://jfbevait:RqDZw0lHLnuG2zAqNiNPYz7GmMPC5kwa@fuji.lmq.cloudamqp.com/jfbevait` |
   | `JWT_SECRET` | `1e1313b8776d23f0450e3749e73243812bcc9e200f73d2a2e415c0b30fc906ef` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `FRONTEND_URL` | `https://ekyc-frontend.onrender.com` (we'll update this later) |

   **IMPORTANT**: Replace `YOUR_PASSWORD` in MONGODB_URI!

5. **Create Web Service** → Wait for build (5-7 minutes)

6. **Note Your Backend URL**: `https://ekyc-backend-XXXX.onrender.com`

---

## 🎨 Step 3: Deploy Frontend to Render (5 min)

1. **Create Frontend Service**:
   - Click "New +" → "Static Site"
   - Repository: `EKYC-Platform` → "Connect"

2. **Configure Frontend**:
   ```
   Name: ekyc-frontend
   Branch: master
   Root Directory: (leave empty)
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/build
   ```

3. **Add Environment Variable**:
   
   Click "Add Environment Variable":

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://ekyc-backend-XXXX.onrender.com/api` |

   **IMPORTANT**: Replace `XXXX` with your actual backend URL from Step 2!

4. **Auto-Publish**: Yes (should be default)

5. **Create Static Site** → Wait for build (3-5 minutes)

6. **Note Your Frontend URL**: `https://ekyc-frontend-XXXX.onrender.com`

---

## 🔄 Step 4: Update Backend with Frontend URL (2 min)

1. **Go to Backend Service**:
   - Dashboard → `ekyc-backend`

2. **Update Environment Variable**:
   - Left menu → "Environment"
   - Find `FRONTEND_URL`
   - Update to: `https://ekyc-frontend-XXXX.onrender.com` (your actual frontend URL)
   - Click "Save Changes"

3. **Backend will redeploy automatically** (2-3 minutes)

---

## ✅ Step 5: Test Your Deployment (3 min)

### Test 1: Backend Health

Open PowerShell:
```powershell
# Replace with your actual backend URL
curl https://ekyc-backend-XXXX.onrender.com/api/health
```

**Expected**: `{"status":"healthy","timestamp":"..."}`

### Test 2: Frontend

Visit: `https://ekyc-frontend-XXXX.onrender.com`

- Should see EKYC Platform homepage
- No console errors (press F12 to check)

### Test 3: Create Admin

```powershell
# Replace with your actual backend URL
$uri = "https://ekyc-backend-XXXX.onrender.com/api/admin/register"
$body = @{
    name = "Admin User"
    email = "admin@example.com"
    password = "SecurePassword123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType "application/json"
```

**Expected**: Success message with admin details

### Test 4: Login

1. Go to frontend: `https://ekyc-frontend-XXXX.onrender.com`
2. Navigate to Admin Login (or `/admin/login`)
3. Login:
   - Email: `admin@example.com`
   - Password: `SecurePassword123!`
4. Should see dashboard!

---

## 🎉 SUCCESS! Your URLs:

```
✅ Frontend: https://ekyc-frontend-XXXX.onrender.com
✅ Backend:  https://ekyc-backend-XXXX.onrender.com
✅ Health:   https://ekyc-backend-XXXX.onrender.com/api/health
```

---

## 📝 Save Your Configuration

```env
# === BACKEND ENVIRONMENT VARIABLES ===
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://ekyc_user:YOUR_PASSWORD@cluster.mongodb.net/ekyc_db?retryWrites=true&w=majority
RABBITMQ_URL=amqps://jfbevait:RqDZw0lHLnuG2zAqNiNPYz7GmMPC5kwa@fuji.lmq.cloudamqp.com/jfbevait
JWT_SECRET=1e1313b8776d23f0450e3749e73243812bcc9e200f73d2a2e415c0b30fc906ef
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://ekyc-frontend-XXXX.onrender.com

# === FRONTEND ENVIRONMENT VARIABLES ===
REACT_APP_API_URL=https://ekyc-backend-XXXX.onrender.com/api

# === ADMIN CREDENTIALS ===
Email: admin@example.com
Password: SecurePassword123!
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Backend build fails** | Check Logs tab → Verify `backend/package.json` exists |
| **MongoDB connection error** | Verify URI → Check IP whitelist (0.0.0.0/0) → Check password |
| **RabbitMQ connection error** | Verify CloudAMQP URL is exact copy |
| **CORS errors** | Update FRONTEND_URL in backend → Redeploy |
| **Frontend white screen** | Check REACT_APP_API_URL → Check browser console (F12) |
| **Service slow to start (30s+)** | Normal for free tier - first request wakes it up |

---

## 💡 Pro Tips

### Keep Your Service Awake (Free)
Services sleep after 15 min of inactivity. Use UptimeRobot:

1. Go to: https://uptimerobot.com (free, no credit card)
2. Add monitor: `https://ekyc-backend-XXXX.onrender.com/api/health`
3. Interval: Every 14 minutes
4. Done! Service won't sleep anymore

### Auto-Deploy on Git Push
Already enabled! Just push to GitHub:
```powershell
git add .
git commit -m "Update app"
git push origin master
```
Both services will auto-redeploy.

### View Logs
- Render Dashboard → Service → "Logs" tab
- Real-time logs for debugging

### Manual Redeploy
- Service → "Manual Deploy" → "Deploy latest commit"
- Use "Clear build cache & deploy" if having issues

---

## 🎊 What's Next?

- [ ] Test all features (KYC form, PDF generation, etc.)
- [ ] Setup UptimeRobot to prevent service sleep
- [ ] Add custom domain (optional)
- [ ] Setup error tracking with Sentry (optional)
- [ ] Share your app!

---

**Need help?** Check the Logs tab in Render dashboard or see `RENDER_DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

**Congratulations! Your EKYC Platform is LIVE! 🚀**
