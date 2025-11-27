const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Patient routes
router.post('/create', requestController.createRequest);
router.get('/my-requests', requestController.getMyRequests);
router.post('/:requestId/cancel', requestController.cancelRequest);

// Donor routes
router.get('/active', requestController.getActiveRequests);
router.post('/:requestId/respond', requestController.respondToRequest);

// Hospital routes
router.get('/all', requestController.getAllRequests);

// Common routes
router.get('/:requestId/details', requestController.getRequestDetails);

module.exports = router;