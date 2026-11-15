import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '../components/AppText';
import { AppData, getMatchResult } from '../data/seed';
import { Card, Eyebrow, Heading, Page, SectionTitle } from '../components/ui';
import { colors } from '../theme';

export function InsightsScreen({ data }: { data: AppData }) {
  const played = data.matches.filter((match) => getMatchResult(match) !== 'upcoming');
  const wins = played.filter((match) => getMatchResult(match) === 'win').length;
  const losses = played.filter((match) => getMatchResult(match) === 'loss').length;
  const scored = played.reduce((total, match) => total + (match.ourScore ?? 0), 0);
  const average = played.length > 0 ? (scored / played.length).toFixed(1) : '0';
  const leadingPlayer = [...data.players].sort((a, b) => b.points - a.points)[0];
  const teamStats = data.teams.map((team) => {
    const matches = played.filter((match) => match.teamId === team.id);
    const teamWins = matches.filter((match) => getMatchResult(match) === 'win').length;
    return { team, matches: matches.length, wins: teamWins, rate: matches.length ? Math.round((teamWins / matches.length) * 100) : 0 };
  }).sort((a, b) => b.rate - a.rate || b.wins - a.wins);
  const recent = [...played].sort((a, b) => a.date.localeCompare(b.date)).slice(-6);
  const maxScore = Math.max(...recent.map((match) => match.ourScore ?? 0), 1);
  const winRate = played.length ? Math.round((wins / played.length) * 100) : 0;

  return (
    <Page>
      <View style={styles.header}>
        <Eyebrow>SEASON 2026  ·  LIVE FROM YOUR DEVICE</Eyebrow>
        <Heading>Numbers tell stories.</Heading>
        <Text style={styles.intro}>A closer look at your carrom community's season so far.</Text>
      </View>

      <View style={styles.metricGrid}>
        <Metric label="FIXTURES PLAYED" value={String(played.length)} note={`${data.matches.length - played.length} coming up`} tint={colors.greenLight} />
        <Metric label="LEAGUE WIN RATE" value={`${winRate}%`} note={`${wins} wins · ${losses} losses`} tint={colors.goldLight} />
        <Metric label="POINTS SCORED" value={String(scored)} note={`Average ${average} per game`} tint={colors.greenLight} />
        <Metric label="PLAYERS ACTIVE" value={String(data.players.length)} note={`${data.teams.length} independent squads`} tint={colors.redLight} />
      </View>

      <View style={styles.section}>
        <SectionTitle title="Points over recent games" />
        <Card style={styles.chartCard}>
          <View style={styles.chartMeta}><Text style={styles.chartCaption}>SCORE BY FIXTURE</Text><Text style={styles.chartKey}><Text style={styles.keyDot}>● </Text>Your team</Text></View>
          {recent.length === 0 ? (
            <Text style={styles.chartEmpty}>Record a match score to start your chart.</Text>
          ) : (
            <View style={styles.chart}>
              {recent.map((match) => {
                const score = match.ourScore ?? 0;
                const height = Math.max(12, Math.round((score / maxScore) * 104));
                const won = getMatchResult(match) === 'win';
                return (
                  <View key={match.id} style={styles.barGroup}>
                    <Text style={styles.barValue}>{score}</Text>
                    <View style={styles.barTrack}><View style={[styles.bar, { height, backgroundColor: won ? colors.green : colors.gold }]} /></View>
                    <Text style={styles.barDate}>{match.date.slice(5, 7)}/{match.date.slice(8, 10)}</Text>
                  </View>
                );
              })}
            </View>
          )}
          <View style={styles.chartFooter}><Text style={styles.footerTag}><Text style={styles.greenDot}>●</Text> Win</Text><Text style={styles.footerTag}><Text style={styles.goldDot}>●</Text> Loss or draw</Text><Text style={styles.footerNote}>score / date</Text></View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Squad standings" />
        <Card style={styles.standings}>
          <View style={styles.tableHead}><Text style={[styles.tableLabel, { flex: 1 }]}>TEAM</Text><Text style={styles.tableLabel}>PLAYED</Text><Text style={styles.tableLabel}>WON</Text><Text style={[styles.tableLabel, { width: 43, textAlign: 'right' }]}>RATE</Text></View>
          {teamStats.map((row, index) => (
            <View key={row.team.id} style={styles.tableRow}>
              <View style={styles.teamNameCell}><Text style={styles.rank}>{String(index + 1).padStart(2, '0')}</Text><View style={[styles.teamDot, { backgroundColor: row.team.color }]} /><Text style={styles.teamName} numberOfLines={1}>{row.team.name}</Text></View>
              <Text style={styles.cellValue}>{row.matches}</Text><Text style={styles.cellValue}>{row.wins}</Text><Text style={[styles.rate, { color: row.team.color }]}>{row.rate}%</Text>
            </View>
          ))}
        </Card>
      </View>

      {leadingPlayer ? (
        <Card style={styles.leaderCard}>
          <View style={styles.leaderIcon}><Text style={styles.star}>✦</Text></View>
          <View style={styles.leaderCopy}><Text style={styles.leaderLabel}>POINTS LEADER</Text><Text style={styles.leaderName}>{leadingPlayer.name}</Text><Text style={styles.leaderMeta}>{leadingPlayer.points} points · {leadingPlayer.accuracy}% shot accuracy</Text></View>
          <Text style={styles.trophy}>♜</Text>
        </Card>
      ) : null}

      <Text style={styles.footnote}>Statistics update automatically when you add a result.</Text>
    </Page>
  );
}

