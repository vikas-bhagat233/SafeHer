import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function Header({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800'
  }
});