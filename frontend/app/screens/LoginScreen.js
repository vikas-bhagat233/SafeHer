import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';
import { verifyBiometricAccess } from '../services/biometricService';
import { theme } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Login Failed', 'Email and password are required');
      return;
    }

    try {
      const res = await api.post('/auth/login', {
        email, password
      });

      const biometric = await verifyBiometricAccess();
      if (!biometric.ok) {
        Alert.alert('Login blocked', biometric.reason || 'Biometric verification failed.');
        return;
      }

      Alert.alert("Login Success");
      navigation.navigate('Home', { user: res.data.user });

    } catch (err) {
      const message = err.response?.data?.error || 'Unable to reach server';
      Alert.alert('Login Failed', message);
    }
  };

  return (
    <ScreenShell>
      <View style={styles.brandBlock}>
        <Text style={styles.brand}>SafeHer</Text>
        <Text style={styles.tagline}>Fast, calm, and clear emergency support.</Text>
      </View>

      <SectionCard title="Welcome back" subtitle="Sign in to access SOS alerts, contacts, and your dashboard.">
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <PrimaryButton title="Login" onPress={login} />
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.linkButton}>
            <Text style={styles.linkText}>Create a new account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PasswordRecovery')} style={styles.linkButton}>
            <Text style={styles.linkText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  brandBlock: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center'
  },
  brand: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  tagline: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    textAlign: 'center'
  },
  form: {
    gap: theme.spacing.sm
  },
  input: {
    minHeight: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm
  },
  linkText: {
    color: theme.colors.secondary,
    fontWeight: '700'
  }
});