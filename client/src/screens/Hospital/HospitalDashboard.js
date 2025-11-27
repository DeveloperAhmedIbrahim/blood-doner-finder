import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import { COLORS } from '../../utils/constants';
import { hospitalAPI } from '../../services/api';

const HospitalDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    totalVerified: 0,
  });
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
      await fetchStats();
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

const fetchStats = async () => {
  try {
    const response = await hospitalAPI.getPendingVerifications();
    if (response.success) {
      setStats(prev => ({
        ...prev,
        pendingVerifications: response.count || response.data.length,
      }));
    }
  } catch (error) {
    console.error('Fetch stats error:', error.message);
    // Alert.alert('Error', error.message);
  }
};

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
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
          <Text style={styles.welcomeText}>Hospital Dashboard</Text>
          <Text style={styles.nameText}>{userData?.name}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: COLORS.WARNING }]}
            onPress={() => navigation.navigate('PendingVerifications')}
          >
            <Text style={styles.statNumber}>{stats.pendingVerifications}</Text>
            <Text style={styles.statLabel}>Pending Verifications</Text>
          </TouchableOpacity>

          <View style={[styles.statCard, { backgroundColor: COLORS.SUCCESS }]}>
            <Text style={styles.statNumber}>{stats.totalVerified}</Text>
            <Text style={styles.statLabel}>Total Verified</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <CustomButton
            title="View Pending Verifications"
            onPress={() => navigation.navigate('PendingVerifications')}
            style={styles.actionButton}
          />

          <CustomButton
            title="View Blood Requests"
            onPress={() =>
              Alert.alert('Coming Soon', 'This feature will be available in Module 3')
            }
            style={[styles.actionButton, { backgroundColor: COLORS.SECONDARY }]}
          />

          <CustomButton
            title="Record Donation"
            onPress={() =>
              Alert.alert('Coming Soon', 'This feature will be available in Module 5')
            }
            style={[styles.actionButton, { backgroundColor: COLORS.SUCCESS }]}
          />

          <CustomButton
            title="Logout"
            onPress={handleLogout}
            style={[styles.actionButton, { backgroundColor: COLORS.GRAY }]}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📌 Hospital Responsibilities:</Text>
          <Text style={styles.infoText}>
            • Verify donor CNIC documents{'\n'}
            • Approve or reject verification requests{'\n'}
            • Manage blood requests{'\n'}
            • Record donation activities{'\n'}
            • Maintain accurate records
          </Text>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 15,
  },
  actionButton: {
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: '#E8F5FF',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.SECONDARY,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.DARK,
    lineHeight: 20,
  },
});

export default HospitalDashboard;