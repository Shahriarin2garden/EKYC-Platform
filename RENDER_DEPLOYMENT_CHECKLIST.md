# 📋 Render.com Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.com.

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to Git
- [ ] Tests passing locally
- [ ] Build succeeds locally (frontend & backend)
- [ ] Environment variables documented
- [ ] Sensitive data removed from code
- [ ] `.gitignore` properly configured
- [ ] `render.yaml` file exists in root

### 2. GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or connected to Render
- [ ] Default branch is `master` or `main`
- [ ] All necessary files are included
- [ ] `.env` files are NOT committed

### 3. External Services Setup

#### MongoDB Atlas
- [ ] Account created
- [ ] Free cluster created
- [ ] Database user created (`ekyc_user`)
- [ ] Password saved securely
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string obtained and tested

#### CloudAMQP
- [ ] Account created
- [ ] Free instance created (Lemur plan)
- [ ] AMQP URL obtained
- [ ] Connection tested (optional)

#### JWT & Secrets
- [ ] JWT secret generated (32+ characters)
- [ ] Secret saved securely
- [ ] (Optional) OpenRouter API key obtained

## ✅ Deployment Checklist

### 4. Render Account
- [ ] Render account created
- [ ] GitHub account connected to Render
- [ ] Payment method added (for verification, won't be charged)

### 5. Blueprint Deployment (render.yaml method)
- [ ] Logged into Render dashboard
- [ ] Clicked "New +" → "Blueprint"
- [ ] Selected EKYC-Platform repository
- [ ] Render detected `render.yaml`
- [ ] Clicked "Apply" to create services
- [ ] Services created: `ekyc-backend` and `ekyc-frontend`

### 6. Environment Variables Configuration

#### Backend Service (ekyc-backend)
- [ ] Navigate to backend service
- [ ] Click "Environment" tab
- [ ] Add `MONGODB_URI` with connection string
- [ ] Add `RABBITMQ_URL` with CloudAMQP URL
- [ ] Add `JWT_SECRET` with generated secret
- [ ] Add `JWT_EXPIRES_IN` (default: `7d`)
- [ ] Add `FRONTEND_URL` (will update after frontend deploys)
- [ ] (Optional) Add `OPENROUTER_API_KEY`
- [ ] Save changes

#### Frontend Service (ekyc-frontend)
- [ ] Navigate to frontend service
- [ ] Click "Environment" tab
- [ ] Add `REACT_APP_API_URL` with backend URL
- [ ] Format: `https://ekyc-backend.onrender.com/api`
- [ ] Save changes

### 7. Initial Deployment
- [ ] Backend build started automatically
- [ ] Backend build completed (check logs)
- [ ] Backend service is "Live"
- [ ] Frontend build started automatically
- [ ] Frontend build completed (check logs)
- [ ] Frontend service is "Live"

### 8. URL Configuration Updates
- [ ] Backend URL obtained: `https://ekyc-backend.onrender.com`
- [ ] Frontend URL obtained: `https://ekyc-frontend.onrender.com`
- [ ] Updated `FRONTEND_URL` in backend environment
- [ ] Verified `REACT_APP_API_URL` in frontend environment
- [ ] Redeployed services if URLs changed

## ✅ Post-Deployment Checklist

### 9. Health Checks

#### Backend Health
- [ ] Test health endpoint:
  ```bash
  curl https://YOUR-BACKEND.onrender.com/api/health
  ```
- [ ] Response received: `{"status":"healthy",...}`
- [ ] Response time reasonable (<2s after warmup)

#### Frontend Health
- [ ] Visit frontend URL in browser
- [ ] Page loads successfully
- [ ] No console errors
- [ ] Styles render correctly
- [ ] Navigation works

#### Database Connection
- [ ] Check backend logs for MongoDB connection success
- [ ] No connection errors in logs

#### RabbitMQ Connection
- [ ] Check backend logs for RabbitMQ connection success
- [ ] No connection errors in logs

### 10. Functional Testing

#### Admin Registration
- [ ] Create first admin via API:
  ```bash
  curl -X POST https://YOUR-BACKEND.onrender.com/api/admin/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Admin","email":"admin@example.com","password":"SecurePass123!"}'
  ```
- [ ] Registration successful
- [ ] Admin saved in database

#### Admin Login
- [ ] Visit frontend admin login page
- [ ] Enter admin credentials
- [ ] Login successful
- [ ] JWT token received
- [ ] Redirected to dashboard

#### KYC Form Submission
- [ ] Access KYC form page
- [ ] Fill in all required fields
- [ ] Submit form
- [ ] Submission successful
- [ ] Confirmation message shown

#### PDF Generation
- [ ] Check if PDF was generated
- [ ] PDF accessible via API
- [ ] PDF contains correct information

#### Full Flow Test
- [ ] Admin creates KYC request
- [ ] View KYC list in dashboard
- [ ] KYC status updates correctly
- [ ] All CRUD operations work

### 11. Monitoring Setup

#### Render Monitoring
- [ ] Checked "Metrics" tab for each service
- [ ] Reviewed request counts
- [ ] Reviewed response times
- [ ] Set up email notifications (optional)

#### External Monitoring (Optional)
- [ ] UptimeRobot account created
- [ ] Backend monitor added (ping every 14 min)
- [ ] Frontend monitor added
- [ ] Email alerts configured

### 12. Auto-Deploy Configuration
- [ ] Auto-deploy enabled on backend service
- [ ] Auto-deploy enabled on frontend service
- [ ] Branch set to `master` or `main`
- [ ] Test push triggers deployment

### 13. Documentation
- [ ] Deployment URLs documented
- [ ] Environment variables documented
- [ ] Admin credentials saved securely
- [ ] API endpoints documented
- [ ] Team members notified

## ✅ Security Checklist

### 14. Security Configuration
- [ ] JWT secret is strong and unique
- [ ] Database password is strong
- [ ] No secrets in code or logs
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Render)
- [ ] MongoDB IP whitelist reviewed
- [ ] CloudAMQP credentials secured

