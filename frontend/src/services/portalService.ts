import {
  ImagingStudy,
  Patient,
  PortalUser,
  RadiologyReport,
  StudyFilterState,
  StudySeries
} from '../types/portal';
import { apiClient } from './apiClient';

interface BackendUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  patient_id?: number | null;
  patient_number?: string | null;
  doctor_id?: number | null;
  doctor_number?: string | null;
  facility?: string | null;
  specialty?: string | null;
  avatar_url?: string | null;
}

interface BackendPatient {
  id: number;
  patient_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  nric_passport?: string | null;
}

interface BackendStudy {
  id: number;
  patient_id: number;
  patient_number: string;
  patient_name: string;
  patient_dob: string;
  gender: string;
  accession_number: string;
  study_date: string;
  modality: string;
  body_part: string;
  description: string;
  facility: string;
  radiologist: string;
  status: string;
  has_report: boolean;
  report_id?: number | null;
  referring_doctor_name?: string | null;
  assigned_doctor_ids?: string[];
  clinical_history?: string | null;
  series?: BackendSeries[];
}

interface BackendSeries {
  id: number;
  series_number: number;
  description: string;
  modality: string;
  plane: string;
  thumbnail_url?: string | null;
  slice_thickness?: string | null;
  kvp?: string | null;
  images?: string[];
}

interface BackendReport {
  id: number;
  study_id: number;
  accession_number: string;
  order_item_id?: number | null;
  patient_id?: string | null;
  patient_name?: string | null;
  patient_dob?: string | null;
  modality?: string | null;
  body_part?: string | null;
  study_date?: string | null;
  facility?: string | null;
  clinical_history: string;
  technique: string;
  comparison?: string | null;
  findings: string;
  impression: string;
  reported_by: string;
  radiologist_title?: string | null;
  reported_date: string;
  status: string;
}

interface PaginatedBackend<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export class PortalService {
  private currentUser: PortalUser | null = null;

  private mapUser(u: BackendUser): PortalUser {
    return {
      id: String(u.id),
      name: u.name,
      email: u.email,
      role: u.role as any,
      patientId: u.patient_number || (u.patient_id ? String(u.patient_id) : undefined),
      doctorId: u.doctor_number || (u.doctor_id ? String(u.doctor_id) : undefined),
      facility: u.facility || undefined,
      specialty: u.specialty || undefined,
      avatarUrl: u.avatar_url || undefined
    };
  }

  private mapPatient(p: BackendPatient): Patient {
    return {
      id: p.patient_number || String(p.id),
      name: p.full_name,
      dateOfBirth: p.date_of_birth,
      gender: p.gender as any,
      phone: p.phone || undefined,
      email: p.email || undefined,
      address: p.address || undefined,
      nricOrPassport: p.nric_passport || undefined
    };
  }

  private mapSeries(s: BackendSeries): StudySeries {
    return {
      id: String(s.id),
      seriesNumber: s.series_number,
      description: s.description,
      modality: s.modality,
      plane: s.plane as any,
      thumbnail: s.thumbnail_url || '',
      images: s.images || [],
      sliceThickness: s.slice_thickness || undefined,
      kvp: s.kvp || undefined
    };
  }

  private mapStudy(s: BackendStudy): ImagingStudy {
    return {
      id: String(s.id),
      patientId: s.patient_number || String(s.patient_id),
      patientName: s.patient_name,
      patientDob: s.patient_dob,
      gender: s.gender,
      accessionNumber: s.accession_number,
      studyDate: s.study_date,
      modality: s.modality as any,
      bodyPart: s.body_part,
      description: s.description,
      facility: s.facility,
      radiologist: s.radiologist,
      status: s.status as any,
      assignedDoctorIds: s.assigned_doctor_ids || [],
      reportId: s.report_id ? String(s.report_id) : (s.has_report ? String(s.id) : undefined),
      clinicalInformation: s.clinical_history || undefined,
      referringDoctorName: s.referring_doctor_name || undefined,
      series: (s.series || []).map((ser) => this.mapSeries(ser))
    };
  }

