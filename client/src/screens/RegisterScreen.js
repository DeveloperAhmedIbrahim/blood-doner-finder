import React, { useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ route, navigation }) => {
  const { login } = useAuth(); 
  const { role } = route.params;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role,
      };

      const response = await authAPI.register(userData);

      if (response.success) {
        await login(response.data.token, response.data);
        Alert.alert('Success', 'Registration successful');
        // Navigation automatic
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Registration failed');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Register as a <Text style={styles.roleText}>{role}</Text>
          </Text>

          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              error={errors.name}
            />

            <CustomInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              error={errors.email}
            />

            <CustomInput
              label="Phone Number"
              placeholder="03001234567"
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <CustomInput
              label="Password"
              placeholder="Enter password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <CustomButton
              title="Register"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />

            <CustomButton
              title="Already have an account? Login"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
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
    backgroundColor: '#fff',
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
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  roleText: {
    color: '#E63946',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  form: {
    gap: 10,
  },
  registerButton: {
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: 'slategray',
    borderWidth: 1,
    borderColor: '#E63946',
    marginTop: 10,
  },
});

export default RegisterScreen;