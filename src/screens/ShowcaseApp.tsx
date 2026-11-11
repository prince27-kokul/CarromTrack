import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { AppText as Text, DisplayText } from '../components/AppText';

type ThemeMode = 'dark' | 'light';
type Screen = 'Home' | 'New Game';
type Palette = {
  bg: string;
  panel: string;
  raised: string;
  border: string;
  text: string;
  muted: string;
  purple: string;
  violet: string;
  blue: string;
  gold: string;
  green: string;
};

const THEME_KEY = 'carromtrack.showcase.theme.v1';
const darkPalette: Palette = {
  bg: '#0A0711',
  panel: '#171022',
  raised: '#21172E',
  border: '#382947',
  text: '#FBF8FF',
  muted: '#B1A8BF',
  purple: '#8E36F5',
  violet: '#B65CFF',
  blue: '#1262D7',
  gold: '#FFB82E',
  green: '#00D58B',
};
const lightPalette: Palette = {
  bg: '#F5F2F8',
  panel: '#FFFFFF',
  raised: '#EEE8F4',
  border: '#DED5E8',
  text: '#251B30',
  muted: '#746A80',
  purple: '#7828D8',
  violet: '#7929D1',
  blue: '#1C64C7',
  gold: '#E6A21C',
  green: '#008D66',
};

export function ShowcaseApp() {
  const { width } = useWindowDimensions();
  const desktop = width >= 820;
  const stacked = width < 1200;
  const boardSize = Math.min(430, Math.max(250, stacked ? width - 335 : (width - 330) / 2));
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [screen, setScreen] = useState<Screen>('Home');
  const [playerA, setPlayerA] = useState('Amin');
  const [playerB, setPlayerB] = useState('Badr');
  const [gameType, setGameType] = useState<'Singles' | 'Doubles'>('Singles');
  const [target, setTarget] = useState(25);
  const palette = theme === 'dark' ? darkPalette : lightPalette;
  const styles = useMemo(() => makeStyles(palette), [palette]);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (active && (saved === 'dark' || saved === 'light')) setTheme(saved);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    void AsyncStorage.setItem(THEME_KEY, next).catch(() => undefined);
  };

  const content = screen === 'Home'
    ? <HomeScreen desktop={desktop} stacked={stacked} boardSize={boardSize} styles={styles} palette={palette} onNewGame={() => setScreen('New Game')} onTheme={toggleTheme} theme={theme} />
    : <NewGameScreen desktop={desktop} boardSize={boardSize} styles={styles} palette={palette} playerA={playerA} playerB={playerB} gameType={gameType} target={target} onBack={() => setScreen('Home')} onPlayerA={() => setPlayerA(nextName(playerA, ['Amin', 'Arul', 'Nimal']))} onPlayerB={() => setPlayerB(nextName(playerB, ['Badr', 'Ravi', 'Kavi']))} onGameType={setGameType} onTarget={setTarget} />;

  return (
    <View style={styles.root}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      {desktop ? <Sidebar styles={styles} palette={palette} active={screen} onSelect={setScreen} /> : null}
      <View style={styles.main}>
        {desktop ? (
          <View style={styles.desktopHeader}>
            <View>
              <Text style={styles.eyebrow}>CARROMTRACK  /  PERSONAL ARENA</Text>
              <Text style={styles.headerTitle}>{screen === 'Home' ? 'Good game starts here.' : 'Set up your next game.'}</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable onPress={toggleTheme} accessibilityRole="button" accessibilityLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} style={styles.themeButton}>
                <Text style={styles.themeButtonText}>{theme === 'dark' ? '☀  Light' : '☾  Dark'}</Text>
              </Pressable>
              {screen === 'Home' ? <Pressable onPress={() => setScreen('New Game')} style={styles.headerNewGame}><Text style={styles.headerNewGameText}>＋  New Game</Text></Pressable> : null}
            </View>
          </View>
        ) : null}
        <View style={styles.content}>{content}</View>
      </View>
    </View>
  );
}

