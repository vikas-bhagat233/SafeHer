import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';

export default function ContactCard({ name, email, phone, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(name || '?').slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        {phone ? <Text style={styles.phone}>{phone}</Text> : null}
        {(onEdit || onDelete) ? (
          <View style={styles.actions}>
            {onEdit ? (
              <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
            ) : null}
            {onDelete ? (
              <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceElevated,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(93, 214, 196, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md
  },
  avatarText: {
    color: theme.colors.secondary,
    fontWeight: '800'
  },
  content: {
    flex: 1
  },
  name: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  email: {
    color: theme.colors.textMuted,
    marginTop: 4
  },
  phone: {
    color: theme.colors.accent,
    marginTop: 3,
    fontSize: 12
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm
  },
  actionButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  actionText: {
    color: theme.colors.secondary,
    fontWeight: '700',
    fontSize: 12
  },
  deleteText: {
    color: theme.colors.danger
  }
});