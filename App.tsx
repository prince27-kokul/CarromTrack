import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  DMSans_800ExtraBold,
} from '@expo-google-fonts/dm-sans';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';

import { AppText as Text } from './src/components/AppText';
import { TrackerApp } from './src/screens/TrackerApp';
import { ThemeProvider, useAppTheme } from './src/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    DMSans_800ExtraBold,
    PlayfairDisplay_600SemiBold,
  });

  return (
    <ThemeProvider>
      <AppShell fontsLoaded={fontsLoaded} fontError={fontError} />
    </ThemeProvider>
  );
}

function AppShell({ fontsLoaded, fontError }: { fontsLoaded: boolean; fontError: Error | null }) {
  const { colors } = useAppTheme();
  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    message: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12, backgroundColor: colors.background },
    messageBody: { color: colors.muted, fontSize: 12, lineHeight: 19, textAlign: 'center' },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {fontsLoaded || fontError ? <TrackerApp /> : (
        <View style={styles.message}>
          <ActivityIndicator color={colors.green} size="large" />
          <Text style={styles.messageBody}>{fontError ? 'Typography could not be loaded.' : 'Preparing Carrom Tracker…'}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