function HomeScreen({ desktop, stacked, boardSize, styles, palette, onNewGame, onTheme, theme }: {
  desktop: boolean;
  stacked: boolean;
  boardSize: number;
  styles: ReturnType<typeof makeStyles>;
  palette: Palette;
  onNewGame: () => void;
  onTheme: () => void;
  theme: ThemeMode;
}) {
  const left = (
    <View style={styles.homeLeft}>
      {!desktop ? (
        <View style={styles.mobileBrandRow}>
          <View style={styles.mobileBrandIcon}><Text style={styles.crown}>♛</Text><Text style={styles.brandBall}>◉</Text></View>
          <Pressable onPress={onTheme} accessibilityRole="button" accessibilityLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} style={styles.mobileThemeButton}>
            <Text style={styles.mobileThemeText}>{theme === 'dark' ? '☀' : '☾'}</Text>
          </Pressable>
        </View>
      ) : null}
      <View>
        <Text style={styles.eyebrow}>{desktop ? 'TRACK  ·  ANALYZE  ·  IMPROVE' : 'CARROMTRACK  /  PERSONAL ARENA'}</Text>
        <DisplayText style={desktop ? styles.desktopBrandTitle : styles.mobileBrandTitle}>Carrom<Text style={styles.brandAccent}>Tracker</Text></DisplayText>
        <Text style={styles.tagline}>{desktop ? 'Your personal arena. Every shot, every win, all in one place.' : 'Track · Analyze · Improve'}</Text>
      </View>
      {!desktop ? <CarromBoard size={Math.min(390, boardSize)} styles={styles} /> : null}
      <View style={styles.performanceCard}>
        <View style={styles.trophy}><Text style={styles.trophyEmoji}>🏆</Text></View>
        <View style={styles.performanceCopy}>
          <Text style={styles.performanceLabel}>Your Performance</Text>
          <Text style={styles.performanceRate}>72.5%</Text>
          <Text style={styles.performanceDelta}>↑ +2.3%</Text>
        </View>
        <MiniTrend color={palette.green} />
      </View>
      <View style={styles.statRow}>
        <StatCard label="TOTAL GAMES" value="20" icon="🎮" styles={styles} />
        <StatCard label="WINS" value="14" icon="🏆" styles={styles} />
        <StatCard label="STREAK" value="3" icon="♨" styles={styles} />
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onNewGame} style={styles.primaryAction}>
          <Text style={styles.actionIcon}>▶</Text><Text style={styles.actionLabel}>Start New Game</Text>
        </Pressable>
        <Pressable onPress={onNewGame} style={styles.secondaryAction}>
          <Text style={styles.actionIcon}>＋</Text><Text style={styles.actionLabel}>Set Up a Game</Text>
        </Pressable>
      </View>
    </View>
  );

  if (!desktop) return <ScrollView contentContainerStyle={styles.mobileHome} showsVerticalScrollIndicator={false}>{left}</ScrollView>;

  return (
    <ScrollView contentContainerStyle={styles.desktopHome} showsVerticalScrollIndicator={false}>
      <View style={[styles.homeGrid, stacked && styles.homeGridStacked]}>
        {left}
        <View style={styles.boardPanel}>
          <View style={styles.boardPanelHeader}>
            <View><Text style={styles.eyebrow}>READY WHEN YOU ARE</Text><Text style={styles.boardHeading}>The board is yours.</Text></View>
            <Text style={styles.liveTag}>READY</Text>
          </View>
          <CarromBoard size={boardSize} styles={styles} />
          <Text style={styles.boardHint}>Your next great game starts with one tap.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function NewGameScreen({ desktop, boardSize, styles, palette, playerA, playerB, gameType, target, onBack, onPlayerA, onPlayerB, onGameType, onTarget }: {
  desktop: boolean;
  boardSize: number;
  styles: ReturnType<typeof makeStyles>;
  palette: Palette;
  playerA: string;
  playerB: string;
  gameType: 'Singles' | 'Doubles';
  target: number;
  onBack: () => void;
  onPlayerA: () => void;
  onPlayerB: () => void;
  onGameType: (type: 'Singles' | 'Doubles') => void;
  onTarget: (target: number) => void;
}) {
  const controls = (
    <View style={styles.setupControls}>
      <Text style={styles.setupTitle}>Select Players</Text>
      <PlayerPicker letter="A" name={playerA} color={palette.purple} styles={styles} onPress={onPlayerA} />
      <PlayerPicker letter="B" name={playerB} color={palette.blue} styles={styles} onPress={onPlayerB} />
      <Text style={styles.setupTitle}>Game Type</Text>
      <View style={styles.choiceRow}>
        <ChoiceButton selected={gameType === 'Singles'} label="♟  Singles" styles={styles} onPress={() => onGameType('Singles')} />
        <ChoiceButton selected={gameType === 'Doubles'} label="♟♟  Doubles" styles={styles} onPress={() => onGameType('Doubles')} />
      </View>
      <Text style={styles.setupTitle}>Target Score</Text>
      <View style={styles.targetRow}>
        <Pressable onPress={() => onTarget(Math.max(10, target - 5))} style={styles.roundButton}><Text style={styles.roundButtonText}>−</Text></Pressable>
        <Text style={styles.targetValue}>{target}</Text>
        <Pressable onPress={() => onTarget(Math.min(50, target + 5))} style={styles.roundButton}><Text style={styles.roundButtonText}>＋</Text></Pressable>
      </View>
      <Pressable
        onPress={() => Alert.alert('Game setup ready', `${playerA} vs ${playerB} · ${gameType} · First to ${target} points.\n\nThe Live Game screen will be added in a later update.`)}
        style={styles.startButton}
      >
        <Text style={styles.startButtonText}>▶   Start Game</Text>
      </Pressable>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.setupPage} showsVerticalScrollIndicator={false}>
      <View style={styles.setupHeader}>
        {!desktop ? <Pressable onPress={onBack} accessibilityLabel="Back to Home" style={styles.backButton}><Text style={styles.backArrow}>‹</Text></Pressable> : null}
        <View style={styles.setupHeaderCopy}>
          <Text style={styles.eyebrow}>NEW MATCH  /  LOCAL GAME</Text>
          <Text style={styles.setupPageTitle}>New Game</Text>
        </View>
        {desktop ? <Pressable onPress={onBack} style={styles.backToHome}><Text style={styles.backToHomeText}>‹  Back to Home</Text></Pressable> : null}
      </View>
      {desktop ? (
        <View style={styles.setupGrid}>
          {controls}
          <View style={styles.setupBoardPanel}>
            <Text style={styles.eyebrow}>YOUR ARENA</Text>
            <Text style={styles.boardHeading}>Ready to play?</Text>
            <CarromBoard size={Math.min(boardSize, 410)} styles={styles} />
            <Text style={styles.boardHint}>Pick your players and choose a target score.</Text>
          </View>
        </View>
      ) : controls}
    </ScrollView>
  );
}

