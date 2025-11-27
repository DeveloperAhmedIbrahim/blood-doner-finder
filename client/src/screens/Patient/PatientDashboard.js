// src/screens/Patient/PatientDashboard.js
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
import { COLORS } from '../../utils/constants';
import { requestAPI } from '../../services/api';
import { chatAPI } from '../../services/api';

const PatientDashboard = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [myRequestsCount, setMyRequestsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }

      const [requestsRes, unreadRes] = await Promise.all([
        requestAPI.getMyRequests(),
        chatAPI.getUnreadCount(),
      ]);

      if (requestsRes.success) {
        setMyRequestsCount(requestsRes.count || requestsRes.data.length);
      }

      if (unreadRes.success) {
        setUnreadCount(unreadRes.data.unread_count);
      }
    } catch (error) {
      console.error('Load data error:', error.message);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['userToken', 'userData']);
          navigation.replace('ChooseRole');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.welcome}>Welcome, {userData?.name || 'Patient'}!</Text>
        <Text style={styles.subtext}>Need blood? Create a request now</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Requests</Text>
          <Text style={styles.bigNumber}>{myRequestsCount}</Text>
          <Text style={styles.cardText}>Total requests created</Text>
        </View>

        <CustomButton
          title="Create New Blood Request"
          onPress={() => navigation.navigate('CreateRequest')}
          style={styles.mainBtn}
        />

        <CustomButton
          title="View My Requests"
          onPress={() => navigation.navigate('MyRequests')}
          style={styles.secondaryBtn}
        />

        <CustomButton
          title={`Messages ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
          onPress={() => navigation.navigate('ChatList')}
          style={[styles.secondaryBtn, { backgroundColor: COLORS.SECONDARY }]}
        />        

        <CustomButton
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LIGHT },
  scrollContent: { padding: 20 },
  welcome: { fontSize: 28, fontWeight: 'bold', color: COLORS.DARK, marginBottom: 5 },
  subtext: { fontSize: 16, color: COLORS.GRAY, marginBottom: 30 },
  card: {
    backgroundColor: COLORS.WHITE,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
  },
  cardTitle: { fontSize: 16, color: COLORS.GRAY },
  bigNumber: { fontSize: 48, fontWeight: 'bold', color: COLORS.PRIMARY, marginVertical: 10 },
  cardText: { fontSize: 14, color: COLORS.GRAY },
  mainBtn: { backgroundColor: COLORS.PRIMARY, marginBottom: 15 },
  secondaryBtn: { backgroundColor: COLORS.SECONDARY, marginBottom: 15 },
  logoutBtn: { backgroundColor: COLORS.GRAY },
});

export default PatientDashboard;