import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../utils/theme';

export default function SOSButton({ onPress, disabled = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[styles.button, disabled && styles.disabled]}
    >
      <View style={styles.innerRing} />
      <Text style={styles.label}>SOS</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 168,
    height: 168,
    borderRadius: 999,
    backgroundColor: theme.colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.16)',
    shadowColor: '#ff3d57',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12
  },
  innerRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)'
  },
  label: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2
  },
  disabled: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }]
  }
});