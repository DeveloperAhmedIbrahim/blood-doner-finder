import { notificationAPI } from './api';
import { Alert } from 'react-native';

class NotificationService {
  constructor() {
    this.listeners = [];
  }

  // Poll for new notifications every 30 seconds
  startPolling() {
    this.pollingInterval = setInterval(() => {
      this.checkNewNotifications();
    }, 30000); // 30 seconds
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  async checkNewNotifications() {
    try {
      const res = await notificationAPI.getUnreadCount();
      if (res.success && res.data.unread_count > 0) {
        // Notify listeners
        this.listeners.forEach(listener => listener(res.data.unread_count));
      }
    } catch (error) {
      console.error('Check notifications error:', error);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async showLocalNotification(title, message) {
    Alert.alert(title, message);
  }
}

export default new NotificationService();