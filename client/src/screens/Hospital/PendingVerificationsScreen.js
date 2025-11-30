import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/constants';
import { hospitalAPI } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

const PendingVerificationsScreen = ({ navigation }) => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchVerifications();
    }, [])
  );

  const fetchVerifications = async () => {
  try {
    const response = await hospitalAPI.getPendingVerifications();
    if (response.success) {
      setVerifications(response.data);
    }
  } catch (error) {
    console.error('Fetch verifications error:', error.message);
    Alert.alert('Error', error.message || 'Failed to load verifications');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    fetchVerifications();
  };

  const renderVerificationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('VerifyDonor', { verification: item })
      }
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.donorName}>{item.name}</Text>
          <Text style={styles.donorEmail}>{item.email}</Text>
        </View>
        <View style={styles.bloodGroupBadge}>
          <Text style={styles.bloodGroupText}>{item.blood_group}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>CNIC:</Text>
          <Text style={styles.infoValue}>{item.cnic}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{item.phone || 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue} numberOfLines={2}>
            {item.address || 'N/A'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Submitted:</Text>
          <Text style={styles.infoValue}>
            {new Date(item.submitted_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>Tap to view CNIC & verify →</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading verifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Pending Verifications</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{verifications.length}</Text>
        </View>
      </View>

      {verifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✓</Text>
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptyText}>
            No pending verifications at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={verifications}
          renderItem={renderVerificationCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.GRAY,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  countBadge: {
    backgroundColor: COLORS.PRIMARY,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  donorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  donorEmail: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  bloodGroupBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bloodGroupText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.GRAY,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.DARK,
    flex: 1,
    textAlign: 'right',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  viewDetailsText: {
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
});

export default PendingVerificationsScreen;