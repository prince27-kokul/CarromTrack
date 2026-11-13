import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText as Text } from '../components/AppText';
import { AppData, getTeamName } from '../data/seed';
import { Body, Card, Chip, Eyebrow, Heading, Initials, Page, SearchField } from '../components/ui';
import { colors } from '../theme';

type RoleFilter = 'All' | 'Striker' | 'Pocket specialist' | 'All-rounder';

export function PlayersScreen({ data, onOpenPlayer }: { data: AppData; onOpenPlayer: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('All teams');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const roles: RoleFilter[] = ['All', 'Striker', 'Pocket specialist', 'All-rounder'];
  const players = useMemo(() => data.players.filter((player) => {
    const team = getTeamName(data.teams, player.teamId);
    return (teamFilter === 'All teams' || player.teamId === teamFilter)
      && (roleFilter === 'All' || player.role === roleFilter)
      && `${player.name} ${player.role} ${team}`.toLowerCase().includes(search.trim().toLowerCase());
  }), [data.players, data.teams, roleFilter, search, teamFilter]);

  return (
    <Page>
      <View style={styles.header}>
        <Eyebrow>MEET THE PLAYERS</Eyebrow>
        <Heading>Player roster</Heading>
        <Body>Find a player and follow their form across the season.</Body>
      </View>
      <SearchField value={search} onChangeText={setSearch} placeholder="Search name, role or team" />
      <View style={styles.filterBlock}>
        <Text style={styles.filterLabel}>TEAM</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All teams" selected={teamFilter === 'All teams'} onPress={() => setTeamFilter('All teams')} />
          {data.teams.map((team) => <Chip key={team.id} label={team.name} selected={teamFilter === team.id} onPress={() => setTeamFilter(team.id)} />)}
        </ScrollView>
      </View>
      <View style={styles.filterBlock}>
        <Text style={styles.filterLabel}>PLAYING STYLE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {roles.map((role) => <Chip key={role} label={role} selected={roleFilter === role} onPress={() => setRoleFilter(role)} />)}
        </ScrollView>
      </View>
      <Text style={styles.resultCount}>{players.length} PLAYER{players.length === 1 ? '' : 'S'} FOUND</Text>
      {players.length === 0 ? <Card><Body>No players match these filters. Try widening your search.</Body></Card> : players.map((player) => {
        const team = data.teams.find((item) => item.id === player.teamId);
        const winRate = player.matches > 0 ? Math.round((player.wins / player.matches) * 100) : 0;
        return (
          <Pressable key={player.id} onPress={() => onOpenPlayer(player.id)}>
            <Card style={styles.playerCard}>
              <Initials name={player.name} color={team?.color ?? colors.green} size={48} />
              <View style={styles.info}>
                <View style={styles.nameLine}><Text style={styles.name}>{player.name}</Text><Text style={styles.arrow}>↗</Text></View>
                <Text style={styles.team}>{getTeamName(data.teams, player.teamId)}  ·  {player.role}</Text>
                <View style={styles.statsLine}>
                  <View style={styles.miniStat}><Text style={styles.statValue}>{player.points}</Text><Text style={styles.statLabel}>PTS</Text></View>
                  <View style={styles.miniStat}><Text style={styles.statValue}>{player.matches}</Text><Text style={styles.statLabel}>MATCHES</Text></View>
                  <View style={styles.miniStat}><Text style={[styles.statValue, { color: colors.green }]}>{winRate}%</Text><Text style={styles.statLabel}>WIN RATE</Text></View>
                </View>
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
  filterBlock: { gap: 9 },
  filterLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  chips: { gap: 8, paddingRight: 20 },
  resultCount: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 0.9, marginTop: -5 },
  playerCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  info: { flex: 1, gap: 6 },
  nameLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  arrow: { color: colors.green, fontSize: 15 },
  team: { color: colors.muted, fontSize: 9 },
  statsLine: { flexDirection: 'row', gap: 19, paddingTop: 4 },
  miniStat: { gap: 3 },
  statValue: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  statLabel: { color: colors.muted, fontSize: 7, fontWeight: '800', letterSpacing: 0.5 },
});
