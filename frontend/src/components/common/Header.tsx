import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { MOCK_USERS } from '../../mock/users';
import {
  Menu,
  Bell,
  User as UserIcon,
  Info,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { currentUser, switchUser, logout } = useAuth();
  const { navigate } = useNavigation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!currentUser) return null;

  return (
    <>
      <header
        style={{
          height: '60px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        {/* Left branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
            style={{
              color: '#94a3b8',
              padding: '6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <Menu size={22} />
          </button>

          <div
            style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', cursor: 'pointer' }}
            onClick={() => navigate(currentUser.role === 'PATIENT' ? '/patient' : '/doctor')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                CLI Radiology
              </span>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                • SMG RIS
              </span>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#94a3b8',
                letterSpacing: '0.02em'
              }}
            >
              Powered by <strong style={{ color: '#cbd5e1' }}>CLI</strong>
            </span>
          </div>
        </div>

        {/* Center Demo Mode Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '9999px',
            padding: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            color: '#38bdf8',
            fontWeight: 600
          }}
        >
          <Sparkles size={13} />
          <span>DEMO MODE — SIMULATED RIS & PACS</span>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Persona Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                padding: '0.35rem 0.7rem',
                borderRadius: '6px',
                border: '1px solid #334155',
                fontSize: '0.8rem'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: currentUser.role === 'PATIENT' ? '#0284c7' : '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}
              >
                {currentUser.name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600 }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  {currentUser.role === 'PATIENT' ? 'Patient Portal' : 'Doctor Portal'}
                </div>
              </div>
              <ChevronDown size={14} color="#94a3b8" />
            </button>

            {showUserMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '105%',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  width: '280px',
                  padding: '0.5rem 0',
                  zIndex: 50
                }}
              >
                <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid #334155', fontSize: '0.75rem', color: '#94a3b8' }}>
                  SWITCH DEMO PERSONA
                </div>
                {MOCK_USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setShowUserMenu(false);
                      switchUser(u);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      textAlign: 'left',
                      backgroundColor: currentUser.id === u.id ? '#334155' : 'transparent',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        currentUser.id === u.id ? '#334155' : 'transparent')
                    }
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: u.role === 'PATIENT' ? '#0284c7' : '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {u.role === 'PATIENT' ? `Patient ID: ${u.patientId}` : `${u.specialty || 'Doctor'}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                color: '#cbd5e1',
                padding: '6px',
                borderRadius: '6px',
                position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={20} />
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b'
                }}
              />
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '320px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  padding: '0.8rem',
                  zIndex: 50
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Notifications</span>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>3 New</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: '#0f172a', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>Radiology Report Available</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>MRI Brain report signed by Dr Michael Lee</div>
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: '#0f172a', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>New Study Scheduled</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Right Shoulder Arthrogram on 05 Oct 2026</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Modal Button */}
          <button
            onClick={() => setShowInfoModal(true)}
            style={{ color: '#cbd5e1', padding: '6px', borderRadius: '6px' }}
            title="About Demo"
          >
            <Info size={20} />
          </button>

          {/* Logout Button */}
          <button
            onClick={() => logout()}
            style={{
              color: '#f87171',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem'
            }}
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Info Dialog */}
      {showInfoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
          onClick={() => setShowInfoModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '540px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              color: '#0f172a'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers color="#0284c7" size={24} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>SMG Radiology Portal Mockup</h3>
              </div>
              <button onClick={() => setShowInfoModal(false)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.6 }}>
              This is a high-fidelity demonstration portal replicating the CLI radiology portal workflow. It illustrates the complete journey from patient orders to imaging studies, interactive multi-series DICOM Medical Viewer, and formal diagnostic radiology reports.
            </p>
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
              <strong>Demo Personas Ready:</strong>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.35rem', color: '#0369a1' }}>
                <li><strong>Patient:</strong> John Tan (P00010001) - 8 imaging studies, 3 reports</li>
                <li><strong>Doctor:</strong> Dr. Sarah Lim (D00021) - Referring Orthopaedic Specialist</li>
                <li><strong>Radiologist:</strong> Dr. Michael Lee (D00001) - Consultant Reporting Radiologist</li>
              </ul>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowInfoModal(false)}
              >
                Close & Continue Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
