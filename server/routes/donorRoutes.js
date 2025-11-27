const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Protected routes (require authentication)
router.use(verifyToken);

// Complete profile
router.post('/complete-profile', donorController.completeProfile);

// Upload CNIC images
router.post('/upload-cnic', 
  upload.fields([
    { name: 'cnic_front', maxCount: 1 },
    { name: 'cnic_back', maxCount: 1 }
  ]),
  donorController.uploadCNIC
);

// Get verification status
router.get('/verification-status', donorController.getVerificationStatus);

// Get donor profile
router.get('/profile', donorController.getProfile);

module.exports = router;