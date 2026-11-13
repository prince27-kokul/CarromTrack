import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppData, Match, getMatchResult, getTeamName } from '../data/seed';
import { AppText as Text } from '../components/AppText';
import { MatchRow } from '../components/MatchRow';
import { Body, Card, Chip, Eyebrow, Heading, Page, PrimaryButton, SearchField } from '../components/ui';
import { colors } from '../theme';

type MatchFilter = 'All' | 'Upcoming' | 'Played';
type DraftMatch = Omit<Match, 'id'>;

export function MatchesScreen({ data, onOpenMatch, onAddMatch }: {
  data: AppData;
  onOpenMatch: (id: string) => void;
  onAddMatch: (match: DraftMatch) => Promise<boolean>;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MatchFilter>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [teamId, setTeamId] = useState(data.teams[0]?.id ?? '');
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [ourScore, setOurScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const matches = useMemo(() => data.matches.filter((match) => {
    const result = getMatchResult(match);
    const statusMatches = filter === 'All' || (filter === 'Upcoming' ? result === 'upcoming' : result !== 'upcoming');
    return statusMatches && `${getTeamName(data.teams, match.teamId)} ${match.opponent} ${match.venue}`.toLowerCase().includes(search.trim().toLowerCase());
  }).sort((a, b) => {
    const aUpcoming = getMatchResult(a) === 'upcoming';
    const bUpcoming = getMatchResult(b) === 'upcoming';
    if (aUpcoming && bUpcoming) return a.date.localeCompare(b.date);
    if (aUpcoming) return -1;
    if (bUpcoming) return 1;
    return b.date.localeCompare(a.date);
  }), [data.matches, data.teams, filter, search]);

  const resetForm = () => {
    setOpponent('');
    setDate('');
    setVenue('');
    setOurScore('');
    setOpponentScore('');
    setTeamId(data.teams[0]?.id ?? '');
    setError('');
  };

  const submit = async () => {
    const cleanedOpponent = opponent.trim();
    const cleanedVenue = venue.trim();
    if (!teamId) {
      setError('Add a team before creating a fixture.');
      return;
    }
    if (!cleanedOpponent || !cleanedVenue || !date.trim()) {
      setError('Add an opponent, date and venue to continue.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      setError('Enter the date in YYYY-MM-DD format.');
      return;
    }
    const [year, month, day] = date.trim().split('-').map(Number);
    const validDate = new Date(year, month - 1, day);
    if (validDate.getFullYear() !== year || validDate.getMonth() !== month - 1 || validDate.getDate() !== day) {
      setError('Enter a real calendar date.');
      return;
    }
    const hasOurScore = ourScore.trim() !== '';
    const hasOpponentScore = opponentScore.trim() !== '';
    if (hasOurScore !== hasOpponentScore) {
      setError('Enter both scores to record a result, or leave both blank for an upcoming fixture.');
      return;
    }
    const scorePattern = /^\d+$/;
    if ((hasOurScore && !scorePattern.test(ourScore.trim())) || (hasOpponentScore && !scorePattern.test(opponentScore.trim()))) {
      setError('Scores must be whole numbers greater than or equal to zero.');
      return;
    }

    setSaving(true);
    const saved = await onAddMatch({
      teamId,
      opponent: cleanedOpponent,
      date: date.trim(),
      venue: cleanedVenue,
      ourScore: hasOurScore ? Number(ourScore) : null,
      opponentScore: hasOpponentScore ? Number(opponentScore) : null,
    });
    setSaving(false);
    if (saved) {
      setModalVisible(false);
      resetForm();
    }
  };

  return (
    <>
      <Page>
        <View style={styles.header}>
          <Eyebrow>FIXTURES & SCOREBOARD</Eyebrow>
          <View style={styles.titleRow}><Heading>Match day</Heading><PrimaryButton label="+ Add fixture" onPress={() => setModalVisible(true)} compact /></View>
          <Body>Plan a game, record the score, keep the season moving.</Body>
        </View>
        <SearchField value={search} onChangeText={setSearch} placeholder="Search teams, opponents or venue" />
        <View style={styles.filters}>
          {(['All', 'Upcoming', 'Played'] as const).map((value) => (
            <Chip key={value} label={`${value}  ${value === 'All' ? data.matches.length : value === 'Upcoming' ? data.matches.filter((match) => getMatchResult(match) === 'upcoming').length : data.matches.filter((match) => getMatchResult(match) !== 'upcoming').length}`} selected={filter === value} onPress={() => setFilter(value)} />
          ))}
        </View>
        <Text style={styles.resultCount}>{matches.length} FIXTURE{matches.length === 1 ? '' : 'S'} · UPCOMING GAMES FIRST</Text>
        {matches.length === 0 ? (
          <Card style={styles.empty}>
            <Text style={styles.emptyIcon}>▤</Text>
            <Text style={styles.emptyTitle}>No fixtures found</Text>
            <Body>Change your search or filters, or add a new fixture.</Body>
          </Card>
        ) : (
          matches.map((match, index) => (
            <View key={match.id} style={styles.matchCard}>
              {index === 0 || getMatchResult(matches[index - 1]) !== getMatchResult(match) ? (
                <Text style={styles.groupTitle}>{getMatchResult(match) === 'upcoming' ? 'UP NEXT' : 'COMPLETED'}</Text>
              ) : null}
              <Card style={styles.rowCard}>
                <MatchRow match={match} teams={data.teams} onPress={() => onOpenMatch(match.id)} />
              </Card>
            </View>
          ))
        )}
      </Page>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View><Eyebrow>LOCAL SEASON RECORD</Eyebrow><Text style={styles.modalTitle}>Add a fixture</Text></View>
              <Pressable onPress={() => { setModalVisible(false); setError(''); }} hitSlop={10} accessibilityLabel="Close form"><Text style={styles.close}>×</Text></Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
              <Text style={styles.label}>HOME TEAM</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teamChips}>
                {data.teams.map((team) => <Chip key={team.id} label={team.name} selected={team.id === teamId} onPress={() => setTeamId(team.id)} />)}
              </ScrollView>
              <Field label="OPPONENT" value={opponent} onChangeText={setOpponent} placeholder="e.g. Jaffna Comets" />
              <Field label="DATE  ·  YYYY-MM-DD" value={date} onChangeText={setDate} placeholder="2026-11-20" />
              <Field label="VENUE" value={venue} onChangeText={setVenue} placeholder="Club or sports hall" />
              <Text style={styles.label}>SCORE  ·  OPTIONAL UNTIL PLAYED</Text>
              <View style={styles.scoreInputs}>
                <TextInput value={ourScore} onChangeText={setOurScore} placeholder="Your score" placeholderTextColor={colors.muted} style={styles.scoreInput} keyboardType="number-pad" accessibilityLabel="Your team score" />
                <Text style={styles.scoreDash}>–</Text>
                <TextInput value={opponentScore} onChangeText={setOpponentScore} placeholder="Their score" placeholderTextColor={colors.muted} style={styles.scoreInput} keyboardType="number-pad" accessibilityLabel="Opponent score" />
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.helper}>Leave both scores blank for an upcoming game.</Text>}
              <PrimaryButton label={saving ? 'Saving to this device…' : 'Save fixture'} onPress={() => { void submit(); }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function Field({ label, value, onChangeText, placeholder }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: 7, paddingTop: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filters: { flexDirection: 'row', gap: 8 },
  resultCount: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.9 },
  matchCard: { gap: 7 },
  groupTitle: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1.1, paddingLeft: 2 },
  rowCard: { paddingVertical: 0, paddingHorizontal: 12 },
  empty: { alignItems: 'center', gap: 9, paddingVertical: 27 },
  emptyIcon: { color: colors.green, fontSize: 28 },
  emptyTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: '#14231FCC', justifyContent: 'flex-end' },
  modalCard: { maxHeight: '92%', backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 22, paddingHorizontal: 20, paddingBottom: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: colors.ink, fontSize: 22, fontWeight: '800', marginTop: 4 },
  close: { color: colors.muted, fontSize: 28, lineHeight: 32, paddingHorizontal: 4 },
  form: { gap: 13, paddingBottom: 8 },
  label: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  teamChips: { gap: 8, paddingRight: 20 },
  field: { gap: 7 },
  input: { height: 46, borderRadius: 12, paddingHorizontal: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, color: colors.ink, fontSize: 13 },
  scoreInputs: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreInput: { flex: 1, height: 46, borderRadius: 12, textAlign: 'center', paddingHorizontal: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, color: colors.ink, fontSize: 12 },
  scoreDash: { color: colors.muted, fontWeight: '800' },
  helper: { color: colors.muted, fontSize: 10, lineHeight: 16 },
  error: { color: colors.red, fontSize: 11, fontWeight: '700', lineHeight: 16 },
});
