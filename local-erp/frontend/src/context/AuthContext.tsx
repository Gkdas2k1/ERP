import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

interface User {
  username: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('erp_token');
    if (token) {
      api.get('/api/auth/me').then((res) => setUser(res.data)).catch(() => setUser(null));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // FastAPI OAuth2 uses form-data, not JSON
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    localStorage.setItem('erp_token', response.data.access_token);
    setUser(response.data.user); // Assuming backend returns user, or fetch it
    // Fallback fetch if backend only returns token:
    const userRes = await api.get('/api/auth/me');
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem('erp_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};