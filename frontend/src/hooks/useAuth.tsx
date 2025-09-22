/**
 * Authentication hook for managing user authentication state
 */

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User, LoginCredentials } from '../types';

// Demo user credentials for testing the pharmacy system
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@heliopharm.com',
    password: 'admin123',
    name: 'Dr. Sarah Johnson',
    role: 'Administrator' as const,
    pharmacy: 'Helio Pharmacy Central',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'pharmacist@heliopharm.com',
    password: 'pharma123',
    name: 'Michael Chen',
    role: 'Head Pharmacist' as const,
    pharmacy: 'Helio Pharmacy Central',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'assistant@heliopharm.com',
    password: 'assist123',
    name: 'Emily Rodriguez',
    role: 'Pharmacy Assistant' as const,
    pharmacy: 'Helio Pharmacy Branch A',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'manager@heliopharm.com',
    password: 'manager123',
    name: 'Robert Wilson',
    role: 'Pharmacy Manager' as const,
    pharmacy: 'Helio Pharmacy Branch B',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'intern@heliopharm.com',
    password: 'intern123',
    name: 'Lisa Thompson',
    role: 'Pharmacy Intern' as const,
    pharmacy: 'Helio Pharmacy Central',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
] as const;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-login as administrator for demo purposes
    const adminUser = {
      id: '1',
      email: 'admin@heliopharm.com',
      name: 'Dr. Sarah Johnson',
      role: 'Administrator' as const,
      pharmacy: 'Helio Pharmacy Central',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Set auto-login token and user data
    localStorage.setItem('authToken', 'demo_token_1');
    localStorage.setItem('user', JSON.stringify(adminUser));
    setUser(adminUser);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check demo credentials
      const demoUser = DEMO_USERS.find(
        user => user.email === credentials.email && user.password === credentials.password
      );
      
      if (demoUser) {
        // Create user object without password
        const { password, ...userData } = demoUser;
        localStorage.setItem('authToken', `demo_token_${demoUser.id}`);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};