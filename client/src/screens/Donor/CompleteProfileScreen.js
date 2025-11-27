import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import { Dropdown } from 'react-native-element-dropdown';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { BLOOD_GROUPS, COLORS } from '../../utils/constants';
import { donorAPI } from '../../services/api';

const CompleteProfileScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    blood_group: null,
    cnic: '',
    address: '',
    latitude: null,
    longitude: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getLocation = () => {
    setGettingLocation(true);
    Geolocation.getCurrentPosition(
      position => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGettingLocation(false);
        Alert.alert('Success', 'Location captured successfully');
      },
      error => {
        setGettingLocation(false);
        Alert.alert('Error', 'Failed to get location. Please try again.');
        console.error('Location error:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.blood_group) {
      newErrors.blood_group = 'Blood group is required';
    }

    if (!formData.cnic.trim()) {
      newErrors.cnic = 'CNIC is required';
    } else {
      const cnicNumbers = formData.cnic.replace(/-/g, '');
      if (!/^\d{13}$/.test(cnicNumbers)) {
        newErrors.cnic = 'CNIC must be 13 digits';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await donorAPI.completeProfile(formData);

      if (response.success) {
        Alert.alert('Success', 'Profile completed! Now upload your CNIC.', [
          { text: 'OK', onPress: () => navigation.replace('UploadCNIC') },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Provide your details to become a verified donor
          </Text>

          <View style={styles.form}>
            {/* Blood Group Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Blood Group *</Text>
              <Dropdown
                style={[styles.dropdown, errors.blood_group && styles.inputError]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={BLOOD_GROUPS}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select blood group"
                value={formData.blood_group}
                onChange={item => handleChange('blood_group', item.value)}
              />
              {errors.blood_group && (
                <Text style={styles.errorText}>{errors.blood_group}</Text>
              )}
            </View>

            {/* CNIC Input */}
            <CustomInput
              label="CNIC Number *"
              placeholder="1234567890123"
              value={formData.cnic}
              onChangeText={value => handleChange('cnic', value)}
              keyboardType="numeric"
              maxLength={13}
              error={errors.cnic}
            />

            {/* Address Input */}
            <CustomInput
              label="Address *"
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={value => handleChange('address', value)}
              error={errors.address}
            />

            {/* Get Location Button */}
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getLocation}
              disabled={gettingLocation}
            >
              <Text style={styles.locationButtonText}>
                {gettingLocation ? 'Getting Location...' : '📍 Get Current Location'}
              </Text>
            </TouchableOpacity>

            {formData.latitude && formData.longitude && (
              <Text style={styles.locationText}>
                ✓ Location captured: {formData.latitude.toFixed(4)},{' '}
                {formData.longitude.toFixed(4)}
              </Text>
            )}

            {/* Submit Button */}
            <CustomButton
              title="Complete Profile"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 30,
  },
  form: {
    gap: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 5,
  },
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
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.DARK,
  },
  errorText: {
    color: COLORS.DANGER,
    fontSize: 12,
    marginTop: 5,
  },
  locationButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  locationButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    textAlign: 'center',
    marginTop: 5,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default CompleteProfileScreen;