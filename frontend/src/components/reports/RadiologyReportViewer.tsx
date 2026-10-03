import React from 'react';
import { ImagingStudy, RadiologyReport } from '../../types/portal';
import {
  ArrowLeft,
  Film,
  Printer,
  Download,
  FileCheck,
  CheckCircle2,
  ShieldCheck,
  Building,
  User
} from 'lucide-react';

interface RadiologyReportViewerProps {
  study: ImagingStudy;
  report: RadiologyReport | null;
  onBackClick: () => void;
  onViewerClick: () => void;
}

export const RadiologyReportViewer: React.FC<RadiologyReportViewerProps> = ({
  study,
  report,
  onBackClick,
  onViewerClick
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Generate a simple simulated download
    const blob = new Blob(
      [
        `SMG MEDICAL CENTRE - RADIOLOGY REPORT\n\nPatient: ${study.patientName} (${study.patientId})\nDOB: ${study.patientDob}\nAccession: ${study.accessionNumber}\nDate: ${study.studyDate}\nModality: ${study.modality}\n\nClinical History:\n${report?.clinicalHistory || study.clinicalInformation}\n\nFindings:\n${report?.findings || 'Findings recorded.'}\n\nImpression:\n${report?.impression || 'Impression recorded.'}\n\nReported By: ${report?.reportedBy || study.radiologist}\nStatus: FINAL`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Radiology_Report_${study.accessionNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!report) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <button onClick={onBackClick} className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Study</span>
        </button>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '3rem 1.5rem',
            textAlign: 'center'
          }}
        >
          <FileCheck size={40} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
            Radiology Report Not Yet Available
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem', maxWidth: '440px', margin: '0.35rem auto 1.5rem' }}>
            This study is currently {study.status.toLowerCase().replace('_', ' ')}. The consultant radiologist has not released the final verified report.
          </p>
          <button onClick={onViewerClick} className="btn btn-primary btn-sm">
            <Film size={14} />
            <span>Open Available Medical Images</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Action Toolbar Header (Hidden on Print) */}
      <div
        className="no-print"
        style={{
          maxWidth: '850px',
          margin: '0 auto 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <button onClick={onBackClick} className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          <span>Back to Study</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onViewerClick}
            className="btn btn-sm"
            style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
            title="Open Medical DICOM Viewer"
          >
            <Film size={14} />
            <span>View Medical Images</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-secondary btn-sm"
            title="Print Report"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="btn btn-secondary btn-sm"
            title="Download Document"
          >
            <Download size={14} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Printable Clinical Report Sheet */}
      <div
        className="report-sheet"
        style={{
          maxWidth: '850px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          padding: '2.5rem 3rem',
          color: '#0f172a',
          fontSize: '0.9rem',
          lineHeight: 1.6
        }}
      >
        {/* Hospital Header / Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #0284c7',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              SMG MEDICAL CENTRE
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DEPARTMENT OF RADIOLOGY & DIAGNOSTIC IMAGING
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              290 Orchard Road, Paragon #18-01, Singapore 238859 • Tel: +65 6737 1100
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                display: 'inline-block',
                border: '2px solid #10b981',
                borderRadius: '6px',
                padding: '0.25rem 0.65rem',
                color: '#065f46',
                fontWeight: 700,
                fontSize: '0.8rem',
                backgroundColor: '#ecfdf5',
                textTransform: 'uppercase'
              }}
            >
              FINAL VERIFIED REPORT
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
              Order Item ID: {report.orderItemId || '104821'}
            </div>
          </div>
        </div>

        {/* Patient & Exam Demographics Grid */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.75rem',
            fontSize: '0.82rem'
          }}
        >
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Patient Name</span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{report.patientName}</strong>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Patient ID / MRN</span>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>{report.patientId}</strong>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Date of Birth</span>
            <span>{report.patientDob}</span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Accession Number</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>{report.accessionNumber}</strong>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Study Date</span>
            <span>{report.studyDate}</span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Exam Modality & Region</span>
            <strong>{report.modality} • {report.bodyPart}</strong>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Referring Specialist</span>
            <span>{study.referringDoctorName || 'Dr. Sarah Lim'}</span>
          </div>

          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Facility</span>
            <span>{report.facility}</span>
          </div>
        </div>

        {/* Clinical Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Clinical History */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              CLINICAL HISTORY
            </h4>
            <p style={{ color: '#334155', backgroundColor: '#ffffff' }}>
              {report.clinicalHistory}
            </p>
          </div>

          {/* Technique */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              TECHNIQUE & PROTOCOL
            </h4>
            <p style={{ color: '#334155' }}>
              {report.technique}
            </p>
          </div>

          {/* Comparison */}
          {report.comparison && (
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                COMPARISON
              </h4>
              <p style={{ color: '#334155' }}>
                {report.comparison}
              </p>
            </div>
          )}

          {/* Findings */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              FINDINGS
            </h4>
            <div style={{ whiteSpace: 'pre-line', color: '#1e293b' }}>
              {report.findings}
            </div>
          </div>

          {/* Impression (Highlighted block) */}
          <div
            style={{
              backgroundColor: '#f0f9ff',
              borderLeft: '4px solid #0284c7',
              borderRadius: '0 6px 6px 0',
              padding: '1rem 1.25rem'
            }}
          >
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
              IMPRESSION / CONCLUSION
            </h4>
            <div style={{ whiteSpace: 'pre-line', color: '#0c4a6e', fontWeight: 500 }}>
              {report.impression}
            </div>
          </div>
        </div>

        {/* Radiologist Digital Signature Block */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>Electronically Authenticated & Signed</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              {report.reportedBy}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {report.radiologistTitle || 'Senior Consultant Radiologist'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
              Verified: {report.reportedDate} 16:42 SGT
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#94a3b8',
                letterSpacing: '0.1em'
              }}
            >
              *ACC{report.accessionNumber.replace(/[^0-9]/g, '')}*
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
              Page 1 of 1 • SMG RIS Report Engine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
