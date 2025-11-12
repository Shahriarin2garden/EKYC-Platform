const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const pdfWorker = require('./services/pdfWorker');

// Load environment variables
dotenv.config();

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error(err.name, err.message);
  console.error(err.stack);
  // Don't exit immediately - let the app handle it
});

// Connect to MongoDB (async but non-blocking)
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
});

// Start PDF Worker (RabbitMQ consumer)
// This will connect to RabbitMQ and start listening for PDF generation requests
pdfWorker.startPdfWorker().catch(err => {
  console.error('Failed to start PDF Worker:', err.message);
  console.log('PDF generation will not be available. Make sure RabbitMQ is running.');
});

const app = express();

// Import routes
const kycRoutes = require('./routes/kycRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware
// Configure CORS to allow requests from frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'EKYC API Server is running',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// API Routes
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`EKYC API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`PDF Worker: ${process.env.RABBITMQ_URL ? 'Enabled' : 'Disabled (RabbitMQ URL not configured)'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server and PDF Worker');
  server.close(() => {
    console.log('HTTP server closed');
    pdfWorker.stopPdfWorker().then(() => {
      console.log('PDF Worker stopped');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server and PDF Worker');
  server.close(() => {
    console.log('HTTP server closed');
    pdfWorker.stopPdfWorker().then(() => {
      console.log('PDF Worker stopped');
      process.exit(0);
    });
  });
});

module.exports = app;
