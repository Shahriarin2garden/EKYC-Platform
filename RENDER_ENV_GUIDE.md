# Environment Variables for Render.com Deployment

This document lists all required environment variables for deploying EKYC Platform on Render.com.

## 🔐 Required Environment Variables

### Backend Service Environment Variables

#### Database Configuration
- `MONGODB_URI` - MongoDB connection string
  - **Render Setup**: Automatically provided when you create a MongoDB database
  - **Format**: `mongodb+srv://username:password@host/database`
  - **Example**: `mongodb+srv://ekyc_user:password@cluster.mongodb.net/ekyc_db`

#### Message Queue Configuration
- `RABBITMQ_URL` - RabbitMQ connection URL
  - **Free Provider**: CloudAMQP (https://www.cloudamqp.com/)
  - **Format**: `amqp://username:password@host/vhost`
  - **Example**: `amqp://user:pass@rat.rmq.cloudamqp.com/vhost`
  - **Setup Steps**:
    1. Sign up at https://www.cloudamqp.com/
    2. Create a free "Lemur" instance
    3. Copy the AMQP URL from the instance details

#### JWT Configuration
- `JWT_SECRET` - Secret key for JWT token signing
  - **Generate**: Use a strong random string (32+ characters)
  - **Example**: `your_super_secret_jwt_key_change_in_production_12345`
  - **Generate Online**: https://www.uuidgenerator.net/

- `JWT_EXPIRES_IN` - JWT token expiration time
  - **Default**: `7d` (7 days)
  - **Options**: `1d`, `7d`, `30d`, `1h`, etc.

#### OpenRouter AI Configuration (Optional)
- `OPENROUTER_API_KEY` - API key for OpenRouter AI service
  - **Get Key**: https://openrouter.ai/keys
  - **Note**: Required only if using AI-powered KYC analysis
  - **Can be empty** if not using AI features

#### CORS Configuration
- `FRONTEND_URL` - Frontend application URL
  - **Render Setup**: Automatically provided from frontend service
  - **Format**: `https://your-app.onrender.com`

#### Server Configuration
- `PORT` - Port number for backend server
  - **Default**: `5000`
  - **Note**: Render automatically assigns a port, but internal port is 5000
  - `NODE_ENV` - Node environment
  - **Value**: `production`

### Frontend Service Environment Variables

#### API Configuration
- `REACT_APP_API_URL` - Backend API URL
  - **Render Setup**: Automatically provided from backend service
  - **Format**: `https://ekyc-backend.onrender.com/api`
  - **Build Time**: Set during build process

## 📝 Environment Variable Setup on Render

### Method 1: Using render.yaml (Recommended)
The `render.yaml` file already includes most environment variables with automatic linking.

**Steps**:
1. Commit the `render.yaml` file to your repository
2. In Render dashboard, click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically read the configuration
5. Add only the sensitive variables manually:
   - `RABBITMQ_URL` (from CloudAMQP)
   - `OPENROUTER_API_KEY` (if using AI)

### Method 2: Manual Setup
If not using render.yaml:

**Backend Service**:
1. Go to your backend service in Render
2. Navigate to "Environment" tab
3. Add each variable with "Add Environment Variable"
4. For secret values, use the "Secret File" option

**Frontend Service**:
1. Go to your frontend service in Render
2. Add environment variables in the "Environment" tab
3. Note: React environment variables must be set at **build time**

## 🔗 Service Dependencies

### Order of Creation:
1. **MongoDB Database** (if using Render's MongoDB)
2. **CloudAMQP Account** (external service)
3. **Backend Service** (depends on MongoDB and RabbitMQ)
4. **Frontend Service** (depends on Backend)

### Automatic Linking in render.yaml:
- MongoDB connection string is automatically linked to backend
- Backend URL is automatically linked to frontend
- CORS is automatically configured with frontend URL

## 🆓 Free Tier Limitations

### Render Free Tier:
- ✅ Web Services: 750 hours/month (enough for 1 service running 24/7)
- ✅ Static Sites: Unlimited
- ✅ PostgreSQL: 1GB storage (free alternative to MongoDB)
- ❌ MongoDB: Not available on free tier (use MongoDB Atlas instead)
- ❌ RabbitMQ: Not available (use CloudAMQP)

### Alternative Free Services:
1. **MongoDB**: Use MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
   - Free tier: 512MB storage
   - Setup: Create cluster → Get connection string

2. **RabbitMQ**: Use CloudAMQP (https://www.cloudamqp.com/)
   - Free tier: "Lemur" plan
   - Setup: Create instance → Copy AMQP URL

## 🚀 Quick Setup Checklist

- [ ] Fork/Push repository to GitHub
- [ ] Sign up for Render account (https://render.com)
- [ ] Create MongoDB Atlas account and cluster (https://www.mongodb.com/cloud/atlas)
- [ ] Create CloudAMQP account and instance (https://www.cloudamqp.com/)
- [ ] Get MongoDB connection string
- [ ] Get RabbitMQ AMQP URL
- [ ] Generate JWT secret key
- [ ] (Optional) Get OpenRouter API key
- [ ] Deploy using render.yaml or manually create services
- [ ] Add environment variables in Render dashboard
- [ ] Verify deployment and test application

## 📱 Testing After Deployment

### Backend Health Check:
```bash
curl https://your-backend.onrender.com/api/health
```

### Frontend Access:
```
https://your-frontend.onrender.com
```

### Expected Response:
Backend should return: `{ "status": "healthy", "timestamp": "..." }`

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failed - Missing Dependencies**
   - Check that package.json is in the correct location
   - Verify build command path: `cd backend && npm install`

2. **Database Connection Error**
   - Verify MongoDB URI is correct
   - Check that IP whitelist includes `0.0.0.0/0` in MongoDB Atlas

3. **RabbitMQ Connection Failed**
   - Verify CloudAMQP URL format
   - Test connection from CloudAMQP dashboard

4. **CORS Errors**
   - Verify `FRONTEND_URL` is set correctly
   - Check that frontend URL matches actual deployment URL

5. **Environment Variables Not Working**
   - React variables must start with `REACT_APP_`
   - React variables are set at **build time**, not runtime
   - Redeploy frontend if API URL changes

## 📚 Additional Resources

- Render Documentation: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- CloudAMQP: https://www.cloudamqp.com/docs/index.html
- OpenRouter: https://openrouter.ai/docs
