import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Credentials {
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changeCredentials: (newUsername: string, currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  currentUsername: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_CREDENTIALS: Credentials = {
  username: 'AnuragSingh',
  password: 'Anurag@123',
};

const STORAGE_KEY_AUTH = 'admin_auth';
const STORAGE_KEY_CREDS = 'admin_credentials';

function loadCredentials(): Credentials {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_CREDS);
    if (stored) return JSON.parse(stored) as Credentials;
  } catch {
    // ignore parse errors
  }
  return DEFAULT_CREDENTIALS;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  const [credentials, setCredentials] = useState<Credentials>(loadCredentials);

  const login = useCallback((username: string, password: string): boolean => {
    const creds = loadCredentials();
    if (username === creds.username && password === creds.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  const changeCredentials = useCallback(
    (newUsername: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } => {
      const creds = loadCredentials();
      if (currentPassword !== creds.password) {
        return { success: false, error: 'Current password is incorrect.' };
      }
      if (!newUsername.trim()) {
        return { success: false, error: 'Username cannot be empty.' };
      }
      if (!newPassword) {
        return { success: false, error: 'New password cannot be empty.' };
      }
      const updated: Credentials = { username: newUsername.trim(), password: newPassword };
      sessionStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(updated));
      setCredentials(updated);
      return { success: true };
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        changeCredentials,
        currentUsername: credentials.username,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
