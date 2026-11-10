import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.mark}>CT</Text>
      <Text style={styles.title}>CarromTrack</Text>
      <Text style={styles.subtitle}>Your carrom season starts here.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#18342A',
  },
  mark: {
    color: '#D8B46A',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 16,
  },
  title: {
    color: '#FFFEFB',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#C4D0C6',
    fontSize: 15,
    marginTop: 10,
  },
});
