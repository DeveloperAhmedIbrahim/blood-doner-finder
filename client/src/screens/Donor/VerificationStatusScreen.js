import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { COLORS } from '../../utils/constants';

const VerificationStatusScreen = ({ navigation }) => {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

const fetchVerificationStatus = async () => {
  try {
    const response = await donorAPI.getVerificationStatus();
    if (response.success) {
      setVerificationData(response.data);
    }
  } catch (error) {
    console.error('Error:', error.message);
    Alert.alert('Error', error.message || 'Failed to load status');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    fetchVerificationStatus();
  };

  const getStatusInfo = () => {
    if (!verificationData) {
      return {
        icon: '❓',
        title: 'No Verification Request',
        message: 'You have not submitted CNIC for verification yet.',
        color: COLORS.GRAY,
      };
    }

    switch (verificationData.verification_status) {
      case 'pending':
        return {
          icon: '⏳',
          title: 'Verification Pending',
          message: 'Your CNIC is under review by hospital. Please wait.',
          color: COLORS.WARNING,
        };
      case 'approved':
        return {
          icon: '✅',
          title: 'Verification Approved',
          message: 'Congratulations! You are now a verified donor.',
          color: COLORS.SUCCESS,
        };
      case 'rejected':
        return {
          icon: '❌',
          title: 'Verification Rejected',
          message: 'Your verification was rejected. Please check the reason below.',
          color: COLORS.DANGER,
        };
      default:
        return {
          icon: '❓',
          title: 'Unknown Status',
          message: 'Unable to determine verification status.',
          color: COLORS.GRAY,
        };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Icon and Title */}
        <View style={styles.statusHeader}>
          <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
          <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
            {statusInfo.title}
          </Text>
          <Text style={styles.statusMessage}>{statusInfo.message}</Text>
        </View>

        {/* Verification Details Card */}
        {verificationData && (
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Verification Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusInfo.color },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {verificationData.verification_status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Submitted At:</Text>
              <Text style={styles.detailValue}>
                {new Date(verificationData.submitted_at).toLocaleString()}
              </Text>
            </View>

            {verificationData.verified_at && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Verified At:</Text>
                <Text style={styles.detailValue}>
                  {new Date(verificationData.verified_at).toLocaleString()}
                </Text>
              </View>
            )}

            {verificationData.verified_by_name && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Verified By:</Text>
                <Text style={styles.detailValue}>
                  {verificationData.verified_by_name}
                </Text>
              </View>
            )}

            {/* Rejection Reason */}
            {verificationData.rejection_reason && (
              <View style={styles.rejectionBox}>
                <Text style={styles.rejectionTitle}>Rejection Reason:</Text>
                <Text style={styles.rejectionText}>
                  {verificationData.rejection_reason}
                </Text>
              </View>
            )}

            {/* CNIC Images Preview */}
            <View style={styles.imagesSection}>
              <Text style={styles.imagesSectionTitle}>Submitted CNIC Images:</Text>

              <View style={styles.imagesRow}>
                <View style={styles.imageBox}>
                  <Text style={styles.imageLabel}>Front Side</Text>
                  <Image
                    source={{
                      uri: `http://10.0.2.2:5000/uploads/cnic/${verificationData.cnic_front_image}`,
                    }}
                    style={styles.cnicImage}
                  />
                </View>

                <View style={styles.imageBox}>
                  <Text style={styles.imageLabel}>Back Side</Text>
                  <Image
                    source={{
                      uri: `http://10.0.2.2:5000/uploads/cnic/${verificationData.cnic_back_image}`,
                    }}
                    style={styles.cnicImage}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {verificationData?.verification_status === 'rejected' && (
            <CustomButton
              title="Re-upload CNIC"
              onPress={() => navigation.navigate('UploadCNIC')}
              style={styles.actionButton}
            />
          )}

          {!verificationData && (
            <CustomButton
              title="Upload CNIC for Verification"
              onPress={() => navigation.navigate('UploadCNIC')}
              style={styles.actionButton}
            />
          )}

          <CustomButton
            title="Back to Dashboard"
            onPress={() => navigation.navigate('DonorDashboard')}
            style={[styles.actionButton, { backgroundColor: COLORS.GRAY }]}
          />
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 30,
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusMessage: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
    paddingHorizontal: 20,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.DARK,
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectionBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#FFE5E5',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.DANGER,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.DANGER,
    marginBottom: 8,
  },
  rejectionText: {
    fontSize: 13,
    color: COLORS.DARK,
    lineHeight: 20,
  },
  imagesSection: {
    marginTop: 20,
  },
  imagesSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 15,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  imageBox: {
    flex: 1,
  },
  imageLabel: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginBottom: 5,
    textAlign: 'center',
  },
  cnicImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: COLORS.LIGHT,
  },
  actionsContainer: {
    gap: 15,
  },
  actionButton: {
    marginTop: 0,
  },
});

export default VerificationStatusScreen;