// src/screens/Patient/MyRequestsScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

const MyRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  const fetchRequests = async () => {
    try {
      const res = await requestAPI.getMyRequests();
      if (res.success) setRequests(res.data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.blood}>{item.blood_group} • {item.units_needed} unit(s)</Text>
      <Text style={styles.urgency}>Urgency: {item.urgency.toUpperCase()}</Text>
      <Text style={styles.hospital}>{item.hospital_name || 'Not specified'}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) return <Text style={styles.center}>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Blood Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.center}>No requests yet</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LIGHT },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  card: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 10, elevation: 3 },
  blood: { fontSize: 18, fontWeight: 'bold', color: COLORS.PRIMARY },
  urgency: { fontSize: 14, color: COLORS.WARNING, fontWeight: '600' },
  hospital: { fontSize: 14, color: COLORS.DARK },
  status: { fontSize: 14, color: COLORS.SUCCESS, fontWeight: 'bold' },
  date: { fontSize: 12, color: COLORS.GRAY, marginTop: 5 },
  center: { textAlign: 'center', marginTop: 50, fontSize: 16, color: COLORS.GRAY },
});

export default MyRequestsScreen;