import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import { ImagingStudy, StudyFilterState } from '../../types/portal';
import { StudyFilters } from '../../components/studies/StudyFilters';
import { StudyTable } from '../../components/studies/StudyTable';

export const DoctorStudies: React.FC = () => {
  const { currentUser } = useAuth();
  const [studies, setStudies] = useState<ImagingStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<StudyFilterState>({
    modality: 'ALL',
    status: 'ALL',
    pageSize: 25
  });

  const doctorId = currentUser?.doctorId || 'D00021';

  const loadStudies = (currentFilters?: StudyFilterState) => {
    setIsLoading(true);
    portalService
      .getDoctorStudies(doctorId, currentFilters || filters)
      .then((data) => setStudies(data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadStudies();
  }, [doctorId]);

  const handleFilterChange = (newFilters: StudyFilterState) => {
    setFilters(newFilters);
    loadStudies(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: StudyFilterState = {
      modality: 'ALL',
      status: 'ALL',
      pageSize: 25
    };
    setFilters(emptyFilters);
    loadStudies(emptyFilters);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
          All Assigned Imaging Studies
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Real-time query of diagnostic imaging exams assigned to your specialist account.
        </p>
      </div>

      {/* Quick Search Filtering Component matching screenshot */}
      <StudyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isDoctorView={true}
      />

      {/* Studies Table */}
      <StudyTable
        studies={studies}
        isLoading={isLoading}
        baseRoute="/doctor/studies"
        showPatientColumn={true}
      />
    </div>
  );
};
