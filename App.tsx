import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AppData } from './src/data/seed';
import { loadAppData } from './src/storage/localStore';
import { colors } from './src/theme';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppData().then(setData).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : String(reason));
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.mark}>CARROMTRACK  /  SEASON 2026</Text>
        <Text style={styles.title}>Your season starts here.</Text>
        {error ? (
          <Text style={styles.message}>Could not load your local dataset: {error}</Text>
        ) : data ? (
          <View style={styles.stats}>
            <Stat value={data.teams.length} label="SQUADS" />
            <Stat value={data.players.length} label="PLAYERS" />
            <Stat value={data.matches.length} label="FIXTURES" />
          </View>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.goldBright} />
            <Text style={styles.message}>Loading your offline season…</Text>
          </View>
        )}
        <Text style={styles.footer}>Your dataset stays on this device.</Text>
      </View>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28, gap: 20 },
  mark: { color: colors.goldBright, fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  title: { color: colors.surface, fontSize: 34, fontWeight: '700', lineHeight: 42, maxWidth: 300 },
  stats: { flexDirection: 'row', gap: 12, marginTop: 16 },
  stat: { flex: 1, paddingVertical: 18, paddingHorizontal: 14, gap: 5, borderRadius: 16, backgroundColor: '#FFFFFF12', borderWidth: 1, borderColor: '#FFFFFF18' },
  value: { color: colors.surface, fontSize: 24, fontWeight: '800' },
  label: { color: '#C4D0C6', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  loading: { gap: 12, alignItems: 'flex-start', marginTop: 18 },
  message: { color: '#C4D0C6', fontSize: 13, lineHeight: 20 },
  footer: { color: '#94A89B', fontSize: 10, marginTop: 32 },
});
