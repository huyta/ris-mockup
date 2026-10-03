import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy } from '../../types/portal';
import { MedicalViewer } from '../../components/viewer/MedicalViewer';
import { ShieldAlert } from 'lucide-react';

export const DoctorViewer: React.FC = () => {
  const { currentUser } = useAuth();
  const { params, navigate } = useNavigation();
  const [study, setStudy] = useState<ImagingStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const studyId = params.studyId;
  const doctorId = currentUser?.doctorId || 'D00021';

  useEffect(() => {
    if (!studyId) return;

    setIsLoading(true);
    portalService
      .getStudy(studyId)
      .then((data) => setStudy(data))
      .finally(() => setIsLoading(false));
  }, [studyId]);

  if (isLoading) {
    return (
      <div style={{ height: '100%', backgroundColor: '#05070a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #1e293b', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>CONNECTING TO PACS ARCHIVE...</p>
        </div>
      </div>
    );
  }

  // Authorization Check
  const isAuthorized = study && (currentUser?.role === 'RADIOLOGIST' || study.assignedDoctorIds.includes(doctorId));

  if (!study || !isAuthorized) {
    return (
      <div style={{ height: '100%', backgroundColor: '#0b1320', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '2.5rem', maxWidth: '500px', textAlign: 'center' }}>
          <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Access Denied</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
            You do not have permission to view DICOM series for this study. This study is not assigned to your physician ID.
          </p>
          <button
            onClick={() => navigate('/doctor/studies')}
            className="btn btn-primary"
            style={{ marginTop: '1.5rem' }}
          >
            Back to Assigned Studies
          </button>
        </div>
      </div>
    );
  }

  return (
    <MedicalViewer
      study={study}
      onBackClick={() => navigate(`/doctor/studies/${study.id}`)}
      onReportClick={() => navigate(`/doctor/studies/${study.id}/report`)}
    />
  );
};
