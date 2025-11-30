const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Hospital routes
router.post('/record', donationController.recordDonation);
router.get('/hospital-donations', donationController.getHospitalDonations);
router.get('/stats', donationController.getStats);

// Donor routes
router.get('/donor-history', donationController.getDonorHistory);
router.get('/check-eligibility/:donorId', donationController.checkEligibility);

module.exports = router;