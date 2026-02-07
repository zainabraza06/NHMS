'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthContextType,
  AuthActionResult,
} from '@/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthActionResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(credentials);

      if (response.token && response.user) {
        authService.setToken(response.token);
        authService.setUser(response.user);
        setToken(response.token);
        setUser(response.user);
        return { success: true, user: response.user };
      }

      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthActionResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(data);

      if (response.message) {
        // Email verification message sent
        setError(null);
      }

      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) {
        return prev;
      }
      const nextUser = { ...prev, ...updates };
      authService.setUser(nextUser);
      return nextUser;
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    updateUser,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
