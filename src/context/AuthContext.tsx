'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithToken: (user: any, token: string) => void; // New method for OAuth login
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const loginWithToken = (userData: any, token: string) => {
    // Convert the user data from backend to our frontend User type
    const userToStore: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      ...(userData.avatar && { avatar: userData.avatar }), // Include avatar if it exists
    };

    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('auth_token', token);
  };

  const loginWithGoogle = () => {
    // Redirect to initiate Google OAuth flow
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth/google/login`;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const result = await response.json();

      const userToStore: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        ...(result.user.avatar && { avatar: result.user.avatar }), // Include avatar if it exists
      };

      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('auth_token', result.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();

      const userToStore: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        ...(result.user.avatar && { avatar: result.user.avatar }), // Include avatar if it exists
      };

      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('auth_token', result.token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      loginWithToken,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}