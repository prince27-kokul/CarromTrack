import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text } from '../components/AppText';
import { AppData, getMatchResult } from '../data/seed';
import { Body, Card, Eyebrow, Heading, Page, SearchField } from '../components/ui';
import { colors } from '../theme';

export function TeamsScreen({ data, onOpenTeam }: { data: AppData; onOpenTeam: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const teams = useMemo(() => data.teams.filter((team) => `${team.name} ${team.city}`.toLowerCase().includes(search.trim().toLowerCase())), [data.teams, search]);

  return (
    <Page>
      <View style={styles.header}>
        <Eyebrow>YOUR CARROM COMMUNITY</Eyebrow>
        <Heading>Team squads</Heading>
        <Body>Every squad, every season. Tap a team to see their roster and record.</Body>
      </View>
      <SearchField value={search} onChangeText={setSearch} placeholder="Search teams or cities" />
      <View style={styles.summary}><Text style={styles.summaryText}>{teams.length} SQUADS</Text><Text style={styles.summaryDot}>·</Text><Text style={styles.summaryText}>{data.players.length} PLAYERS</Text></View>
      {teams.length === 0 ? <Card><Body>No teams match “{search}”. Try another name or city.</Body></Card> : teams.map((team) => {
        const roster = data.players.filter((player) => player.teamId === team.id);
        const played = data.matches.filter((match) => match.teamId === team.id && getMatchResult(match) !== 'upcoming');
        const wins = played.filter((match) => getMatchResult(match) === 'win').length;
        const rate = played.length ? Math.round((wins / played.length) * 100) : 0;
        return (
          <Pressable key={team.id} onPress={() => onOpenTeam(team.id)}>
            <Card style={styles.teamCard}>
              <View style={styles.cardTop}>
                <View style={[styles.emblem, { backgroundColor: `${team.color}18` }]}><Text style={[styles.emblemText, { color: team.color }]}>{team.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</Text></View>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamLocation}>{team.city}  ·  EST. {team.founded}</Text>
                </View>
                <Text style={styles.arrow}>↗</Text>
              </View>
              <Text style={styles.motto}>“{team.motto}”</Text>
              <View style={styles.divider} />
              <View style={styles.metrics}>
                <View style={styles.metric}><Text style={styles.metricValue}>{roster.length}</Text><Text style={styles.metricLabel}>PLAYERS</Text></View>
                <View style={styles.metric}><Text style={styles.metricValue}>{played.length}<Text style={styles.metricSub}> played</Text></Text><Text style={styles.metricLabel}>FIXTURES</Text></View>
                <View style={styles.metric}><Text style={[styles.metricValue, { color: team.color }]}>{rate}%</Text><Text style={styles.metricLabel}>WIN RATE</Text></View>
              </View>
              <View style={styles.rosterPreview}>
                {roster.slice(0, 4).map((player, index) => (
                  <View key={player.id} style={[styles.avatar, { backgroundColor: `${team.color}${index === 0 ? '32' : '19'}`, marginLeft: index === 0 ? 0 : -7, zIndex: roster.length - index }]}>
                    <Text style={[styles.avatarText, { color: team.color }]}>{player.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</Text>
                  </View>
                ))}
                <Text style={styles.rosterLabel}>{roster.length ? `${roster[0].name.split(' ')[0]}${roster.length > 1 ? ` + ${roster.length - 1} teammates` : ''}` : 'No players yet'}</Text>
              </View>
            </Card>
          </Pressable>
        );
      })}
    </Page>
  );
}

const styles = StyleSheet.create({
  header: { gap: 7, paddingTop: 4 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -7 },
  summaryText: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 0.9 },
  summaryDot: { color: colors.gold, fontSize: 15 },
  teamCard: { gap: 15 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emblem: { width: 47, height: 47, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  emblemText: { fontSize: 12, fontWeight: '900' },
  teamInfo: { flex: 1, gap: 5 },
  teamName: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  teamLocation: { color: colors.muted, fontSize: 9, fontWeight: '600', letterSpacing: 0.5 },
  arrow: { color: colors.green, fontSize: 17 },
  motto: { color: colors.muted, fontSize: 12, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: -2 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { gap: 4 },
  metricValue: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  metricSub: { color: colors.muted, fontSize: 9, fontWeight: '600' },
  metricLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 0.7 },
  rosterPreview: { flexDirection: 'row', alignItems: 'center', paddingTop: 1 },
  avatar: { width: 27, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  avatarText: { fontSize: 8, fontWeight: '900' },
  rosterLabel: { color: colors.muted, fontSize: 10, marginLeft: 9, fontWeight: '600' },
});
