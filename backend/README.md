# Backend Structure

Backend API server for EKYC system.

## Directory Structure

```
backend/
├── src/
│   ├── server.js          # Main server file
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── utils/             # Utility functions
├── .env.example           # Environment variables template
└── package.json           # Dependencies
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Update environment variables in `.env`

4. Start server:
   ```bash
   npm run dev    # Development mode
   npm start      # Production mode
   ```

## API Endpoints

### Health Check
- GET `/api/health` - Server status

### KYC
- POST `/api/kyc/submit` - Submit KYC application

### Admin
- POST `/api/admin/login` - Admin login
- POST `/api/admin/register` - Admin registration
