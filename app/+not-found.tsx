// app/+not-found.tsx
import { usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Route Not Found</Text>
      <Text style={styles.path}>Attempted path: <Text style={styles.code}>{pathname}</Text></Text>

      <Text style={styles.tip}>
        Tip: Make sure you have a screen file matching this route in your <Text style={styles.code}>app/</Text> directory.
      </Text>

      <Text style={styles.hint}>
        If this was a tab route, check your <Text style={styles.code}>app/(tabs)/_layout.tsx</Text> and file names like <Text style={styles.code}>dashboard.tsx</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: 16,
  },
  path: {
    fontSize: 16,
    marginBottom: 8,
  },
  code: {
    fontFamily: 'monospace',
    color: '#374151',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 4,
  },
  tip: {
    marginTop: 12,
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
