import { Doctor } from '../types/portal';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'D00021',
    name: 'Dr. Sarah Lim',
    role: 'Referring Doctor / Specialist',
    specialty: 'Orthopaedic Surgery & Sports Medicine',
    clinic: 'Singapore Sports & Orthopaedic Clinic',
    email: 'sarah.lim@orthocare.sg',
    phone: '+65 6734 8812'
  },
  {
    id: 'D00025',
    name: 'Dr. James Wong',
    role: 'Referring Doctor / Specialist',
    specialty: 'Neurology & Stroke Medicine',
    clinic: 'Novena Neuroscience Partners',
    email: 'james.wong@neuromed.sg',
    phone: '+65 6250 1928'
  },
  {
    id: 'D00030',
    name: 'Dr. Emily Tan',
    role: 'Referring Doctor / General Physician',
    specialty: 'Family Medicine & Health Screening',
    clinic: 'SMG Primary Care Clinic (Paragon)',
    email: 'emily.tan@smgcare.sg',
    phone: '+65 6836 2911'
  },
  {
    id: 'D00001',
    name: 'Dr. Michael Lee',
    role: 'Reporting Radiologist',
    specialty: 'Consultant Diagnostic Neuroradiologist',
    clinic: 'SMG Radiology Department',
    email: 'michael.lee@smgrad.com',
    phone: '+65 6321 4455'
  }
];
