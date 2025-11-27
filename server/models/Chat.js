const db = require('../config/database');

class Chat {
  // Send message
  static async sendMessage(messageData) {
    try {
      const { request_id, sender_id, receiver_id, message } = messageData;

      const [result] = await db.query(
        `INSERT INTO chat_messages (request_id, sender_id, receiver_id, message) 
         VALUES (?, ?, ?, ?)`,
        [request_id, sender_id, receiver_id, message]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get messages for a request
  static async getMessages(requestId, userId) {
    try {
      const [rows] = await db.query(
        `SELECT cm.*, 
                sender.name as sender_name, 
                sender.role as sender_role,
                receiver.name as receiver_name
         FROM chat_messages cm
         JOIN users sender ON cm.sender_id = sender.id
         JOIN users receiver ON cm.receiver_id = receiver.id
         WHERE cm.request_id = ? 
         AND (cm.sender_id = ? OR cm.receiver_id = ?)
         ORDER BY cm.created_at ASC`,
        [requestId, userId, userId]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Mark messages as read
  static async markAsRead(requestId, receiverId) {
    try {
      await db.query(
        `UPDATE chat_messages 
         SET is_read = TRUE 
         WHERE request_id = ? AND receiver_id = ? AND is_read = FALSE`,
        [requestId, receiverId]
      );
    } catch (error) {
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount(userId) {
    try {
      const [rows] = await db.query(
        `SELECT COUNT(*) as unread_count 
         FROM chat_messages 
         WHERE receiver_id = ? AND is_read = FALSE`,
        [userId]
      );

      return rows[0].unread_count;
    } catch (error) {
      throw error;
    }
  }

  // Get chat list (all conversations for a user)
  static async getChatList(userId) {
    try {
      const [rows] = await db.query(
        `SELECT DISTINCT
           br.id as request_id,
           br.blood_group,
           br.urgency,
           br.status,
           CASE 
             WHEN br.patient_id = ? THEN donor.id
             ELSE patient.id
           END as other_user_id,
           CASE 
             WHEN br.patient_id = ? THEN donor.name
             ELSE patient.name
           END as other_user_name,
           CASE 
             WHEN br.patient_id = ? THEN donor.role
             ELSE patient.role
           END as other_user_role,
           (SELECT message FROM chat_messages 
            WHERE request_id = br.id 
            ORDER BY created_at DESC LIMIT 1) as last_message,
           (SELECT created_at FROM chat_messages 
            WHERE request_id = br.id 
            ORDER BY created_at DESC LIMIT 1) as last_message_time,
           (SELECT COUNT(*) FROM chat_messages 
            WHERE request_id = br.id 
            AND receiver_id = ? 
            AND is_read = FALSE) as unread_count
         FROM blood_requests br
         JOIN users patient ON br.patient_id = patient.id
         LEFT JOIN request_responses rr ON br.id = rr.request_id AND rr.response = 'accepted'
         LEFT JOIN users donor ON rr.donor_id = donor.id
         WHERE br.patient_id = ? OR rr.donor_id = ?
         HAVING last_message IS NOT NULL
         ORDER BY last_message_time DESC`,
        [userId, userId, userId, userId, userId, userId]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Chat;