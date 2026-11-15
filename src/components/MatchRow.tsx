import { Pressable, StyleSheet, View } from 'react-native';

import { Match, getMatchResult, getTeamName, Team } from '../data/seed';
import { formatDate } from '../data/format';
import { colors } from '../theme';
import { AppText as Text } from './AppText';

export function MatchRow({ match, teams, onPress }: { match: Match; teams: Team[]; onPress: () => void }) {
  const result = getMatchResult(match);
  const teamName = getTeamName(teams, match.teamId);
  const outcome = result === 'upcoming'
    ? 'UP NEXT'
    : result === 'win'
      ? 'WIN'
      : result === 'loss'
        ? 'LOSS'
        : 'DRAW';
  const outcomeColor = result === 'win' ? colors.green : result === 'loss' ? colors.red : colors.muted;

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.dateBlock}>
        <Text style={styles.dateDay}>{match.date.slice(8, 10)}</Text>
        <Text style={styles.dateMonth}>{new Date(Number(match.date.slice(0, 4)), Number(match.date.slice(5, 7)) - 1, 1).toLocaleDateString('en-LK', { month: 'short' }).toUpperCase()}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.matchup} numberOfLines={1}>{teamName} <Text style={styles.vs}>vs</Text> {match.opponent}</Text>
        <Text style={styles.venue} numberOfLines={1}>{match.venue} · {formatDate(match.date)}</Text>
      </View>
      <View style={styles.scoreBlock}>
        {result === 'upcoming' ? (
          <Text style={[styles.outcome, { color: colors.gold }]}>UP NEXT</Text>
        ) : (
          <>
            <Text style={styles.score}>{match.ourScore}–{match.opponentScore}</Text>
            <Text style={[styles.outcome, { color: outcomeColor }]}>{outcome}</Text>
          </>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  dateBlock: { width: 43, height: 45, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  dateDay: { color: colors.ink, fontSize: 16, fontWeight: '800', lineHeight: 19 },
  dateMonth: { color: colors.muted, fontSize: 8, fontWeight: '800' },
  details: { flex: 1, gap: 5 },
  matchup: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  vs: { color: colors.muted, fontWeight: '500' },
  venue: { color: colors.muted, fontSize: 9 },
  scoreBlock: { alignItems: 'flex-end', minWidth: 49, gap: 3 },
  score: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  outcome: { fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  chevron: { color: '#AAB3AE', fontSize: 20, marginLeft: -4 },
});
