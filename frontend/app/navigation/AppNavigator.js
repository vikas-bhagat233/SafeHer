import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import EvidenceScreen from '../screens/EvidenceScreen';
import PasswordRecoveryScreen from '../screens/PasswordRecoveryScreen';
import SecurityQuestionsScreen from '../screens/SecurityQuestionsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#08111f' },
          headerTintColor: '#f5f7ff',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#08111f' }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} options={{ title: 'Recover password' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SafeHer' }} />
        <Stack.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Emergency Contacts' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Alert History' }} />
        <Stack.Screen name="Evidence" component={EvidenceScreen} options={{ title: 'Evidence Capture' }} />
        <Stack.Screen name="Resources" component={ResourcesScreen} options={{ title: 'Emergency Resources' }} />
        <Stack.Screen name="SecurityQuestions" component={SecurityQuestionsScreen} options={{ title: 'Security question' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}