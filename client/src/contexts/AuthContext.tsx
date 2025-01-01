import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../utils/api';

interface User {
  id: string;
  email: string;
  role: string;
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
  }) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (email: string, oneTimeCode: number) => Promise<any>;
  resetPassword: (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp > currentTime) {
          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          });
        } else {
          // Token expired
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.auth.login(email, password);
    console.log(response);
    const token = response;
    if (!token) {
      throw new Error('No token received from server');
    }

    // Store token in localStorage
    localStorage.setItem('token', token);

    // Decode and set user
    const decoded = jwtDecode<DecodedToken>(token);
    setUser({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });
  };

  const signup = async (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
  }) => {
    await api.auth.signup(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    api.auth.logout();
  };

  const forgotPassword = async (email: string) => {
    await api.auth.forgotPassword(email);
  };

  const verifyEmail = async (email: string, oneTimeCode: number) => {
    const response = await api.auth.verifyEmail(email, oneTimeCode);
    return response;
  };

  const resetPassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    await api.auth.resetPassword(token, newPassword, confirmPassword);
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    await api.auth.changePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );
  };

  const value = {
    user,
    login,
    signup,
    logout,
    forgotPassword,
    verifyEmail,
    resetPassword,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
