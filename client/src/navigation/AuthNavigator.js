import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChooseRoleScreen from '../screens/ChooseRoleScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DonorDashboard from '../screens/Donor/DonorDashboard';
import CompleteProfileScreen from '../screens/Donor/CompleteProfileScreen';
import UploadCNICScreen from '../screens/Donor/UploadCNICScreen';
import VerificationStatusScreen from '../screens/Donor/VerificationStatusScreen';
import HospitalDashboard from '../screens/Hospital/HospitalDashboard';
import PendingVerificationsScreen from '../screens/Hospital/PendingVerificationsScreen';
import VerifyDonorScreen from '../screens/Hospital/VerifyDonorScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ChooseRole"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E63946',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="ChooseRole"
          component={ChooseRoleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            headerLeft: null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="DonorDashboard"
          component={DonorDashboard}
          options={{ 
            title: 'Donor Dashboard',
            headerLeft: null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{ title: 'Complete Profile' }}
        />
        <Stack.Screen
          name="UploadCNIC"
          component={UploadCNICScreen}
          options={{ title: 'Upload CNIC' }}
        />
        <Stack.Screen
          name="VerificationStatus"
          component={VerificationStatusScreen}
          options={{ title: 'Verification Status' }}
        />
        <Stack.Screen
          name="HospitalDashboard"
          component={HospitalDashboard}
          options={{ title: 'Hospital Dashboard' }}
        />
        <Stack.Screen
          name="PendingVerifications"
          component={PendingVerificationsScreen}
          options={{ title: 'Pending Verifications' }}
        />
        <Stack.Screen
          name="VerifyDonor"
          component={VerifyDonorScreen}
          options={{ title: 'Verify Donor' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;