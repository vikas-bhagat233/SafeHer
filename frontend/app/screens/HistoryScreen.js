import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import api from '../services/api';
import { getEvidenceByUser } from '../services/evidenceService';
import { formatDate } from '../utils/helpers';
import { theme } from '../utils/theme';

export default function HistoryScreen({ route }) {
  const user = route.params?.user;
  const [alerts, setAlerts] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await api.get(`/alert/history/${user.id}`);
      setAlerts(Array.isArray(res.data) ? res.data : []);
      const localEvidence = await getEvidenceByUser(user.id);
      setEvidence(localEvidence);
    } catch {
      setAlerts([]);
      setEvidence([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();

      const intervalId = setInterval(() => {
        loadHistory();
      }, 8000);

      return () => clearInterval(intervalId);
    }, [loadHistory])
  );

  return (
    <ScreenShell>
      <SectionCard
        title="Alert history"
        subtitle="Timeline of triggered SOS alerts with timestamp and shared location."
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.secondary} />
        ) : alerts.length === 0 ? (
          <>
            <Text style={styles.emptyTitle}>No alerts recorded yet</Text>
            <Text style={styles.emptyText}>
              Once an SOS is sent, this page tracks the alert timeline for later reporting.
            </Text>
          </>
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>SOS Triggered</Text>
                  <Text style={styles.timelineText}>{formatDate(item.created_at)}</Text>
                  <Text style={styles.linkText}>{item.location}</Text>
                </View>
              </View>
            )}
          />
        )}
      </SectionCard>

      <SectionCard title="Evidence timeline" subtitle="Locally captured audio/video evidence attached to incidents.">
        {evidence.length === 0 ? (
          <Text style={styles.emptyText}>No local evidence saved yet.</Text>
        ) : (
          <FlatList
            data={evidence}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotMuted]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{item.type === 'video' ? 'Video evidence' : 'Audio evidence'}</Text>
                  <Text style={styles.timelineText}>{formatDate(item.created_at)}</Text>
                  <Text style={styles.linkText}>{item.uri}</Text>
                </View>
              </View>
            )}
          />
        )}
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: theme.spacing.xs
  },
  emptyText: {
    color: theme.colors.textMuted,
    lineHeight: 20
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.secondary,
    marginTop: 4,
    marginRight: theme.spacing.sm
  },
  timelineDotMuted: {
    backgroundColor: theme.colors.accent
  },
  timelineContent: {
    flex: 1
  },
  timelineTitle: {
    color: theme.colors.text,
    fontWeight: '800',
    marginBottom: 4
  },
  timelineText: {
    color: theme.colors.textMuted,
    lineHeight: 20
  },
  linkText: {
    color: theme.colors.secondary,
    lineHeight: 18,
    marginTop: 4
  }
});