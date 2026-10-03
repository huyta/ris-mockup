import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy, Patient } from '../../types/portal';
import { Users, Search, Eye, Film, UserPlus } from 'lucide-react';

interface PatientWithStats extends Patient {
  studiesCount: number;
  latestStudy?: ImagingStudy;
}

export const DoctorPatients: React.FC = () => {
  const { currentUser } = useAuth();
  const { navigate } = useNavigation();
  const [patients, setPatients] = useState<PatientWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const doctorId = currentUser?.doctorId || 'D00021';

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      portalService.getPatientsForDoctor(doctorId),
      portalService.getDoctorStudies(doctorId)
    ])
      .then(([docPatients, docStudies]) => {
        const enhanced: PatientWithStats[] = docPatients.map((patient) => {
          const patientStudies = docStudies.filter((s) => s.patientId === patient.id);
          return {
            ...patient,
            studiesCount: patientStudies.length,
            latestStudy: patientStudies[0]
          };
        });
        setPatients(enhanced);
      })
      .finally(() => setIsLoading(false));
  }, [doctorId]);

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.dateOfBirth.includes(q)
    );
  });

  return (
    <div className="container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            Assigned Patients Directory
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Patients with active or completed radiology orders under your care.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', width: '100%' }}
              placeholder="Search by name, ID or DOB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Patient Table */}
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
                <th style={{ padding: '0.75rem 1rem' }}>Patient ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Patient Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>DOB / Age</th>
                <th style={{ padding: '0.75rem 1rem' }}>Gender</th>
                <th style={{ padding: '0.75rem 1rem' }}>Latest Study</th>
                <th style={{ padding: '0.75rem 1rem' }}>Study Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Studies</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0284c7' }}>
                    {patient.id}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                    {patient.name}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                    {patient.dateOfBirth}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                    {patient.gender}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {patient.latestStudy ? (
                      <div>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>
                          {patient.latestStudy.description}
                        </span>
                        <span className="badge badge-modality" style={{ marginLeft: '0.4rem' }}>
                          {patient.latestStudy.modality}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                    {patient.latestStudy ? patient.latestStudy.studyDate : '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                    {patient.studiesCount}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                        className="btn btn-secondary btn-sm"
                        title="View Patient Chart"
                      >
                        <Eye size={13} />
                        <span>View Patient</span>
                      </button>

                      <button
                        onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                        className="btn btn-sm"
                        style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
                        title="View Studies"
                      >
                        <Film size={13} />
                        <span>Studies</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
          Displaying {filteredPatients.length} patients assigned to {currentUser?.name}
        </div>
      </div>
    </div>
  );
};
