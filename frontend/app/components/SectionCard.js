import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function SectionCard({ title, subtitle, children, style, right }) {
  return (
    <View style={[styles.card, style]}>
      {(title || subtitle || right) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm
  },
  headerText: {
    flex: 1
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  subtitle: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18
  }
});
