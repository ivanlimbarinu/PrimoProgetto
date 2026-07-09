import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

interface User {
  email: string;
  name: string;
  avatarUri: string;
}

interface AuthContextProps {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await StorageService.getUserSession();
      if (session) setUser(session);
      setIsLoading(false);
    })();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    await StorageService.setUserSession(userData);
  };

  const logout = async () => {
    setUser(null);
    await StorageService.clearUserSession();
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isDarkMode, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return context;
};