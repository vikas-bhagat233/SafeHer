import { View, Text, StyleSheet } from 'react-native';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../utils/theme';

export default function ProfileScreen({ route, navigation }) {
  const user = route.params?.user;

  return (
    <ScreenShell>
      <SectionCard title="Profile overview" subtitle="Your account details and safety preferences in one place.">
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || 'U').slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>{user?.name || 'Unknown user'}</Text>
            <Text style={styles.email}>{user?.email || 'No email available'}</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard title="Account details" subtitle="Useful information for your emergency workflow.">
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>User ID</Text>
          <Text style={styles.detailValue}>{user?.id || 'Not signed in'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mode</Text>
          <Text style={styles.detailValue}>Protected</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Alerts</Text>
          <Text style={styles.detailValue}>Enabled</Text>
        </View>
      </SectionCard>

      <SectionCard title="Shortcuts" subtitle="Move quickly between the most important parts of the app.">
        <View style={styles.actions}>
          <PrimaryButton title="Dashboard" onPress={() => navigation.navigate('Home', { user })} />
          <PrimaryButton title="Contacts" variant="secondary" onPress={() => navigation.navigate('Contacts', { user })} />
          <PrimaryButton title="Update security question" variant="secondary" onPress={() => navigation.navigate('SecurityQuestions', { user })} />
        </View>
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(122, 167, 255, 0.18)',
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  avatarText: {
    color: theme.colors.accent,
    fontSize: 28,
    fontWeight: '900'
  },
  profileText: {
    flex: 1
  },
  name: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800'
  },
  email: {
    color: theme.colors.textMuted,
    marginTop: 6
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  detailLabel: {
    color: theme.colors.textMuted
  },
  detailValue: {
    color: theme.colors.text,
    fontWeight: '700'
  },
  actions: {
    gap: theme.spacing.sm
  }
});