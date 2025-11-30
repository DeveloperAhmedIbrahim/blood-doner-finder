import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { COLORS, BLOOD_GROUPS, URGENCY_LEVELS } from '../../utils/constants';
import { requestAPI } from '../../services/api';
import MapView, { Marker } from 'react-native-maps';

const CreateRequestScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    blood_group: null,
    urgency: null,
    units_needed: '1',
    hospital_name: '',
    contact_number: '',
    additional_notes: '',
  });

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getLocation();
  }, []);

  // -----------------------
  // Get Location
  // -----------------------
  const getLocation = () => {
    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      error => {
        setLocationLoading(false);
        Alert.alert(
          'Location Error',
          'Could not get your location. Please enable GPS and try again.'
        );
        console.log('Location error:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // -----------------------
  // onchange helper
  // -----------------------
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // -----------------------
  // Validation
  // -----------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.blood_group) newErrors.blood_group = 'Blood group is required';

    if (!formData.urgency) newErrors.urgency = 'Urgency level is required';

    if (!formData.units_needed.trim() || isNaN(formData.units_needed)) {
      newErrors.units_needed = 'Units must be a number';
    }

    if (!formData.hospital_name.trim())
      newErrors.hospital_name = 'Hospital name is required';

    if (!formData.contact_number.trim())
      newErrors.contact_number = 'Contact number is required';

    if (!location) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------
  // Submit
  // -----------------------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await requestAPI.createRequest({
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude,
        units_needed: parseInt(formData.units_needed) || 1,
      });

      Toast.show({
        type: 'success',
        text1: 'Request Created!',
        text2: 'Nearby donors have been notified.',
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  // ---------------
  // UI LOADER
  // ---------------
  if (locationLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ---------------
  // UI
  // ---------------
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create Blood Request</Text>

          {/* BLOOD GROUP DROPDOWN */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Group *</Text>

            <Dropdown
              style={[styles.dropdown, errors.blood_group && styles.inputError]}
              data={BLOOD_GROUPS}
              labelField="label"
              valueField="value"
              placeholder="Select blood group"
              value={formData.blood_group}
              onChange={item => handleChange('blood_group', item.value)}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            {errors.blood_group && (
              <Text style={styles.errorText}>{errors.blood_group}</Text>
            )}
          </View>

          {/* UNITS */}
          <CustomInput
            label="Units Needed *"
            placeholder="1"
            value={formData.units_needed}
            onChangeText={val => handleChange('units_needed', val)}
            keyboardType="numeric"
            error={errors.units_needed}
          />

          {/* URGENCY DROPDOWN */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Urgency Level *</Text>

            <Dropdown
              style={[styles.dropdown, errors.urgency && styles.inputError]}
              data={URGENCY_LEVELS}
              labelField="label"
              valueField="value"
              placeholder="Select urgency level"
              value={formData.urgency}
              onChange={item => handleChange('urgency', item.value)}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />

            {errors.urgency && (
              <Text style={styles.errorText}>{errors.urgency}</Text>
            )}
          </View>

          {/* HOSPITAL */}
          <CustomInput
            label="Hospital Name *"
            placeholder="e.g. Jinnah Hospital"
            value={formData.hospital_name}
            onChangeText={val => handleChange('hospital_name', val)}
            error={errors.hospital_name}
          />

          {/* CONTACT */}
          <CustomInput
            label="Contact Number *"
            placeholder="03xx-xxxxxxx"
            value={formData.contact_number}
            onChangeText={val => handleChange('contact_number', val)}
            error={errors.contact_number}
            keyboardType="phone-pad"
          />

          {/* NOTES */}
          <CustomInput
            label="Additional Notes (Optional)"
            placeholder="Any special instructions..."
            value={formData.additional_notes}
            onChangeText={val => handleChange('additional_notes', val)}
            multiline
            numberOfLines={4}
          />

          {location && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Your Location"
                  pinColor={COLORS.PRIMARY}
                />
              </MapView>
            </View>
          )}

          {errors.location && (
            <Text style={[styles.errorText, { marginTop: -10 }]}>
              {errors.location}
            </Text>
          )}

          {/* SUBMIT */}
          <CustomButton
            title={loading ? 'Creating Request...' : 'Create Request'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --------------------
// Styles
// --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 20,
    textAlign: 'center',
  },

  // Layout
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.DARK, marginBottom: 5 },

  // DROPDOWN
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: COLORS.WHITE,
  },
  inputError: {
    borderColor: COLORS.DANGER,
  },
  placeholder: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.DARK,
  },

  errorText: { color: COLORS.DANGER, fontSize: 12, marginTop: 5 },

  submitBtn: { marginTop: 20 },

  // Loader screen
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: COLORS.GRAY },

  mapContainer: { height: 200, borderRadius: 15, overflow: 'hidden', marginBottom: 15 },
  map: { flex: 1 },  
});

export default CreateRequestScreen;