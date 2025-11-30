import React, { useEffect, useState } from 'react';
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

const DonorDonationHistoryScreen = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await donationAPI.getDonorHistory();
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
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🩸</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.hospital}>{item.hospital_name}</Text>
        <Text style={styles.patient}>Helped: {item.patient_name}</Text>
        <Text style={styles.units}>{item.units_donated} unit(s) donated</Text>
        <Text style={styles.date}>
          {new Date(item.donation_date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.centerText}>Loading history...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Donation History</Text>
        <Text style={styles.subtitle}>
          {donations.length} lives saved ❤️
        </Text>
      </View>

      <FlatList
        data={donations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No donations yet. Start saving lives!
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LIGHT },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.WHITE,
    marginTop: 5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    margin: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 30,
  },
  cardContent: {
    flex: 1,
  },
  hospital: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  patient: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: 4,
  },
  units: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 4,
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

export default DonorDonationHistoryScreen;