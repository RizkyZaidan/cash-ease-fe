import { create } from 'zustand';
import { persist, StorageValue, PersistStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { decryptData, encryptData } from '@/components/utility';

interface AuthState {
  token: string;
  userId: string;
  sessionExpired: boolean;
  isUnauthorize: boolean;
  isAuthReady: boolean;
  updateAuth: (newData: { token: string; userId: string }) => void;
  setSessionExpired: (value: boolean) => void;
  setIsUnauthorize: (value: boolean) => void;
  clearAuth: () => void;
}

const initialState: Omit<AuthState, 'updateAuth' | 'setSessionExpired' | 'setIsUnauthorize' | 'clearAuth'> = {
  token: '',
  userId: '',
  sessionExpired: false,
  isUnauthorize: false,
  isAuthReady: false,
};

// Cached server snapshot to avoid recalculation during SSR
let serverSnapshot: AuthState | null = null;

const customAuthStorage: PersistStorage<AuthState> = {
  getItem: async (name: string): Promise<StorageValue<AuthState> | null> => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const encryptedValue = await get(name);
      if (encryptedValue) {
        const decryptedValue = await decryptData(encryptedValue as string);
        if (decryptedValue) {
          return JSON.parse(decryptedValue) as StorageValue<AuthState>;
        }
      }
      return null;
    } catch (error) {
      console.error('Error decrypting ' + name + ' from IndexedDB:', error);
      return null;
    }
  },
  setItem: async (name: string, value: StorageValue<AuthState>): Promise<void> => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const serializedValue = JSON.stringify(value);
      const encryptedValue = await encryptData(serializedValue);
      await set(name, encryptedValue);
    } catch (error) {
      console.error('Error encrypting/setting ' + name + ' in IndexedDB:', error);
      throw error;
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      await del(name);
    } catch (error) {
      console.error('Error removing ' + name + ' from IndexedDB:', error);
      throw error;
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateAuth: (newData) => {
        set(newData);
        if (typeof window !== 'undefined') {
          document.cookie = `auth-token=${newData.token}; path=/; max-age=86400`;
        }
      },
      setSessionExpired: (value) => set({ sessionExpired: value }),
      setIsUnauthorize: (value) => set({ isUnauthorize: value }),
      clearAuth: () => {
        set({ ...initialState });
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
      },
      isAuthReady: false,
    }),
    {
      name: 'auth-storage',
      storage: customAuthStorage,
      
      // This callback runs when rehydration finishes
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthReady = true;
        }
      },
    }
  )
);

export const getAuthServerSnapshot = (): AuthState => {
  if (!serverSnapshot) {
    serverSnapshot = {
      ...initialState,
      updateAuth: () => { },
      setSessionExpired: () => { },
      setIsUnauthorize: () => { },
      clearAuth: () => { },
    };
  }
  return serverSnapshot;
};