function Sidebar({ styles, palette, active, onSelect }: {
  styles: ReturnType<typeof makeStyles>;
  palette: Palette;
  active: Screen;
  onSelect: (screen: Screen) => void;
}) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarBrand}>
        <View style={styles.sidebarLogo}><Text style={styles.sidebarCrown}>♛</Text></View>
        <View><Text style={styles.sidebarName}>Carrom<Text style={{ color: palette.gold }}>Track</Text></Text><Text style={styles.sidebarCaption}>YOUR PERSONAL ARENA</Text></View>
      </View>
      <Text style={styles.sidebarSection}>SCREENS</Text>
      {(['Home', 'New Game'] as const).map((item) => (
        <Pressable key={item} onPress={() => onSelect(item)} accessibilityRole="tab" accessibilityState={{ selected: active === item }} style={[styles.sidebarLink, active === item && styles.sidebarLinkActive]}>
          <Text style={[styles.sidebarLinkIcon, active === item && styles.sidebarLinkIconActive]}>{item === 'Home' ? '⌂' : '▶'}</Text>
          <Text style={[styles.sidebarLinkText, active === item && styles.sidebarLinkTextActive]}>{item}</Text>
          {active === item ? <View style={styles.sidebarIndicator} /> : null}
        </Pressable>
      ))}
      <View style={styles.sidebarBottom}>
        <Text style={styles.sidebarTipIcon}>🎯</Text>
        <Text style={styles.sidebarTipTitle}>Play Smart</Text>
        <Text style={styles.sidebarTipText}>Track every match and improve your game.</Text>
      </View>
      <View style={styles.sidebarVersion}><Text style={styles.sidebarVersionText}>CARROMTRACK  ·  FIRST RELEASE</Text></View>
    </View>
  );
}

