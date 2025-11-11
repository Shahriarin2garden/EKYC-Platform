# EKYC System

A modern, full-stack Know Your Customer (KYC) application built with React, TypeScript, and Node.js. This system provides a complete solution for customer verification and administrative management.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

EKYC System is designed for organizations that require robust customer verification processes. It features a React-based frontend with TypeScript for type safety, styled with Tailwind CSS, and an Express.js backend API.

### Key Capabilities

- **Customer Verification** - Streamlined KYC form with real-time validation
- **Admin Portal** - Secure authentication and management interface
- **AI Integration** - Automated summary generation for applications
- **Responsive Design** - Mobile-first approach for all devices
- **Type Safety** - Full TypeScript implementation

## ✨ Features

### Current Features (v1.0.0)

- ✅ KYC form submission with validation
- ✅ Admin login and registration
- ✅ Password strength validation
- ✅ Real-time form validation
- ✅ AI-powered application summaries
- ✅ Responsive design
- ✅ Error handling and feedback

### Coming Soon

- 🔲 Admin dashboard with analytics
- 🔲 Application review workflow
- 🔲 Document upload and verification
- � Dark mode theme
- 🔲 Multi-language support

## 🛠️ Tech Stack

### Frontend
- **React** 18.2 - UI library
- **TypeScript** 4.9 - Type safety
- **Tailwind CSS** 3.3 - Styling
- **React Router** 6.20 - Routing
- **Axios** 1.6 - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.18 - Web framework
- **MongoDB** - Database (planned)
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Shahriarin2garden/EKYC-Theme.git
cd EKYC-Theme
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Start the development servers**
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run start:frontend  # Runs on http://localhost:3000
npm run start:backend   # Runs on http://localhost:5000
```

## 📁 Project Structure

```
ekyc-system/
├── frontend/                 # React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── KycForm.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminRegister.tsx
│   │   ├── services/        # API integration
│   │   │   └── api.ts
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx          # Root component
│   │   └── index.tsx        # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # Express API server
│   ├── src/
│   │   ├── server.js        # Main server file
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   └── models/          # Data models
│   └── package.json
│
├── docs/                     # Documentation
└── package.json              # Root package file
```

## ⚙️ Configuration

### Frontend Configuration

Update the API endpoint in `frontend/src/services/api.ts`:

```typescript
const API_URL = 'http://localhost:5000/api';
```

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ekyc
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=24h
```

## 💻 Development

### Frontend Development

```bash
cd frontend
npm start          # Start dev server
npm test           # Run tests
npm run build      # Build for production
```

### Backend Development

```bash
cd backend
npm run dev        # Start with nodemon
npm start          # Start production server
npm test           # Run tests
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Component-based architecture

## 🚢 Deployment

### Frontend Deployment

Build the production bundle:

```bash
cd frontend
npm run build
```

Deploy the `build/` directory to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

### Backend Deployment

Deploy to:
- Heroku
- AWS EC2/ECS
- DigitalOcean
- Railway

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed as part of an internship program.

## � Author

**Shahriar Hossain**
- Email: shahriarhossain197@gmail.com
- GitHub: [@Shahriarin2garden](https://github.com/Shahriarin2garden)

## � Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- TypeScript for type safety
- Open source community

---

**Last Updated:** November 11, 2025
