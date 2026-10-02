import { Patient } from '../types/portal';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P00010001',
    name: 'John Tan',
    dateOfBirth: '1980-03-15',
    gender: 'Male',
    phone: '+65 9123 4567',
    email: 'john.tan@example.com',
    address: 'Blk 124 Bishan St 12 #08-412, Singapore 570124',
    nricOrPassport: 'S****123A'
  },
  {
    id: 'P00010008',
    name: 'Jane Wong',
    dateOfBirth: '1975-01-12',
    gender: 'Female',
    phone: '+65 9234 5678',
    email: 'jane.wong@example.com',
    address: '18 Orchard Boulevard #14-02, Singapore 248643',
    nricOrPassport: 'S****567B'
  },
  {
    id: 'P00010014',
    name: 'David Lim',
    dateOfBirth: '1968-07-22',
    gender: 'Male',
    phone: '+65 9345 6789',
    email: 'david.lim@example.com',
    address: '55 Tampines Central 1 #05-18, Singapore 529541',
    nricOrPassport: 'S****890C'
  },
  {
    id: 'P00010022',
    name: 'Mary Chen',
    dateOfBirth: '1992-11-04',
    gender: 'Female',
    phone: '+65 9456 7890',
    email: 'mary.chen@example.com',
    address: '88 River Valley Road #19-01, Singapore 179041',
    nricOrPassport: 'T****234D'
  },
  {
    id: 'P00010035',
    name: 'Robert Koh',
    dateOfBirth: '1959-09-30',
    gender: 'Male',
    phone: '+65 9567 8901',
    email: 'robert.koh@example.com',
    address: '32 Dunearn Road #03-08, Singapore 309425',
    nricOrPassport: 'S****678E'
  }
];
