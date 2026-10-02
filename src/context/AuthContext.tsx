import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortalUser } from '../types/portal';
import { DEFAULT_DOCTOR_USER, DEFAULT_PATIENT_USER, MOCK_USERS } from '../mock/users';
import { portalService } from '../services/portalService';
import { useNavigation } from './NavigationContext';

interface AuthContextType {
  currentUser: PortalUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsPatient: (patientId?: string) => Promise<void>;
  loginAsDoctor: (doctorId?: string) => Promise<void>;
  switchUser: (user: PortalUser) => Promise<void>;
  logout: () => Promise<void>;
  isPatient: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(DEFAULT_PATIENT_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { navigate, currentPath } = useNavigation();

  useEffect(() => {
    // If not authenticated and not on login, redirect to /login
    if (!currentUser && currentPath !== '/login') {
      navigate('/login');
    }
  }, [currentUser, currentPath, navigate]);

  const loginAsPatient = async (patientId: string = 'P00010001') => {
    setIsLoading(true);
    try {
      const user = await portalService.loginAsPatient(patientId);
      setCurrentUser(user);
      navigate('/patient');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDoctor = async (doctorId: string = 'D00021') => {
    setIsLoading(true);
    try {
      const user = await portalService.loginAsDoctor(doctorId);
      setCurrentUser(user);
      navigate('/doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = async (user: PortalUser) => {
    setIsLoading(true);
    try {
      await portalService.login(user);
      setCurrentUser(user);
      if (user.role === 'PATIENT') {
        navigate('/patient');
      } else {
        navigate('/doctor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await portalService.logout();
      setCurrentUser(null);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const isPatient = currentUser?.role === 'PATIENT';
  const isDoctor = currentUser?.role === 'DOCTOR' || currentUser?.role === 'RADIOLOGIST';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        loginAsPatient,
        loginAsDoctor,
        switchUser,
        logout,
        isPatient,
        isDoctor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
