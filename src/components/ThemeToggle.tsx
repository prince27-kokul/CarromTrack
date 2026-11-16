import { Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from './AppText';
import { useAppTheme } from '../theme';

export function ThemeToggle() {
  const { colors, mode, toggleTheme, ready } = useAppTheme();
  const nextMode = mode === 'dark' ? 'light' : 'dark';
  const styles = StyleSheet.create({
    button: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingHorizontal: 13,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.line,
      backgroundColor: colors.surface,
    },
    icon: { color: colors.goldBright, fontSize: 15 },
    label: { color: colors.ink, fontSize: 11, fontWeight: '800' },
    selected: { color: colors.muted, fontSize: 9, fontWeight: '700' },
  });

  return (
    <Pressable
      onPress={toggleTheme}
      style={styles.button}
      accessibilityRole="switch"
      accessibilityLabel={`Theme, currently ${mode}`}
      accessibilityHint={`Switch to ${nextMode} theme`}
      accessibilityState={{ checked: mode === 'light', disabled: !ready }}
      aria-checked={mode === 'light'}
      disabled={!ready}
    >
      <Text style={styles.icon}>{mode === 'dark' ? '☀' : '☾'}</Text>
      <View>
        <Text style={styles.label}>{mode === 'dark' ? 'Light theme' : 'Dark theme'}</Text>
        <Text style={styles.selected}>{mode === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}</Text>
      </View>
    </Pressable>
  );
}
