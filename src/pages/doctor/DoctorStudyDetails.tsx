import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy } from '../../types/portal';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  Film,
  FileText,
  User,
  ShieldAlert,
  Building,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';

export const DoctorStudyDetails: React.FC = () => {
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
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading study record from PACS archive...</p>
      </div>
    );
  }

  // Doctor Authorization Check: currentUser.doctorId exists in study.assignedDoctorIds
  const isAuthorized = study && (currentUser?.role === 'RADIOLOGIST' || study.assignedDoctorIds.includes(doctorId));

  if (!study || !isAuthorized) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '2rem', color: '#991b1b' }}>
          <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Access Denied</h3>
          <p style={{ fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
            You do not have permission to view this study. This examination is assigned to a different referring physician.
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
    <div className="container" style={{ maxWidth: '960px' }}>
      <button
        onClick={() => navigate('/doctor/studies')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={14} />
        <span>Back to Studies</span>
      </button>

      {/* Main Study Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-modality">{study.modality}</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
                {study.description}
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
              Accession: <strong style={{ color: '#0284c7', fontFamily: 'var(--font-mono)' }}>{study.accessionNumber}</strong>
            </div>
          </div>

          <StatusBadge status={study.status} />
        </div>

        {/* Demographics & Clinical Information */}
        <div style={{ padding: '1.75rem' }}>
          {/* Patient summary row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <User size={20} color="#0284c7" />
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#0369a1' }}>{study.patientName}</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.75rem' }}>
                  ID: {study.patientId} • DOB: {study.patientDob} • Gender: {study.gender}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/doctor/patients/${study.patientId}`)}
              className="btn btn-secondary btn-sm"
              style={{ backgroundColor: '#ffffff', borderColor: '#bae6fd', color: '#0284c7' }}
            >
              Patient Profile
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.75rem',
              backgroundColor: '#f8fafc',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Study Date</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                {study.studyDate}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Anatomical Body Part</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                {study.bodyPart}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Imaging Facility</span>
              <div style={{ fontSize: '0.92rem', color: '#1e293b', marginTop: '2px' }}>
                {study.facility}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Reporting Radiologist</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                {study.radiologist}
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
              Clinical Indication & Referral Notes
            </h4>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '1rem',
                fontSize: '0.88rem',
                color: '#334155',
                lineHeight: 1.6
              }}
            >
              {study.clinicalInformation || 'No specific clinical indication noted.'}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1.5rem',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => navigate(`/doctor/studies/${study.id}/viewer`)}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.92rem' }}
            >
              <Film size={18} />
              <span>Launch Medical DICOM Viewer</span>
            </button>

            {study.status === 'REPORTED' && (
              <button
                onClick={() => navigate(`/doctor/studies/${study.id}/report`)}
                className="btn btn-secondary"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.92rem',
                  borderColor: '#10b981',
                  color: '#065f46',
                  backgroundColor: '#ecfdf5'
                }}
              >
                <FileText size={18} />
                <span>View Diagnostic Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
