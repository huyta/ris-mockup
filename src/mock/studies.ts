import { ImagingStudy } from '../types/portal';
import { createMedicalScanSvg } from './medicalImages';

export const MOCK_STUDIES: ImagingStudy[] = [
  // John Tan (P00010001) - 8 studies
  {
    id: 'STUDY-1001',
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    gender: 'Male',
    accessionNumber: 'ACC-2026-009812',
    studyDate: '2026-09-20',
    modality: 'MRI',
    bodyPart: 'Brain',
    description: 'MRI Brain with and without contrast + MRA Circle of Willis',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00025'], // Dr. James Wong (Neurology)
    reportId: 'REP-001',
    clinicalInformation: 'Headache for 3 months with intermittent visual blurring. R/O intracranial mass.',
    referringDoctorName: 'Dr. James Wong',
    series: [
      {
        id: 'SER-101',
        seriesNumber: 1,
        description: 'Axial T2 FSE (5mm)',
        modality: 'MRI',
        plane: 'Axial',
        thumbnail: createMedicalScanSvg('brain-axial', 1, 24),
        images: [
          createMedicalScanSvg('brain-axial', 1, 24),
          createMedicalScanSvg('brain-axial', 2, 24),
          createMedicalScanSvg('brain-axial', 3, 24),
          createMedicalScanSvg('brain-axial', 4, 24),
          createMedicalScanSvg('brain-axial', 5, 24),
          createMedicalScanSvg('brain-axial', 6, 24),
        ]
      },
      {
        id: 'SER-102',
        seriesNumber: 2,
        description: 'Sagittal T1 3D Volumetric',
        modality: 'MRI',
        plane: 'Sagittal',
        thumbnail: createMedicalScanSvg('brain-sagittal', 1, 30),
        images: [
          createMedicalScanSvg('brain-sagittal', 1, 30),
          createMedicalScanSvg('brain-sagittal', 2, 30),
          createMedicalScanSvg('brain-sagittal', 3, 30),
          createMedicalScanSvg('brain-sagittal', 4, 30),
        ]
      },
      {
        id: 'SER-103',
        seriesNumber: 3,
        description: 'Coronal FLAIR Brain',
        modality: 'MRI',
        plane: 'Coronal',
        thumbnail: createMedicalScanSvg('brain-coronal', 1, 22),
        images: [
          createMedicalScanSvg('brain-coronal', 1, 22),
          createMedicalScanSvg('brain-coronal', 2, 22),
          createMedicalScanSvg('brain-coronal', 3, 22),
        ]
      }
    ]
  },
  {
    id: 'STUDY-1002',
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    gender: 'Male',
    accessionNumber: 'ACC-2026-009740',
    studyDate: '2026-09-15',
    modality: 'MRI',
    bodyPart: 'Left Knee',
    description: 'MRI Left Knee non-contrast',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00021'], // Dr. Sarah Lim (Orthopaedics)
    reportId: 'REP-002',
    clinicalInformation: 'Sports injury playing badminton 2 weeks ago. Medial joint tenderness.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: [
      {
        id: 'SER-201',
        seriesNumber: 1,
        description: 'Sagittal PD FS Knee',
        modality: 'MRI',
        plane: 'Sagittal',
        thumbnail: createMedicalScanSvg('knee-mri', 1, 18),
        images: [
          createMedicalScanSvg('knee-mri', 1, 18),
          createMedicalScanSvg('knee-mri', 2, 18),
          createMedicalScanSvg('knee-mri', 3, 18),
        ]
      },
      {
        id: 'SER-202',
        seriesNumber: 2,
        description: 'Coronal T2 FS Knee',
        modality: 'MRI',
        plane: 'Coronal',
        thumbnail: createMedicalScanSvg('knee-mri', 4, 18),
        images: [
          createMedicalScanSvg('knee-mri', 4, 18),
          createMedicalScanSvg('knee-mri', 5, 18),
        ]
      }
    ]
  },
  {
    id: 'STUDY-1003',
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    gender: 'Male',
    accessionNumber: 'ACC-2026-009110',
    studyDate: '2026-08-10',
    modality: 'X-Ray',
    bodyPart: 'Chest',
    description: 'Chest X-Ray PA Erect',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00030', 'D00021'],
    reportId: 'REP-003',
    clinicalInformation: 'Routine pre-operative / health screening evaluation.',
    referringDoctorName: 'Dr. Emily Tan',
    series: [
      {
        id: 'SER-301',
        seriesNumber: 1,
        description: 'Chest PA Erect',
        modality: 'X-Ray',
        plane: 'Coronal',
        thumbnail: createMedicalScanSvg('chest-xray', 1, 1),
        images: [createMedicalScanSvg('chest-xray', 1, 1)]
      }
    ]
  },
  {
    id: 'STUDY-1004',
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    gender: 'Male',
    accessionNumber: 'ACC-2026-008900',
    studyDate: '2026-07-04',
    modality: 'CT',
    bodyPart: 'Abdomen & Pelvis',
    description: 'CT Abdomen & Pelvis with IV Contrast',
    facility: 'SMG Paragon Imaging',
    radiologist: 'Dr. Michael Lee',
    status: 'IN_PROGRESS',
    assignedDoctorIds: ['D00030'],
    clinicalInformation: 'Recurrent right lower quadrant discomfort.',
    referringDoctorName: 'Dr. Emily Tan',
    series: [
      {
        id: 'SER-401',
        seriesNumber: 1,
        description: 'Axial Abdomen Venous Phase',
        modality: 'CT',
        plane: 'Axial',
        thumbnail: createMedicalScanSvg('brain-axial', 1, 40),
        images: [createMedicalScanSvg('brain-axial', 1, 40)]
      }
    ]
  },
  {
    id: 'STUDY-1005',
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    gender: 'Male',
    accessionNumber: 'ACC-2026-007800',
    studyDate: '2026-05-18',
    modality: 'Ultrasound',
    bodyPart: 'Abdomen',
    description: 'Ultrasound Hepatobiliary & Renal',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00030'],
    reportId: 'REP-005',
    clinicalInformation: 'Screening for fatty liver and renal calculi.',
    referringDoctorName: 'Dr. Emily Tan',
    series: [
      {
        id: 'SER-501',
        seriesNumber: 1,
        description: 'Liver & Gallbladder B-Mode',
        modality: 'Ultrasound',
        plane: 'Coronal',
        thumbnail: createMedicalScanSvg('knee-mri', 2, 10),
        images: [createMedicalScanSvg('knee-mri', 2, 10)]
      }
    ]
  },
  {
    id: 'STUDY-1006',
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    gender: 'Male',
    accessionNumber: 'ACC-2026-006200',
    studyDate: '2026-03-11',
    modality: 'X-Ray',
    bodyPart: 'Lumbar Spine',
    description: 'X-Ray Lumbar Spine AP & Lateral',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00021'], // Dr. Sarah Lim
    clinicalInformation: 'Mechanical lower back strain.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: [
      {
        id: 'SER-601',
        seriesNumber: 1,
        description: 'L-Spine AP & Lateral',
        modality: 'X-Ray',
        plane: 'Sagittal',
        thumbnail: createMedicalScanSvg('chest-xray', 1, 2),
        images: [createMedicalScanSvg('chest-xray', 1, 2)]
      }
    ]
  },
  {
    id: 'STUDY-1007',
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    gender: 'Male',
    accessionNumber: 'ACC-2026-005110',
    studyDate: '2026-01-20',
    modality: 'MRI',
    bodyPart: 'Cervical Spine',
    description: 'MRI Cervical Spine non-contrast',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00021', 'D00025'],
    clinicalInformation: 'Neck stiffness and right arm radicular tingling.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: [
      {
        id: 'SER-701',
        seriesNumber: 1,
        description: 'Sagittal T2 C-Spine',
        modality: 'MRI',
        plane: 'Sagittal',
        thumbnail: createMedicalScanSvg('knee-mri', 3, 14),
        images: [createMedicalScanSvg('knee-mri', 3, 14)]
      }
    ]
  },
  {
    id: 'STUDY-1008',
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    gender: 'Male',
    accessionNumber: 'ACC-2026-009950',
    studyDate: '2026-10-05',
    modality: 'MRI',
    bodyPart: 'Right Shoulder',
    description: 'MRI Right Shoulder Arthrogram',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'SCHEDULED',
    assignedDoctorIds: ['D00021'], // Dr. Sarah Lim
    clinicalInformation: 'Upcoming rotator cuff follow-up.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: []
  },

  // Jane Wong (P00010008)
  {
    id: 'STUDY-1009',
    patientId: 'P00010008',
    patientName: 'Jane Wong',
    patientDob: '1975-01-12',
    gender: 'Female',
    accessionNumber: 'ACC-2026-008450',
    studyDate: '2026-09-22',
    modality: 'CT',
    bodyPart: 'Chest',
    description: 'HRCT Thorax non-contrast',
    facility: 'SMG Paragon Imaging',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00021', 'D00030'], // Assigned to Dr. Sarah Lim & Dr. Emily Tan
    reportId: 'REP-004',
    clinicalInformation: 'Chronic cough for 6 weeks. Rule out bronchiectasis.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: [
      {
        id: 'SER-901',
        seriesNumber: 1,
        description: 'Axial High Resolution Thorax',
        modality: 'CT',
        plane: 'Axial',
        thumbnail: createMedicalScanSvg('chest-xray', 1, 50),
        images: [createMedicalScanSvg('chest-xray', 1, 50)]
      }
    ]
  },
  {
    id: 'STUDY-1010',
    patientId: 'P00010008',
    patientName: 'Jane Wong',
    patientDob: '1975-01-12',
    gender: 'Female',
    accessionNumber: 'ACC-2026-007120',
    studyDate: '2026-08-14',
    modality: 'Mammogram',
    bodyPart: 'Bilateral Breasts',
    description: 'Digital 3D Tomosynthesis Mammography & Ultrasound',
    facility: 'SMG Breast Diagnostic Centre',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00030'], // Dr. Emily Tan
    clinicalInformation: 'Annual bilateral screening mammography.',
    referringDoctorName: 'Dr. Emily Tan',
    series: [
      {
        id: 'SER-1001',
        seriesNumber: 1,
        description: 'Bilateral MLO & CC Views',
        modality: 'Mammogram',
        plane: 'Coronal',
        thumbnail: createMedicalScanSvg('chest-xray', 1, 4),
        images: [createMedicalScanSvg('chest-xray', 1, 4)]
      }
    ]
  },

  // David Lim (P00010014)
  {
    id: 'STUDY-1011',
    patientId: 'P00010014',
    patientName: 'David Lim',
    patientDob: '1968-07-22',
    gender: 'Male',
    accessionNumber: 'ACC-2026-008120',
    studyDate: '2026-09-18',
    modality: 'Ultrasound',
    bodyPart: 'Abdomen',
    description: 'Ultrasound Hepatobiliary System (HBS)',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00021'], // Dr. Sarah Lim
    reportId: 'REP-005',
    clinicalInformation: 'Fatty liver surveillance and abnormal LFTs.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: [
      {
        id: 'SER-1101',
        seriesNumber: 1,
        description: 'Upper Abdomen Sonography',
        modality: 'Ultrasound',
        plane: 'Coronal',
        thumbnail: createMedicalScanSvg('knee-mri', 2, 8),
        images: [createMedicalScanSvg('knee-mri', 2, 8)]
      }
    ]
  },
  {
    id: 'STUDY-1012',
    patientId: 'P00010014',
    patientName: 'David Lim',
    patientDob: '1968-07-22',
    gender: 'Male',
    accessionNumber: 'ACC-2026-009890',
    studyDate: '2026-09-29',
    modality: 'MRI',
    bodyPart: 'Right Knee',
    description: 'MRI Right Knee Joint',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'IN_PROGRESS',
    assignedDoctorIds: ['D00021'], // Dr. Sarah Lim
    clinicalInformation: 'Knee effusion and joint locking post-fall.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: [
      {
        id: 'SER-1201',
        seriesNumber: 1,
        description: 'Sagittal PD FS Knee',
        modality: 'MRI',
        plane: 'Sagittal',
        thumbnail: createMedicalScanSvg('knee-mri', 1, 16),
        images: [createMedicalScanSvg('knee-mri', 1, 16)]
      }
    ]
  },

  // Mary Chen (P00010022)
  {
    id: 'STUDY-1013',
    patientId: 'P00010022',
    patientName: 'Mary Chen',
    patientDob: '1992-11-04',
    gender: 'Female',
    accessionNumber: 'ACC-2026-007620',
    studyDate: '2026-09-12',
    modality: 'MRI',
    bodyPart: 'Lumbar Spine',
    description: 'MRI Lumbar Spine + Sacroiliac Joints',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00021'], // Dr. Sarah Lim
    clinicalInformation: 'Inflammatory lower back stiffness. HLA-B27 positive.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: [
      {
        id: 'SER-1301',
        seriesNumber: 1,
        description: 'Sagittal T1 & T2 STIR',
        modality: 'MRI',
        plane: 'Sagittal',
        thumbnail: createMedicalScanSvg('knee-mri', 1, 20),
        images: [createMedicalScanSvg('knee-mri', 1, 20)]
      }
    ]
  },
  {
    id: 'STUDY-1014',
    patientId: 'P00010022',
    patientName: 'Mary Chen',
    patientDob: '1992-11-04',
    gender: 'Female',
    accessionNumber: 'ACC-2026-009988',
    studyDate: '2026-10-01',
    modality: 'X-Ray',
    bodyPart: 'Pelvis & Hips',
    description: 'Pelvis AP Erect',
    facility: 'SMG Medical Centre (Novena)',
    radiologist: 'Dr. Michael Lee',
    status: 'SCHEDULED',
    assignedDoctorIds: ['D00021'], // Dr. Sarah Lim
    clinicalInformation: 'Assessment of sacroiliac joints.',
    referringDoctorName: 'Dr. Sarah Lim',
    series: []
  },

  // Robert Koh (P00010035)
  {
    id: 'STUDY-1015',
    patientId: 'P00010035',
    patientName: 'Robert Koh',
    patientDob: '1959-09-30',
    gender: 'Male',
    accessionNumber: 'ACC-2026-006890',
    studyDate: '2026-09-08',
    modality: 'CT',
    bodyPart: 'Coronary Angiography',
    description: 'CT Coronary Angiogram & Calcium Score',
    facility: 'SMG Paragon Imaging',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00025'], // Dr. James Wong
    clinicalInformation: 'Atypical angina on exertion. Agatston score calculation.',
    referringDoctorName: 'Dr. James Wong',
    series: [
      {
        id: 'SER-1501',
        seriesNumber: 1,
        description: 'Coronary CTA 3D Volume Render',
        modality: 'CT',
        plane: '3D',
        thumbnail: createMedicalScanSvg('chest-xray', 1, 1),
        images: [createMedicalScanSvg('chest-xray', 1, 1)]
      }
    ]
  },
  {
    id: 'STUDY-1016',
    patientId: 'P00010035',
    patientName: 'Robert Koh',
    patientDob: '1959-09-30',
    gender: 'Male',
    accessionNumber: 'ACC-2026-005880',
    studyDate: '2026-07-28',
    modality: 'PET/CT',
    bodyPart: 'Whole Body',
    description: '18F-FDG PET/CT Whole Body Oncology',
    facility: 'SMG Novena Oncology Imaging',
    radiologist: 'Dr. Michael Lee',
    status: 'REPORTED',
    assignedDoctorIds: ['D00030'], // Dr. Emily Tan
    clinicalInformation: 'Lymphoma staging follow-up.',
    referringDoctorName: 'Dr. Emily Tan',
    series: [
      {
        id: 'SER-1601',
        seriesNumber: 1,
        description: 'Whole Body MIP Projection',
        modality: 'PET/CT',
        plane: 'Coronal',
        thumbnail: createMedicalScanSvg('brain-coronal', 1, 1),
        images: [createMedicalScanSvg('brain-coronal', 1, 1)]
      }
    ]
  }
];
