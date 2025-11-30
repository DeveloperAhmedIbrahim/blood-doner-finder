import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import StatCard from '../../components/StatCard';
import GradientCard from '../../components/GradientCard';
import { donorAPI, chatAPI, notificationAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
import notificationService from '../../services/notificationService';

const DonorDashboard = ({ navigation }) => {
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

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
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }

      const [profileRes, statusRes, chatRes, notifRes] = await Promise.all([
        donorAPI.getProfile(),
        donorAPI.getVerificationStatus(),
        chatAPI.getUnreadCount(),
        notificationAPI.getUnreadCount(),
      ]);

      if (profileRes.success) setProfileData(profileRes.data);
      if (statusRes.success) setVerificationStatus(statusRes.data);
      if (chatRes.success) setUnreadMessages(chatRes.data.unread_count);
      if (notifRes.success) setUnreadNotifications(notifRes.data.unread_count);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const getVerificationBadge = () => {
    if (!verificationStatus) {
      return { text: 'Not Submitted', color: COLORS.GRAY, icon: '❓' };
    }
    switch (verificationStatus.verification_status) {
      case 'pending':
        return { text: 'Pending Review', color: COLORS.WARNING, icon: '⏳' };
      case 'approved':
        return { text: 'Verified Donor', color: COLORS.SUCCESS, icon: '✅' };
      case 'rejected':
        return { text: 'Rejected', color: COLORS.DANGER, icon: '❌' };
      default:
        return { text: 'Unknown', color: COLORS.GRAY, icon: '❓' };
    }
  };

  const badge = getVerificationBadge();
  const isProfileComplete = profileData?.profile_completed;
  const isVerified = profileData?.is_verified;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{userData?.name || 'Donor'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Verification Status Card */}
        <GradientCard colors={[badge.color]}>
          <View style={styles.statusContent}>
            <Text style={styles.statusIcon}>{badge.icon}</Text>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Verification Status</Text>
              <Text style={styles.statusText}>{badge.text}</Text>
            </View>
          </View>

          {verificationStatus?.rejection_reason && (
            <View style={styles.rejectionBox}>
              <Text style={styles.rejectionText}>
                Reason: {verificationStatus.rejection_reason}
              </Text>
            </View>
          )}
        </GradientCard>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <StatCard
            icon="💬"
            title="Messages"
            value={unreadMessages}
            color={COLORS.SECONDARY}
            onPress={() => navigation.navigate('ChatList')}
          />
          <StatCard
            icon="🩸"
            title="Blood Type"
            value={profileData?.blood_group || 'N/A'}
            color={COLORS.PRIMARY}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!isProfileComplete && (
            <CustomButton
              title="Complete Your Profile"
              onPress={() => navigation.navigate('CompleteProfile')}
              style={[styles.button, { backgroundColor: COLORS.PRIMARY }]}
            />
          )}

          {isProfileComplete && !verificationStatus && (
            <CustomButton
              title="Upload CNIC for Verification"
              onPress={() => navigation.navigate('UploadCNIC')}
              style={[styles.button, { backgroundColor: COLORS.PRIMARY }]}
            />
          )}

          {verificationStatus?.verification_status === 'rejected' && (
            <CustomButton
              title="Re-upload CNIC"
              onPress={() => navigation.navigate('UploadCNIC')}
              style={[styles.button, { backgroundColor: COLORS.WARNING }]}
            />
          )}

          {isVerified && (
            <>
              <CustomButton
                title="View Blood Requests"
                onPress={() => navigation.navigate('ActiveRequests')}
                style={[styles.button, { backgroundColor: COLORS.SUCCESS }]}
              />
              <CustomButton
                title="My Donation History"
                onPress={() => navigation.navigate('DonorDonationHistory')}
                style={[styles.button, { backgroundColor: COLORS.SECONDARY }]}
              />
              <CustomButton
                title="Messages"
                onPress={() => navigation.navigate('ChatList')}
                style={[styles.button, { backgroundColor: COLORS.SECONDARY }]}
              />
            </>
          )}

          <CustomButton
            title="Logout"
            onPress={handleLogout}
            style={[styles.button, { backgroundColor: COLORS.GRAY }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.DANGER,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 50,
    marginRight: 15,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  rejectionBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  rejectionText: {
    color: COLORS.WHITE,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  button: {
    marginVertical: 0,
  },
});

export default DonorDashboard;