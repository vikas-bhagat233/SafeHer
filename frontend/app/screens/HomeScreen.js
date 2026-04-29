import { View, Text, Alert, ActivityIndicator, StyleSheet, FlatList, Linking, Platform } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import SOSButton from '../components/SOSButton';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import ContactCard from '../components/ContactCard';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../utils/theme';
import api from '../services/api';
import { getLiveLocation } from '../services/locationService';
import { getQueuedAlertCount } from '../services/offlineQueueService';
import { sendAlertWithQueue, retryQueuedAlerts } from '../services/alertService';
import { formatDate } from '../utils/helpers';

export default function HomeScreen({ route, navigation }) {
  const user = route.params?.user;
  const [sending, setSending] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [queuedCount, setQueuedCount] = useState(0);

  const getSmsRecipients = () => {
    return contacts
      .map((item) => (item.phone || '').trim())
      .filter((phone) => phone.length > 0);
  };

  const openSmsFallback = (link) => {
    const recipients = getSmsRecipients();
    const separator = Platform.OS === 'ios' ? ';' : ',';
    const recipientPart = recipients.length > 0 ? recipients.join(separator) : '';
    const body = `SOS from ${user?.name || 'SafeHer user'} ${link}`;
    return Linking.openURL(`sms:${recipientPart}?body=${encodeURIComponent(body)}`);
  };

  const loadContacts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingContacts(true);
      const res = await api.get(`/contact/${user.id}`);
      setContacts(Array.isArray(res.data) ? res.data : []);
      const pending = await getQueuedAlertCount();
      setQueuedCount(pending);
    } catch (err) {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadContacts();

      const intervalId = setInterval(() => {
        loadContacts();
      }, 10000);

      return () => clearInterval(intervalId);
    }, [loadContacts])
  );

  const sendSOS = async () => {
    if (sending) return;

    if (!user?.id) {
      Alert.alert('SOS Failed', 'User session missing. Please login again.');
      return;
    }

    try {
      setSending(true);
      const { link, latitude, longitude } = await getLiveLocation();

      const alertPayload = {
        user_id: user.id,
        location: link,
        latitude,
        longitude,
        contacts
      };

      const result = await sendAlertWithQueue(alertPayload);

      if (result.queued) {
        const pending = await getQueuedAlertCount();
        setQueuedCount(pending);

        Alert.alert(
          'Offline fallback active',
          'Internet seems unavailable. SOS was queued and will auto-send once network is back. Open SMS app now to notify emergency contact manually?',
          [
            { text: 'Not now', style: 'cancel' },
            {
              text: 'Open SMS',
              onPress: () => openSmsFallback(link)
            }
          ]
        );
      } else {
        Alert.alert('SOS Sent', 'Emergency alert sent successfully.');
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to send SOS right now.';
      Alert.alert('SOS Failed', message);
    } finally {
      setSending(false);
    }
  };

  const syncQueuedAlerts = async () => {
    try {
      const result = await retryQueuedAlerts();
      setQueuedCount(result.remaining);
      Alert.alert('Sync complete', `Sent: ${result.flushed} | Remaining: ${result.remaining}`);
    } catch {
      Alert.alert('Sync failed', 'Unable to retry queued alerts right now.');
    }
  };

  const logout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  return (
    <ScreenShell>
      <SectionCard
        title={`Welcome back, ${user?.name || 'friend'}`}
        subtitle="Your safety dashboard is ready with quick access to SOS, trusted contacts, and personal status."
        right={
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        }
      >
        <View style={styles.heroRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{contacts.length}</Text>
            <Text style={styles.heroStatLabel}>Trusted contacts</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{sending ? '...' : '24/7'}</Text>
            <Text style={styles.heroStatLabel}>Emergency mode</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>Ready</Text>
            <Text style={styles.heroStatLabel}>Safety status</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard title="Session" subtitle="Manage your current login and pending offline alerts.">
        <View style={styles.sessionRow}>
          <Text style={styles.sessionText}>Queued SOS alerts: {queuedCount}</Text>
          <View style={styles.sessionActions}>
            <PrimaryButton title="Retry queue" variant="secondary" onPress={syncQueuedAlerts} style={styles.sessionBtn} />
            <PrimaryButton title="Logout" variant="secondary" onPress={logout} style={styles.sessionBtn} />
          </View>
        </View>
      </SectionCard>

      <View style={styles.centerBlock}>
        <SOSButton onPress={sendSOS} disabled={sending} />
        {sending ? <ActivityIndicator size="small" color={theme.colors.secondary} style={styles.sending} /> : null}
        <Text style={styles.sosCaption}>Tap only when you need immediate help.</Text>
      </View>

      <SectionCard title="Quick actions" subtitle="Jump to the most important screens in one tap.">
        <View style={styles.quickGrid}>
          <PrimaryButton title="Contacts" onPress={() => navigation.navigate('Contacts', { user })} style={styles.quickButton} />
          <PrimaryButton title="Profile" variant="secondary" onPress={() => navigation.navigate('Profile', { user })} style={styles.quickButton} />
          <PrimaryButton title="History" variant="secondary" onPress={() => navigation.navigate('History', { user })} style={styles.quickButton} />
          <PrimaryButton title="Evidence" variant="secondary" onPress={() => navigation.navigate('Evidence', { user })} style={styles.quickButton} />
          <PrimaryButton title="Resources" variant="secondary" onPress={() => navigation.navigate('Resources')} style={styles.quickButton} />
        </View>
      </SectionCard>

      <SectionCard title={`Emergency contacts (${contacts.length})`} subtitle="These people will receive alerts when SOS is triggered.">
        {loadingContacts ? (
          <ActivityIndicator size="small" color={theme.colors.secondary} />
        ) : contacts.length === 0 ? (
          <Text style={styles.emptyText}>No contacts added yet. Add at least one trusted person.</Text>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => <ContactCard name={item.name} email={item.email} phone={item.phone} />}
          />
        )}
      </SectionCard>

      <SectionCard title="Safety checklist" subtitle="Simple habits that improve response time and visibility.">
        <View style={styles.checklistItem}>
          <View style={styles.checkDot} />
          <Text style={styles.checkText}>Keep location permission enabled for faster alerts.</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checkDot} />
          <Text style={styles.checkText}>Add two or more trusted contacts for backup coverage.</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checkDot} />
          <Text style={styles.checkText}>Charge your phone before travel or late-night trips.</Text>
        </View>
      </SectionCard>

      <SectionCard title="Last sync" subtitle="The app updates the contact list every time you open this dashboard.">
        <Text style={styles.syncText}>{formatDate(new Date())}</Text>
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.round,
    backgroundColor: 'rgba(68, 209, 157, 0.12)'
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.success,
    marginRight: 8
  },
  liveText: {
    color: theme.colors.success,
    fontWeight: '700'
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    flexWrap: 'wrap'
  },
  heroStat: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 88,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  heroStatValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  heroStatLabel: {
    color: theme.colors.textMuted,
    marginTop: 4,
    fontSize: 12
  },
  centerBlock: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg
  },
  sending: {
    marginTop: theme.spacing.md
  },
  sosCaption: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontSize: 13,
    maxWidth: 280,
    lineHeight: 18
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm
  },
  quickButton: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 96
  },
  emptyText: {
    color: theme.colors.textMuted,
    lineHeight: 20
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm
  },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.secondary,
    marginTop: 6,
    marginRight: theme.spacing.sm
  },
  checkText: {
    flex: 1,
    color: theme.colors.text,
    lineHeight: 20
  },
  syncText: {
    color: theme.colors.textMuted
  },
  sessionRow: {
    gap: theme.spacing.sm
  },
  sessionText: {
    color: theme.colors.text,
    fontWeight: '700'
  },
  sessionActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm
  },
  sessionBtn: {
    flexGrow: 1,
    minWidth: 120
  }
});