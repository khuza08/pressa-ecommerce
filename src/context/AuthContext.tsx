'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userToStore = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user (in a real app, this would be saved to DB)
    const newUser = { id: mockUsers.length + 1, name, email, password };
    const userToStore = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    // Simulate Google login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would use Google's OAuth
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const userToStore = { id: randomUser.id, name: randomUser.name, email: randomUser.email };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
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