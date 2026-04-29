import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';
import { theme } from '../utils/theme';

const QUESTIONS = [
  'What is your mother\'s name?',
  'What is your favorite city?',
  'What was your first pet\'s name?',
  'What is your birth year?',
  'What is your favorite food?',
  'What school did you first attend?'
];

export default function SecurityQuestionsScreen({ route, navigation }) {
  const user = route.params?.user;
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const saveSecurityQuestion = async () => {
    if (!selectedQuestion || !answer) {
      Alert.alert('Missing fields', 'Please select a question and provide an answer');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/update-security', {
        user_id: user?.id,
        security_question: selectedQuestion,
        security_answer: answer
      });

      Alert.alert('Saved', 'Your security question has been saved. You can use it to recover your password.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Failed', err.response?.data?.error || 'Unable to save security question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      <SectionCard
        title="Security question"
        subtitle="Choose a security question to help recover your account if you forget your password."
      >
        <View style={styles.form}>
          <Text style={styles.label}>Select a question:</Text>
          <View style={styles.questionList}>
            {QUESTIONS.map((q, idx) => (
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

          <PrimaryButton
            title={loading ? 'Saving...' : 'Save security question'}
            onPress={saveSecurityQuestion}
            disabled={loading || !selectedQuestion || !answer}
          />

          {loading && <ActivityIndicator size="small" color={theme.colors.secondary} style={styles.loader} />}
        </View>
      </SectionCard>

      <SectionCard title="Why this matters" subtitle="Security questions help you recover your account if you forget your password.">
        <Text style={styles.note}>
          • Keep your answer simple and memorable.{'\n'}
          • Use information only you would know.{'\n'}
          • This is stored securely in your account.
        </Text>
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.sm
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700'
  },
  questionList: {
    gap: theme.spacing.sm
  },
  questionButton: {
    minHeight: 52,
    justifyContent: 'center'
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
  loader: {
    marginTop: theme.spacing.md
  },
  note: {
    color: theme.colors.textMuted,
    lineHeight: 20
  }
});
