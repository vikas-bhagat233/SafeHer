import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';
import { theme } from '../utils/theme';

const SECURITY_QUESTIONS = [
  'What is your mother\'s name?',
  'What is your favorite city?',
  'What was your first pet\'s name?',
  'What is your birth year?',
  'What is your favorite food?',
  'What school did you first attend?'
];

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);

  const signup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Signup Failed', 'Name, email and password are required');
      return;
    }

    if (!selectedQuestion || !answer) {
      Alert.alert('Setup failed', 'Please select a security question and provide an answer');
      return;
    }

    try {
      await api.post('/auth/signup', {
        name,
        email,
        password,
        security_question: selectedQuestion,
        security_answer: answer
      });

      Alert.alert('Signup Success');
      navigation.navigate('Login');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to reach server';
      Alert.alert('Signup Failed', message);
    }
  };

  return (
    <ScreenShell>
      <View style={styles.brandBlock}>
        <Text style={styles.brand}>Join SafeHer</Text>
        <Text style={styles.tagline}>Create your profile and keep your safety tools ready.
        </Text>
      </View>

      <SectionCard title="Create account" subtitle="It takes only a minute to set up your emergency dashboard.">
        <View style={styles.form}>
          <TextInput
            placeholder="Full name"
            placeholderTextColor={theme.colors.textMuted}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
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

          {!showQuestions ? (
            <PrimaryButton title="Next: Set security question" onPress={() => setShowQuestions(true)} />
          ) : (
            <>
              <Text style={styles.label}>Select a security question:</Text>
              <View style={styles.questionList}>
                {SECURITY_QUESTIONS.map((q, idx) => (
                  <PrimaryButton
                    key={idx}
                    title={q}
                    variant={selectedQuestion === q ? 'primary' : 'secondary'}
                    onPress={() => setSelectedQuestion(q)}
                    style={styles.questionButton}
                  />
                ))}
              </View>

              {selectedQuestion && (
                <>
                  <Text style={styles.label}>Your answer:</Text>
                  <TextInput
                    placeholder="Answer this question"
                    placeholderTextColor={theme.colors.textMuted}
                    value={answer}
                    onChangeText={setAnswer}
                    style={styles.input}
                  />
                </>
              )}

              <PrimaryButton title="Create account" onPress={signup} />
              <PrimaryButton title="Back" variant="secondary" onPress={() => setShowQuestions(false)} />
            </>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
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
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1
  },
  tagline: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    lineHeight: 20
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
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: theme.spacing.sm
  },
  questionList: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs
  },
  questionButton: {
    minHeight: 50
  }
});