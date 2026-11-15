import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '../theme';
import { AppText as Text } from './AppText';

export type TabKey = 'Home' | 'Teams' | 'Players' | 'Matches' | 'Insights';

const tabs: { key: TabKey; icon: string }[] = [
  { key: 'Home', icon: '⌂' },
  { key: 'Teams', icon: '♧' },
  { key: 'Players', icon: '◉' },
  { key: 'Matches', icon: '▤' },
  { key: 'Insights', icon: '⌁' },
];

export function BottomNav({ active, onSelect }: { active: TabKey; onSelect: (tab: TabKey) => void }) {
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

const styles = StyleSheet.create({
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
  selectedLabel: { color: '#D8B9FF' },
  dot: { position: 'absolute', top: -6, width: 23, height: 3, borderRadius: 2, backgroundColor: colors.green },
});
