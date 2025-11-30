const db = require('../config/database');

class Notification {
  // Create notification
  static async create(notificationData) {
    try {
      const { user_id, title, message, type, request_id } = notificationData;

      const [result] = await db.query(
        `INSERT INTO notifications 
         (user_id, title, message, type, request_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, title, message, type, request_id || null]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get user notifications
  static async getByUserId(userId, limit = 50) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM notifications 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, limit]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Mark as read
  static async markAsRead(notificationId, userId) {
    try {
      await db.query(
        `UPDATE notifications 
         SET is_read = TRUE 
         WHERE id = ? AND user_id = ?`,
        [notificationId, userId]
      );
    } catch (error) {
      throw error;
    }
  }

  // Mark all as read
  static async markAllAsRead(userId) {
    try {
      await db.query(
        `UPDATE notifications 
         SET is_read = TRUE 
         WHERE user_id = ? AND is_read = FALSE`,
        [userId]
      );
    } catch (error) {
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount(userId) {
    try {
      const [rows] = await db.query(
        `SELECT COUNT(*) as count 
         FROM notifications 
         WHERE user_id = ? AND is_read = FALSE`,
        [userId]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  // Delete notification
  static async delete(notificationId, userId) {
    try {
      await db.query(
        `DELETE FROM notifications 
         WHERE id = ? AND user_id = ?`,
        [notificationId, userId]
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Notification;