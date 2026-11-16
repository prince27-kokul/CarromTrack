import { Pressable, StyleSheet, View } from 'react-native';

import { ThemePalette, useAppTheme } from '../theme';
import { AppText as Text } from './AppText';

export type TabKey = 'Overview' | 'Teams' | 'Players' | 'Matches' | 'Insights';

const tabs: { key: TabKey; icon: string }[] = [
  { key: 'Overview', icon: '⌂' },
  { key: 'Teams', icon: '♧' },
  { key: 'Players', icon: '◉' },
  { key: 'Matches', icon: '▤' },
  { key: 'Insights', icon: '⌁' },
];

export function BottomNav({ active, onSelect, variant = 'bottom' }: { active: TabKey; onSelect: (tab: TabKey) => void; variant?: 'bottom' | 'sidebar' }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  if (variant === 'sidebar') {
    return (
      <View style={styles.sidebar}>
        <View style={styles.brand}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>◉</Text></View>
          <View>
            <Text style={styles.brandName}>CARROM<Text style={styles.brandAccent}>TRACK</Text></Text>
            <Text style={styles.brandCaption}>SEASON MANAGER</Text>
          </View>
        </View>
        <Text style={styles.navHeading}>WORKSPACE</Text>
        <View style={styles.sidebarItems}>
          {tabs.map((tab) => {
            const selected = tab.key === active;
            return (
              <Pressable
                key={tab.key}
                style={[styles.sidebarItem, selected && styles.sidebarItemSelected]}
                onPress={() => onSelect(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={tab.key}
              >
                <Text style={[styles.sidebarIcon, selected && styles.sidebarIconSelected]}>{tab.icon}</Text>
                <Text style={[styles.sidebarLabel, selected && styles.sidebarLabelSelected]}>{tab.key}</Text>
                {selected ? <View style={styles.sidebarIndicator} /> : null}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.sidebarFooter}>
          <View style={styles.seasonMark}><Text style={styles.seasonMarkText}>✦</Text></View>
          <View style={styles.seasonCopy}>
            <Text style={styles.seasonTitle}>SEASON 2026</Text>
            <Text style={styles.seasonStatus}>●  Saved on this device</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            style={styles.item}
            onPress={() => onSelect(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.key}
          >
            <Text style={[styles.icon, selected && styles.selectedIcon]}>{tab.icon}</Text>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{tab.key}</Text>
            {selected ? <View style={styles.dot} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  sidebar: {
    width: 250,
    flexShrink: 0,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 20,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 7, paddingBottom: 34 },
  brandMark: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.greenDark, borderWidth: 1, borderColor: colors.accentBorder },
  brandMarkText: { color: colors.goldBright, fontSize: 22, fontWeight: '800' },
  brandName: { color: colors.ink, fontSize: 14, fontWeight: '900', letterSpacing: 0.4 },
  brandAccent: { color: colors.goldBright },
  brandCaption: { color: colors.navMuted, fontSize: 8, fontWeight: '800', letterSpacing: 1.4, marginTop: 4 },
  navHeading: { color: colors.navMuted, fontSize: 8, fontWeight: '900', letterSpacing: 1.4, paddingHorizontal: 11, marginBottom: 10 },
  sidebarItems: { gap: 5 },
  sidebarItem: { height: 48, borderRadius: 13, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 12, position: 'relative' },
  sidebarItemSelected: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder },
  sidebarIcon: { color: colors.navMuted, fontSize: 19, width: 23, textAlign: 'center' },
  sidebarIconSelected: { color: colors.goldBright },
  sidebarLabel: { color: colors.navMuted, fontSize: 12, fontWeight: '700' },
  sidebarLabelSelected: { color: colors.ink, fontWeight: '800' },
  sidebarIndicator: { position: 'absolute', right: 0, width: 3, height: 22, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: colors.green },
  sidebarFooter: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  seasonMark: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.goldLight },
  seasonMarkText: { color: colors.goldBright, fontSize: 16 },
  seasonCopy: { gap: 4 },
  seasonTitle: { color: colors.ink, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  seasonStatus: { color: colors.muted, fontSize: 8, fontWeight: '600' },
  bar: {
    height: 76,
    flexDirection: 'row',
    backgroundColor: colors.navy,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingBottom: 8,
    paddingTop: 7,
    shadowColor: '#10251C',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 1 },
  icon: { color: colors.navMuted, fontSize: 21, lineHeight: 26 },
  selectedIcon: { color: colors.green, fontWeight: '800' },
  label: { color: colors.navMuted, fontSize: 9, fontWeight: '700' },
  selectedLabel: { color: colors.ink },
  dot: { position: 'absolute', top: -6, width: 23, height: 3, borderRadius: 2, backgroundColor: colors.green },
});
