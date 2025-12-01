import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { donationAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

const DonationHistoryScreen = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { fetchDonations(); }, []));  

  const fetchDonations = async () => {
    try {
      const res = await donationAPI.getHospitalDonations();
      if (res.success) {
        setDonations(res.data);
      }
    } catch (error) {
      console.error('Fetch donations error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDonations();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.donorName}>Donor: {item.donor_name}</Text>
      <Text style={styles.bloodGroup}>{item.donor_blood_group}</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.infoText}>Patient: {item.patient_name}</Text>
      <Text style={styles.infoText}>Units: {item.units_donated}</Text>
      <Text style={styles.infoText}>
        Date: {new Date(item.donation_date).toLocaleDateString()}
      </Text>
      
      {item.notes && (
        <Text style={styles.notes}>Notes: {item.notes}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.centerText}>Loading donations...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Donation History</Text>

      <FlatList
        data={donations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No donations recorded yet</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LIGHT },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: COLORS.DARK,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    margin: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  donorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  bloodGroup: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 5,
  },
  notes: {
    fontSize: 13,
    color: COLORS.DARK,
    fontStyle: 'italic',
    marginTop: 8,
  },
  centerText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: COLORS.GRAY,
  },
});

export default DonationHistoryScreen;