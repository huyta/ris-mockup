import React, { createContext, useContext, useEffect, useState } from 'react';

export interface RouteParams {
  studyId?: string;
  patientId?: string;
}

interface NavigationContextType {
  currentPath: string;
  params: RouteParams;
  navigate: (path: string) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Check hash first if present (for static preview resilience), otherwise pathname
    if (window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname || '/login';
  });

  const [params, setParams] = useState<RouteParams>({});

  // Parse path & params whenever currentPath changes
  useEffect(() => {
    const studyMatch = currentPath.match(/studies\/([A-Za-z0-9_-]+)/);
    const patientMatch = currentPath.match(/patients\/([A-Za-z0-9_-]+)/);

    setParams({
      studyId: studyMatch ? studyMatch[1] : undefined,
      patientId: patientMatch ? patientMatch[1] : undefined
    });

    // Sync browser URL and hash for smooth reload and back/forward
    if (window.location.hash !== `#${currentPath}`) {
      window.history.pushState(null, '', `#${currentPath}`);
    }
  }, [currentPath]);

  // Listen to popstate (browser back / forward)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash.startsWith('#/')) {
        setCurrentPath(window.location.hash.slice(1));
      } else {
        setCurrentPath(window.location.pathname || '/login');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <NavigationContext.Provider value={{ currentPath, params, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
