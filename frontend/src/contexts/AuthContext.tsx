import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
      // You can add token validation logic here if needed
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For now, we'll just simulate a successful login
      // Replace this with your actual API call later
      setIsAuthenticated(true);
      setUser({
        id: 1,
        name: 'Test User',
        email: email,
        role: 'user'
      });
      Cookies.set('token', 'dummy-token', { expires: 7 });
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // For now, we'll just simulate a successful registration
      // Replace this with your actual API call later
      setIsAuthenticated(true);
      setUser({
        id: 1,
        name: userData.name,
        email: userData.email,
        role: 'user'
      });
      Cookies.set('token', 'dummy-token', { expires: 7 });
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 