"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  year?: number;
  enrollmentNumber?: string;
  employeeId?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  year?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.student@eduverse.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science',
    year: 3,
    enrollmentNumber: 'CS2021001',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.faculty@eduverse.edu',
    password: 'password123',
    role: 'faculty',
    department: 'Computer Science',
    employeeId: 'FAC2019045',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@eduverse.edu',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    employeeId: 'ADM2020001',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.student@eduverse.edu',
    password: 'password123',
    role: 'student',
    department: 'Electrical Engineering',
    year: 2,
    enrollmentNumber: 'EE2022015',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('eduverse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('eduverse_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('eduverse_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('eduverse_token', 'mock-jwt-token-' + foundUser.id);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (data: RegisterData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      year: data.year,
      enrollmentNumber: data.role === 'student' ? `${data.department?.substring(0, 2).toUpperCase()}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}` : undefined,
      employeeId: data.role !== 'student' ? `${data.role.toUpperCase()}${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}` : undefined,
    };

    setUser(newUser);
    localStorage.setItem('eduverse_user', JSON.stringify(newUser));
    localStorage.setItem('eduverse_token', 'mock-jwt-token-' + newUser.id);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eduverse_user');
    localStorage.removeItem('eduverse_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading
      }}
    >
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
