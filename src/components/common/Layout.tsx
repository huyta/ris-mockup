import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const { currentPath } = useNavigation();

  // Hide sidebar on Viewer full-immersion view
  const isViewer = currentPath.includes('/viewer');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Top Banner inspired by the HMI / Zed portal */}
      {showAlert && !isViewer && (
        <div
          style={{
            backgroundColor: '#ea580c', // Warm reddish-orange alert banner matching screenshot
            color: '#ffffff',
            padding: '0.45rem 1.25rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>
              <strong>Simulated Radiology Environment:</strong> This demo showcases the SMG RIS order-to-report lifecycle with interactive DICOM Medical Viewer and authentic diagnostic reports.
            </span>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            style={{ color: '#ffffff', opacity: 0.8 }}
            aria-label="Close Banner"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Body Frame */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {!isViewer && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            height: isViewer ? 'calc(100vh - 60px)' : showAlert ? 'calc(100vh - 96px)' : 'calc(100vh - 60px)',
            backgroundColor: isViewer ? '#05070a' : '#f8fafc'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
