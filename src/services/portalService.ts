import {
  ImagingStudy,
  Patient,
  PortalUser,
  RadiologyReport,
  StudyFilterState,
  StudySeries
} from '../types/portal';
import { DEFAULT_DOCTOR_USER, DEFAULT_PATIENT_USER, MOCK_USERS } from '../mock/users';
import { MOCK_PATIENTS } from '../mock/patients';
import { MOCK_STUDIES } from '../mock/studies';
import { MOCK_REPORTS } from '../mock/reports';

const SIMULATED_LATENCY_MS = 150;

function sleep(ms: number = SIMULATED_LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class PortalService {
  private currentUser: PortalUser | null = DEFAULT_PATIENT_USER;

  // Session & Authentication
  async getCurrentUser(): Promise<PortalUser | null> {
    await sleep(50);
    return this.currentUser;
  }

  async loginAsPatient(patientId: string = 'P00010001'): Promise<PortalUser> {
    await sleep(200);
    const user = MOCK_USERS.find(
      (u) => u.role === 'PATIENT' && u.patientId === patientId
    ) || DEFAULT_PATIENT_USER;
    this.currentUser = user;
    return user;
  }

  async loginAsDoctor(doctorId: string = 'D00021'): Promise<PortalUser> {
    await sleep(200);
    const user = MOCK_USERS.find(
      (u) => u.role === 'DOCTOR' && u.doctorId === doctorId
    ) || DEFAULT_DOCTOR_USER;
    this.currentUser = user;
    return user;
  }

  async login(user: PortalUser): Promise<PortalUser> {
    await sleep(150);
    this.currentUser = user;
    return user;
  }

  async logout(): Promise<void> {
    await sleep(100);
    this.currentUser = null;
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    await sleep();
    return [...MOCK_PATIENTS];
  }

  async getPatientById(id: string): Promise<Patient | null> {
    await sleep();
    return MOCK_PATIENTS.find((p) => p.id === id) || null;
  }

  async getPatientsForDoctor(doctorId: string): Promise<Patient[]> {
    await sleep();
    // A doctor sees patients who have at least one study assigned to that doctor
    const assignedPatientIds = new Set(
      MOCK_STUDIES.filter((s) => s.assignedDoctorIds.includes(doctorId)).map(
        (s) => s.patientId
      )
    );
    return MOCK_PATIENTS.filter((p) => assignedPatientIds.has(p.id));
  }

  // Studies
  async getAllStudies(): Promise<ImagingStudy[]> {
    await sleep();
    return [...MOCK_STUDIES];
  }

  async getPatientStudies(
    patientId: string,
    filters?: StudyFilterState
  ): Promise<ImagingStudy[]> {
    await sleep();
    let studies = MOCK_STUDIES.filter((s) => s.patientId === patientId);

    if (filters) {
      studies = this.applyFilters(studies, filters);
    }

    return studies;
  }

  async getDoctorStudies(
    doctorId: string,
    filters?: StudyFilterState
  ): Promise<ImagingStudy[]> {
    await sleep();
    let studies = MOCK_STUDIES.filter((s) =>
      s.assignedDoctorIds.includes(doctorId)
    );

    if (filters) {
      studies = this.applyFilters(studies, filters);
    }

    return studies;
  }

  async getStudy(studyId: string): Promise<ImagingStudy | null> {
    await sleep();
    return MOCK_STUDIES.find((s) => s.id === studyId) || null;
  }

  async getStudySeries(studyId: string): Promise<StudySeries[]> {
    await sleep();
    const study = MOCK_STUDIES.find((s) => s.id === studyId);
    return study ? study.series : [];
  }

  // Reports
  async getReport(studyIdOrReportId: string): Promise<RadiologyReport | null> {
    await sleep();
    // Search by direct report ID
    if (MOCK_REPORTS[studyIdOrReportId]) {
      return MOCK_REPORTS[studyIdOrReportId];
    }
    // Search by studyId
    const report = Object.values(MOCK_REPORTS).find(
      (r) => r.studyId === studyIdOrReportId
    );
    return report || null;
  }

  // Filters helper
  private applyFilters(
    studies: ImagingStudy[],
    filters: StudyFilterState
  ): ImagingStudy[] {
    return studies.filter((study) => {
      if (
        filters.patientName &&
        !study.patientName
          .toLowerCase()
          .includes(filters.patientName.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.patientId &&
        !study.patientId
          .toLowerCase()
          .includes(filters.patientId.toLowerCase())
      ) {
        return false;
      }
      if (filters.patientDob && !study.patientDob.includes(filters.patientDob)) {
        return false;
      }
      if (
        filters.accessionNo &&
        !study.accessionNumber
          .toLowerCase()
          .includes(filters.accessionNo.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.description &&
        !study.description
          .toLowerCase()
          .includes(filters.description.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.referringPhysician &&
        study.referringDoctorName &&
        !study.referringDoctorName
          .toLowerCase()
          .includes(filters.referringPhysician.toLowerCase())
      ) {
        return false;
      }
      if (filters.modality && filters.modality !== 'ALL' && filters.modality !== '') {
        if (study.modality.toUpperCase() !== filters.modality.toUpperCase()) {
          return false;
        }
      }
      if (filters.status && filters.status !== 'ALL' && filters.status !== '') {
        if (study.status.toUpperCase() !== filters.status.toUpperCase()) {
          return false;
        }
      }
      if (filters.bodyPart && filters.bodyPart !== 'ALL' && filters.bodyPart !== '') {
        if (
          !study.bodyPart
            .toLowerCase()
            .includes(filters.bodyPart.toLowerCase())
        ) {
          return false;
        }
      }
      if (filters.dateFrom && study.studyDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && study.studyDate > filters.dateTo) {
        return false;
      }
      return true;
    });
  }
}

export const portalService = new PortalService();
