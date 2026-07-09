import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVS_KEY = 'app:v1:favs';
const USER_KEY = 'app:v1:user';

export const StorageService = {
  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(FAVS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveFavorites(favs: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FAVS_KEY, JSON.stringify(favs));
    } catch (e) {
      console.error("Errore salvataggio preferiti", e);
    }
  },

  async getUserSession(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setUserSession(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Errore salvataggio sessione", e);
    }
  },

  async clearUserSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error("Errore rimozione sessione", e);
    }
  }
};