## ✅ Performance Checklist

### 15. Performance Optimization
- [ ] Frontend build optimized (check bundle size)
- [ ] Backend health check responds <1s
- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Static assets served efficiently
- [ ] Images optimized

## ✅ Final Verification

### 16. Complete System Test
- [ ] All services running
- [ ] All features functional
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Mobile responsive (test on phone)
- [ ] Different browsers tested

### 17. Backup & Recovery
- [ ] MongoDB Atlas backup enabled (automatic)
- [ ] Code backed up on GitHub
- [ ] Environment variables documented
- [ ] Recovery procedure documented

### 18. Team Handoff
- [ ] Access credentials shared with team
- [ ] Documentation shared
- [ ] Support contacts documented
- [ ] Maintenance schedule defined

## 🎉 Deployment Complete!

### Your Live URLs:
- Frontend: `https://ekyc-frontend.onrender.com`
- Backend: `https://ekyc-backend.onrender.com`

### Next Steps:
1. Monitor application for 24 hours
2. Set up custom domain (optional)
3. Configure CDN (optional)
4. Set up error tracking (Sentry)
5. Implement analytics (Google Analytics)

## 📞 Support Resources

- **Render Support**: https://community.render.com/
- **MongoDB Atlas Support**: https://www.mongodb.com/cloud/atlas/support
- **CloudAMQP Support**: https://www.cloudamqp.com/support.html
- **Project Documentation**: See `RENDER_DEPLOYMENT_GUIDE.md`

---

## 🚨 Troubleshooting Quick Reference

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Build fails | Missing dependencies | Check package.json, clear cache |
| 502/503 errors | Service not started | Check logs, verify start command |
| DB connection fails | Wrong URI or IP block | Verify URI, check IP whitelist |
| CORS errors | Wrong FRONTEND_URL | Update env var, redeploy |
| White screen | Wrong API URL | Check REACT_APP_API_URL |
| Slow first load | Service sleeping | Normal for free tier, use UptimeRobot |

---

**Last Updated**: Deployment checklist v1.0  
**Estimated Time**: 30-45 minutes for complete deployment