function Metric({ label, value, note, tint }: { label: string; value: string; note: string; tint: string }) {
  return (
    <Card style={styles.metricCard}>
      <View style={[styles.metricAccent, { backgroundColor: tint }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricNote}>{note}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { gap: 8, paddingTop: 4 },
  intro: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '48%', flexGrow: 1, minHeight: 116, gap: 6, padding: 14, overflow: 'hidden' },
  metricAccent: { position: 'absolute', top: -19, right: -14, width: 67, height: 67, borderRadius: 40, opacity: 0.85 },
  metricLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  metricValue: { color: colors.ink, fontSize: 25, fontWeight: '800', marginTop: 4 },
  metricNote: { color: colors.muted, fontSize: 9 },
  section: { gap: 14 },
  chartCard: { gap: 15, paddingVertical: 15 },
  chartMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartCaption: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  chartKey: { color: colors.muted, fontSize: 9, fontWeight: '600' },
  keyDot: { color: colors.green },
  chart: { flexDirection: 'row', height: 152, alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: colors.line, paddingHorizontal: 2 },
  barGroup: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 4 },
  barValue: { color: colors.ink, fontSize: 9, fontWeight: '800' },
  barTrack: { height: 111, width: 22, justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  barDate: { color: colors.muted, fontSize: 8, paddingBottom: 5 },
  chartEmpty: { color: colors.muted, fontSize: 11, textAlign: 'center', paddingVertical: 30 },
  chartFooter: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  footerTag: { color: colors.muted, fontSize: 9 },
  greenDot: { color: colors.green },
  goldDot: { color: colors.gold },
  footerNote: { color: colors.muted, fontSize: 8, marginLeft: 'auto' },
  standings: { paddingHorizontal: 13, paddingVertical: 8 },
  tableHead: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderColor: colors.line },
  tableLabel: { width: 40, color: colors.muted, fontSize: 7, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 43, borderBottomWidth: 1, borderBottomColor: colors.line },
  teamNameCell: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6 },
  rank: { width: 15, color: colors.muted, fontSize: 8, fontWeight: '800' },
  teamDot: { width: 7, height: 7, borderRadius: 4 },
  teamName: { flex: 1, color: colors.ink, fontSize: 9, fontWeight: '700' },
  cellValue: { width: 40, color: colors.ink, textAlign: 'center', fontSize: 10, fontWeight: '700' },
  rate: { width: 43, textAlign: 'right', fontSize: 10, fontWeight: '900' },
  leaderCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.navy, borderColor: colors.navy },
  leaderIcon: { width: 39, height: 39, borderRadius: 14, backgroundColor: '#ffffff18', alignItems: 'center', justifyContent: 'center' },
  star: { color: '#EDC575', fontSize: 18 },
  leaderCopy: { flex: 1, gap: 4 },
  leaderLabel: { color: '#B6C7BE', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  leaderName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  leaderMeta: { color: '#B6C7BE', fontSize: 9 },
  trophy: { color: '#EDC575', fontSize: 24 },
  footnote: { color: colors.muted, fontSize: 9, textAlign: 'center' },
});
