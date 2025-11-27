// src/screens/Donor/ActiveRequestsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';

const ActiveRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await requestAPI.getActiveRequests();
      if (res.success) {
        // Filter out rejected by me
        const filtered = res.data.filter(item => item.my_response !== 'rejected');
        setRequests(filtered);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('RequestDetails', { requestId: item.id })
      }
    >
      <View style={styles.headerRow}>
        <Text style={styles.patientName}>{item.patient_name || 'Unknown Patient'}</Text>
        <Text style={styles.urgencyBadge(item.urgency)}>
          {item.urgency.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.bloodGroup}>
        Need {item.blood_group} • {item.units_needed} unit(s)
      </Text>

      <Text style={styles.hospital}>
        {item.hospital_name || 'Hospital not specified'}
      </Text>

      <Text style={styles.phone}>
        Contact: {item.patient_phone || item.contact_number || 'N/A'}
      </Text>

      {item.my_response === 'accepted' && (
        <View style={styles.acceptedBadge}>
          <Text style={styles.badgeText}>Accepted by You ✓</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.tapText}>Tap to view details</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.centerText}>Loading requests...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Active Blood Requests Near You</Text>

      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active requests right now</Text>
            <Text style={styles.emptySub}>Pull down to refresh</Text>
          </View>
        }
        contentContainerStyle={requests.length === 0 ? { flex: 1 } : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 15,
    color: COLORS.DARK,
    backgroundColor: COLORS.WHITE,
    elevation: 2,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    margin: 12,
    padding: 18,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  urgencyBadge: (urgency) => ({
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    backgroundColor:
      urgency === 'critical'
        ? COLORS.DANGER
        : urgency === 'high'
        ? '#FF6B6B'
        : urgency === 'medium'
        ? COLORS.WARNING
        : COLORS.GRAY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  }),
  bloodGroup: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginVertical: 8,
  },
  hospital: {
    fontSize: 15,
    color: COLORS.DARK,
    marginBottom: 5,
  },
  phone: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 10,
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
  tapText: {
    fontSize: 13,
    color: COLORS.SECONDARY,
    fontStyle: 'italic',
  },
  centerText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.GRAY,
    marginBottom: 10,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
acceptedBadge: {
    backgroundColor: COLORS.SUCCESS,
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  badgeText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ActiveRequestsScreen;