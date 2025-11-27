const Chat = require('../models/Chat');
const Request = require('../models/Request');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { message, receiver_id } = req.body;

    // Validation
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    if (!receiver_id) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID is required',
      });
    }

    // Verify request exists
    const request = await Request.getById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Send message
    const messageId = await Chat.sendMessage({
      request_id: requestId,
      sender_id: req.userId,
      receiver_id: receiver_id,
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: {
        messageId,
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
};

// Get messages
exports.getMessages = async (req, res) => {
  try {
    const { requestId } = req.params;

    const messages = await Chat.getMessages(requestId, req.userId);

    // Mark messages as read
    await Chat.markAsRead(requestId, req.userId);

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }
};

// Get chat list
exports.getChatList = async (req, res) => {
  try {
    const chats = await Chat.getChatList(req.userId);

    res.json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    console.error('Get chat list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat list',
    });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Chat.getUnreadCount(req.userId);

    res.json({
      success: true,
      data: {
        unread_count: count,
      },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
    });
  }
};