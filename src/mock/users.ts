import { PortalUser } from '../types/portal';

export const MOCK_USERS: PortalUser[] = [
  {
    id: 'user-patient-1',
    name: 'John Tan',
    email: 'john.tan@example.com',
    role: 'PATIENT',
    patientId: 'P00010001',
    facility: 'SMG Medical Centre (Novena)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'user-doctor-1',
    name: 'Dr. Sarah Lim',
    email: 'sarah.lim@orthocare.sg',
    role: 'DOCTOR',
    doctorId: 'D00021',
    specialty: 'Orthopaedic Surgery',
    facility: 'Singapore Sports & Orthopaedic Clinic',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'user-radiologist-1',
    name: 'Dr. Michael Lee',
    email: 'michael.lee@smgrad.com',
    role: 'RADIOLOGIST',
    doctorId: 'D00001',
    specialty: 'Senior Consultant Radiologist (MBBS, FRCR)',
    facility: 'SMG Radiology Department',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'user-doctor-2',
    name: 'Dr. James Wong',
    email: 'james.wong@neuromed.sg',
    role: 'DOCTOR',
    doctorId: 'D00025',
    specialty: 'Neurology & Stroke Medicine',
    facility: 'Novena Neuroscience Partners',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'user-doctor-3',
    name: 'Dr. Emily Tan',
    email: 'emily.tan@smgcare.sg',
    role: 'DOCTOR',
    doctorId: 'D00030',
    specialty: 'General Internal Medicine',
    facility: 'SMG Primary Care Clinic',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813590-482a4773c38b?auto=format&fit=crop&w=120&q=80'
  }
];

export const DEFAULT_PATIENT_USER = MOCK_USERS[0];
export const DEFAULT_DOCTOR_USER = MOCK_USERS[1];
