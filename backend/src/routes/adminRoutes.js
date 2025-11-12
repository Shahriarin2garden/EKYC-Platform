const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Protected routes (require authentication)
router.get('/profile', auth, adminController.getProfile);
router.patch('/profile', auth, adminController.updateProfile);
router.post('/change-password', auth, adminController.changePassword);
router.get('/all', auth, adminController.getAllAdmins);

// PDF generation routes
router.post('/kyc/:kycId/generate-pdf', auth, adminController.generatePdf);
router.get('/kyc/:kycId/download-pdf', auth, adminController.downloadPdf);
router.get('/kyc/:kycId/pdf-status', auth, adminController.getPdfStatus);
router.post('/kyc/batch-generate-pdf', auth, adminController.batchGeneratePdf);
router.get('/pdf-queue-status', auth, adminController.getPdfQueueStatus);

module.exports = router;