  private mapReport(r: BackendReport): RadiologyReport {
    return {
      id: String(r.id),
      studyId: String(r.study_id),
      accessionNumber: r.accession_number,
      orderItemId: r.order_item_id || undefined,
      patientId: r.patient_id || '',
      patientName: r.patient_name || '',
      patientDob: r.patient_dob || '',
      modality: r.modality || '',
      bodyPart: r.body_part || '',
      studyDate: r.study_date || '',
      facility: r.facility || '',
      clinicalHistory: r.clinical_history,
      technique: r.technique,
      comparison: r.comparison || undefined,
      findings: r.findings,
      impression: r.impression,
      reportedBy: r.reported_by,
      radiologistTitle: r.radiologist_title || undefined,
      reportedDate: r.reported_date,
      status: r.status as any
    };
  }

  // Session & Authentication
  async getCurrentUser(): Promise<PortalUser | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    const token = apiClient.getToken();
    if (!token) {
      return null;
    }

    try {
      const user = await apiClient.get<BackendUser>('/auth/me');
      this.currentUser = this.mapUser(user);
      return this.currentUser;
    } catch {
      apiClient.setToken(null);
      this.currentUser = null;
      return null;
    }
  }

  async login(userOrCredentials: any): Promise<PortalUser> {
    // If username and password provided
    if (typeof userOrCredentials === 'object' && 'username' in userOrCredentials && 'password' in userOrCredentials) {
      const res = await apiClient.post<{ access_token: string; user: BackendUser }>(
        '/auth/login',
        {
          username: userOrCredentials.username,
          password: userOrCredentials.password
        }
      );
      apiClient.setToken(res.access_token);
      this.currentUser = this.mapUser(res.user);
      return this.currentUser;
    }

    // Direct user object fallback
    this.currentUser = userOrCredentials;
    return userOrCredentials;
  }

  async loginWithCredentials(username: string, password: string = 'demo123'): Promise<PortalUser> {
    const res = await apiClient.post<{ access_token: string; user: BackendUser }>(
      '/auth/login',
      { username, password }
    );
    apiClient.setToken(res.access_token);
    this.currentUser = this.mapUser(res.user);
    return this.currentUser;
  }

  async loginAsPatient(patientId: string = 'P00010001'): Promise<PortalUser> {
    // Demo shortcut for John Tan
    return this.loginWithCredentials('john.tan', 'demo123');
  }

  async loginAsDoctor(doctorId: string = 'D00021'): Promise<PortalUser> {
    let username = 'sarah.lim';
    if (doctorId === 'D00025') {
      username = 'james.wong';
    } else if (doctorId === 'D00030') {
      username = 'emily.tan';
    } else if (doctorId === 'D00001') {
      username = 'michael.lee';
    }
    return this.loginWithCredentials(username, 'demo123');
  }

  async logout(): Promise<void> {
    apiClient.setToken(null);
    this.currentUser = null;
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    try {
      const res = await apiClient.get<PaginatedBackend<BackendPatient>>('/doctor/patients', { page_size: 100 });
      return res.items.map((p) => this.mapPatient(p));
    } catch {
      return [];
    }
  }

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const res = await apiClient.get<{ patient: BackendPatient }>(`/doctor/patients/${id}`);
      return this.mapPatient(res.patient);
    } catch {
      return null;
    }
  }

  async getPatientsForDoctor(doctorId: string): Promise<Patient[]> {
    return this.getPatients();
  }

  // Studies
  async getAllStudies(): Promise<ImagingStudy[]> {
    const user = await this.getCurrentUser();
    if (user?.role === 'PATIENT') {
      return this.getPatientStudies(user.patientId || '');
    }
    return this.getDoctorStudies(user?.doctorId || '');
  }

  async getPatientStudies(
    patientId: string,
    filters?: StudyFilterState
  ): Promise<ImagingStudy[]> {
    const params: Record<string, any> = { page_size: 50 };
    if (filters) {
      if (filters.modality && filters.modality !== 'ALL') params.modality = filters.modality;
      if (filters.status && filters.status !== 'ALL') params.status = filters.status;
      if (filters.bodyPart && filters.bodyPart !== 'ALL') params.body_part = filters.bodyPart;
      if (filters.dateFrom) params.date_from = filters.dateFrom;
      if (filters.dateTo) params.date_to = filters.dateTo;
      if (filters.description) params.search = filters.description;
    }

    try {
      const res = await apiClient.get<PaginatedBackend<BackendStudy>>('/patient/studies', params);
      return res.items.map((s) => this.mapStudy(s));
    } catch {
      return [];
    }
  }

  async getDoctorStudies(
    doctorId: string,
    filters?: StudyFilterState
  ): Promise<ImagingStudy[]> {
    const params: Record<string, any> = { page_size: 50 };
    if (filters) {
      if (filters.patientId) params.patient_id = filters.patientId;
      if (filters.patientName) params.patient_name = filters.patientName;
      if (filters.accessionNo) params.accession_number = filters.accessionNo;
      if (filters.modality && filters.modality !== 'ALL') params.modality = filters.modality;
      if (filters.status && filters.status !== 'ALL') params.status = filters.status;
      if (filters.bodyPart && filters.bodyPart !== 'ALL') params.body_part = filters.bodyPart;
      if (filters.dateFrom) params.date_from = filters.dateFrom;
      if (filters.dateTo) params.date_to = filters.dateTo;
      if (filters.referringPhysician) params.referring_physician = filters.referringPhysician;
      if (filters.description) params.search = filters.description;
    }

    try {
      const res = await apiClient.get<PaginatedBackend<BackendStudy>>('/doctor/studies', params);
      return res.items.map((s) => this.mapStudy(s));
    } catch {
      return [];
    }
  }

  async getStudy(studyId: string): Promise<ImagingStudy | null> {
    const user = await this.getCurrentUser();
    const endpoint = user?.role === 'PATIENT'
      ? `/patient/studies/${studyId}`
      : `/doctor/studies/${studyId}`;

    try {
      const study = await apiClient.get<BackendStudy>(endpoint);
      return this.mapStudy(study);
    } catch {
      return null;
    }
  }

  async getStudySeries(studyId: string): Promise<StudySeries[]> {
    const user = await this.getCurrentUser();
    const endpoint = user?.role === 'PATIENT'
      ? `/patient/studies/${studyId}/viewer`
      : `/doctor/studies/${studyId}/viewer`;

    try {
      const res = await apiClient.get<{ series: BackendSeries[] }>(endpoint);
      return (res.series || []).map((s) => this.mapSeries(s));
    } catch {
      return [];
    }
  }

  // Reports
  async getReport(studyIdOrReportId: string): Promise<RadiologyReport | null> {
    const user = await this.getCurrentUser();
    const endpoint = user?.role === 'PATIENT'
      ? `/patient/studies/${studyIdOrReportId}/report`
      : `/doctor/studies/${studyIdOrReportId}/report`;

    try {
      const report = await apiClient.get<BackendReport>(endpoint);
      return this.mapReport(report);
    } catch {
      return null;
    }
  }

  // Dashboard Stats
  async getPatientDashboard() {
    return apiClient.get<{
      total_studies: number;
      recent_studies: number;
      reports_available: number;
      latest_study_date: string | null;
    }>('/patient/dashboard');
  }

  async getDoctorDashboard() {
    return apiClient.get<{
      assigned_patients: number;
      new_studies: number;
      reports_available: number;
    }>('/doctor/dashboard');
  }
}

export const portalService = new PortalService();