function PlayerPicker({ letter, name, color, styles, onPress }: { letter: string; name: string; color: string; styles: ReturnType<typeof makeStyles>; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.playerPicker}>
      <View style={[styles.playerLetter, { backgroundColor: color }]}><Text style={styles.playerLetterText}>{letter}</Text></View>
      <View style={styles.playerCopy}><Text style={styles.playerLabel}>Player {letter === 'A' ? '1' : '2'}</Text><Text style={styles.playerName}>{name}</Text></View>
      <Text style={styles.chevron}>⌄</Text>
    </Pressable>
  );
}

function ChoiceButton({ selected, label, styles, onPress }: { selected: boolean; label: string; styles: ReturnType<typeof makeStyles>; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.choiceButton, selected && styles.choiceSelected]}><Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text></Pressable>;
}

function StatCard({ label, value, icon, styles }: { label: string; value: string; icon: string; styles: ReturnType<typeof makeStyles> }) {
  return <View style={styles.statCard}><Text style={styles.statIcon}>{icon}</Text><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function MiniTrend({ color }: { color: string }) {
  return <Svg width={92} height={48} viewBox="0 0 92 48"><Path d="M2 42 17 30 28 34 44 20 57 26 70 10 82 15 90 3" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /><Circle cx="70" cy="10" r="2.8" fill={color} /><Circle cx="90" cy="3" r="3" fill={color} /></Svg>;
}

function CarromBoard({ size, styles }: { size: number; styles: ReturnType<typeof makeStyles> }) {
  const pieces = [
    [107, 81, '#201720'], [149, 91, '#252027'], [189, 82, '#EAE1D4'], [216, 116, '#242026'],
    [83, 169, '#E9DED0'], [112, 199, '#231F25'], [182, 203, '#292329'], [210, 170, '#EFE5D7'],
    [128, 137, '#272127'], [174, 143, '#EFE2D2'], [149, 157, '#C93227'],
  ] as const;
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300" style={styles.board}>
      <Defs>
        <LinearGradient id="frame" x1="20" y1="15" x2="282" y2="285" gradientUnits="userSpaceOnUse"><Stop stopColor="#805229" /><Stop offset="1" stopColor="#2C160F" /></LinearGradient>
        <LinearGradient id="play" x1="55" y1="45" x2="242" y2="250" gradientUnits="userSpaceOnUse"><Stop stopColor="#F6C785" /><Stop offset="1" stopColor="#D69A59" /></LinearGradient>
      </Defs>
      <Ellipse cx="150" cy="277" rx="120" ry="12" fill="#000" fillOpacity=".42" />
      <Rect x="18" y="12" width="264" height="264" rx="24" fill="#050407" />
      <Rect x="23" y="13" width="254" height="254" rx="20" fill="url(#frame)" stroke="#B77A3E" strokeWidth="3" />
      <Rect x="36" y="26" width="228" height="228" rx="14" fill="url(#play)" stroke="#F7D49A" strokeWidth="2" />
      <Rect x="48" y="38" width="204" height="204" rx="8" fill="none" stroke="#9D6036" strokeWidth="1.3" />
      <Path d="M65 72h34M65 72v34M235 72h-34M235 72v34M65 208h34M65 208v-34M235 208h-34M235 208v-34" stroke="#8E4B2D" strokeWidth="2" fill="none" />
      <Circle cx="150" cy="140" r="34" fill="none" stroke="#A75737" strokeWidth="1.5" />
      <Circle cx="150" cy="140" r="14" fill="none" stroke="#A75737" strokeWidth="1.5" />
      <Circle cx="150" cy="140" r="5" fill="#A93025" />
      {[[31, 31], [269, 31], [31, 249], [269, 249]].map(([x, y]) => <Circle key={`${x}-${y}`} cx={x} cy={y} r="14" fill="#09070A" stroke="#C78B4F" strokeWidth="2" />)}
      {pieces.map(([x, y, color]) => <g key={`${x}-${y}`}><Ellipse cx={x + 1} cy={y + 3} rx="10" ry="7" fill="#000" fillOpacity=".35" /><Circle cx={x} cy={y} r="9" fill={color} stroke="#AF865D" strokeWidth="1.4" /><Ellipse cx={x - 3} cy={y - 3} rx="3.3" ry="2" fill="#FFF" fillOpacity=".38" /></g>)}
    </Svg>
  );
}

function nextName(current: string, names: string[]) {
  return names[(names.indexOf(current) + 1) % names.length];
}

