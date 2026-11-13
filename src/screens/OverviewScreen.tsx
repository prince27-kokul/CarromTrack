import { Pressable, StyleSheet, View } from 'react-native';

import { AppData, getMatchResult, getTeamName } from '../data/seed';
import { formatDate } from '../data/format';
import { AppText as Text, DisplayText } from '../components/AppText';
import { BoardIllustration } from '../components/BoardIllustration';
import { MatchRow } from '../components/MatchRow';
import { Body, Card, Eyebrow, Page, SectionTitle } from '../components/ui';
import { TabKey } from '../components/BottomNav';
import { colors } from '../theme';

const HOME_TEAM_ID = 'team-harbor';

export function OverviewScreen({ data, onTab, onOpenMatch, onOpenPlayer }: {
  data: AppData;
  onTab: (tab: TabKey) => void;
  onOpenMatch: (id: string) => void;
  onOpenPlayer: (id: string) => void;
}) {
  const homeTeam = data.teams.find((team) => team.id === HOME_TEAM_ID) ?? data.teams[0];
  const teamMatches = data.matches.filter((match) => match.teamId === homeTeam?.id);
  const played = teamMatches.filter((match) => getMatchResult(match) !== 'upcoming');
  const wins = played.filter((match) => getMatchResult(match) === 'win').length;
  const winRate = played.length > 0 ? Math.round((wins / played.length) * 100) : 0;
  const nextMatch = teamMatches
    .filter((match) => getMatchResult(match) === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const latestMatches = [...data.matches].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const topPlayer = [...data.players].sort((a, b) => b.points - a.points)[0];
  const topPlayerTeam = data.teams.find((team) => team.id === topPlayer?.teamId);

  return (
    <Page>
      <View style={styles.topline}>
        <View>
          <Eyebrow>CARROMTRACK  /  SEASON 2026</Eyebrow>
          <DisplayText style={styles.greeting}>Carrom, at a glance.</DisplayText>
        </View>
        <View style={styles.profile}><Text style={styles.profileText}>CT</Text></View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Eyebrow style={styles.heroEyebrow}>YOUR HOME TEAM</Eyebrow>
            <DisplayText style={styles.teamName}>{homeTeam?.name ?? 'Your team'}</DisplayText>
          </View>
          <BoardIllustration width={118} height={73} />
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroStats}>
          <View><Text style={styles.heroStatValue}>{wins}<Text style={styles.heroStatSlash}>/{played.length}</Text></Text><Text style={styles.heroStatLabel}>WINS THIS SEASON</Text></View>
          <View style={styles.heroStatSeparator} />
          <View><Text style={styles.heroStatValue}>{winRate}<Text style={styles.heroStatSlash}>%</Text></Text><Text style={styles.heroStatLabel}>WIN RATE</Text></View>
          <View style={styles.form}>
            {teamMatches.filter((match) => getMatchResult(match) !== 'upcoming').slice(-3).reverse().map((match) => (
              <View key={match.id} style={[styles.formDot, { backgroundColor: getMatchResult(match) === 'win' ? '#B98AFF' : getMatchResult(match) === 'loss' ? colors.red : colors.gold }]} />
            ))}
            {played.length === 0 ? <Text style={styles.heroStatSlash}>—</Text> : null}
          </View>
        </View>
      </View>

      <View style={styles.quickStats}>
        {[
          { label: 'SQUADS', value: String(data.teams.length), icon: '♧' },
          { label: 'PLAYERS', value: String(data.players.length), icon: '◉' },
          { label: 'FIXTURES', value: String(data.matches.length), icon: '▤' },
        ].map((stat) => (
          <Pressable key={stat.label} style={styles.quickStat} onPress={() => onTab(stat.label === 'SQUADS' ? 'Teams' : stat.label === 'PLAYERS' ? 'Players' : 'Matches')}>
            <Text style={styles.quickIcon}>{stat.icon}</Text>
            <Text style={styles.quickValue}>{stat.value}</Text>
            <Text style={styles.quickLabel}>{stat.label}</Text>
          </Pressable>
        ))}
      </View>

      {nextMatch ? (
        <Pressable style={styles.nextCard} onPress={() => onOpenMatch(nextMatch.id)}>
          <View style={styles.nextLabel}><Text style={styles.nextLabelText}>NEXT ON THE BOARD</Text><Text style={styles.nextArrow}>↗</Text></View>
          <Text style={styles.nextOpponent}>Harbor Hawks <Text style={styles.nextVs}>vs</Text> {nextMatch.opponent}</Text>
          <Text style={styles.nextMeta}>{formatDate(nextMatch.date)}  ·  {nextMatch.venue}</Text>
        </Pressable>
      ) : null}

      <View style={styles.sectionWrap}>
        <SectionTitle title="Recent fixtures" action="All matches" onAction={() => onTab('Matches')} />
        <Card style={styles.listCard}>
          {latestMatches.map((match, index) => (
            <View key={match.id} style={index === latestMatches.length - 1 ? styles.lastRow : undefined}>
              <MatchRow match={match} teams={data.teams} onPress={() => onOpenMatch(match.id)} />
            </View>
          ))}
          {latestMatches.length === 0 ? <Body>No fixtures yet. Add one from the Matches tab.</Body> : null}
        </Card>
      </View>

      {topPlayer ? (
        <View style={styles.sectionWrap}>
          <SectionTitle title="Player to watch" action="Player roster" onAction={() => onTab('Players')} />
          <Pressable onPress={() => onOpenPlayer(topPlayer.id)}>
            <Card style={styles.playerCard}>
              <View style={styles.playerInitials}><Text style={styles.playerInitialsText}>{topPlayer.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</Text></View>
              <View style={styles.playerCopy}>
                <Text style={styles.playerName}>{topPlayer.name}</Text>
                <Text style={styles.playerTeam}>{getTeamName(data.teams, topPlayer.teamId)} · {topPlayer.role}</Text>
              </View>
              <View style={styles.points}><Text style={styles.pointsValue}>{topPlayer.points}</Text><Text style={styles.pointsLabel}>PTS</Text></View>
            </Card>
          </Pressable>
        </View>
      ) : null}

      <Text style={styles.offlineNote}>●  YOUR SEASON DATA IS STORED ON THIS DEVICE</Text>
    </Page>
  );
}

const styles = StyleSheet.create({
  topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 },
  greeting: { color: colors.ink, fontSize: 27, lineHeight: 35, fontWeight: '700', letterSpacing: -0.65, marginTop: 6 },
  profile: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.greenDark, borderWidth: 1, borderColor: '#B57AFF70', alignItems: 'center', justifyContent: 'center' },
  profileText: { color: colors.goldBright, fontWeight: '900', fontSize: 11, letterSpacing: 0.6 },
  hero: {
    backgroundColor: colors.navy,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#A56AFF55',
    padding: 22,
    gap: 19,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.38,
    shadowRadius: 20,
    elevation: 7,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroEyebrow: { color: '#D5B8FF' },
  teamName: { color: '#FFFFFF', fontSize: 23, lineHeight: 30, fontWeight: '700', marginTop: 7 },
  heroDivider: { height: 1, backgroundColor: '#B78AFF36' },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 17 },
  heroStatValue: { color: '#FFFFFF', fontSize: 23, fontWeight: '800' },
  heroStatSlash: { color: '#C6B9D8', fontSize: 14, fontWeight: '600' },
  heroStatLabel: { color: '#C6B9D8', fontSize: 8, fontWeight: '800', letterSpacing: 0.6, marginTop: 4 },
  heroStatSeparator: { height: 35, width: 1, backgroundColor: '#B78AFF45' },
  form: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 5 },
  formDot: { width: 9, height: 9, borderRadius: 5 },
  quickStats: { flexDirection: 'row', gap: 10 },
  quickStat: { flex: 1, borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: 14, minHeight: 94, justifyContent: 'space-between', shadowColor: '#000000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 3 },
  quickIcon: { color: colors.green, fontSize: 17 },
  quickValue: { color: colors.ink, fontSize: 21, fontWeight: '800' },
  quickLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  nextCard: { backgroundColor: colors.greenDark, borderWidth: 1, borderColor: '#B57AFF55', borderRadius: 19, padding: 18, gap: 8, shadowColor: colors.greenDark, shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.34, shadowRadius: 14, elevation: 5 },
  nextLabel: { flexDirection: 'row', justifyContent: 'space-between' },
  nextLabelText: { color: '#E4D2FF', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  nextArrow: { color: '#FFFFFF', fontSize: 17, lineHeight: 16 },
  nextOpponent: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  nextVs: { color: '#D1B5FF', fontWeight: '500' },
  nextMeta: { color: '#E4D2FF', fontSize: 11 },
  sectionWrap: { gap: 15 },
  listCard: { paddingVertical: 4, paddingHorizontal: 12 },
  lastRow: { borderBottomWidth: 0 },
  playerCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playerInitials: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.goldLight, alignItems: 'center', justifyContent: 'center' },
  playerInitialsText: { color: '#A37231', fontWeight: '800' },
  playerCopy: { flex: 1, gap: 5 },
  playerName: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  playerTeam: { color: colors.muted, fontSize: 10 },
  points: { alignItems: 'flex-end' },
  pointsValue: { color: colors.green, fontSize: 19, fontWeight: '800' },
  pointsLabel: { color: colors.muted, fontSize: 8, fontWeight: '800' },
  offlineNote: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 0.8, textAlign: 'center', paddingTop: 2 },
});
