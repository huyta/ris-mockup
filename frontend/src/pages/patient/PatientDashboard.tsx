import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy } from '../../types/portal';
import { StudySummaryCards } from '../../components/studies/StudySummaryCards';
import { StudyTable } from '../../components/studies/StudyTable';
import { Film, FileText, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const [studies, setStudies] = useState<ImagingStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.patientId) return;

    setIsLoading(true);
    portalService
      .getPatientStudies(currentUser.patientId)
      .then((data) => setStudies(data))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  const reportedCount = studies.filter((s) => s.status === 'REPORTED').length;
  const recentStudyDate = studies.length > 0 ? studies[0].studyDate : 'N/A';

  const cards = [
    {
      title: 'Total Studies',
      value: studies.length,
      subtitle: 'Recorded in SMG RIS',
      icon: Film,
      color: '#0284c7',
      bgColor: '#e0f2fe'
    },
    {
      title: 'Recent Study',
      value: recentStudyDate,
      subtitle: studies[0]?.description || 'No recent study',
      icon: Calendar,
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      title: 'Available Reports',
      value: reportedCount,
      subtitle: 'Verified by Radiologist',
      icon: FileText,
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    }
  ];

  return (
    <div className="container">
      {/* Patient Welcome Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            PATIENT PORTAL DASHBOARD
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
            Welcome back, {currentUser?.name}
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Patient ID: <strong style={{ color: '#0284c7' }}>{currentUser?.patientId}</strong> • Primary Facility: {currentUser?.facility || 'SMG Medical Centre'}
          </div>
        </div>

        <button
          onClick={() => navigate('/patient/studies')}
          className="btn btn-primary"
        >
          <span>View All Studies</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Summary Cards */}
      <StudySummaryCards cards={cards} />

      {/* Recent Studies Section */}
      <div style={{ marginTop: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              Recent Diagnostic Imaging Studies
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Click <strong>Images</strong> to launch the interactive viewer or <strong>Report</strong> to view diagnostic findings.
            </p>
          </div>

          <button
            onClick={() => navigate('/patient/studies')}
            style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>See full archive ({studies.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <StudyTable
          studies={studies.slice(0, 5)}
          isLoading={isLoading}
          baseRoute="/patient/studies"
        />
      </div>
    </div>
  );
};
