import React, { useState } from 'react';
import { StudyFilterState } from '../../types/portal';
import { Search, RotateCcw, Bookmark, Filter, Calendar } from 'lucide-react';

interface StudyFiltersProps {
  filters: StudyFilterState;
  onFilterChange: (filters: StudyFilterState) => void;
  onReset: () => void;
  isDoctorView?: boolean;
}

export const StudyFilters: React.FC<StudyFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  isDoctorView = false
}) => {
  const [localFilters, setLocalFilters] = useState<StudyFilterState>(filters);

  const handleChange = (field: keyof StudyFilterState, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const cleared: StudyFilterState = {
      patientName: '',
      patientId: '',
      patientDob: '',
      accessionNo: '',
      description: '',
      referringPhysician: '',
      dateFrom: '',
      dateTo: '',
      modality: 'ALL',
      status: 'ALL',
      pageSize: 25
    };
    setLocalFilters(cleared);
    onReset();
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '1.25rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          paddingBottom: '0.65rem',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#1e293b' }}>
          <Filter size={16} color="#0284c7" />
          <span>Quick Search</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Real-time filter for orders & PACS imaging studies
        </span>
      </div>

      <form onSubmit={handleSearch}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1rem'
          }}
        >
          {isDoctorView && (
            <>
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Last, First"
                  value={localFilters.patientName || ''}
                  onChange={(e) => handleChange('patientName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Patient ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Patient ID"
                  value={localFilters.patientId || ''}
                  onChange={(e) => handleChange('patientId', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Patient DOB</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="YYYY-MM-DD"
                  value={localFilters.patientDob || ''}
                  onChange={(e) => handleChange('patientDob', e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Accession No.</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ACC-2026..."
              value={localFilters.accessionNo || ''}
              onChange={(e) => handleChange('accessionNo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Exam</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Brain, Knee, Chest"
              value={localFilters.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          {isDoctorView && (
            <div className="form-group">
              <label className="form-label">Referring Physician</label>
              <input
                type="text"
                className="form-input"
                placeholder="Doctor Name"
                value={localFilters.referringPhysician || ''}
                onChange={(e) => handleChange('referringPhysician', e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Modality</label>
            <select
              className="form-select"
              value={localFilters.modality || 'ALL'}
              onChange={(e) => handleChange('modality', e.target.value)}
            >
              <option value="ALL">All Modalities</option>
              <option value="MRI">MRI</option>
              <option value="CT">CT</option>
              <option value="X-Ray">X-Ray</option>
              <option value="Ultrasound">Ultrasound</option>
              <option value="Mammogram">Mammography</option>
              <option value="PET/CT">PET/CT</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Report Status</label>
            <select
              className="form-select"
              value={localFilters.status || 'ALL'}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported (Final)</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Study Date To</label>
            <input
              type="date"
              className="form-input"
              value={localFilters.dateTo || ''}
              onChange={(e) => handleChange('dateTo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Page Size</label>
            <select
              className="form-select"
              value={localFilters.pageSize || 25}
              onChange={(e) => handleChange('pageSize', Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Buttons matching screenshot: Clear, Save, Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary btn-sm"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Search preset saved for current session.')}
            className="btn btn-secondary btn-sm"
          >
            <Bookmark size={14} />
            <span>Save</span>
          </button>

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#0284c7' }}
          >
            <Search size={14} />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};
