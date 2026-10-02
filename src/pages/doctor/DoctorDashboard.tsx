import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy, Patient } from '../../types/portal';
import { StudySummaryCards } from '../../components/studies/StudySummaryCards';
import { StudyTable } from '../../components/studies/StudyTable';
import { Users, Film, FileCheck, ArrowRight, Stethoscope, Search } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const [studies, setStudies] = useState<ImagingStudy[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const doctorId = currentUser?.doctorId || 'D00021';

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      portalService.getDoctorStudies(doctorId),
      portalService.getPatientsForDoctor(doctorId)
    ])
      .then(([docStudies, docPatients]) => {
        setStudies(docStudies);
        setPatients(docPatients);
      })
      .finally(() => setIsLoading(false));
  }, [doctorId]);

  const reportedCount = studies.filter((s) => s.status === 'REPORTED').length;
  const inProgressCount = studies.filter((s) => s.status === 'IN_PROGRESS' || s.status === 'SCHEDULED').length;

  const cards = [
    {
      title: 'Assigned Patients',
      value: patients.length,
      subtitle: 'Under your active care',
      icon: Users,
      color: '#0284c7',
      bgColor: '#e0f2fe'
    },
    {
      title: 'Total Studies',
      value: studies.length,
      subtitle: `${inProgressCount} pending/scheduled`,
      icon: Film,
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    {
      title: 'Reports Available',
      value: reportedCount,
      subtitle: 'Signed by radiologist',
      icon: FileCheck,
      color: '#10b981',
      bgColor: '#ecfdf5'
    }
  ];

  return (
    <div className="container">
      {/* Doctor Welcome Banner */}
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
            DOCTOR / SPECIALIST PORTAL
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
            {currentUser?.name}
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Specialty: <strong style={{ color: '#0284c7' }}>{currentUser?.specialty || 'Referring Specialist'}</strong> • Clinic: {currentUser?.facility || 'SMG Specialist Centre'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => navigate('/doctor/patients')}
            className="btn btn-secondary"
          >
            <Users size={16} />
            <span>Assigned Patients</span>
          </button>
          <button
            onClick={() => navigate('/doctor/studies')}
            className="btn btn-primary"
          >
            <Search size={16} />
            <span>Search Studies</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <StudySummaryCards cards={cards} />

      {/* Recent Imaging Studies Section */}
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
              Recent Assigned Imaging Studies
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Studies referred by or assigned to you across SMG diagnostic imaging centres.
            </p>
          </div>

          <button
            onClick={() => navigate('/doctor/studies')}
            style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>View all studies ({studies.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <StudyTable
          studies={studies.slice(0, 6)}
          isLoading={isLoading}
          baseRoute="/doctor/studies"
          showPatientColumn={true}
        />
      </div>
    </div>
  );
};
