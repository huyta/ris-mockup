export type UserRole = 'PATIENT' | 'DOCTOR' | 'RADIOLOGIST';

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  patientId?: string;
  doctorId?: string;
  specialty?: string;
  facility?: string;
  avatarUrl?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone?: string;
  email?: string;
  address?: string;
  nricOrPassport?: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  specialty: string;
  clinic: string;
  email: string;
  phone: string;
}

export interface StudySeries {
  id: string;
  seriesNumber: number;
  description: string;
  modality: string;
  plane: 'Axial' | 'Coronal' | 'Sagittal' | '3D' | 'Scout';
  images: string[];
  thumbnail: string;
  sliceThickness?: string;
  kvp?: string;
}

export interface RadiologyReport {
  id: string;
  studyId: string;
  accessionNumber: string;
  patientId: string;
  patientName: string;
  patientDob: string;
  modality: string;
  bodyPart: string;
  studyDate: string;
  facility: string;
  clinicalHistory: string;
  technique: string;
  comparison?: string;
  findings: string;
  impression: string;
  reportedBy: string;
  radiologistTitle?: string;
  reportedDate: string;
  status: 'DRAFT' | 'FINAL';
  orderItemId?: number;
}

export type StudyStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'REPORTED';

export interface ImagingStudy {
  id: string;
  patientId: string;
  patientName: string;
  patientDob: string;
  gender: string;
  accessionNumber: string;
  studyDate: string;
  modality: 'MRI' | 'CT' | 'X-Ray' | 'Ultrasound' | 'Mammogram' | 'PET/CT';
  bodyPart: string;
  description: string;
  facility: string;
  radiologist: string;
  status: StudyStatus;
  assignedDoctorIds: string[];
  series: StudySeries[];
  reportId?: string;
  clinicalInformation?: string;
  referringDoctorName?: string;
}

export interface StudyFilterState {
  patientName?: string;
  patientId?: string;
  patientDob?: string;
  accessionNo?: string;
  description?: string;
  referringPhysician?: string;
  dateFrom?: string;
  dateTo?: string;
  modality?: string;
  status?: string;
  bodyPart?: string;
  pageSize?: number;
}
