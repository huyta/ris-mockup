import { RadiologyReport } from '../types/portal';

export const MOCK_REPORTS: Record<string, RadiologyReport> = {
  'REP-001': {
    id: 'REP-001',
    studyId: 'STUDY-1001',
    accessionNumber: 'ACC-2026-009812',
    orderItemId: 104821,
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    modality: 'MRI',
    bodyPart: 'Brain (With and Without Contrast)',
    studyDate: '2026-09-20',
    facility: 'SMG Medical Centre (Novena)',
    clinicalHistory: 'Headache for 3 months with intermittent visual blurring and tension. Rule out intracranial space-occupying lesion or vascular abnormality.',
    technique: 'Multi-planar, multi-sequence MRI of the brain was performed on a 3.0T Siemens Vida system. Sequences acquired include Axial T1 SE, T2 FSE, FLAIR, DWI, ADC map, and post-gadolinium T1 volumetric sequences. 3D MR Angiography of the Circle of Willis was also performed.',
    comparison: 'No previous imaging available for direct comparison.',
    findings: `1. BRAIN PARENCHYMA:
There is no focal intra-axial or extra-axial mass, acute territorial infarction, or hemorrhage. Gray-white matter differentiation is preserved. Normal signal intensity of the basal ganglia, internal capsules, and thalami.

2. VENTRICULAR SYSTEM & CISTERNS:
The lateral, third, and fourth ventricles are normal in size, shape, and midline configuration. Basal cisterns and cortical sulci are unremarkable for age. No midline shift or hydrocephalus.

3. DIFFUSION & CONTRAST:
No restricted diffusion on DWI/ADC to suggest acute ischemia. No abnormal intra-axial or dural enhancement following intravenous contrast administration.

4. SELLA & ORBITS:
Pituitary gland demonstrates normal height and convex superior contour within the sella. Optic chiasm and retro-orbital structures are within normal limits.

5. VASCULATURE (3D-MRA):
The intracranial internal carotid arteries, middle cerebral arteries, anterior cerebral arteries, basilar artery, and posterior cerebral arteries are patent with smooth luminal contours. No aneurysm, vascular malformation, or hemodynamically significant stenosis.

6. PARANASAL SINUSES & MASTOIDS:
Minimal mucosal thickening in the left maxillary sinus. Mastoid air cells are well-aerated bilaterally.`,
    impression: `1. Normal MRI brain examination. No acute infarction, hemorrhage, or intracranial mass lesion.
2. Normal 3D MR angiography of the intracranial Circle of Willis; no vascular malformation or aneurysm.
3. Mild incidental mucosal thickening in the left maxillary sinus.`,
    reportedBy: 'Dr. Michael Lee',
    radiologistTitle: 'Senior Consultant Radiologist (MBBS, FRCR, FAMS)',
    reportedDate: '2026-09-20',
    status: 'FINAL'
  },
  'REP-002': {
    id: 'REP-002',
    studyId: 'STUDY-1002',
    accessionNumber: 'ACC-2026-009740',
    orderItemId: 104712,
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    modality: 'MRI',
    bodyPart: 'Left Knee',
    studyDate: '2026-09-15',
    facility: 'SMG Medical Centre (Novena)',
    clinicalHistory: 'Twisting injury while playing badminton 2 weeks ago. Persistent medial joint line pain and catching sensation. Rule out meniscus or ACL tear.',
    technique: 'MRI of the left knee was performed in sagittal, coronal, and axial planes using proton density (PD) fat-suppressed and T1-weighted sequences without contrast.',
    comparison: 'None.',
    findings: `1. MENISCI:
Medial Meniscus: Linear hyperintense signal extending to the inferior articular surface on sagittal and coronal PD-FS sequences in the posterior horn, compatible with a Grade 3 horizontal cleavage tear. The anterior horn and body are preserved.
Lateral Meniscus: Normal morphology and low signal intensity throughout the anterior horn, body, and posterior horn. No tear.

2. LIGAMENTS & TENDONS:
Cruciate Ligaments: The Anterior Cruciate Ligament (ACL) demonstrates mild intrasubstance hyperintensity consistent with Grade 1 low-grade sprain, but fibers remain continuous and taut. The Posterior Cruciate Ligament (PCL) is intact with normal curvature.
Collateral Ligaments: Medial Collateral Ligament (MCL) and Lateral Collateral Ligament (LCL) complexes are intact without disruption.
Extensor Mechanism: Quadriceps tendon and patellar tendon are unremarkable.

3. CARTILAGE & BONE:
Mild articular cartilage fraying along the medial femoral condyle (Grade 2 chondromalacia). Small bone marrow contusion in the posterior medial tibial plateau.

4. JOINT SPACE:
Moderate joint effusion with mild synovitis. No loose bodies.`,
    impression: `1. Horizontal cleavage tear of the posterior horn of the medial meniscus.
2. Low-grade (Grade 1) sprain of the anterior cruciate ligament without mechanical rupture.
3. Moderate joint effusion and mild post-traumatic bone contusion in the medial tibial plateau.`,
    reportedBy: 'Dr. Michael Lee',
    radiologistTitle: 'Senior Consultant Radiologist (MBBS, FRCR, FAMS)',
    reportedDate: '2026-09-16',
    status: 'FINAL'
  },
  'REP-003': {
    id: 'REP-003',
    studyId: 'STUDY-1003',
    accessionNumber: 'ACC-2026-009110',
    orderItemId: 104105,
    patientId: 'P00010001',
    patientName: 'John Tan',
    patientDob: '1980-03-15',
    modality: 'X-Ray',
    bodyPart: 'Chest PA',
    studyDate: '2026-08-10',
    facility: 'SMG Medical Centre (Novena)',
    clinicalHistory: 'Annual executive health screening. Non-smoker. No cough or fever.',
    technique: 'Single frontal PA projection of the chest was obtained in the erect position.',
    comparison: 'Comparison with chest radiograph from 12 August 2025.',
    findings: `The lungs are clear bilaterally with no focal consolidation, pneumothorax, or pleural effusion.
Cardiothoracic ratio is within normal limits (< 0.50). Mediastinal and hilar contours are normal.
Both hemidiaphragms are smooth and sharp. Costophrenic sulci are clear.
Thoracic bony cage and visualised soft tissues are unremarkable.`,
    impression: `Normal chest radiograph. No active cardiopulmonary pathology.`,
    reportedBy: 'Dr. Michael Lee',
    radiologistTitle: 'Consultant Radiologist',
    reportedDate: '2026-08-10',
    status: 'FINAL'
  },
  'REP-004': {
    id: 'REP-004',
    studyId: 'STUDY-1004',
    accessionNumber: 'ACC-2026-008450',
    orderItemId: 103980,
    patientId: 'P00010008',
    patientName: 'Jane Wong',
    patientDob: '1975-01-12',
    modality: 'CT',
    bodyPart: 'Chest High Resolution (HRCT)',
    studyDate: '2026-09-22',
    facility: 'SMG Paragon Imaging',
    clinicalHistory: 'Chronic dry cough for 6 weeks following viral URI. Non-smoker.',
    technique: 'Helical volumetric CT scan of the thorax from lung apices to adrenal glands with sub-millimeter collimation in deep inspiration and selected expiratory views without IV contrast.',
    comparison: 'None.',
    findings: `Lungs show scattered subsegmental bronchial wall thickening in both lower lobes. No honeycombing, traction bronchiectasis, or architectural distortion. No pulmonary nodules larger than 3mm.
Mediastinal lymph nodes are within normal size limits. No pleural effusion or thickening. Visualised thyroid and upper abdominal viscera are unremarkable.`,
    impression: `1. Mild post-viral bronchial wall thickening in lower lobes without evidence of interstitial lung disease or bronchiectasis.
2. No suspicious pulmonary nodule.`,
    reportedBy: 'Dr. Michael Lee',
    radiologistTitle: 'Senior Consultant Radiologist',
    reportedDate: '2026-09-23',
    status: 'FINAL'
  },
  'REP-005': {
    id: 'REP-005',
    studyId: 'STUDY-1005',
    accessionNumber: 'ACC-2026-008120',
    orderItemId: 103600,
    patientId: 'P00010014',
    patientName: 'David Lim',
    patientDob: '1968-07-22',
    modality: 'Ultrasound',
    bodyPart: 'Hepatobiliary System (HBS)',
    studyDate: '2026-09-18',
    facility: 'SMG Medical Centre (Novena)',
    clinicalHistory: 'Elevated ALT/AST on routine blood test. Rule out fatty liver or gallstones.',
    technique: 'Real-time ultrasound evaluation of the upper abdomen was performed using curvilinear and linear transducers.',
    comparison: 'None.',
    findings: `The liver is mildly enlarged measuring 16.2 cm in midclavicular line with diffuse increase in parenchymal echogenicity and sound attenuation, consistent with moderate hepatic steatosis. No focal hepatic lesion or mass.
The gallbladder is well-distended with thin, smooth wall. No intraluminal calculi or sludge. Common bile duct measures 4.2 mm, within normal limits.
Pancreas and spleen appear normal. Bilateral kidneys show normal cortical thickness and echogenicity.`,
    impression: `1. Moderate hepatic steatosis (fatty liver). No focal liver mass.
2. Normal gallbladder without cholelithiasis or wall thickening.`,
    reportedBy: 'Dr. Michael Lee',
    radiologistTitle: 'Consultant Radiologist',
    reportedDate: '2026-09-18',
    status: 'FINAL'
  }
};
