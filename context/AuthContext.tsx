
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { LoginData, RegisterData, User, UserRole } from '../types';
import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
  setAccessToken,
  socialLogin,
} from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginData) => Promise<User>;
  register: (payload: RegisterData) => Promise<User>;
  loginWithGoogle: (role: UserRole) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persistSession = (accessToken: string, authenticatedUser: User) => {
    setAccessToken(accessToken);
    setToken(accessToken);
    localStorage.setItem('access_token', accessToken);
    setUser(authenticatedUser);
  };

  useEffect(() => {
    const initialize = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        setAccessToken(storedToken);
        setToken(storedToken);
        try {
          const current = await getCurrentUser();
          setUser(current);
        } catch {
          localStorage.removeItem('access_token');
          setAccessToken(null);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initialize();
  }, []);

  const login = async (payload: LoginData) => {
    setLoading(true);
    try {
      const response = await loginRequest(payload);
      persistSession(response.access_token, response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterData) => {
    setLoading(true);
    try {
      const response = await registerRequest(payload);
      persistSession(response.access_token, response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const current = await getCurrentUser();
      setUser(current);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (role: UserRole) => {
    setLoading(true);
    try {
      const response = await socialLogin(role);
      persistSession(response.access_token, response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAccessToken(null);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
