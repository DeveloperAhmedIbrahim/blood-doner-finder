import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const ChooseRoleScreen = ({ navigation }) => {
  const roles = [
    {
      id: 'donor',
      title: '🩸 Donor',
      description: 'Register as a blood donor',
      color: '#E63946',
    },
    {
      id: 'patient',
      title: '🤕 Patient',
      description: 'Find blood donors',
      color: '#F77F00',
    },
    {
      id: 'hospital',
      title: '🏥 Hospital',
      description: 'Manage blood requests',
      color: '#06A77D',
    },
  ];

  const handleRoleSelect = (role) => {
    navigation.navigate('Register', { role });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Blood Donor Finder</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>

        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[styles.roleCard, { borderColor: role.color }]}
              onPress={() => handleRoleSelect(role.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E63946',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  rolesContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    marginTop: 40,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginBold: {
    color: '#E63946',
    fontWeight: 'bold',
  },
});

export default ChooseRoleScreen;