function makeStyles(p: Palette) {
  return StyleSheet.create({
    root: { flex: 1, flexDirection: 'row', backgroundColor: p.bg },
    main: { flex: 1, minWidth: 0, backgroundColor: p.bg },
    content: { flex: 1 },
    desktopHeader: { minHeight: 100, paddingHorizontal: 36, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: p.panel, borderBottomWidth: 1, borderBottomColor: p.border },
    headerTitle: { color: p.text, fontSize: 24, fontWeight: '800', marginTop: 5 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    eyebrow: { color: p.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
    themeButton: { minHeight: 42, borderRadius: 12, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: p.border, backgroundColor: p.bg },
    themeButtonText: { color: p.text, fontSize: 12, fontWeight: '800' },
    headerNewGame: { minHeight: 42, borderRadius: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: p.purple },
    headerNewGameText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
    sidebar: { width: 220, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 14, backgroundColor: p.panel, borderRightWidth: 1, borderRightColor: p.border },
    sidebarBrand: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 3, marginBottom: 34 },
    sidebarLogo: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: p.purple },
    sidebarCrown: { color: p.gold, fontSize: 22 },
    sidebarName: { color: p.text, fontSize: 16, fontWeight: '900' },
    sidebarCaption: { color: p.muted, fontSize: 7, fontWeight: '900', letterSpacing: .9, marginTop: 3 },
    sidebarSection: { color: p.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.3, marginHorizontal: 10, marginBottom: 9 },
    sidebarLink: { height: 44, borderRadius: 11, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 11, position: 'relative', marginBottom: 5 },
    sidebarLinkActive: { backgroundColor: p.raised },
    sidebarLinkIcon: { color: p.muted, width: 22, textAlign: 'center', fontSize: 19 },
    sidebarLinkIconActive: { color: p.violet },
    sidebarLinkText: { color: p.muted, fontSize: 12, fontWeight: '700' },
    sidebarLinkTextActive: { color: p.text },
    sidebarIndicator: { position: 'absolute', right: 0, width: 3, height: 25, borderRadius: 2, backgroundColor: p.violet },
    sidebarBottom: { marginTop: 'auto', padding: 13, borderRadius: 13, backgroundColor: p.raised, borderWidth: 1, borderColor: p.border },
    sidebarTipIcon: { fontSize: 22, marginBottom: 5 },
    sidebarTipTitle: { color: p.text, fontSize: 12, fontWeight: '800' },
    sidebarTipText: { color: p.muted, fontSize: 9, lineHeight: 14, marginTop: 4 },
    sidebarVersion: { paddingTop: 14 },
    sidebarVersionText: { color: p.muted, fontSize: 7, fontWeight: '800', letterSpacing: .7, textAlign: 'center' },
    desktopHome: { width: '100%', maxWidth: 1420, alignSelf: 'center', padding: 32, paddingBottom: 45 },
    homeGrid: { flexDirection: 'row', alignItems: 'stretch', gap: 25 },
    homeGridStacked: { flexDirection: 'column' },
    homeLeft: { flex: 1, justifyContent: 'center', gap: 20 },
    desktopBrandTitle: { color: p.text, fontSize: 39, lineHeight: 50, fontWeight: '800', letterSpacing: -1.5, marginTop: 6 },
    mobileBrandTitle: { color: p.text, fontSize: 31, lineHeight: 40, fontWeight: '800', letterSpacing: -1, textAlign: 'center', marginTop: 4 },
    brandAccent: { color: p.gold, fontFamily: 'DMSans_800ExtraBold' },
    tagline: { color: p.muted, fontSize: 12, marginTop: 3 },
    mobileHome: { paddingHorizontal: 17, paddingTop: 12, paddingBottom: 24, gap: 14 },
    mobileBrandRow: { height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    mobileBrandIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
    crown: { position: 'absolute', top: -4, color: p.gold, fontSize: 17, zIndex: 1 },
    brandBall: { color: p.violet, fontSize: 30, lineHeight: 35 },
    mobileThemeButton: { width: 38, height: 38, borderRadius: 13, backgroundColor: p.panel, borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center' },
    mobileThemeText: { color: p.text, fontSize: 18 },
    performanceCard: { minHeight: 102, borderRadius: 18, backgroundColor: p.panel, borderWidth: 1, borderColor: p.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 10 },
    trophy: { width: 54, height: 60, borderRadius: 14, backgroundColor: p.raised, alignItems: 'center', justifyContent: 'center' },
    trophyEmoji: { fontSize: 36 },
    performanceCopy: { flex: 1 },
    performanceLabel: { color: p.text, fontSize: 12, fontWeight: '700' },
    performanceRate: { color: p.text, fontSize: 28, lineHeight: 32, fontWeight: '900' },
    performanceDelta: { color: p.green, fontSize: 13, fontWeight: '900' },
    statRow: { flexDirection: 'row', gap: 9 },
    statCard: { flex: 1, minHeight: 88, borderRadius: 15, backgroundColor: p.panel, borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center', gap: 2 },
    statIcon: { fontSize: 19 },
    statValue: { color: p.text, fontSize: 19, fontWeight: '900' },
    statLabel: { color: p.muted, fontSize: 7, fontWeight: '900', letterSpacing: .6 },
    actions: { flexDirection: 'row', gap: 10 },
    primaryAction: { flex: 1, minHeight: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: p.purple },
    secondaryAction: { flex: 1, minHeight: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: p.blue },
    actionIcon: { color: '#FFF', fontSize: 16, fontWeight: '900' },
    actionLabel: { color: '#FFF', fontSize: 11, fontWeight: '800' },
    boardPanel: { flex: 1, minHeight: 480, padding: 17, borderRadius: 22, backgroundColor: p.panel, borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    boardPanelHeader: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 },
    boardHeading: { color: p.text, fontSize: 17, fontWeight: '800', marginTop: 5 },
    liveTag: { color: p.green, fontSize: 8, fontWeight: '900', letterSpacing: .7, backgroundColor: p.raised, borderRadius: 10, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
    board: { alignSelf: 'center', marginVertical: 5 },
    boardHint: { color: p.muted, fontSize: 10, textAlign: 'center', marginBottom: 4 },
    setupPage: { width: '100%', maxWidth: 1050, alignSelf: 'center', paddingHorizontal: 26, paddingVertical: 22, paddingBottom: 40 },
    setupHeader: { minHeight: 55, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    setupHeaderCopy: { flex: 1 },
    backButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: p.panel, alignItems: 'center', justifyContent: 'center' },
    backArrow: { color: p.text, fontSize: 29, lineHeight: 34 },
    setupPageTitle: { color: p.text, fontSize: 24, fontWeight: '900', marginTop: 3 },
    backToHome: { minHeight: 38, paddingHorizontal: 13, borderRadius: 11, borderWidth: 1, borderColor: p.border, justifyContent: 'center' },
    backToHomeText: { color: p.text, fontSize: 11, fontWeight: '700' },
    setupGrid: { flexDirection: 'row', alignItems: 'flex-start', gap: 22 },
    setupControls: { flex: 1, gap: 12 },
    setupTitle: { color: p.text, fontSize: 15, fontWeight: '800', marginTop: 3 },
    playerPicker: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 11, borderRadius: 15, backgroundColor: p.panel, borderWidth: 1, borderColor: p.border },
    playerLetter: { width: 44, height: 44, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
    playerLetterText: { color: '#FFF', fontSize: 22, fontWeight: '900' },
    playerCopy: { flex: 1, gap: 3 },
    playerLabel: { color: p.muted, fontSize: 10, fontWeight: '700' },
    playerName: { color: p.text, fontSize: 13, fontWeight: '800' },
    chevron: { color: p.text, fontSize: 23 },
    choiceRow: { flexDirection: 'row', gap: 10 },
    choiceButton: { minHeight: 46, flex: 1, paddingHorizontal: 12, borderRadius: 13, backgroundColor: p.panel, borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center' },
    choiceSelected: { backgroundColor: p.purple, borderColor: p.violet },
    choiceText: { color: p.text, fontSize: 12, fontWeight: '700' },
    choiceTextSelected: { color: '#FFF' },
    targetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
    roundButton: { width: 43, height: 43, borderRadius: 14, backgroundColor: p.panel, borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center' },
    roundButtonText: { color: p.text, fontSize: 25 },
    targetValue: { width: 80, color: p.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
    startButton: { minHeight: 52, borderRadius: 27, backgroundColor: p.gold, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
    startButtonText: { color: '#281A08', fontSize: 15, fontWeight: '900' },
    setupBoardPanel: { flex: 1, minHeight: 430, borderRadius: 20, backgroundColor: p.panel, borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center', padding: 18 },
  });
}
