import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortalUser } from '../types/portal';
import { portalService } from '../services/portalService';
import { useNavigation } from './NavigationContext';

interface AuthContextType {
  currentUser: PortalUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsPatient: (patientId?: string) => Promise<void>;
  loginAsDoctor: (doctorId?: string) => Promise<void>;
  loginWithCredentials: (username: string, password: string) => Promise<void>;
  switchUser: (user: PortalUser) => Promise<void>;
  logout: () => Promise<void>;
  isPatient: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { navigate, currentPath } = useNavigation();

  // Restore session from JWT token on mount
  useEffect(() => {
    let isMounted = true;
    portalService
      .getCurrentUser()
      .then((user) => {
        if (!isMounted) return;
        if (user) {
          setCurrentUser(user);
        } else {
          // If no active session, auto-login default demo user (John Tan) if not on /login
          portalService.loginAsPatient().then((demoUser) => {
            if (isMounted) setCurrentUser(demoUser);
          }).catch(() => {
            if (isMounted && currentPath !== '/login') {
              navigate('/login');
            }
          });
        }
      })
      .catch(() => {
        if (isMounted && currentPath !== '/login') {
          navigate('/login');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loginWithCredentials = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await portalService.loginWithCredentials(username, password);
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
      if (user.role === 'PATIENT') {
        await loginAsPatient(user.patientId);
      } else {
        await loginAsDoctor(user.doctorId);
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
        loginWithCredentials,
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
