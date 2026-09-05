'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from './types';
import { DEMO_USERS } from './mock-data';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.donor);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('tfk_user_role');
      if (savedUser && DEMO_USERS[savedUser]) {
        setCurrentUser(DEMO_USERS[savedUser]);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setRole = (role: UserRole) => {
    const selected = DEMO_USERS[role] || DEMO_USERS.visitor;
    setCurrentUser(selected);
    try {
      localStorage.setItem('tfk_user_role', role);
    } catch {
      // ignore
    }
  };

  const login = (email: string, role: UserRole) => {
    const matched = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(matched);
    try {
      localStorage.setItem('tfk_user_role', matched.role);
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setCurrentUser(DEMO_USERS.visitor);
    try {
      localStorage.setItem('tfk_user_role', 'visitor');
    } catch {
      // ignore
    }
  };

  const isRole = (role: UserRole | UserRole[]) => {
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    return currentUser.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        setRole,
        login,
        logout,
        isAuthenticated: currentUser.role !== 'visitor',
        isRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
