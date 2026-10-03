import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_USERS } from '../../mock/users';
import {
  Layers,
  User,
  Stethoscope,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Login: React.FC = () => {
  const { loginAsPatient, loginAsDoctor, loginWithCredentials, switchUser, isLoading } = useAuth();
  const [email, setEmail] = useState('john.tan');
  const [password, setPassword] = useState('demo123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const username = email.includes('@') ? email.split('@')[0] : email;
      await loginWithCredentials(username, password || 'demo123');
    } catch (err: any) {
      setErrorMessage(err?.detail || err?.message || 'Invalid username or password');
    }
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b1320', // Sleek dark navy enterprise background
        backgroundImage: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0b1320 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative'
      }}
    >
      {/* Decorative top branding bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0284c7, #38bdf8, #10b981)'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          border: '1px solid #334155'
        }}
      >
        {/* Card Header */}
        <div
          style={{
            backgroundColor: '#0f172a',
            padding: '2rem 2rem 1.5rem',
            textAlign: 'center',
            color: '#ffffff',
            borderBottom: '1px solid #1e293b'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(2, 132, 199, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              marginBottom: '0.85rem'
            }}
          >
            <Layers color="#38bdf8" size={28} />
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            CLI RADIOLOGY PORTAL
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Powered by <strong>CLI</strong> • Singapore Medical Group RIS
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.7rem',
              color: '#38bdf8',
              fontWeight: 600,
              marginTop: '0.75rem'
            }}
          >
            <Sparkles size={12} />
            <span>Interactive Demo Environment</span>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '2rem' }}>
          {/* Quick 1-Click Demo Buttons - High Priority */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}
            >
              Select A Demo Persona to Sign In:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => loginAsPatient('P00010001')}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.9rem 0.75rem',
                  backgroundColor: '#f0f9ff',
                  border: '2px solid #0284c7',
                  borderRadius: '10px',
                  color: '#0369a1',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(2, 132, 199, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <User size={22} color="#0284c7" style={{ marginBottom: '0.35rem' }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Login as Patient</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  John Tan (P00010001)
                </span>
              </button>

              <button
                type="button"
                onClick={() => loginAsDoctor('D00021')}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.9rem 0.75rem',
                  backgroundColor: '#ecfdf5',
                  border: '2px solid #10b981',
                  borderRadius: '10px',
                  color: '#065f46',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(16, 185, 129, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Stethoscope size={22} color="#10b981" style={{ marginBottom: '0.35rem' }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Login as Doctor</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  Dr Sarah Lim (D00021)
                </span>
              </button>
            </div>

            {/* Additional Specialist Personas */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.75rem',
                fontSize: '0.72rem',
                color: '#64748b'
              }}
            >
              <span>Other specialists:</span>
              <button
                type="button"
                onClick={() => switchUser(MOCK_USERS[3])} // Dr James Wong
                style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: 600 }}
              >
                Dr James Wong (Neuro)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => switchUser(MOCK_USERS[4])} // Dr Emily Tan
                style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: 600 }}
              >
                Dr Emily Tan (GP)
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: '1.25rem 0',
              color: '#94a3b8',
              fontSize: '0.75rem'
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span>or sign in manually</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          {/* Manual Credentials Form */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#b91c1c',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{errorMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} />
                <span>Email or Patient ID / Doctor ID</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john.tan@example.com or D00021"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} />
                <span>Password</span>
              </label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 500 }}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginTop: '0.5rem'
              }}
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer Guarantee */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '0.85rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Encrypted Diagnostic Portal • ISO 27001 & MOH Singapore Guidelines</span>
        </div>
      </div>
    </div>
  );
};
