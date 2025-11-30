import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import StatCard from '../../components/StatCard';
import { hospitalAPI, chatAPI, notificationAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
import notificationService from '../../services/notificationService';

const HospitalDashboard = ({ navigation }) => {
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ pendingVerifications: 0 });
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  useEffect(() => {
    notificationService.startPolling();
    
    const unsubscribe = notificationService.subscribe((count) => {
      setUnreadNotifications(count);
      // Optional: Show alert
      // notificationService.showLocalNotification('New Notification', 'You have new notifications');
    });

    return () => {
      notificationService.stopPolling();
      unsubscribe();
    };
  }, []);  

  const loadData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) setUserData(JSON.parse(userDataStr));

      const [pendingRes, chatRes, notifRes] = await Promise.all([
        hospitalAPI.getPendingVerifications(),
        chatAPI.getUnreadCount(),
        notificationAPI.getUnreadCount(),
      ]);

      if (pendingRes.success) setStats(prev => ({ ...prev, pendingVerifications: pendingRes.count || pendingRes.data.length }));
      if (chatRes.success) setUnreadMessages(chatRes.data.unread_count);
      if (notifRes.success) setUnreadNotifications(notifRes.data.unread_count);
    } catch (error) {
      console.error('Load data error:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hospital</Text>
            <Text style={styles.name}>{userData?.name}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.notificationIcon}>🔔</Text>
            {unreadNotifications > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadNotifications}</Text></View>}
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="⏳" title="Pending Verifications" value={stats.pendingVerifications} color={COLORS.WARNING} onPress={() => navigation.navigate('PendingVerifications')} />
          <StatCard icon="💬" title="Messages" value={unreadMessages} color={COLORS.SECONDARY} onPress={() => navigation.navigate('ChatList')} />
        </View>

        <View style={styles.actionsContainer}>
          <CustomButton title="View Pending Verifications" onPress={() => navigation.navigate('PendingVerifications')} style={[styles.button, { backgroundColor: COLORS.PRIMARY }]} />
          <CustomButton title="Record Donation" onPress={() => navigation.navigate('RecordDonation')} style={[styles.button, { backgroundColor: COLORS.SUCCESS }]} />
          <CustomButton title="View Donation History" onPress={() => navigation.navigate('DonationHistory')} style={[styles.button, { backgroundColor: COLORS.SECONDARY }]} />
          <CustomButton title="Messages" onPress={() => navigation.navigate('ChatList')} style={[styles.button, { backgroundColor: COLORS.SECONDARY }]} />
          <CustomButton title="Logout" onPress={handleLogout} style={[styles.button, { backgroundColor: COLORS.GRAY }]} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 16, color: COLORS.GRAY },
  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.DARK },
  notificationButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.WHITE, justifyContent: 'center', alignItems: 'center', elevation: 3, position: 'relative' },
  notificationIcon: { fontSize: 24 },
  badge: { position: 'absolute', top: 5, right: 5, backgroundColor: COLORS.DANGER, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: COLORS.WHITE, fontSize: 12, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  actionsContainer: { gap: 12 },
  button: { marginVertical: 0 },
});

export default HospitalDashboard;