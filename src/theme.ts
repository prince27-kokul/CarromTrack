import { createContext, createElement, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'dark' | 'light';

export type ThemePalette = {
  background: string;
  surface: string;
  surfaceRaised: string;
  ink: string;
  muted: string;
  line: string;
  green: string;
  greenDark: string;
  greenLight: string;
  gold: string;
  goldLight: string;
  red: string;
  redLight: string;
  navy: string;
  navMuted: string;
  goldBright: string;
  accentSoft: string;
  accentBorder: string;
  overlay: string;
  strongText: string;
  onAccent: string;
};

const darkPalette: ThemePalette = {
  background: '#0B0812',
  surface: '#171222',
  surfaceRaised: '#211A2D',
  ink: '#F7F2FF',
  muted: '#AAA1BC',
  line: '#30263F',
  green: '#984BFF',
  greenDark: '#6825C9',
  greenLight: '#29183F',
  gold: '#FFBD3E',
  goldLight: '#392A18',
  red: '#FF6675',
  redLight: '#3B1C2A',
  navy: '#120B20',
  navMuted: '#877D99',
  goldBright: '#FFC84F',
  accentSoft: '#51218A55',
  accentBorder: '#A56AFF48',
  overlay: '#14231FCC',
  strongText: '#FFFFFF',
  onAccent: '#FFFFFF',
};

const lightPalette: ThemePalette = {
  background: '#F5F2F8',
  surface: '#FFFFFF',
  surfaceRaised: '#EEE8F4',
  ink: '#251B30',
  muted: '#746A80',
  line: '#DED5E8',
  green: '#7828D8',
  greenDark: '#6420BC',
  greenLight: '#EEE4F8',
  gold: '#945E00',
  goldLight: '#F8EEDB',
  red: '#C43850',
  redLight: '#F8E5E8',
  navy: '#4B3262',
  navMuted: '#766B83',
  goldBright: '#95600A',
  accentSoft: '#E9DDF7',
  accentBorder: '#C7A9E9',
  overlay: '#251B3066',
  strongText: '#FFFFFF',
  onAccent: '#FFFFFF',
};

const THEME_STORAGE_KEY = '@carromtrack/theme-v1';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemePalette;
  ready: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: darkPalette,
  ready: false,
  toggleTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (active && (saved === 'dark' || saved === 'light')) setMode(saved);
    }).catch(() => undefined).finally(() => {
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, []);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    void AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => undefined);
  };

  const value = useMemo(() => ({
    mode,
    colors: mode === 'dark' ? darkPalette : lightPalette,
    ready,
    toggleTheme,
  }), [mode, ready]);

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
