'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User>; // <-- Change here
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: 'user' | 'admin';
}

const API_BASE_URL = 'http://localhost:8095/api/v1/auth';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password}),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Use role from backend
      const userData: User = {
        id: 1, // You might want to get this from the backend
        name: data.name,
        email: data.email,
        role: data.role, // <-- Use backend role
      };

      setUser(userData);
      setIsAuthenticated(true);

      Cookies.set('userEmail', data.email);
      Cookies.set('userName', data.name);

      return userData; // <-- Return user object
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
        }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store user info
      const newUser = {
        id: 1, // You might want to get this from the backend
        name: data.name,
        email: data.email,
        role: userData.role,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      
      // Store session info in cookies
      Cookies.set('userEmail', data.email);
      Cookies.set('userName', data.name);
      
      router.push(userData.role === 'admin' ? '/admin/dashboard' : '/dashboard');

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and cookies regardless of API call success
      Cookies.remove('userEmail');
      Cookies.remove('userName');
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);