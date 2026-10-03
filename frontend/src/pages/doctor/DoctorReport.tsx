import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy, RadiologyReport } from '../../types/portal';
import { RadiologyReportViewer } from '../../components/reports/RadiologyReportViewer';
import { ShieldAlert } from 'lucide-react';

export const DoctorReport: React.FC = () => {
  const { currentUser } = useAuth();
  const { params, navigate } = useNavigation();
  const [study, setStudy] = useState<ImagingStudy | null>(null);
  const [report, setReport] = useState<RadiologyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const studyId = params.studyId;
  const doctorId = currentUser?.doctorId || 'D00021';

  useEffect(() => {
    if (!studyId) return;

    setIsLoading(true);
    portalService
      .getStudy(studyId)
      .then(async (s) => {
        setStudy(s);
        if (s) {
          const rep = await portalService.getReport(s.reportId || s.id);
          setReport(rep);
        }
      })
      .finally(() => setIsLoading(false));
  }, [studyId]);

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Retrieving authenticated radiology report...</p>
      </div>
    );
  }

  // Authorization Check
  const isAuthorized = study && (currentUser?.role === 'RADIOLOGIST' || study.assignedDoctorIds.includes(doctorId));

  if (!study || !isAuthorized) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '2rem', color: '#991b1b' }}>
          <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Access Denied</h3>
          <p style={{ fontSize: '0.88rem', marginTop: '0.5rem' }}>
            You do not have permission to view the radiology report for this unassigned study.
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
    <RadiologyReportViewer
      study={study}
      report={report}
      onBackClick={() => navigate(`/doctor/studies/${study.id}`)}
      onViewerClick={() => navigate(`/doctor/studies/${study.id}/viewer`)}
    />
  );
};
