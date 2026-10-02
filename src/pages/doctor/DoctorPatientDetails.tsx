import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy, Patient, RadiologyReport } from '../../types/portal';
import { StudyTable } from '../../components/studies/StudyTable';
import {
  ArrowLeft,
  User,
  Film,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DoctorPatientDetails: React.FC = () => {
  const { currentUser } = useAuth();
  const { params, navigate } = useNavigation();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [studies, setStudies] = useState<ImagingStudy[]>([]);
  const [reports, setReports] = useState<RadiologyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'studies' | 'reports'>('studies');

  const patientId = params.patientId;
  const doctorId = currentUser?.doctorId || 'D00021';

  useEffect(() => {
    if (!patientId) return;

    setIsLoading(true);
    Promise.all([
      portalService.getPatientById(patientId),
      portalService.getPatientStudies(patientId)
    ])
      .then(async ([p, allPatientStudies]) => {
        setPatient(p);
        // In doctor view, can see studies assigned to doctor
        const assignedStudies = allPatientStudies.filter((s) =>
          s.assignedDoctorIds.includes(doctorId)
        );
        setStudies(assignedStudies);

        // Fetch reports for reported studies
        const repList: RadiologyReport[] = [];
        for (const s of assignedStudies) {
          if (s.status === 'REPORTED') {
            const rep = await portalService.getReport(s.reportId || s.id);
            if (rep) repList.push(rep);
          }
        }
        setReports(repList);
      })
      .finally(() => setIsLoading(false));
  }, [patientId, doctorId]);

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading patient medical record...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h3>Patient Not Found</h3>
        <button onClick={() => navigate('/doctor/patients')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Patient List
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <button
        onClick={() => navigate('/doctor/patients')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={14} />
        <span>Back to Patients</span>
      </button>

      {/* Patient Banner Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 700
            }}
          >
            {patient.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
                {patient.name}
              </h2>
              <span className="badge badge-modality">{patient.gender}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
              Patient ID: <strong style={{ color: '#0284c7', fontFamily: 'var(--font-mono)' }}>{patient.id}</strong> • DOB: {patient.dateOfBirth} • NRIC: {patient.nricOrPassport}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#475569' }}>
          <div>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>PHONE</span>
            <strong>{patient.phone}</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>EMAIL</span>
            <strong>{patient.email}</strong>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1.25rem'
        }}
      >
        <button
          onClick={() => setActiveTab('studies')}
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: activeTab === 'studies' ? 700 : 500,
            color: activeTab === 'studies' ? '#0284c7' : '#64748b',
            borderBottom: activeTab === 'studies' ? '2px solid #0284c7' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.9rem'
          }}
        >
          <Film size={16} />
          <span>Imaging Studies ({studies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: activeTab === 'reports' ? 700 : 500,
            color: activeTab === 'reports' ? '#0284c7' : '#64748b',
            borderBottom: activeTab === 'reports' ? '2px solid #0284c7' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.9rem'
          }}
        >
          <FileText size={16} />
          <span>Radiology Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            color: activeTab === 'overview' ? '#0284c7' : '#64748b',
            borderBottom: activeTab === 'overview' ? '2px solid #0284c7' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.9rem'
          }}
        >
          <User size={16} />
          <span>Demographics & Overview</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'studies' && (
        <div>
          <StudyTable
            studies={studies}
            baseRoute="/doctor/studies"
            showPatientColumn={false}
          />
        </div>
      )}

      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {reports.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              No finalized radiology reports available for this patient yet.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-reported">Verified</span>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                      {rep.modality} • {rep.bodyPart}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Accession: {rep.accessionNumber} • Reported: {rep.reportedDate} by {rep.reportedBy}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/doctor/studies/${rep.studyId}/viewer`)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Film size={14} />
                    <span>View Images</span>
                  </button>
                  <button
                    onClick={() => navigate(`/doctor/studies/${rep.studyId}/report`)}
                    className="btn btn-primary btn-sm"
                  >
                    <FileText size={14} />
                    <span>Open Report</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem'
          }}
        >
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
            Registered Patient Information
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Full Legal Name</span>
              <strong>{patient.name}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>National ID (NRIC / FIN)</span>
              <strong>{patient.nricOrPassport}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Residential Address</span>
              <span>{patient.address}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Assigned Specialist</span>
              <span>{currentUser?.name} ({currentUser?.specialty})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
