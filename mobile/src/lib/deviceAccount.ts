import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const key = 'civic-paete.device-account';
const storage = Platform.OS === 'web'
  ? { get: AsyncStorage.getItem, set: AsyncStorage.setItem }
  : { get: SecureStore.getItemAsync, set: SecureStore.setItemAsync };

export const getDeviceAccount = () => storage.get(key);

export async function bindDeviceAccount(googleId: string) {
  const current = await getDeviceAccount();
  if (current && current !== googleId) {
    throw new Error('This device is linked to another Google account. Sign in with that account.');
  }
  if (!current) await storage.set(key, googleId);
}
