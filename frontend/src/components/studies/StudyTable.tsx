import React from 'react';
import { ImagingStudy } from '../../types/portal';
import { StatusBadge } from '../common/StatusBadge';
import { useNavigation } from '../../context/NavigationContext';
import { Eye, Film, FileText, ChevronRight, AlertCircle } from 'lucide-react';

interface StudyTableProps {
  studies: ImagingStudy[];
  isLoading?: boolean;
  baseRoute: '/patient/studies' | '/doctor/studies';
  showPatientColumn?: boolean;
}

export const StudyTable: React.FC<StudyTableProps> = ({
  studies,
  isLoading = false,
  baseRoute,
  showPatientColumn = false
}) => {
  const { navigate } = useNavigation();

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '3rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          color: '#64748b'
        }}
      >
        <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', fontSize: '0.88rem' }}>Loading imaging studies from SMG RIS...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (studies.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          border: '1px dashed #cbd5e1',
          color: '#64748b'
        }}
      >
        <AlertCircle size={36} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>No Imaging Studies Found</h4>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
          No records match your current filter parameters or patient assignment.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Study Date</th>
              <th style={{ padding: '0.75rem 1rem' }}>Accession #</th>
              {showPatientColumn && <th style={{ padding: '0.75rem 1rem' }}>Patient</th>}
              <th style={{ padding: '0.75rem 1rem' }}>Modality</th>
              <th style={{ padding: '0.75rem 1rem' }}>Study Description</th>
              <th style={{ padding: '0.75rem 1rem' }}>Body Part</th>
              <th style={{ padding: '0.75rem 1rem' }}>Facility / Radiologist</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((study) => (
              <tr
                key={study.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontWeight: 500, color: '#1e293b' }}>
                  {study.studyDate}
                </td>
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#0284c7' }}>
                  {study.accessionNumber}
                </td>
                {showPatientColumn && (
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{study.patientName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{study.patientId}</div>
                  </td>
                )}
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className="badge badge-modality">{study.modality}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{study.description}</div>
                  {study.clinicalInformation && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {study.clinicalInformation}
                    </div>
                  )}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                  {study.bodyPart}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#1e293b' }}>{study.facility}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{study.radiologist}</div>
                </td>
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                  <StatusBadge status={study.status} />
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    {/* View Details */}
                    <button
                      onClick={() => navigate(`${baseRoute}/${study.id}`)}
                      className="btn btn-secondary btn-sm"
                      title="View Study Details"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>

                    {/* Images / Viewer */}
                    <button
                      onClick={() => navigate(`${baseRoute}/${study.id}/viewer`)}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#0284c7',
                        color: '#ffffff'
                      }}
                      title="Open Medical DICOM Viewer"
                    >
                      <Film size={13} />
                      <span>Images</span>
                    </button>

                    {/* Report */}
                    {study.status === 'REPORTED' ? (
                      <button
                        onClick={() => navigate(`${baseRoute}/${study.id}/report`)}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff'
                        }}
                        title="View Diagnostic Report"
                      >
                        <FileText size={13} />
                        <span>Report</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="btn btn-secondary btn-sm"
                        style={{ opacity: 0.4, cursor: 'not-allowed' }}
                        title="Report not yet finalized"
                      >
                        <FileText size={13} />
                        <span>Report</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#64748b'
        }}
      >
        <span>Showing {studies.length} imaging studies</span>
        <span>Connected to Simulated PACS Cache</span>
      </div>
    </div>
  );
};
