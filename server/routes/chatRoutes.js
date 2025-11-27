const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Send message
router.post('/:requestId/send', chatController.sendMessage);

// Get messages for a request
router.get('/:requestId/messages', chatController.getMessages);

// Get chat list
router.get('/list', chatController.getChatList);

// Get unread count
router.get('/unread-count', chatController.getUnreadCount);

module.exports = router;