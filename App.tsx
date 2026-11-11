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
import { ShowcaseApp } from './src/screens/ShowcaseApp';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    DMSans_800ExtraBold,
    PlayfairDisplay_600SemiBold,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {fontsLoaded ? <ShowcaseApp /> : (
        <View style={styles.message}>
          <ActivityIndicator color="#B65CFF" size="large" />
          <Text style={styles.messageBody}>{fontError ? 'Typography could not be loaded.' : 'Preparing Carrom Tracker…'}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  message: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
  messageBody: { color: '#B1A8BF', fontSize: 12, lineHeight: 19, textAlign: 'center' },
});
