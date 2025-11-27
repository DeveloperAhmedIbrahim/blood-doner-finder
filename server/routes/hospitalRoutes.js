const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.use(verifyToken);

// Get pending verifications
router.get('/pending-verifications', hospitalController.getPendingVerifications);

// Verify donor
router.post('/verify-donor/:verificationId', hospitalController.verifyDonor);

module.exports = router;