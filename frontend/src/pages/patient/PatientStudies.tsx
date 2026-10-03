import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy, StudyFilterState } from '../../types/portal';
import { StudyFilters } from '../../components/studies/StudyFilters';
import { StudyTable } from '../../components/studies/StudyTable';

export const PatientStudies: React.FC = () => {
  const { currentUser } = useAuth();
  const [studies, setStudies] = useState<ImagingStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<StudyFilterState>({
    modality: 'ALL',
    status: 'ALL'
  });

  const loadStudies = (currentFilters?: StudyFilterState) => {
    if (!currentUser?.patientId) return;

    setIsLoading(true);
    portalService
      .getPatientStudies(currentUser.patientId, currentFilters || filters)
      .then((data) => setStudies(data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadStudies();
  }, [currentUser]);

  const handleFilterChange = (newFilters: StudyFilterState) => {
    setFilters(newFilters);
    loadStudies(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: StudyFilterState = { modality: 'ALL', status: 'ALL' };
    setFilters(emptyFilters);
    loadStudies(emptyFilters);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
          My Imaging Studies
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Browse your complete historical PACS studies, open multi-slice medical images, and access official reports.
        </p>
      </div>

      {/* Quick Search & Filters */}
      <StudyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isDoctorView={false}
      />

      {/* Studies Table */}
      <StudyTable
        studies={studies}
        isLoading={isLoading}
        baseRoute="/patient/studies"
      />
    </div>
  );
};
