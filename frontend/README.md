# Frontend Structure

React-based frontend application for EKYC system.

## Directory Structure

```
frontend/
├── public/                # Static files
├── src/
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Root component
│   └── index.tsx         # Entry point
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update API URL in `src/services/api.ts`:
   ```typescript
   const API_URL = 'http://localhost:5000/api';
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Available Routes

- `/` - KYC Form
- `/admin` - Admin Login
- `/admin/register` - Admin Registration
