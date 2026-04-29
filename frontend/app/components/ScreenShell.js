import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';

export default function ScreenShell({ children, scrollable = true, contentStyle }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.blobOne} />
        <View style={styles.blobTwo} />
        <View style={styles.blobThree} />
      </View>

      {scrollable ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, styles.nonScrollContent, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background
  },
  blobOne: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(122, 167, 255, 0.16)'
  },
  blobTwo: {
    position: 'absolute',
    top: 140,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(93, 214, 196, 0.12)'
  },
  blobThree: {
    position: 'absolute',
    bottom: 30,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 107, 107, 0.12)'
  },
  container: {
    flex: 1
  },
  nonScrollContent: {
    padding: theme.spacing.lg
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl
  }
});
