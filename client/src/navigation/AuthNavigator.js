import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

// Auth Screens
import ChooseRoleScreen from '../screens/Auth/ChooseRoleScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import LoginScreen from '../screens/Auth/LoginScreen';

// Donor Screens
import DonorDashboard from '../screens/Donor/DonorDashboard';
import CompleteProfileScreen from '../screens/Donor/CompleteProfileScreen';
import UploadCNICScreen from '../screens/Donor/UploadCNICScreen';
import VerificationStatusScreen from '../screens/Donor/VerificationStatusScreen';
import ActiveRequestsScreen from '../screens/Donor/ActiveRequestsScreen';
import RequestDetailsScreen from '../screens/Donor/RequestDetailsScreen';
import DonorDonationHistoryScreen from '../screens/Donor/DonationHistoryScreen';

// Patient Screens
import PatientDashboard from '../screens/Patient/PatientDashboard';
import CreateRequestScreen from '../screens/Patient/CreateRequestScreen';
import MyRequestsScreen from '../screens/Patient/MyRequestsScreen';

// Hospital Screens
import HospitalDashboard from '../screens/Hospital/HospitalDashboard';
import PendingVerificationsScreen from '../screens/Hospital/PendingVerificationsScreen';
import VerifyDonorScreen from '../screens/Hospital/VerifyDonorScreen';
import RecordDonationScreen from '../screens/Hospital/RecordDonationScreen';
import DonationHistoryScreen from '../screens/Hospital/DonationHistoryScreen';

// Chat Screens
import ChatListScreen from '../screens/Chat/ChatListScreen';
import ChatScreen from '../screens/Chat/ChatScreen';

// Common Screens
import NotificationsScreen from '../screens/Common/NotificationsScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.PRIMARY },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="ChooseRole"
              component={ChooseRoleScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : userRole === 'donor' ? (
          // Donor Stack
          <>
            <Stack.Screen
              name="DonorDashboard"
              component={DonorDashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
            <Stack.Screen name="UploadCNIC" component={UploadCNICScreen} />
            <Stack.Screen name="VerificationStatus" component={VerificationStatusScreen} />
            <Stack.Screen name="ActiveRequests" component={ActiveRequestsScreen} />
            <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} />
            <Stack.Screen name="DonorDonationHistory" component={DonorDonationHistoryScreen} />
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        ) : userRole === 'patient' ? (
          // Patient Stack
          <>
            <Stack.Screen
              name="PatientDashboard"
              component={PatientDashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
            <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        ) : userRole === 'hospital' ? (
          // Hospital Stack
          <>
            <Stack.Screen
              name="HospitalDashboard"
              component={HospitalDashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="PendingVerifications" component={PendingVerificationsScreen} />
            <Stack.Screen name="VerifyDonor" component={VerifyDonorScreen} />
            <Stack.Screen name="RecordDonation" component={RecordDonationScreen} />
            <Stack.Screen name="DonationHistory" component={DonationHistoryScreen} />
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;