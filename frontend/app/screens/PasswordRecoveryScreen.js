import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';
import { theme } from '../utils/theme';

export default function PasswordRecoveryScreen({ navigation }) {
  const [stage, setStage] = useState('email');
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSecurityQuestion = async () => {
    if (!email) {
      Alert.alert('Email required', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/security-question', { email });
      setSecurityQuestion(res.data.security_question);
      setStage('answer');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to fetch security question';
      Alert.alert('Unable to continue', message);
    } finally {
      setLoading(false);
    }
  };

  const verifyAnswer = async () => {
    if (!securityAnswer) {
      Alert.alert('Answer required', 'Please provide your answer');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/verify-security', {
        email,
        security_answer: securityAnswer
      });

      setResetToken(res.data.reset_token);
      setUserId(res.data.user_id);
      setStage('password');
      Alert.alert('Verified', 'Security question answered correctly. Set your new password.');
    } catch (err) {
      Alert.alert('Verification failed', err.response?.data?.error || 'Incorrect answer');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Password required', 'Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/reset-password', {
        user_id: userId,
        reset_token: resetToken,
        new_password: newPassword
      });

      Alert.alert('Success', 'Your password has been reset. Please login with your new password.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (err) {
      Alert.alert('Reset failed', err.response?.data?.error || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      {stage === 'email' && (
        <>
          <SectionCard title="Password recovery" subtitle="Enter your email to find your account">
            <View style={styles.form}>
              <TextInput
                placeholder="Email address"
                placeholderTextColor={theme.colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
              <PrimaryButton
                title={loading ? 'Searching...' : 'Next'}
                onPress={fetchSecurityQuestion}
                disabled={loading}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
                <Text style={styles.linkText}>Back to login</Text>
              </TouchableOpacity>
            </View>
          </SectionCard>
        </>
      )}

      {stage === 'answer' && (
        <>
          <SectionCard title="Verify identity" subtitle="Answer your security question to prove it's you">
            <View style={styles.form}>
              <Text style={styles.label}>Security question:</Text>
              <Text style={styles.question}>{securityQuestion}</Text>
              <TextInput
                placeholder="Your answer"
                placeholderTextColor={theme.colors.textMuted}
                value={securityAnswer}
                onChangeText={setSecurityAnswer}
                style={styles.input}
              />
              <PrimaryButton
                title={loading ? 'Verifying...' : 'Verify'}
                onPress={verifyAnswer}
                disabled={loading}
              />
              <TouchableOpacity onPress={() => setStage('email')} style={styles.linkButton}>
                <Text style={styles.linkText}>Back</Text>
              </TouchableOpacity>
            </View>
          </SectionCard>
        </>
      )}

      {stage === 'password' && (
        <>
          <SectionCard title="Set new password" subtitle="Create a strong password for your account">
            <View style={styles.form}>
              <TextInput
                placeholder="New password"
                placeholderTextColor={theme.colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                placeholder="Confirm password"
                placeholderTextColor={theme.colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />
              <PrimaryButton
                title={loading ? 'Resetting...' : 'Reset Password'}
                onPress={resetPassword}
                disabled={loading}
              />
              {loading && <ActivityIndicator size="small" color={theme.colors.secondary} style={styles.loader} />}
            </View>
          </SectionCard>
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700'
  },
  question: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.sm
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm
  },
  linkText: {
    color: theme.colors.secondary,
    fontWeight: '700'
  },
  loader: {
    marginTop: theme.spacing.md
  }
});
