import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text, DisplayText } from '../components/AppText';
import { AppData, getMatchResult, getTeamName, Match, Player, Team } from '../data/seed';
import { formatDate } from '../data/format';
import { MatchRow } from '../components/MatchRow';
import { Body, Card, Eyebrow, Heading, Initials, Page, SectionTitle } from '../components/ui';
import { ThemePalette, useAppTheme } from '../theme';

export type DetailRoute =
  | { kind: 'team'; id: string }
  | { kind: 'player'; id: string }
  | { kind: 'match'; id: string };

export function DetailScreen({ route, data, onBack, onOpenTeam, onOpenPlayer, onOpenMatch }: {
  route: DetailRoute;
  data: AppData;
  onBack: () => void;
  onOpenTeam: (id: string) => void;
  onOpenPlayer: (id: string) => void;
  onOpenMatch: (id: string) => void;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const team = route.kind === 'team' ? data.teams.find((item) => item.id === route.id) : undefined;
  const player = route.kind === 'player' ? data.players.find((item) => item.id === route.id) : undefined;
  const match = route.kind === 'match' ? data.matches.find((item) => item.id === route.id) : undefined;

  return (
    <Page>
      <Pressable onPress={onBack} style={styles.back}><Text style={styles.backArrow}>‹</Text><Text style={styles.backText}>Back to season</Text></Pressable>
      {team ? <TeamDetail team={team} data={data} onOpenPlayer={onOpenPlayer} onOpenMatch={onOpenMatch} /> : null}
      {player ? <PlayerDetail player={player} data={data} onOpenTeam={onOpenTeam} onOpenMatch={onOpenMatch} /> : null}
      {match ? <MatchDetail match={match} data={data} onOpenTeam={onOpenTeam} /> : null}
      {!team && !player && !match ? (
        <Card><Heading>Record not found</Heading><Body>This record may have been removed from the local season data.</Body></Card>
      ) : null}
    </Page>
  );
}

function TeamDetail({ team, data, onOpenPlayer, onOpenMatch }: {
  team: Team;
  data: AppData;
  onOpenPlayer: (id: string) => void;
  onOpenMatch: (id: string) => void;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const roster = data.players.filter((player) => player.teamId === team.id);
  const matches = data.matches.filter((item) => item.teamId === team.id).sort((a, b) => b.date.localeCompare(a.date));
  const played = matches.filter((item) => getMatchResult(item) !== 'upcoming');
  const wins = played.filter((item) => getMatchResult(item) === 'win').length;
  const rate = played.length ? Math.round((wins / played.length) * 100) : 0;

  return (
    <>
      <View style={[styles.teamHero, { backgroundColor: team.color }]}>
        <View style={styles.teamHeroTop}><Eyebrow style={styles.lightEyebrow}>TEAM PROFILE  ·  EST. {team.founded}</Eyebrow><Text style={styles.bigMonogram}>{team.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</Text></View>
        <DisplayText style={styles.lightHeading}>{team.name}</DisplayText>
        <Text style={styles.lightMeta}>{team.city}  ·  “{team.motto}”</Text>
        <View style={styles.teamStats}>
          <DetailStat value={String(roster.length)} label="PLAYERS" light />
          <DetailStat value={`${wins}/${played.length}`} label="WON" light />
          <DetailStat value={`${rate}%`} label="WIN RATE" light />
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Squad roster" />
        {roster.length === 0 ? <Card><Body>No players added to this squad yet.</Body></Card> : roster.map((player) => (
          <PlayerListItem key={player.id} player={player} team={team} onPress={() => onOpenPlayer(player.id)} />
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Team fixtures" />
        {matches.length === 0 ? <Card><Body>This squad has no fixtures in the season yet.</Body></Card> : (
          <Card style={styles.matchList}>
            {matches.map((item, index) => (
              <View key={item.id} style={index === matches.length - 1 ? styles.lastRow : undefined}>
                <MatchRow match={item} teams={data.teams} onPress={() => onOpenMatch(item.id)} />
              </View>
            ))}
          </Card>
        )}
      </View>
    </>
  );
}

function PlayerDetail({ player, data, onOpenTeam, onOpenMatch }: {
  player: Player;
  data: AppData;
  onOpenTeam: (id: string) => void;
  onOpenMatch: (id: string) => void;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const team = data.teams.find((item) => item.id === player.teamId);
  const winRate = player.matches > 0 ? Math.round((player.wins / player.matches) * 100) : 0;
  const teamMatches = data.matches.filter((item) => item.teamId === player.teamId).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <>
      <Card style={styles.playerHero}>
        <Initials name={player.name} color={team?.color ?? colors.green} size={72} />
        <Eyebrow>PLAYER PROFILE  ·  {player.role.toUpperCase()}</Eyebrow>
        <DisplayText style={styles.center}>{player.name}</DisplayText>
        <Pressable onPress={() => team && onOpenTeam(team.id)}><Text style={[styles.teamLink, { color: team?.color ?? colors.green }]}>{getTeamName(data.teams, player.teamId)}  ↗</Text></Pressable>
        <View style={styles.playerStats}>
          <DetailStat value={String(player.points)} label="POINTS" />
          <DetailStat value={`${winRate}%`} label="WIN RATE" />
          <DetailStat value={`${player.accuracy}%`} label="ACCURACY" />
        </View>
      </Card>

      <View style={styles.section}>
        <SectionTitle title="Season performance" />
        <Card style={styles.performance}>
          <PerformanceRow label="Matches played" value={player.matches} max={Math.max(player.matches, 20)} />
          <PerformanceRow label="Matches won" value={player.wins} max={Math.max(player.matches, 20)} color={colors.green} />
          <PerformanceRow label="Shot accuracy" value={player.accuracy} max={100} suffix="%" color={colors.gold} />
          <View style={styles.pointsBanner}><Text style={styles.pointsLabel}>TOTAL SEASON POINTS</Text><Text style={styles.pointsValue}>{player.points}</Text></View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Recent team fixtures" />
        {teamMatches.length === 0 ? <Card><Body>No team fixtures have been recorded.</Body></Card> : (
          <Card style={styles.matchList}>
            {teamMatches.map((item, index) => (
              <View key={item.id} style={index === teamMatches.length - 1 ? styles.lastRow : undefined}>
                <MatchRow match={item} teams={data.teams} onPress={() => onOpenMatch(item.id)} />
              </View>
            ))}
          </Card>
        )}
      </View>
    </>
  );
}

function MatchDetail({ match, data, onOpenTeam }: { match: Match; data: AppData; onOpenTeam: (id: string) => void }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const team = data.teams.find((item) => item.id === match.teamId);
  const result = getMatchResult(match);
  const statusLabel = result === 'upcoming' ? 'UPCOMING FIXTURE' : result === 'win' ? 'SEASON WIN' : result === 'loss' ? 'SEASON LOSS' : 'MATCH DRAW';
  const resultColor = result === 'win' ? colors.green : result === 'loss' ? colors.red : colors.gold;

  return (
    <>
      <View style={styles.matchHero}>
        <Eyebrow style={styles.matchEyebrow}>{statusLabel}</Eyebrow>
        <Heading style={styles.matchDate}>{formatDate(match.date)}</Heading>
        <Text style={styles.matchVenue}>{match.venue}</Text>
        <View style={styles.scoreboard}>
          <View style={styles.scoreSide}>
            <View style={[styles.teamBadge, { backgroundColor: `${team?.color ?? colors.green}22` }]}><Text style={[styles.teamBadgeText, { color: team?.color ?? colors.green }]}>{team?.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() ?? 'CT'}</Text></View>
            <Text style={styles.scoreTeam} numberOfLines={1}>{getTeamName(data.teams, match.teamId)}</Text>
          </View>
          <View style={styles.scoreCenter}>
            {result === 'upcoming' ? (
              <Text style={styles.vsText}>VS</Text>
            ) : (
              <Text style={[styles.finalScore, { color: resultColor }]}>{match.ourScore} <Text style={styles.scoreDashText}>–</Text> {match.opponentScore}</Text>
            )}
            {result !== 'upcoming' ? <Text style={styles.finalLabel}>FINAL</Text> : <Text style={styles.finalLabel}>FIXTURE</Text>}
          </View>
          <View style={styles.scoreSide}>
            <View style={[styles.teamBadge, { backgroundColor: colors.goldLight }]}><Text style={[styles.teamBadgeText, { color: colors.goldBright }]}>{match.opponent.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</Text></View>
            <Text style={styles.scoreTeam} numberOfLines={1}>{match.opponent}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Fixture details" />
        <Card style={styles.detailList}>
          <InfoRow label="HOME SQUAD" value={getTeamName(data.teams, match.teamId)} />
          <InfoRow label="OPPONENT" value={match.opponent} />
          <InfoRow label="DATE" value={formatDate(match.date)} />
          <InfoRow label="VENUE" value={match.venue} />
          <InfoRow label="STATUS" value={result === 'upcoming' ? 'Scheduled' : result === 'win' ? 'Won' : result === 'loss' ? 'Lost' : 'Drawn'} valueColor={resultColor} />
        </Card>
      </View>

      {team ? (
        <Pressable onPress={() => onOpenTeam(team.id)}>
          <Card style={styles.teamShortcut}>
            <Initials name={team.name} color={team.color} size={40} />
            <View style={{ flex: 1 }}><Text style={styles.shortcutLabel}>SQUAD PROFILE</Text><Text style={styles.shortcutName}>{team.name}</Text></View>
            <Text style={styles.shortcutArrow}>↗</Text>
          </Card>
        </Pressable>
      ) : null}
    </>
  );
}

function PlayerListItem({ player, team, onPress }: { player: Player; team: Team; onPress: () => void }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.playerItem}>
        <Initials name={player.name} color={team.color} size={42} />
        <View style={{ flex: 1, gap: 4 }}><Text style={styles.playerName}>{player.name}</Text><Text style={styles.playerRole}>{player.role} · {player.points} points</Text></View>
        <Text style={styles.playerArrow}>›</Text>
      </Card>
    </Pressable>
  );
}

function DetailStat({ value, label, light = false }: { value: string; label: string; light?: boolean }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.detailStat}>
      <Text style={[styles.detailStatValue, light && styles.lightDetailValue]}>{value}</Text>
      <Text style={[styles.detailStatLabel, light && styles.lightDetailLabel]}>{label}</Text>
    </View>
  );
}

function PerformanceRow({ label, value, max, suffix = '', color }: { label: string; value: number; max: number; suffix?: string; color?: string }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const width = `${Math.min(100, max > 0 ? (value / max) * 100 : 0)}%` as `${number}%`;
  return (
    <View style={styles.performanceRow}>
      <View style={styles.performanceLabel}><Text style={styles.performanceName}>{label}</Text><Text style={styles.performanceValue}>{value}{suffix}</Text></View>
      <View style={styles.track}><View style={[styles.fill, { width, backgroundColor: color ?? colors.green }]} /></View>
    </View>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, { color: valueColor ?? colors.ink }]}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: ThemePalette) => StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 1, marginBottom: -4 },
  backArrow: { color: colors.green, fontSize: 24, lineHeight: 24 },
  backText: { color: colors.green, fontSize: 11, fontWeight: '800' },
  teamHero: { borderRadius: 22, padding: 20, gap: 10 },
  teamHeroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lightEyebrow: { color: '#FFFFFFD9' },
  bigMonogram: { color: '#FFFFFF55', fontSize: 25, fontWeight: '900' },
  lightHeading: { color: '#FFFFFF', fontSize: 25 },
  lightMeta: { color: '#FFFFFFE8', fontSize: 11 },
  teamStats: { flexDirection: 'row', gap: 28, paddingTop: 13, marginTop: 5, borderTopWidth: 1, borderTopColor: '#ffffff35' },
  detailStat: { gap: 4, alignItems: 'center' },
  detailStatValue: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  detailStatLabel: { color: colors.muted, fontSize: 7, fontWeight: '900', letterSpacing: 0.6 },
  lightDetailValue: { color: '#FFFFFF', fontSize: 17 },
  lightDetailLabel: { color: '#FFFFFFD9' },
  section: { gap: 13 },
  playerItem: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12 },
  playerName: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  playerRole: { color: colors.muted, fontSize: 9 },
  playerArrow: { color: colors.green, fontSize: 20 },
  matchList: { paddingVertical: 0, paddingHorizontal: 12 },
  lastRow: { borderBottomWidth: 0 },
  playerHero: { alignItems: 'center', paddingVertical: 22, gap: 11 },
  center: { textAlign: 'center' },
  teamLink: { fontSize: 11, fontWeight: '800' },
  playerStats: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 15, marginTop: 6, borderTopWidth: 1, borderTopColor: colors.line },
  performance: { gap: 17 },
  performanceRow: { gap: 8 },
  performanceLabel: { flexDirection: 'row', justifyContent: 'space-between' },
  performanceName: { color: colors.muted, fontSize: 10, fontWeight: '600' },
  performanceValue: { color: colors.ink, fontSize: 10, fontWeight: '800' },
  track: { height: 6, borderRadius: 4, backgroundColor: colors.background, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  pointsBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 13, borderTopWidth: 1, borderTopColor: colors.line },
  pointsLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  pointsValue: { color: colors.green, fontSize: 19, fontWeight: '900' },
  matchHero: { backgroundColor: colors.surface, borderRadius: 22, borderWidth: 1, borderColor: colors.line, padding: 18, gap: 6 },
  matchEyebrow: { color: colors.green, textAlign: 'center' },
  matchDate: { fontSize: 21, textAlign: 'center', marginTop: 3 },
  matchVenue: { color: colors.muted, fontSize: 10, textAlign: 'center' },
  scoreboard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, paddingTop: 16, borderTopWidth: 1, borderColor: colors.line },
  scoreSide: { flex: 1, alignItems: 'center', gap: 7 },
  teamBadge: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  teamBadgeText: { fontSize: 11, fontWeight: '900' },
  scoreTeam: { color: colors.ink, fontSize: 9, fontWeight: '700', maxWidth: '100%' },
  scoreCenter: { alignItems: 'center', minWidth: 95 },
  finalScore: { fontSize: 24, fontWeight: '900' },
  scoreDashText: { color: colors.muted, fontSize: 17 },
  vsText: { color: colors.muted, fontSize: 19, fontWeight: '900' },
  finalLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  detailList: { gap: 0, paddingVertical: 3 },
  infoRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  infoLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  infoValue: { fontSize: 10, fontWeight: '800', textAlign: 'right', flexShrink: 1 },
  teamShortcut: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  shortcutLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  shortcutName: { color: colors.ink, fontSize: 12, fontWeight: '800', marginTop: 3 },
  shortcutArrow: { color: colors.green, fontSize: 17 },
});
