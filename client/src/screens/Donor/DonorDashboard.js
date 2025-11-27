import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import { donorAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';

const DonorDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }
      await fetchProfileData();
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const [profileRes, statusRes] = await Promise.all([
        donorAPI.getProfile(),
        donorAPI.getVerificationStatus(),
      ]);

      if (profileRes.success) {
        setProfileData(profileRes.data);
      }
      if (statusRes.success) {
        setVerificationStatus(statusRes.data);
      }
    } catch (error) {
      console.error('Fetch profile error:', error.message);
      Alert.alert('Error', error.message || 'Failed to load data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
          navigation.replace('ChooseRole');
        },
      },
    ]);
  };

  const getVerificationBadge = () => {
    if (!verificationStatus) {
      return { text: 'Not Submitted', color: COLORS.GRAY };
    }
    switch (verificationStatus.verification_status) {
      case 'pending':
        return { text: 'Pending', color: COLORS.WARNING };
      case 'approved':
        return { text: 'Verified ✓', color: COLORS.SUCCESS };
      case 'rejected':
        return { text: 'Rejected', color: COLORS.DANGER };
      default:
        return { text: 'Unknown', color: COLORS.GRAY };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const badge = getVerificationBadge();
  const isProfileComplete = profileData?.profile_completed;
  const isVerified = profileData?.is_verified === 1;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, Donor!</Text>
          <Text style={styles.nameText}>{userData?.name}</Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Verification Status</Text>
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeText}>{badge.text}</Text>
          </View>

          {verificationStatus?.rejection_reason && (
            <View style={styles.rejectionBox}>
              <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
              <Text style={styles.rejectionText}>
                {verificationStatus.rejection_reason}
              </Text>
            </View>
          )}
        </View>

        {/* Profile Info Card */}
        {isProfileComplete && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Profile Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Blood Group:</Text>
              <Text style={styles.infoValue}>
                {profileData?.blood_group || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CNIC:</Text>
              <Text style={styles.infoValue}>
                {profileData?.cnic || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {profileData?.address || 'Not provided'}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!isProfileComplete && (
            <CustomButton
              title="Complete Profile"
              onPress={() => navigation.navigate('CompleteProfile')}
              style={styles.actionButton}
            />
          )}

          {isProfileComplete && !verificationStatus && (
            <CustomButton
              title="Upload CNIC for Verification"
              onPress={() => navigation.navigate('UploadCNIC')}
              style={styles.actionButton}
            />
          )}

          {verificationStatus?.verification_status === 'rejected' && (
            <CustomButton
              title="Re-upload CNIC"
              onPress={() => navigation.navigate('UploadCNIC')}
              style={styles.actionButton}
            />
          )}

          {isVerified && (
            <CustomButton
              title="View Active Blood Requests"
              onPress={() => navigation.navigate('ActiveRequests')}
              style={[styles.actionButton, { backgroundColor: COLORS.SUCCESS }]}
            />
          )}

          <CustomButton
            title="Logout"
            onPress={handleLogout}
            style={[styles.actionButton, { backgroundColor: COLORS.GRAY }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  statusCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 10,
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 14,
  },
  rejectionBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.DANGER,
    marginBottom: 5,
  },
  rejectionText: {
    fontSize: 14,
    color: COLORS.DARK,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  actionsContainer: {
    gap: 15,
  },
  actionButton: {
    marginTop: 0,
  },
});

export default DonorDashboard;