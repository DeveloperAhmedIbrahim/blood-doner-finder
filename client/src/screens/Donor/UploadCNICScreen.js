import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomButton from '../../components/CustomButton';
import { COLORS } from '../../utils/constants';
import { donorAPI } from '../../services/api';

const UploadCNICScreen = ({ navigation }) => {
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectImage = (side) => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(side),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(side),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = (side) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0]) {
        if (side === 'front') {
          setCnicFront(response.assets[0]);
        } else {
          setCnicBack(response.assets[0]);
        }
      }
    });
  };

  const openGallery = (side) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0]) {
        if (side === 'front') {
          setCnicFront(response.assets[0]);
        } else {
          setCnicBack(response.assets[0]);
        }
      }
    });
  };

const handleUpload = async () => {
  if (!cnicFront || !cnicBack) {
    Alert.alert('Error', 'Please select both CNIC images');
    return;
  }

  setLoading(true);
  const formData = new FormData();
  formData.append('cnic_front', {
    uri: cnicFront.uri,
    type: cnicFront.type || 'image/jpeg',
    name: cnicFront.fileName || 'cnic_front.jpg',
  });
  formData.append('cnic_back', {
    uri: cnicBack.uri,
    type: cnicBack.type || 'image/jpeg',
    name: cnicBack.fileName || 'cnic_back.jpg',
  });

  try {
    const response = await donorAPI.uploadCNIC(formData);

    if (response.success) {
      Alert.alert('Success', 'CNIC uploaded! Waiting for verification.', [
        { text: 'OK', onPress: () => navigation.replace('DonorDashboard') },
      ]);
    }
  } catch (error) {
    Alert.alert('Error', error.message || 'Upload failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Upload CNIC</Text>
        <Text style={styles.subtitle}>
          Please upload clear photos of your CNIC front and back
        </Text>

        {/* CNIC Front */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>CNIC Front Side</Text>
          {cnicFront ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: cnicFront.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => selectImage('front')}
              >
                <Text style={styles.changeButtonText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => selectImage('front')}
            >
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Tap to upload CNIC front</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CNIC Back */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>CNIC Back Side</Text>
          {cnicBack ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: cnicBack.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => selectImage('back')}
              >
                <Text style={styles.changeButtonText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => selectImage('back')}
            >
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Tap to upload CNIC back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Upload Button */}
        <CustomButton
          title="Submit for Verification"
          onPress={handleUpload}
          loading={loading}
          disabled={!cnicFront || !cnicBack}
          style={styles.uploadButton}
        />

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>📌 Important:</Text>
          <Text style={styles.noteText}>
            • Make sure CNIC details are clearly visible{'\n'}
            • Photos should be well-lit{'\n'}
            • CNIC number should match your registered CNIC{'\n'}
            • Hospital will verify your CNIC before approval
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
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
  uploadSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 10,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
resizeMode: 'contain',
  },
  changeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
  },
  changeButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  noteBox: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.GRAY,
    lineHeight: 22,
  },
});

export default UploadCNICScreen;    