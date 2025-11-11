const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'EKYC API Server is running',
    timestamp: new Date().toISOString()
  });
});

// KYC Routes (placeholder)
app.post('/api/kyc/submit', async (req, res) => {
  try {
    const { name, email, address, nid, occupation } = req.body;
    
    // TODO: Add validation
    // TODO: Save to database
    // TODO: Generate AI summary
    
    const mockSummary = `KYC application received for ${name} (${email}). National ID: ${nid || 'N/A'}. Occupation: ${occupation || 'N/A'}. Address: ${address || 'N/A'}. Application is pending review.`;
    
    res.json({
      success: true,
      message: 'KYC submitted successfully',
      summary: mockSummary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit KYC',
      error: error.message
    });
  }
});

// Admin Routes (placeholder)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Add validation
    // TODO: Check credentials
    // TODO: Generate JWT token
    
    // Mock response
    if (email === 'admin@example.com' && password === 'admin123') {
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock_jwt_token_here',
          user: { email, name: 'Admin User' }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

app.post('/api/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // TODO: Add validation
    // TODO: Hash password
    // TODO: Save to database
    
    res.json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

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
app.listen(PORT, () => {
  console.log(`EKYC API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
