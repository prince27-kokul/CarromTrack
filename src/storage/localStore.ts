import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppData, seedData } from '../data/seed';

const STORAGE_KEY = '@carromtrack/data-v1';

function isAppData(value: unknown): value is AppData {
  if (typeof value !== 'object' || value === null) return false;
  const data = value as Record<string, unknown>;
  return Array.isArray(data.teams) && Array.isArray(data.players) && Array.isArray(data.matches);
}

export async function loadAppData(): Promise<AppData> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    await saveAppData(seedData);
    return seedData;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch (error) {
    throw new Error(`Saved CarromTrack data could not be read: ${String(error)}`);
  }
  if (!isAppData(parsed)) {
    throw new Error('Saved CarromTrack data has an invalid format. Clear the app storage to restore the starter dataset.');
  }
  return parsed;
}

export async function saveAppData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
