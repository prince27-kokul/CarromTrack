import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppText as Text } from '../components/AppText';
import { BottomNav, TabKey } from '../components/BottomNav';
import { AppData, Match } from '../data/seed';
import { DetailRoute, DetailScreen } from './DetailScreen';
import { InsightsScreen } from './InsightsScreen';
import { MatchesScreen } from './MatchesScreen';
import { OverviewScreen } from './OverviewScreen';
import { PlayersScreen } from './PlayersScreen';
import { TeamsScreen } from './TeamsScreen';
import { loadAppData, saveAppData } from '../storage/localStore';
import { colors } from '../theme';

type DraftMatch = Omit<Match, 'id'>;

export function TrackerApp() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retry, setRetry] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>('Overview');
  const [detail, setDetail] = useState<DetailRoute | null>(null);
  const { width } = useWindowDimensions();
  const desktop = width >= 980;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    loadAppData().then((loaded) => {
      if (active) setData(loaded);
    }).catch((error: unknown) => {
      if (active) setLoadError(error instanceof Error ? error.message : 'Season data could not be loaded.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [retry]);

  const openDetail = (route: DetailRoute) => setDetail(route);
  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setDetail(null);
  };
  const addMatch = async (draft: DraftMatch): Promise<boolean> => {
    if (!data) return false;
    let id = `match-${Date.now()}`;
    while (data.matches.some((match) => match.id === id)) id = `${id}-1`;
    const match: Match = { ...draft, id };
    const updated = { ...data, matches: [match, ...data.matches] };
    try {
      await saveAppData(updated);
      setData(updated);
      return true;
    } catch {
      Alert.alert('Could not save fixture', 'Your fixture was not saved. Check device storage and try again.');
      return false;
    }
  };

  if (loading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={colors.green} size="large" />
        <Text style={styles.stateMessage}>Loading your season…</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.state}>
        <Text style={styles.errorTitle}>Season data unavailable</Text>
        <Text style={styles.stateMessage}>{loadError}</Text>
        <Pressable onPress={() => setRetry((value) => value + 1)} style={styles.retry} accessibilityRole="button">
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const screen = (
    <View style={styles.content}>
        {detail ? (
          <DetailScreen
            route={detail}
            data={data}
            onBack={() => setDetail(null)}
            onOpenTeam={(id) => openDetail({ kind: 'team', id })}
            onOpenPlayer={(id) => openDetail({ kind: 'player', id })}
            onOpenMatch={(id) => openDetail({ kind: 'match', id })}
          />
        ) : activeTab === 'Overview' ? (
          <OverviewScreen data={data} onTab={selectTab} onOpenMatch={(id) => openDetail({ kind: 'match', id })} onOpenPlayer={(id) => openDetail({ kind: 'player', id })} />
        ) : activeTab === 'Teams' ? (
          <TeamsScreen data={data} onOpenTeam={(id) => openDetail({ kind: 'team', id })} />
        ) : activeTab === 'Players' ? (
          <PlayersScreen data={data} onOpenPlayer={(id) => openDetail({ kind: 'player', id })} />
        ) : activeTab === 'Matches' ? (
          <MatchesScreen data={data} onOpenMatch={(id) => openDetail({ kind: 'match', id })} onAddMatch={addMatch} />
        ) : (
          <InsightsScreen data={data} />
        )}
    </View>
  );

  return (
    <View style={[styles.root, desktop && styles.desktopRoot]}>
      {desktop ? <BottomNav active={activeTab} onSelect={selectTab} variant="sidebar" /> : null}
      <View style={styles.main}>
        {desktop ? (
          <View style={styles.topbar}>
            <View style={styles.breadcrumb}>
              <Text style={styles.topbarSeason}>SEASON 2026</Text>
              <Text style={styles.breadcrumbSlash}>/</Text>
              <Text style={styles.topbarSection}>{detail ? 'Record details' : activeTab}</Text>
            </View>
            <View style={styles.savedBadge}><View style={styles.savedDot} /><Text style={styles.savedText}>SAVED ON THIS DEVICE</Text></View>
          </View>
        ) : null}
        <View style={styles.screenArea}>
          <View pointerEvents="none" style={styles.ambientGlow} />
          {screen}
        </View>
        {!desktop ? <BottomNav active={activeTab} onSelect={selectTab} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  desktopRoot: { flexDirection: 'row' },
  main: { flex: 1, minWidth: 0, minHeight: 0, backgroundColor: colors.background },
  topbar: { height: 68, paddingHorizontal: 34, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: '#0E0A16', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topbarSeason: { color: colors.navMuted, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  breadcrumbSlash: { color: colors.line, fontSize: 14 },
  topbarSection: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  savedBadge: { height: 30, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, borderWidth: 1, borderColor: colors.line, borderRadius: 10, backgroundColor: colors.surface },
  savedDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: colors.goldBright },
  savedText: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  screenArea: { flex: 1, minHeight: 0, overflow: 'hidden', backgroundColor: colors.background },
  ambientGlow: { position: 'absolute', top: -165, right: -70, width: 360, height: 300, borderRadius: 200, backgroundColor: '#4C1D79', opacity: 0.11, shadowColor: '#A146FF', shadowOpacity: 0.7, shadowRadius: 80, elevation: 3 },
  content: { flex: 1, minHeight: 0 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 28, backgroundColor: colors.background },
  stateMessage: { color: colors.muted, fontSize: 12, lineHeight: 19, textAlign: 'center' },
  errorTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  retry: { minHeight: 42, borderRadius: 13, backgroundColor: colors.green, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  retryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
