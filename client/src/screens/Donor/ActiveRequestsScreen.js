// src/screens/Donor/ActiveRequestsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';

const ActiveRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await requestAPI.getActiveRequests();
      if (res.success) setRequests(res.data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, response) => {
    try {
      await requestAPI.respondToRequest(requestId, response);
      Alert.alert('Success', `You have ${response} the request`);
      fetchRequests();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.patient}>Patient: {item.patient_name}</Text>
      <Text style={styles.blood}>Need {item.blood_group} • {item.units_needed} unit(s)</Text>
      <Text style={styles.urgency}>Urgency: {item.urgency.toUpperCase()}</Text>
      <Text style={styles.hospital}>{item.hospital_name || 'Hospital not specified'}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => handleRespond(item.id, 'accepted')}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => handleRespond(item.id, 'rejected')}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Active Blood Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={fetchRequests}
        ListEmptyComponent={<Text style={styles.empty}>No active requests right now</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LIGHT },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
  card: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 12, elevation: 4 },
  patient: { fontSize: 16, fontWeight: 'bold' },
  blood: { fontSize: 18, color: COLORS.PRIMARY, fontWeight: 'bold', marginVertical: 5 },
  urgency: { fontSize: 14, color: COLORS.WARNING, fontWeight: '600' },
  hospital: { fontSize: 14, color: COLORS.GRAY },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  acceptBtn: { backgroundColor: COLORS.SUCCESS, padding: 12, borderRadius: 8, flex: 1, marginRight: 10 },
  rejectBtn: { backgroundColor: COLORS.DANGER, padding: 12, borderRadius: 8, flex: 1 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: COLORS.GRAY },
});

export default ActiveRequestsScreen;