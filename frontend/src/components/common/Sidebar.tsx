import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  LayoutDashboard,
  Users,
  Film,
  FileText,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { currentUser } = useAuth();
  const { currentPath, navigate } = useNavigation();

  if (!currentUser) return null;

  const isPatient = currentUser.role === 'PATIENT';

  const patientNav = [
    { label: 'Dashboard', path: '/patient', icon: LayoutDashboard },
    { label: 'My Studies', path: '/patient/studies', icon: Film },
    { label: 'My Reports', path: '/patient/studies?status=REPORTED', icon: FileText }
  ];

  const doctorNav = [
    { label: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
    { label: 'Patients', path: '/doctor/patients', icon: Users },
    { label: 'Imaging Studies', path: '/doctor/studies', icon: Film }
  ];

  const navItems = isPatient ? patientNav : doctorNav;

  const isActive = (itemPath: string) => {
    const basePath = itemPath.split('?')[0];
    if (basePath === '/patient' || basePath === '/doctor') {
      return currentPath === basePath;
    }
    return currentPath.startsWith(basePath);
  };

  return (
    <aside
      style={{
        width: collapsed ? '68px' : '230px',
        backgroundColor: '#0284c7', // HMI Medical Blue sidebar
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s ease',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        zIndex: 30,
        flexShrink: 0
      }}
    >
      {/* Navigation Links */}
      <div style={{ paddingTop: '1rem' }}>
        <div
          style={{
            padding: '0 1rem 0.75rem',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase'
          }}
        >
          {!collapsed && (isPatient ? 'Patient Portal' : 'Referring Doctor')}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: collapsed ? '0.75rem 0' : '0.65rem 0.9rem',
                  borderRadius: '6px',
                  backgroundColor: active ? '#0369a1' : 'transparent',
                  color: '#ffffff',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.85rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative'
                }}
                title={collapsed ? item.label : undefined}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '15%',
                      bottom: '15%',
                      width: '4px',
                      backgroundColor: '#38bdf8',
                      borderRadius: '0 4px 4px 0'
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom info & toggle */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        {!collapsed && (
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(0,0,0,0.15)',
              borderRadius: '6px',
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <ShieldCheck size={14} color="#38bdf8" />
              <span>HIPAA / PDPA Compliant</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
              SMG Novena Medical Centre
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '0.5rem 0.75rem',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.8rem',
            borderRadius: '6px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {!collapsed && <span>Collapse Sidebar</span>}
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};
