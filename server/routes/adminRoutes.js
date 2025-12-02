const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { ensureAdmin } = require('../middleware/adminMiddleware');

// All routes protected: verifyToken + ensureAdmin
router.use(verifyToken, ensureAdmin);

// Stats
router.get('/stats', adminController.getStats);

// Users
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/block', adminController.blockUser);
router.delete('/users/:id', adminController.deleteUser);

// Donors
router.get('/donors', adminController.getAllDonors);
router.get('/donors/pending', adminController.getPendingDonors);
router.put('/donors/:id/verify', adminController.verifyDonor);

// Hospitals
router.get('/hospitals', adminController.getAllHospitals);
router.put('/hospitals/:id/status', adminController.updateHospitalStatus);

// Requests
router.get('/requests', adminController.getAllRequests);

// Donations
router.get('/donations', adminController.getAllDonations);

module.exports = router;
