import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { requestAPI } from '../../services/api';
import { COLORS } from '../../utils/constants';
// import MapView, { Marker } from 'react-native-maps';

const RequestDetailsScreen = ({ route, navigation }) => {
  const { requestId } = route.params;
  const [request, setRequest] = useState(null);
  const [myResponse, setMyResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await requestAPI.getRequestDetails(requestId);
      if (res.success) {
        setRequest(res.data.request);
        setMyResponse(res.data.request.my_response);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (response) => {
    try {
      await requestAPI.respondToRequest(requestId, response);
      setMyResponse(response);
      Alert.alert('Success', `You have ${response} the request`);
      // Navigate back to list and refresh
      navigation.navigate('ActiveRequests');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading || !request) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.center}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Blood Request Details</Text>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Patient Name:</Text>
          <Text style={styles.value}>{request.patient_name}</Text>

          <Text style={styles.label}>Blood Group:</Text>
          <Text style={styles.value}>{request.blood_group}</Text>

          <Text style={styles.label}>Units Needed:</Text>
          <Text style={styles.value}>{request.units_needed}</Text>

          <Text style={styles.label}>Urgency:</Text>
          <Text style={styles.value}>{request.urgency.toUpperCase()}</Text>

          <Text style={styles.label}>Hospital:</Text>
          <Text style={styles.value}>{request.hospital_name || 'Not specified'}</Text>

          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{request.contact_number || request.patient_phone}</Text>

          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.value}>{request.additional_notes || 'None'}</Text>

          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>Lat: {request.latitude}, Lng: {request.longitude}</Text>

          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{request.status.toUpperCase()}</Text>

          <Text style={styles.label}>Your Response:</Text>
          <Text style={styles.value}>
            {myResponse ? myResponse.toUpperCase() : 'Not responded yet'}
          </Text>
        </View>

        {request.latitude && request.longitude && (
          <View style={styles.mapContainer}>
            <Text style={styles.label}>Location:</Text>
            {/* <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(request.latitude),
                longitude: parseFloat(request.longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(request.latitude),
                  longitude: parseFloat(request.longitude),
                }}
                title={request.hospital_name}
                pinColor={COLORS.PRIMARY}
              />
            </MapView> */}
          </View>
        )}

        {!myResponse && (
          <>
            <CustomButton
              title="Accept Request"
              onPress={() => handleRespond('accepted')}
              style={styles.acceptBtn}
            />
            <CustomButton
              title="Reject Request"
              onPress={() => handleRespond('rejected')}
              style={styles.rejectBtn}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LIGHT },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.DARK, marginBottom: 20, textAlign: 'center' },
  infoCard: { backgroundColor: COLORS.WHITE, padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  label: { fontSize: 14, color: COLORS.GRAY, marginBottom: 5 },
  value: { fontSize: 16, color: COLORS.DARK, marginBottom: 15, fontWeight: '600' },
  acceptBtn: { backgroundColor: COLORS.SUCCESS, marginBottom: 10 },
  rejectBtn: { backgroundColor: COLORS.DANGER },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', fontSize: 16, color: COLORS.GRAY },
  mapContainer: { marginBottom: 20 },
  map: { height: 250, borderRadius: 15 },
});

export default RequestDetailsScreen;