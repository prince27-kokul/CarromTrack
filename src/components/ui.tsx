import { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../theme';
import { AppText as Text, DisplayText } from './AppText';

export function Page({ children, contentStyle }: { children: ReactNode; contentStyle?: StyleProp<ViewStyle> }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.page, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function Heading({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <DisplayText style={[styles.heading, style]}>{children}</DisplayText>;
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.link}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SearchField({ value, onChangeText, placeholder }: { value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return (
    <View style={styles.search}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityLabel="Clear search">
          <Text style={styles.clearSearch}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Initials({ name, color, size = 46 }: { name: string; color: string; size?: number }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return (
    <View style={[styles.initials, { backgroundColor: `${color}1A`, width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initialsText, { color, fontSize: size * 0.31 }]}>{initials}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress, compact = false }: { label: string; onPress: () => void; compact?: boolean }) {
  return (
    <Pressable style={[styles.button, compact && styles.buttonCompact]} onPress={onPress} accessibilityRole="button">
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <Card style={styles.empty}>
      <Text style={styles.emptyIcon}>◎</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  page: { paddingHorizontal: 21, paddingTop: 18, paddingBottom: 30, gap: 21 },
  eyebrow: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  heading: { color: colors.ink, fontSize: 29, lineHeight: 36, fontWeight: '600', letterSpacing: -0.7 },
  body: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: -8 },
  sectionHeading: { color: colors.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  link: { color: colors.green, fontSize: 12, fontWeight: '800' },
  search: { height: 49, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 9 },
  searchIcon: { color: colors.green, fontSize: 23, lineHeight: 27 },
  searchInput: { flex: 1, paddingVertical: 0, color: colors.ink, fontSize: 14 },
  clearSearch: { color: colors.muted, fontSize: 23, lineHeight: 25, paddingLeft: 4 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, backgroundColor: colors.surface, paddingVertical: 8, paddingHorizontal: 14 },
  chipSelected: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  chipTextSelected: { color: '#FFFFFF' },
  initials: { alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontWeight: '800', letterSpacing: -0.4 },
  button: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowColor: colors.greenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonCompact: { minHeight: 40, paddingHorizontal: 14, borderRadius: 12 },
  buttonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 28, gap: 8 },
  emptyIcon: { color: colors.green, fontSize: 28 },
  emptyTitle: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  emptyMessage: { color: colors.muted, fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
