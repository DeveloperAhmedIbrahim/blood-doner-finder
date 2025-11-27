import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { BASE_URL, COLORS } from '../../utils/constants';
import { hospitalAPI } from '../../services/api';

const VerifyDonorScreen = ({ route, navigation }) => {
  const { verification } = route.params;
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const handleApprove = () => {
    Alert.alert(
      'Approve Verification',
      `Are you sure you want to approve ${verification.name} as a verified donor?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => submitVerification('approved'),
        },
      ]
    );
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

const submitVerification = async (status, reason = null) => {
  if (status === 'rejected' && !reason?.trim()) {
    Alert.alert('Error', 'Please provide a rejection reason');
    return;
  }

  setLoading(true);
  try {
    const response = await hospitalAPI.verifyDonor(verification.id, status, reason);
    
    if (response.success) {
      Alert.alert(
        'Success',
        `Donor has been ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  } catch (error) {
    Alert.alert('Error', error.message || 'Failed to process verification');
  } finally {
    setLoading(false);
    setShowRejectModal(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.title}>Verify Donor: {verification.name}</Text>
        <Text style={styles.subtitle}>Review CNIC and details before verification</Text>

        {/* Donor Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Donor Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Group:</Text>
            <Text style={styles.infoValue}>{verification.blood_group}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CNIC:</Text>
            <Text style={styles.infoValue}>{verification.cnic}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{verification.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{verification.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{verification.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Submitted At:</Text>
            <Text style={styles.infoValue}>
              {new Date(verification.submitted_at).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* CNIC Images */}
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>CNIC Images</Text>

          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Front Side</Text>
            <Image
              source={{ uri: `${BASE_URL}/uploads/cnic/${verification.cnic_front_image}` }}
              style={styles.cnicImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Back Side</Text>
            <Image
              source={{ uri: `${BASE_URL}/uploads/cnic/${verification.cnic_back_image}` }}
              style={styles.cnicImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Approve Donor"
            onPress={handleApprove}
            loading={loading}
            style={[styles.actionButton, { backgroundColor: COLORS.SUCCESS }]}
          />

          <CustomButton
            title="Reject Donor"
            onPress={handleReject}
            loading={loading}
            style={[styles.actionButton, { backgroundColor: COLORS.DANGER }]}
          />
        </View>
      </ScrollView>

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Verification</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for rejection
            </Text>

            <CustomInput
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
              style={styles.reasonInput}
            />

            <View style={styles.modalButtons}>
              <CustomButton
                title="Cancel"
                onPress={() => setShowRejectModal(false)}
                style={[styles.modalButton, { backgroundColor: COLORS.GRAY }]}
              />

              <CustomButton
                title="Submit Rejection"
                onPress={() => submitVerification('rejected', rejectionReason)}
                loading={loading}
                style={[styles.modalButton, { backgroundColor: COLORS.DANGER }]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.DARK,
    flex: 1,
    textAlign: 'right',
  },
  imagesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 15,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 10,
  },
  cnicImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 20,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 15,
  },
  reasonInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
  },
});

export default VerifyDonorScreen;