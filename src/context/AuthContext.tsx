'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/user';
import { cartService } from '@/services/cartService';
import { apiService } from '@/services/apiService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithToken: (user: any, token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  getToken: () => string | null; // Function to get token directly from localStorage
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    // Keep cart items in backend but clear local cart to hide notification
    cartService.clearCart(); // Clear local storage cart to remove notification

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  }, []);

  const getToken = useCallback(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }, []);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = () => {
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
    };

    initAuth();

    // Listen for storage changes (e.g., from OAuth callback)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          // Token was added/updated, refresh user data
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (error) {
              console.error('Error parsing user data from storage event:', error);
            }
          }
        } else {
          // Token was removed (logout)
          setUser(null);
        }
      } else if (e.key === 'user' && e.newValue) {
        try {
          const parsedUser = JSON.parse(e.newValue);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for unauthorized access events from apiService
    const handleUnauthorized = () => {
      console.warn('Handling unauthorized access event - logging out');
      logout();
    };
    window.addEventListener('unauthorized-access', handleUnauthorized);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('unauthorized-access', handleUnauthorized);
    };
  }, [logout]);

  const isAuthenticated = !!user;
  const loginWithToken = useCallback(async (userData: any, token: string) => {
    const userToStore: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      ...(userData.avatar && { avatar: userData.avatar }),
    };

    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('auth_token', token);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      localStorage.removeItem('favorites');
    }

    await cartService.loadCartFromBackend();
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth/google/login`;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await apiService.post('/auth/login', { email, password });

      const userToStore: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        ...(result.user.avatar && { avatar: result.user.avatar }),
      };

      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('auth_token', result.token);

      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        localStorage.removeItem('favorites');
      }

      await cartService.loadCartFromBackend();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await apiService.post('/auth/register', { name, email, password });

      const userToStore: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        ...(result.user.avatar && { avatar: result.user.avatar }),
      };

      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('auth_token', result.token);

      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        localStorage.removeItem('favorites');
      }

      await cartService.loadCartFromBackend();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      loginWithToken,
      logout,
      isAuthenticated,
      getToken
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