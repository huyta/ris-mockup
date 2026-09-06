/**
 * Radiology Information System (RIS) Mock Data
 * Comprehensive enterprise mock dataset with cross-referenced relational entities.
 * Exported as a single global `MOCK_DATA` object.
 */

const MOCK_DATA = {
  // ---------------------------------------------------------------------------
  // Patients (8 entries) - Demographically diverse, ages 25-82
  // ---------------------------------------------------------------------------
  patients: [
    {
      id: 'PAT-001', mrn: 'MRN-10045', name: 'Robert Chen', dob: '1965-03-14', sex: 'M',
      phone: '555-0101', address: '123 Oak St, Springfield, IL 62701', insurance: 'BlueCross PPO',
      allergies: 'Gadolinium', status: 'Active'
    },
    {
      id: 'PAT-002', mrn: 'MRN-10046', name: 'Eleanor Vance', dob: '1942-11-20', sex: 'F',
      phone: '555-0142', address: '452 Elm Street, Apt 3B, Springfield, IL 62702', insurance: 'Medicare Part B',
      allergies: 'Penicillin, Iodine', status: 'Active'
    },
    {
      id: 'PAT-003', mrn: 'MRN-10047', name: 'Marcus Aurelius Johnson', dob: '1988-07-09', sex: 'M',
      phone: '555-0178', address: '789 Pine Ridge Way, Springfield, IL 62704', insurance: 'Aetna Open Choice POS',
      allergies: 'NKDA', status: 'Active'
    },
    {
      id: 'PAT-004', mrn: 'MRN-10048', name: 'Sofia Elena Rodriguez', dob: '1999-04-25', sex: 'F',
      phone: '555-0193', address: '321 Maple Avenue, Springfield, IL 62703', insurance: 'UnitedHealthcare Choice Plus',
      allergies: 'Latex', status: 'Active'
    },
    {
      id: 'PAT-005', mrn: 'MRN-10049', name: 'David K. Washington', dob: '1956-12-02', sex: 'M',
      phone: '555-0211', address: '654 Birch Court, Springfield, IL 62704', insurance: 'Humana Gold Plus HMO',
      allergies: 'Sulfa drugs', status: 'Active'
    },
    {
      id: 'PAT-006', mrn: 'MRN-10050', name: 'Priya Patel', dob: '1978-08-30', sex: 'F',
      phone: '555-0234', address: '882 Cedar Boulevard, Springfield, IL 62705', insurance: 'Cigna HealthSpring',
      allergies: 'Aspirin, NSAIDs', status: 'Active'
    },
    {
      id: 'PAT-007', mrn: 'MRN-10051', name: 'Arthur Pendelton', dob: '1944-01-18', sex: 'M',
      phone: '555-0256', address: '1010 Willow Lake Road, Springfield, IL 62706', insurance: 'Medicare Advantage',
      allergies: 'Contrast dye (IV Iodinated)', status: 'Active'
    },
    {
      id: 'PAT-008', mrn: 'MRN-10052', name: 'Grace Miriam O\'Connor', dob: '1991-10-12', sex: 'F',
      phone: '555-0289', address: '543 Sycamore Terrace, Springfield, IL 62707', insurance: 'Kaiser Permanente',
      allergies: 'NKDA', status: 'Active'
    }
  ],

  // ---------------------------------------------------------------------------
  // Encounters (10 entries) - Outpatient, Inpatient, and Emergency episodes
  // ---------------------------------------------------------------------------
  encounters: [
    {
      id: 'ENC-001', patientId: 'PAT-001', type: 'Outpatient', admitDate: '2024-01-15',
      department: 'Radiology', attendingPhysician: 'Dr. Sarah Mitchell', status: 'Active'
    },
    {
      id: 'ENC-002', patientId: 'PAT-002', type: 'Inpatient', admitDate: '2024-01-14',
      department: 'Internal Medicine 4W', attendingPhysician: 'Dr. Gregory House', status: 'Active'
    },
    {
      id: 'ENC-003', patientId: 'PAT-003', type: 'Emergency', admitDate: '2024-01-14',
      department: 'Emergency Department', attendingPhysician: 'Dr. John Carter', status: 'Active'
    },
    {
      id: 'ENC-004', patientId: 'PAT-004', type: 'Outpatient', admitDate: '2024-01-16',
      department: 'Orthopedic Surgery', attendingPhysician: 'Dr. Robert Torres', status: 'Active'
    },
    {
      id: 'ENC-005', patientId: 'PAT-005', type: 'Inpatient', admitDate: '2024-01-13',
      department: 'Oncology', attendingPhysician: 'Dr. Allison Cameron', status: 'Active'
    },
    {
      id: 'ENC-006', patientId: 'PAT-006', type: 'Outpatient', admitDate: '2024-01-15',
      department: 'Women\'s Health Center', attendingPhysician: 'Dr. Lisa Cuddy', status: 'Active'
    },
    {
      id: 'ENC-007', patientId: 'PAT-007', type: 'Inpatient', admitDate: '2024-01-12',
      department: 'Cardiology ICU', attendingPhysician: 'Dr. Eric Foreman', status: 'Active'
    },
    {
      id: 'ENC-008', patientId: 'PAT-008', type: 'Emergency', admitDate: '2024-01-16',
      department: 'Emergency Department', attendingPhysician: 'Dr. John Carter', status: 'Active'
    },
    {
      id: 'ENC-009', patientId: 'PAT-001', type: 'Outpatient', admitDate: '2024-01-08',
      department: 'Family Medicine', attendingPhysician: 'Dr. Sarah Mitchell', status: 'Closed'
    },
    {
      id: 'ENC-010', patientId: 'PAT-004', type: 'Outpatient', admitDate: '2024-01-10',
      department: 'Sports Medicine', attendingPhysician: 'Dr. Robert Torres', status: 'Closed'
    }
  ],

  // ---------------------------------------------------------------------------
  // Orders (12 entries) - Covering all 10 required statuses across modalities
  // ---------------------------------------------------------------------------
  orders: [
    {
      id: 'ORD-001', accession: 'ACC-2024-00101', patientId: 'PAT-001', encounterId: 'ENC-001',
      procedure: 'MRI Brain w/o Contrast', procedureCode: '70551', modality: 'MR', bodyPart: 'Brain', laterality: 'N/A',
      urgency: 'Routine', status: 'Scheduled', orderingPhysician: 'Dr. Sarah Mitchell', clinicalIndication: 'Persistent headaches for 3 weeks',
      scheduledDate: '2024-01-16', scheduledTime: '09:30', roomId: 'ROOM-001', modalityId: 'MOD-001',
      assignedTech: 'TECH-001', assignedRad: 'RAD-001', createdAt: '2024-01-15T08:30:00Z'
    },
    {
      id: 'ORD-002', accession: 'ACC-2024-00102', patientId: 'PAT-002', encounterId: 'ENC-002',
      procedure: 'CT Abdomen/Pelvis w/ Contrast', procedureCode: '74177', modality: 'CT', bodyPart: 'Abdomen/Pelvis', laterality: 'N/A',
      urgency: 'Urgent', status: 'Requested', orderingPhysician: 'Dr. Gregory House', clinicalIndication: 'Right lower quadrant pain, leukocytosis, suspect appendicitis',
      scheduledDate: '2024-01-16', scheduledTime: '11:00', roomId: 'ROOM-002', modalityId: 'MOD-002',
      assignedTech: 'TECH-002', assignedRad: 'RAD-002', createdAt: '2024-01-16T07:15:00Z'
    },
    {
      id: 'ORD-003', accession: 'ACC-2024-00103', patientId: 'PAT-003', encounterId: 'ENC-003',
      procedure: 'Chest X-Ray 2 Views PA/LAT', procedureCode: '71046', modality: 'CR', bodyPart: 'Chest', laterality: 'Bilateral',
      urgency: 'STAT', status: 'Arrived', orderingPhysician: 'Dr. John Carter', clinicalIndication: 'Acute shortness of breath, hypoxia, evaluate for pneumothorax',
      scheduledDate: '2024-01-16', scheduledTime: '10:00', roomId: 'ROOM-003', modalityId: 'MOD-003',
      assignedTech: 'TECH-002', assignedRad: 'RAD-002', createdAt: '2024-01-16T09:10:00Z'
    },
    {
      id: 'ORD-004', accession: 'ACC-2024-00104', patientId: 'PAT-004', encounterId: 'ENC-004',
      procedure: 'Ultrasound Abdomen Complete', procedureCode: '76700', modality: 'US', bodyPart: 'Abdomen', laterality: 'N/A',
      urgency: 'Routine', status: 'In Progress', orderingPhysician: 'Dr. Robert Torres', clinicalIndication: 'Elevated liver enzymes, evaluate hepatic parenchyma and biliary tree',
      scheduledDate: '2024-01-16', scheduledTime: '10:30', roomId: 'ROOM-004', modalityId: 'MOD-004',
      assignedTech: 'TECH-003', assignedRad: 'RAD-002', createdAt: '2024-01-15T14:20:00Z'
    },
    {
      id: 'ORD-005', accession: 'ACC-2024-00105', patientId: 'PAT-003', encounterId: 'ENC-003',
      procedure: 'MRI Brain w/o Contrast', procedureCode: '70551', modality: 'MR', bodyPart: 'Brain', laterality: 'N/A',
      urgency: 'Urgent', status: 'Finalized', orderingPhysician: 'Dr. John Carter', clinicalIndication: 'Persistent headaches with visual aura',
      scheduledDate: '2024-01-14', scheduledTime: '11:00', roomId: 'ROOM-001', modalityId: 'MOD-001',
      assignedTech: 'TECH-001', assignedRad: 'RAD-001', createdAt: '2024-01-14T08:00:00Z'
    },
    {
      id: 'ORD-006', accession: 'ACC-2024-00106', patientId: 'PAT-006', encounterId: 'ENC-006',
      procedure: 'Mammography Screening Bilateral', procedureCode: '77067', modality: 'MG', bodyPart: 'Breast', laterality: 'Bilateral',
      urgency: 'Routine', status: 'Completed', orderingPhysician: 'Dr. Lisa Cuddy', clinicalIndication: 'Annual routine screening mammogram',
      scheduledDate: '2024-01-15', scheduledTime: '13:00', roomId: 'ROOM-004', modalityId: 'MOD-005',
      assignedTech: 'TECH-003', assignedRad: 'RAD-004', createdAt: '2024-01-10T11:00:00Z'
    },
    {
      id: 'ORD-007', accession: 'ACC-2024-00107', patientId: 'PAT-007', encounterId: 'ENC-007',
      procedure: 'CT Head w/o Contrast', procedureCode: '70450', modality: 'CT', bodyPart: 'Head', laterality: 'N/A',
      urgency: 'STAT', status: 'Preliminary', orderingPhysician: 'Dr. Eric Foreman', clinicalIndication: 'Fall with head strike on anticoagulant therapy, rule out intracranial hemorrhage',
      scheduledDate: '2024-01-15', scheduledTime: '15:30', roomId: 'ROOM-002', modalityId: 'MOD-002',
      assignedTech: 'TECH-002', assignedRad: 'RAD-001', createdAt: '2024-01-15T15:00:00Z'
    },
    {
      id: 'ORD-008', accession: 'ACC-2024-00108', patientId: 'PAT-005', encounterId: 'ENC-005',
      procedure: 'Nuclear Medicine Bone Scan Whole Body', procedureCode: '78306', modality: 'NM', bodyPart: 'Whole Body', laterality: 'N/A',
      urgency: 'Routine', status: 'Draft Report', orderingPhysician: 'Dr. Allison Cameron', clinicalIndication: 'Prostate cancer staging, evaluate for osseous metastases',
      scheduledDate: '2024-01-15', scheduledTime: '08:30', roomId: 'ROOM-002', modalityId: 'MOD-006',
      assignedTech: 'TECH-004', assignedRad: 'RAD-003', createdAt: '2024-01-12T09:45:00Z'
    },
    {
      id: 'ORD-009', accession: 'ACC-2024-00109', patientId: 'PAT-008', encounterId: 'ENC-008',
      procedure: 'X-Ray Knee 3 Views', procedureCode: '73562', modality: 'CR', bodyPart: 'Knee', laterality: 'Right',
      urgency: 'Urgent', status: 'Validated', orderingPhysician: 'Dr. John Carter', clinicalIndication: 'Acute trauma, twisting injury while skiing, inability to bear weight',
      scheduledDate: '2024-01-16', scheduledTime: '11:30', roomId: 'ROOM-003', modalityId: 'MOD-003',
      assignedTech: 'TECH-002', assignedRad: 'RAD-003', createdAt: '2024-01-16T10:45:00Z'
    },
    {
      id: 'ORD-010', accession: 'ACC-2024-00110', patientId: 'PAT-001', encounterId: 'ENC-009',
      procedure: 'MRI Lumbar Spine w/o Contrast', procedureCode: '72148', modality: 'MR', bodyPart: 'Lumbar Spine', laterality: 'N/A',
      urgency: 'Routine', status: 'Cancelled', orderingPhysician: 'Dr. Sarah Mitchell', clinicalIndication: 'Chronic lower back pain with radiculopathy',
      scheduledDate: '2024-01-12', scheduledTime: '14:00', roomId: 'ROOM-001', modalityId: 'MOD-001',
      assignedTech: 'TECH-001', assignedRad: 'RAD-003', createdAt: '2024-01-08T10:00:00Z'
    },
    {
      id: 'ORD-011', accession: 'ACC-2024-00111', patientId: 'PAT-002', encounterId: 'ENC-002',
      procedure: 'CT Angiography Chest w/ Contrast', procedureCode: '71275', modality: 'CT', bodyPart: 'Chest', laterality: 'N/A',
      urgency: 'STAT', status: 'Finalized', orderingPhysician: 'Dr. Gregory House', clinicalIndication: 'Sudden onset chest pain, elevated D-Dimer, rule out pulmonary embolism',
      scheduledDate: '2024-01-14', scheduledTime: '16:00', roomId: 'ROOM-002', modalityId: 'MOD-002',
      assignedTech: 'TECH-002', assignedRad: 'RAD-002', createdAt: '2024-01-14T15:15:00Z'
    },
    {
      id: 'ORD-012', accession: 'ACC-2024-00112', patientId: 'PAT-004', encounterId: 'ENC-010',
      procedure: 'Chest X-Ray 2 Views PA/LAT', procedureCode: '71046', modality: 'CR', bodyPart: 'Chest', laterality: 'Bilateral',
      urgency: 'Routine', status: 'Completed', orderingPhysician: 'Dr. Robert Torres', clinicalIndication: 'Pre-operative clearance for scheduled knee arthroscopy',
      scheduledDate: '2024-01-10', scheduledTime: '14:00', roomId: 'ROOM-003', modalityId: 'MOD-003',
      assignedTech: 'TECH-002', assignedRad: 'RAD-002', createdAt: '2024-01-10T09:00:00Z'
    }
  ],

  // ---------------------------------------------------------------------------
  // Appointments (8 entries) - Room and technologist scheduling
  // ---------------------------------------------------------------------------
  appointments: [
    {
      id: 'APT-001', orderId: 'ORD-001', patientId: 'PAT-001', date: '2024-01-16', startTime: '09:30', endTime: '10:15',
      roomId: 'ROOM-001', modalityId: 'MOD-001', techId: 'TECH-001', status: 'Confirmed', duration: 45
    },
    {
      id: 'APT-002', orderId: 'ORD-002', patientId: 'PAT-002', date: '2024-01-16', startTime: '11:00', endTime: '11:30',
      roomId: 'ROOM-002', modalityId: 'MOD-002', techId: 'TECH-002', status: 'Pending', duration: 30
    },
    {
      id: 'APT-003', orderId: 'ORD-003', patientId: 'PAT-003', date: '2024-01-16', startTime: '10:00', endTime: '10:15',
      roomId: 'ROOM-003', modalityId: 'MOD-003', techId: 'TECH-002', status: 'Arrived', duration: 15
    },
    {
      id: 'APT-004', orderId: 'ORD-004', patientId: 'PAT-004', date: '2024-01-16', startTime: '10:30', endTime: '11:00',
      roomId: 'ROOM-004', modalityId: 'MOD-004', techId: 'TECH-003', status: 'In Progress', duration: 30
    },
    {
      id: 'APT-005', orderId: 'ORD-006', patientId: 'PAT-006', date: '2024-01-15', startTime: '13:00', endTime: '13:30',
      roomId: 'ROOM-004', modalityId: 'MOD-005', techId: 'TECH-003', status: 'Completed', duration: 30
    },
    {
      id: 'APT-006', orderId: 'ORD-007', patientId: 'PAT-007', date: '2024-01-15', startTime: '15:30', endTime: '15:50',
      roomId: 'ROOM-002', modalityId: 'MOD-002', techId: 'TECH-002', status: 'Completed', duration: 20
    },
    {
      id: 'APT-007', orderId: 'ORD-008', patientId: 'PAT-005', date: '2024-01-15', startTime: '08:30', endTime: '09:30',
      roomId: 'ROOM-002', modalityId: 'MOD-006', techId: 'TECH-004', status: 'Completed', duration: 60
    },
    {
      id: 'APT-008', orderId: 'ORD-009', patientId: 'PAT-008', date: '2024-01-16', startTime: '11:30', endTime: '11:45',
      roomId: 'ROOM-003', modalityId: 'MOD-003', techId: 'TECH-002', status: 'Completed', duration: 15
    }
  ],

  // ---------------------------------------------------------------------------
  // Modalities (6 entries) - MR, CT, CR, US, MG, NM with vendors & network info
  // ---------------------------------------------------------------------------
  modalities: [
    {
      id: 'MOD-001', name: 'MRI Scanner 1', type: 'MR', aeTitle: 'MRI_SCANNER_1', manufacturer: 'Siemens',
      model: 'MAGNETOM Vida', roomId: 'ROOM-001', status: 'Online', ipAddress: '10.0.1.101'
    },
    {
      id: 'MOD-002', name: 'CT Scanner Revolution', type: 'CT', aeTitle: 'CT_SCANNER_1', manufacturer: 'GE Healthcare',
      model: 'Revolution Apex Elite', roomId: 'ROOM-002', status: 'Online', ipAddress: '10.0.1.102'
    },
    {
      id: 'MOD-003', name: 'Digital Radiography Unit', type: 'CR', aeTitle: 'XR_ROOM_1', manufacturer: 'Philips',
      model: 'DigitalDiagnost C90', roomId: 'ROOM-003', status: 'Online', ipAddress: '10.0.1.103'
    },
    {
      id: 'MOD-004', name: 'Ultrasound System Elite', type: 'US', aeTitle: 'US_UNIT_1', manufacturer: 'Canon Medical',
      model: 'Aplio i800', roomId: 'ROOM-004', status: 'Online', ipAddress: '10.0.1.104'
    },
    {
      id: 'MOD-005', name: '3D Mammography System', type: 'MG', aeTitle: 'MAMMO_DIMENSIONS', manufacturer: 'Hologic',
      model: 'Dimensions 3D 6000', roomId: 'ROOM-004', status: 'Online', ipAddress: '10.0.1.105'
    },
    {
      id: 'MOD-006', name: 'SPECT/CT Symbia', type: 'NM', aeTitle: 'NM_SPECT_1', manufacturer: 'Siemens',
      model: 'Symbia Intevo Bold', roomId: 'ROOM-002', status: 'Online', ipAddress: '10.0.1.106'
    }
  ],

  // ---------------------------------------------------------------------------
  // Rooms (4 entries) - Suites with floor, building, and assigned modality types
  // ---------------------------------------------------------------------------
  rooms: [
    { id: 'ROOM-001', name: 'MRI Suite A', floor: '2nd Floor', building: 'Imaging Center', modalityTypes: ['MR'], status: 'Available' },
    { id: 'ROOM-002', name: 'CT / Nuclear Imaging Suite B', floor: '1st Floor', building: 'Imaging Center', modalityTypes: ['CT', 'NM'], status: 'Occupied' },
    { id: 'ROOM-003', name: 'General Radiography Room 1', floor: 'Ground Floor', building: 'Main Hospital', modalityTypes: ['CR'], status: 'Available' },
    { id: 'ROOM-004', name: 'Ultrasound & Mammography Suite C', floor: '2nd Floor', building: 'Imaging Center', modalityTypes: ['US', 'MG'], status: 'Available' }
  ],

  // ---------------------------------------------------------------------------
  // Staff (4 Radiologists & 4 Technologists)
  // ---------------------------------------------------------------------------
  staff: {
    radiologists: [
      { id: 'RAD-001', name: 'Dr. James Wilson', subspecialty: 'Neuroradiology', npi: '1234567890', email: 'jwilson@hospital.org', status: 'Available' },
      { id: 'RAD-002', name: 'Dr. Elena Rostova', subspecialty: 'Body Imaging', npi: '1821039452', email: 'erostova@hospital.org', status: 'Available' },
      { id: 'RAD-003', name: 'Dr. Marcus Sterling', subspecialty: 'Musculoskeletal', npi: '1598723410', email: 'msterling@hospital.org', status: 'Busy' },
      { id: 'RAD-004', name: 'Dr. Karen Chen', subspecialty: 'Breast Imaging', npi: '1730294851', email: 'kchen@hospital.org', status: 'Available' }
    ],
    technologists: [
      { id: 'TECH-001', name: 'Maria Rodriguez', certifications: ['MR', 'CT'], shift: 'Day', status: 'On Duty' },
      { id: 'TECH-002', name: 'David Miller', certifications: ['CT', 'CR'], shift: 'Day', status: 'On Duty' },
      { id: 'TECH-003', name: 'Aisha Washington', certifications: ['US', 'MG'], shift: 'Day', status: 'On Duty' },
      { id: 'TECH-004', name: 'Carlos Mendez', certifications: ['CR', 'NM'], shift: 'Night', status: 'Off Duty' }
    ]
  },

  // ---------------------------------------------------------------------------
  // Studies (8 entries) - DICOM study instances linked to orders and PACS
  // ---------------------------------------------------------------------------
  studies: [
    {
      id: 'STD-001', orderId: 'ORD-005', accession: 'ACC-2024-00105', patientId: 'PAT-003',
      studyInstanceUid: '1.2.840.113619.2.55.3.604688119.969.1234567890.101', studyDate: '2024-01-14',
      studyDescription: 'MRI BRAIN WO CONTRAST', modality: 'MR', seriesCount: 4, imageCount: 186,
      bodyPart: 'BRAIN', status: 'Available', receivedAt: '2024-01-14T11:45:00Z'
    },
    {
      id: 'STD-002', orderId: 'ORD-006', accession: 'ACC-2024-00106', patientId: 'PAT-006',
      studyInstanceUid: '1.2.840.113619.2.55.3.604688119.969.1234567890.102', studyDate: '2024-01-15',
      studyDescription: 'MAMMOGRAPHY SCREENING BILATERAL 3D', modality: 'MG', seriesCount: 4, imageCount: 88,
      bodyPart: 'BREAST', status: 'Available', receivedAt: '2024-01-15T13:35:00Z'
    },
    {
      id: 'STD-003', orderId: 'ORD-007', accession: 'ACC-2024-00107', patientId: 'PAT-007',
      studyInstanceUid: '1.2.840.113619.2.55.3.604688119.969.1234567890.103', studyDate: '2024-01-15',
      studyDescription: 'CT HEAD WO CONTRAST', modality: 'CT', seriesCount: 3, imageCount: 142,
      bodyPart: 'HEAD', status: 'Available', receivedAt: '2024-01-15T15:48:00Z'
    },
    {
      id: 'STD-004', orderId: 'ORD-008', accession: 'ACC-2024-00108', patientId: 'PAT-005',
      studyInstanceUid: '1.2.840.113619.2.55.3.604688119.969.1234567890.104', studyDate: '2024-01-15',
      studyDescription: 'NM BONE SCAN WHOLE BODY', modality: 'NM', seriesCount: 2, imageCount: 24,
      bodyPart: 'WHOLE BODY', status: 'Available', receivedAt: '2024-01-15T09:35:00Z'
    },
    {
      id: 'STD-005', orderId: 'ORD-009', accession: 'ACC-2024-00109', patientId: 'PAT-008',
      studyInstanceUid: '1.2.840.113619.2.55.3.604688119.969.1234567890.105', studyDate: '2024-01-16',
      studyDescription: 'XR KNEE 3 VIEWS RIGHT', modality: 'CR', seriesCount: 1, imageCount: 3,
      bodyPart: 'KNEE', status: 'Available', receivedAt: '2024-01-16T11:48:00Z'
    },
    {
      id: 'STD-006', orderId: 'ORD-011', accession: 'ACC-2024-00111', patientId: 'PAT-002',
      studyInstanceUid: '1.2.840.113619.2.55.3.604688119.969.1234567890.106', studyDate: '2024-01-14',
      studyDescription: 'CTA CHEST W CONTRAST PE PROTOCOL', modality: 'CT', seriesCount: 4, imageCount: 420,
      bodyPart: 'CHEST', status: 'Available', receivedAt: '2024-01-14T16:22:00Z'
    },
    {
      id: 'STD-007', orderId: 'ORD-012', accession: 'ACC-2024-00112', patientId: 'PAT-004',
      studyInstanceUid: '1.2.840.113619.2.55.3.604688119.969.1234567890.107', studyDate: '2024-01-10',
      studyDescription: 'XR CHEST 2 VIEWS PA/LAT', modality: 'CR', seriesCount: 1, imageCount: 2,
      bodyPart: 'CHEST', status: 'Available', receivedAt: '2024-01-10T14:15:00Z'
    },
    {
      id: 'STD-008', orderId: 'ORD-004', accession: 'ACC-2024-00104', patientId: 'PAT-004',
      studyInstanceUid: '1.2.840.113619.2.55.3.604688119.969.1234567890.108', studyDate: '2024-01-16',
      studyDescription: 'US ABDOMEN COMPLETE', modality: 'US', seriesCount: 2, imageCount: 46,
      bodyPart: 'ABDOMEN', status: 'Acquiring', receivedAt: '2024-01-16T10:45:00Z'
    }
  ],

  // ---------------------------------------------------------------------------
  // Reports (6 entries) - Clinical narratives, findings, and impressions
  // ---------------------------------------------------------------------------
  reports: [
    {
      id: 'RPT-001', orderId: 'ORD-005', studyId: 'STD-001', accession: 'ACC-2024-00105',
      patientId: 'PAT-003', radiologistId: 'RAD-001', status: 'Finalized',
      clinicalHistory: 'Persistent headaches for 3 weeks with visual aura.',
      technique: 'MRI Brain without contrast: Sagittal T1, Axial T2, FLAIR, DWI, ADC obtained on 3.0T scanner.',
      findings: 'The brain parenchyma demonstrates normal signal intensity throughout. No focal diffusion restriction to suggest acute ischemia. No mass effect, midline shift, or hydrocephalus. The ventricles and basal cisterns are within normal limits for age. Minimal non-specific subcortical T2/FLAIR hyperintensities in the frontal lobes, likely chronic microvascular changes. Paranasal sinuses and mastoids are clear.',
      impression: '1. No acute intracranial abnormality, infarct, hemorrhage, or mass.\n2. Mild chronic microvascular ischemic changes within expected limits for age.',
      createdAt: '2024-01-14T12:00:00Z', signedAt: '2024-01-14T14:30:00Z', version: 1
    },
    {
      id: 'RPT-002', orderId: 'ORD-007', studyId: 'STD-003', accession: 'ACC-2024-00107',
      patientId: 'PAT-007', radiologistId: 'RAD-001', status: 'Preliminary',
      clinicalHistory: 'Mechanical fall with scalp laceration, on Eliquis (anticoagulation).',
      technique: 'Non-contrast axial CT images reconstructed from skull base through vertex at 1.25mm slice thickness.',
      findings: 'Calvarium intact without acute calvarial fracture. No evidence of acute epidural, subdural, subarachnoid, or intra-axial hemorrhage. Ventricles and sulci demonstrate age-related cerebral volume loss. Grey-white matter differentiation is preserved throughout. Right parietal scalp hematoma noted.',
      impression: 'PRELIMINARY: No acute intracranial hemorrhage or calvarial fracture. Soft tissue swelling in right parietal scalp. Formal read pending.',
      createdAt: '2024-01-15T15:55:00Z', signedAt: null, version: 1
    },
    {
      id: 'RPT-003', orderId: 'ORD-008', studyId: 'STD-004', accession: 'ACC-2024-00108',
      patientId: 'PAT-005', radiologistId: 'RAD-003', status: 'Draft',
      clinicalHistory: 'Prostate adenocarcinoma, Gleason score 4+4=8, staging bone scan.',
      technique: 'Anterior and posterior planar whole-body scintigraphy obtained 3 hours following IV administration of 25.4 mCi Tc-99m MDP.',
      findings: 'Physiologic radiotracer uptake is seen throughout the axial and appendicular skeleton. Symmetric tracer excretion in kidneys and bladder. Mild focal uptake in bilateral acromioclavicular joints and mid lumbar spine consistent with degenerative joint disease. No focally intense osteoblastic lesions suggestive of skeletal metastasis.',
      impression: 'DRAFT: No scintigraphic evidence of osseous metastatic disease. Mild degenerative arthropathy noted.',
      createdAt: '2024-01-15T10:15:00Z', signedAt: null, version: 1
    },
    {
      id: 'RPT-004', orderId: 'ORD-011', studyId: 'STD-006', accession: 'ACC-2024-00111',
      patientId: 'PAT-002', radiologistId: 'RAD-002', status: 'Finalized',
      clinicalHistory: 'Acute pleuritic chest pain, tachypnea, hypoxia. Rule out pulmonary embolism.',
      technique: 'Helical CT of the chest performed with intravenous Isovue-370 contrast timed for pulmonary arterial enhancement.',
      findings: 'Pulmonary arterial tree is opacified through the subsegmental branches bilaterally. No filling defect identified within main, lobar, segmental, or subsegmental pulmonary arteries. Thoracic aorta is normal in caliber with no flap. Cardiac size is normal. Lungs are clear without consolidation, pneumothorax, or pleural effusion.',
      impression: '1. Negative for acute pulmonary embolism.\n2. No acute thoracic or pleuroparenchymal abnormality.',
      createdAt: '2024-01-14T16:35:00Z', signedAt: '2024-01-14T17:00:00Z', version: 1
    },
    {
      id: 'RPT-005', orderId: 'ORD-011', studyId: 'STD-006', accession: 'ACC-2024-00111',
      patientId: 'PAT-002', radiologistId: 'RAD-002', status: 'Addendum',
      clinicalHistory: 'Addendum requested to evaluate incidental finding in upper abdominal cuts.',
      technique: 'Review of re-windowed subdiaphragmatic CT views.',
      findings: 'ADDENDUM: Re-examination of imaged portions of the upper abdomen reveals a 1.2 cm hypodense non-calcified lesion in liver segment 7, demonstrating features characteristic of a benign hepatic cyst (homogeneous, <10 HU).',
      impression: 'ADDENDUM: Incidental 1.2 cm benign-appearing simple hepatic cyst. No further imaging recommended.',
      createdAt: '2024-01-14T18:15:00Z', signedAt: '2024-01-14T18:30:00Z', version: 2
    },
    {
      id: 'RPT-006', orderId: 'ORD-009', studyId: 'STD-005', accession: 'ACC-2024-00109',
      patientId: 'PAT-008', radiologistId: 'RAD-003', status: 'Amended',
      clinicalHistory: 'Skiing accident, knee twisting injury. Correlated with bedside exam.',
      technique: 'Three views of the right knee: AP, lateral, and sunrise patellar projections.',
      findings: 'AMENDED REPORT: Previous version inadvertently marked lateral compartment joint effusion. Re-review confirms moderate suprapatellar joint effusion without intra-articular loose bodies or radiopaque foreign bodies. Cortical margins of distal femur, proximal tibia, fibula, and patella are intact without acute fracture or dislocation. Normal femorotibial joint alignment maintained.',
      impression: 'AMENDED IMPRESSION:\n1. Moderate joint effusion; often correlates with meniscal or cruciate ligamentous injury.\n2. No acute fracture or dislocation on plain radiographs.\n3. Recommend MRI Right Knee if mechanical symptoms persist.',
      createdAt: '2024-01-16T12:00:00Z', signedAt: '2024-01-16T12:40:00Z', version: 2
    }
  ],

  // ---------------------------------------------------------------------------
  // Dispatch & Interoperability (6 entries) - External test routing & sync
  // ---------------------------------------------------------------------------
  dispatch: [
    {
      id: 'DSP-001', type: 'Outsourced Test', accession: 'ACC-2024-00108', originFacility: 'Springfield General Hospital',
      destinationFacility: 'Regional Reference Lab', patientId: 'PAT-005', testName: 'Bone Scan Quantitative Analysis',
      barcode: 'BC-9981234', status: 'Synced', syncTimestamp: '2024-01-15T16:00:00Z', retryCount: 0
    },
    {
      id: 'DSP-002', type: 'Reflex Test', accession: 'ACC-2024-00106', originFacility: 'Springfield General Hospital',
      destinationFacility: 'Comprehensive Breast Care Center', patientId: 'PAT-006', testName: 'Targeted Ultrasound Breast',
      barcode: 'BC-9981235', status: 'Dispatched', syncTimestamp: '2024-01-15T14:15:00Z', retryCount: 0
    },
    {
      id: 'DSP-003', type: 'Add-on Test', accession: 'ACC-2024-00102', originFacility: 'Springfield General Hospital',
      destinationFacility: 'Emergency Radiology Telerad Group', patientId: 'PAT-002', testName: 'CT Pelvis 3D Reconstruction',
      barcode: 'BC-9981236', status: 'Pending', syncTimestamp: null, retryCount: 0
    },
    {
      id: 'DSP-004', type: 'Result Sync', accession: 'ACC-2024-00105', originFacility: 'Springfield General Hospital',
      destinationFacility: 'State Health Information Exchange (HIE)', patientId: 'PAT-003', testName: 'Diagnostic Report Tele-Sync',
      barcode: 'BC-9981237', status: 'Received', syncTimestamp: '2024-01-14T15:00:00Z', retryCount: 0
    },
    {
      id: 'DSP-005', type: 'Barcode Share', accession: 'ACC-2024-00107', originFacility: 'Springfield General Hospital',
      destinationFacility: 'Trauma Center Mobile PACS', patientId: 'PAT-007', testName: 'STAT CT Head Pre-Read',
      barcode: 'BC-9981238', status: 'Processing', syncTimestamp: '2024-01-15T15:45:00Z', retryCount: 0
    },
    {
      id: 'DSP-006', type: 'Outsourced Test', accession: 'ACC-2024-00110', originFacility: 'Springfield General Hospital',
      destinationFacility: 'Spine Specialists Diagnostic Cloud', patientId: 'PAT-001', testName: 'Spine AI Vertebra Segmentation',
      barcode: 'BC-9981239', status: 'Failed', syncTimestamp: '2024-01-12T14:30:00Z', retryCount: 3
    }
  ],

  // ---------------------------------------------------------------------------
  // Outbound Messages (8 entries) - HL7 v2 and FHIR R4 interfaces
  // ---------------------------------------------------------------------------
  outboundMessages: [
    {
      id: 'MSG-001', type: 'HL7 ORU', trigger: 'R01', direction: 'Outbound', accession: 'ACC-2024-00105',
      destination: 'HIS/EMR', status: 'Delivered', sentAt: '2024-01-14T14:31:00Z', responseCode: 'AA', retryCount: 0,
      payload: 'MSH|^~\\&|RIS|HOSP|HIS|HOSP|202401141430||ORU^R01|MSG001|P|2.5.1\rPID|1||MRN-10047^^^SPH^MR||Johnson^Marcus^A||19880709|M\rOBR|1|ORD-005|ACC-2024-00105|70551^MRI Brain w/o Contrast^CPT|||202401141100\rOBX|1|TX|70551&IMP^Impression||1. No acute findings. 2. Mild chronic microvascular changes.||||||F'
    },
    {
      id: 'MSG-002', type: 'HL7 ORM', trigger: 'O01', direction: 'Outbound', accession: 'ACC-2024-00101',
      destination: 'Modality Worklist Server (DCM4CHEE)', status: 'Delivered', sentAt: '2024-01-15T08:31:30Z', responseCode: 'AA', retryCount: 0,
      payload: 'MSH|^~\\&|RIS_SYSTEM|SPH_RAD|MWL_SCP|SPH_PACS|20240115083115||ORM^O01^ORM_O01|MSG20240115002|P|2.5.1\rPID|1||MRN-10045^^^SPH^MR||Chen^Robert||19650314|M\rORC|NW|ORD-001|ACC-2024-00101||SC||^^^20240116093000\rOBR|1|ORD-001|ACC-2024-00101|70551^MRI Brain w/o Contrast^CPT'
    },
    {
      id: 'MSG-003', type: 'HL7 ADT', trigger: 'A08', direction: 'Outbound', accession: 'ACC-2024-00103',
      destination: 'Enterprise MPI', status: 'Delivered', sentAt: '2024-01-16T09:10:45Z', responseCode: 'AA', retryCount: 0,
      payload: 'MSH|^~\\&|RIS_SYSTEM|SPH_RAD|EMPI_SERVER|SPH_CORP|20240116091012||ADT^A08^ADT_A08|MSG20240116003|P|2.5.1\rPID|1||MRN-10047^^^SPH^MR||Johnson^Marcus^A||19880709|M|||789 Pine Ridge Way^^Springfield^IL^62704\rPV1|1|E|RAD^ROOM-003^MAIN||||1234567^Carter^John^^^Dr'
    },
    {
      id: 'MSG-004', type: 'FHIR DiagnosticReport', trigger: 'diagnosticreport-submit', direction: 'Outbound', accession: 'ACC-2024-00111',
      destination: 'FHIR Interop Gateway (SmileCDR)', status: 'Delivered', sentAt: '2024-01-14T17:05:00Z', responseCode: '201 Created', retryCount: 0,
      payload: '{"resourceType":"DiagnosticReport","id":"DR-ACC-2024-00111","status":"final","category":[{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0074","code":"RAD","display":"Radiology"}]}],"code":{"coding":[{"system":"http://www.ama-assn.org/go/cpt","code":"71275","display":"CT Angiography Chest w/ Contrast"}]},"subject":{"reference":"Patient/PAT-002","display":"Eleanor Vance"},"conclusion":"Negative for acute pulmonary embolism or aortic dissection."}'
    },
    {
      id: 'MSG-005', type: 'HL7 ORU', trigger: 'R01', direction: 'Outbound', accession: 'ACC-2024-00107',
      destination: 'Emergency Dept Tracking Board', status: 'Delivered', sentAt: '2024-01-15T16:10:20Z', responseCode: 'AA', retryCount: 0,
      payload: 'MSH|^~\\&|RIS_SYSTEM|SPH_RAD|ED_TRACK|SPH_ED|20240115161005||ORU^R01^ORU_R01|MSG20240115005|P|2.5.1\rPID|1||MRN-10051^^^SPH^MR||Pendelton^Arthur||19440118|M\rOBR|1|ORD-007|ACC-2024-00107|70450^CT Head w/o Contrast^CPT\rOBX|1|TX|70450&IMP^Preliminary Report||PRELIMINARY: No acute intracranial hemorrhage or mass effect.'
    },
    {
      id: 'MSG-006', type: 'FHIR ServiceRequest', trigger: 'servicerequest-create', direction: 'Outbound', accession: 'ACC-2024-00102',
      destination: 'State Cloud Imaging Registry', status: 'Retrying', sentAt: '2024-01-16T07:20:00Z', responseCode: '504 Gateway Timeout', retryCount: 2,
      payload: '{"resourceType":"ServiceRequest","id":"SR-ACC-2024-00102","status":"active","intent":"order","code":{"coding":[{"system":"http://www.ama-assn.org/go/cpt","code":"74177","display":"CT Abdomen/Pelvis w/ Contrast"}]},"subject":{"reference":"Patient/PAT-002"},"requester":{"display":"Dr. Gregory House"}}'
    },
    {
      id: 'MSG-007', type: 'HL7 ORM', trigger: 'O01', direction: 'Outbound', accession: 'ACC-2024-00109',
      destination: 'PACSCube Archive', status: 'Failed', sentAt: '2024-01-16T10:50:12Z', responseCode: 'AR', retryCount: 3,
      payload: 'MSH|^~\\&|RIS_SYSTEM|SPH_RAD|PACS_ARCHIVE|SPH_PACS|20240116105000||ORM^O01|MSG20240116007|P|2.5.1\rPID|1||MRN-10052^^^SPH^MR||O Connor^Grace^Miriam\rORC|NW|ORD-009|ACC-2024-00109'
    },
    {
      id: 'MSG-008', type: 'FHIR DiagnosticReport', trigger: 'diagnosticreport-update', direction: 'Outbound', accession: 'ACC-2024-00108',
      destination: 'Oncology Clinical Portal', status: 'Queued', sentAt: null, responseCode: null, retryCount: 0,
      payload: '{"resourceType":"DiagnosticReport","id":"DR-ACC-2024-00108","status":"registered","code":{"coding":[{"system":"http://www.ama-assn.org/go/cpt","code":"78306","display":"Bone Scan Whole Body"}]},"subject":{"reference":"Patient/PAT-005"}}'
    }
  ],

  // ---------------------------------------------------------------------------
  // Status History (15 entries) - Audit trail for order & report status transitions
  // ---------------------------------------------------------------------------
  statusHistory: [
    {
      id: 'SH-001', entityType: 'Order', entityId: 'ORD-005', fromStatus: 'Requested',
      toStatus: 'Scheduled', changedBy: 'System', changedAt: '2024-01-13T09:00:00Z', reason: 'Auto-scheduled via HL7 ORM'
    },
    {
      id: 'SH-002', entityType: 'Order', entityId: 'ORD-005', fromStatus: 'None',
      toStatus: 'Requested', changedBy: 'Dr. John Carter', changedAt: '2024-01-14T08:00:00Z', reason: 'Urgent order submitted via ED CPOE'
    },
    {
      id: 'SH-003', entityType: 'Order', entityId: 'ORD-005', fromStatus: 'Scheduled',
      toStatus: 'Arrived', changedBy: 'Front Desk (L. Adams)', changedAt: '2024-01-14T10:45:00Z', reason: 'Patient checked in at West Pavilion desk'
    },
    {
      id: 'SH-004', entityType: 'Order', entityId: 'ORD-005', fromStatus: 'Arrived',
      toStatus: 'In Progress', changedBy: 'Maria Rodriguez (Tech)', changedAt: '2024-01-14T11:00:00Z', reason: 'Patient positioned in MRI Suite A'
    },
    {
      id: 'SH-005', entityType: 'Order', entityId: 'ORD-005', fromStatus: 'In Progress',
      toStatus: 'Completed', changedBy: 'Maria Rodriguez (Tech)', changedAt: '2024-01-14T11:42:00Z', reason: 'Protocol completed, 186 images verified and pushed to PACS'
    },
    {
      id: 'SH-006', entityType: 'Order', entityId: 'ORD-005', fromStatus: 'Completed',
      toStatus: 'Draft Report', changedBy: 'Dr. James Wilson', changedAt: '2024-01-14T12:00:00Z', reason: 'Study claimed from unread queue, dictation begun'
    },
    {
      id: 'SH-007', entityType: 'Order', entityId: 'ORD-005', fromStatus: 'Draft Report',
      toStatus: 'Finalized', changedBy: 'Dr. James Wilson', changedAt: '2024-01-14T14:30:00Z', reason: 'Report reviewed, electronically signed, and distributed'
    },
    {
      id: 'SH-008', entityType: 'Order', entityId: 'ORD-007', fromStatus: 'Requested',
      toStatus: 'Scheduled', changedBy: 'System', changedAt: '2024-01-15T15:05:00Z', reason: 'STAT order fast-tracked directly to CT Suite B'
    },
    {
      id: 'SH-009', entityType: 'Order', entityId: 'ORD-007', fromStatus: 'Scheduled',
      toStatus: 'In Progress', changedBy: 'David Miller (Tech)', changedAt: '2024-01-15T15:28:00Z', reason: 'Emergency department patient table transfer'
    },
    {
      id: 'SH-010', entityType: 'Order', entityId: 'ORD-007', fromStatus: 'In Progress',
      toStatus: 'Completed', changedBy: 'David Miller (Tech)', changedAt: '2024-01-15T15:45:00Z', reason: 'Axial acquisition complete, images sent to PACS'
    },
    {
      id: 'SH-011', entityType: 'Order', entityId: 'ORD-007', fromStatus: 'Completed',
      toStatus: 'Preliminary', changedBy: 'Dr. James Wilson', changedAt: '2024-01-15T16:05:00Z', reason: 'Preliminary wet read phoned to ED attending Dr. Foreman'
    },
    {
      id: 'SH-012', entityType: 'Order', entityId: 'ORD-010', fromStatus: 'Requested',
      toStatus: 'Scheduled', changedBy: 'System', changedAt: '2024-01-08T10:30:00Z', reason: 'Outpatient routine scheduling confirmed via portal'
    },
    {
      id: 'SH-013', entityType: 'Order', entityId: 'ORD-010', fromStatus: 'Scheduled',
      toStatus: 'Cancelled', changedBy: 'Patient (via Portal)', changedAt: '2024-01-12T11:20:00Z', reason: 'Patient requested cancellation due to personal scheduling conflict'
    },
    {
      id: 'SH-014', entityType: 'Order', entityId: 'ORD-003', fromStatus: 'Requested',
      toStatus: 'Arrived', changedBy: 'ED Triage (Nurse B. Hayes)', changedAt: '2024-01-16T09:45:00Z', reason: 'STAT patient wheeled directly into General X-Ray Room 1'
    },
    {
      id: 'SH-015', entityType: 'Report', entityId: 'RPT-006', fromStatus: 'Finalized',
      toStatus: 'Amended', changedBy: 'Dr. Marcus Sterling', changedAt: '2024-01-16T12:15:00Z', reason: 'Amendment filed to clarify soft tissue vs osseous findings'
    }
  ],

  // ---------------------------------------------------------------------------
  // Procedures (10 catalog items) - Standard CPT procedure catalog
  // ---------------------------------------------------------------------------
  procedures: [
    { code: '70551', name: 'MRI Brain w/o Contrast', modality: 'MR', bodyPart: 'Brain', duration: 45, prepRequired: true, contrastRequired: false },
    { code: '74177', name: 'CT Abdomen/Pelvis w/ Contrast', modality: 'CT', bodyPart: 'Abdomen/Pelvis', duration: 30, prepRequired: true, contrastRequired: true },
    { code: '71046', name: 'Chest X-Ray 2 Views PA/LAT', modality: 'CR', bodyPart: 'Chest', duration: 15, prepRequired: false, contrastRequired: false },
    { code: '76700', name: 'Ultrasound Abdomen Complete', modality: 'US', bodyPart: 'Abdomen', duration: 30, prepRequired: true, contrastRequired: false },
    { code: '77067', name: 'Mammography Screening Bilateral', modality: 'MG', bodyPart: 'Breast', duration: 30, prepRequired: false, contrastRequired: false },
    { code: '70450', name: 'CT Head w/o Contrast', modality: 'CT', bodyPart: 'Head', duration: 20, prepRequired: false, contrastRequired: false },
    { code: '72148', name: 'MRI Lumbar Spine w/o Contrast', modality: 'MR', bodyPart: 'Lumbar Spine', duration: 45, prepRequired: true, contrastRequired: false },
    { code: '73562', name: 'X-Ray Knee 3 Views', modality: 'CR', bodyPart: 'Knee', duration: 15, prepRequired: false, contrastRequired: false },
    { code: '78306', name: 'Nuclear Medicine Bone Scan Whole Body', modality: 'NM', bodyPart: 'Whole Body', duration: 60, prepRequired: true, contrastRequired: true },
    { code: '71275', name: 'CT Angiography Chest w/ Contrast', modality: 'CT', bodyPart: 'Chest', duration: 30, prepRequired: true, contrastRequired: true }
  ]
};

// Global export for browser environments and Node.js
if (typeof window !== 'undefined') {
  window.MOCK_DATA = MOCK_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MOCK_DATA;
}
