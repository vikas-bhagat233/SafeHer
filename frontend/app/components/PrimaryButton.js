import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function PrimaryButton({ title, onPress, disabled = false, variant = 'primary', style }) {
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.button,
        isSecondary ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[styles.text, isSecondary && styles.secondaryText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: theme.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: theme.colors.border
  },
  disabled: {
    opacity: 0.6
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  secondaryText: {
    color: theme.colors.text
  }
});
