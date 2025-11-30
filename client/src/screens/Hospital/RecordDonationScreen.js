import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { COLORS } from '../../utils/constants';
import { donationAPI, requestAPI } from '../../services/api';

const RecordDonationScreen = ({ navigation }) => {
  const [activeRequests, setActiveRequests] = useState([]);
  const [donors, setDonors] = useState([]);

  const [formData, setFormData] = useState({
    request_id: null,
    donor_id: null,
    units_donated: '1',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const fetchActiveRequests = async () => {
    try {
      const res = await requestAPI.getAllRequests();
      if (res.success) {
        const active = res.data.filter(r => r.status === 'active');
        setActiveRequests(
          active.map(r => ({
            label: `${r.patient_name} - ${r.blood_group} (${r.urgency})`,
            value: r.id,
            blood_group: r.blood_group,
          }))
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRequestChange = (requestId) => {
    setFormData(prev => ({ ...prev, request_id: requestId, donor_id: null }));

    const selected = activeRequests.find(r => r.value === requestId);

    if (selected) {
      setDonors([
        { label: 'Search donors manually for now', value: null }
      ]);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.request_id) {
      newErrors.request_id = 'Please select a blood request';
    }

    if (!formData.donor_id) {
      newErrors.donor_id = 'Please enter donor ID';
    }

    if (!formData.units_donated || isNaN(formData.units_donated)) {
      newErrors.units_donated = 'Units must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await donationAPI.recordDonation({
        ...formData,
        units_donated: parseInt(formData.units_donated),
      });

      Alert.alert('Success', 'Donation recorded successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Record Donation</Text>

          {/* Blood Request Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Blood Request *</Text>

            <Dropdown
              style={[styles.dropdown, errors.request_id && styles.inputError]}
              data={activeRequests}
              labelField="label"
              valueField="value"
              placeholder="Select request"
              value={formData.request_id}
              onChange={item => handleRequestChange(item.value)}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
            />
            {errors.request_id && (
              <Text style={styles.errorText}>{errors.request_id}</Text>
            )}
          </View>

          {/* Donor ID */}
          <CustomInput
            label="Donor ID *"
            placeholder="Enter donor user ID"
            value={formData.donor_id}
            onChangeText={val => handleChange('donor_id', val)}
            keyboardType="numeric"
            error={errors.donor_id}
          />

          {/* Units Donated */}
          <CustomInput
            label="Units Donated *"
            placeholder="1"
            value={formData.units_donated}
            onChangeText={val => handleChange('units_donated', val)}
            keyboardType="numeric"
            error={errors.units_donated}
          />

          {/* Notes */}
          <CustomInput
            label="Notes (Optional)"
            placeholder="Any additional notes..."
            value={formData.notes}
            onChangeText={val => handleChange('notes', val)}
            multiline
            numberOfLines={4}
          />

          {/* Submit Button */}
          <CustomButton
            title={loading ? 'Recording...' : 'Record Donation'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitBtn}
          />

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ Note:</Text>
            <Text style={styles.infoText}>
              • Donor must have donated at hospital{'\n'}
              • Donation will update donor eligibility{'\n'}
              • Request will be marked as fulfilled{'\n'}
              • Notifications will be sent automatically
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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

  inputContainer: { marginBottom: 15 },

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

  inputError: { borderColor: COLORS.DANGER },

  placeholder: { fontSize: 16, color: COLORS.GRAY },
  selectedText: { fontSize: 16, color: COLORS.DARK },

  errorText: { color: COLORS.DANGER, fontSize: 12, marginTop: 5 },

  submitBtn: { marginTop: 20 },

  infoBox: {
    backgroundColor: '#E8F5FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.SECONDARY,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 8,
  },

  infoText: {
    fontSize: 12,
    color: COLORS.DARK,
    lineHeight: 20,
  },
});

export default RecordDonationScreen;
