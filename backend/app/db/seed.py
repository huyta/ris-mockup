from datetime import datetime, timezone
import logging
from sqlalchemy.orm import Session

from app.db.database import SessionLocal, engine, Base
from app.db.models import (
    User,
    Patient,
    Doctor,
    ImagingStudy,
    StudySeries,
    StudyImage,
    StudyAssignment,
    RadiologyReport
)
from app.core.security import hash_password
from app.db.sample_images import create_medical_scan_svg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smg.seed")


def seed_database(db: Session) -> None:
    logger.info("Starting deterministic database seed...")

    # Ensure tables exist
    Base.metadata.create_all(bind=db.get_bind())

    # 1. Users
    user_definitions = [
        {
            "username": "john.tan",
            "email": "john.tan@example.com",
            "password": "demo123",
            "role": "PATIENT"
        },
        {
            "username": "sarah.lim",
            "email": "sarah.lim@orthocare.sg",
            "password": "demo123",
            "role": "DOCTOR"
        },
        {
            "username": "james.wong",
            "email": "james.wong@neuromed.sg",
            "password": "demo123",
            "role": "DOCTOR"
        },
        {
            "username": "emily.tan",
            "email": "emily.tan@smgcare.sg",
            "password": "demo123",
            "role": "DOCTOR"
        },
        {
            "username": "michael.lee",
            "email": "michael.lee@smgrad.com",
            "password": "demo123",
            "role": "DOCTOR"
        }
    ]

    users_map = {}
    for u_def in user_definitions:
        user = db.query(User).filter(User.username == u_def["username"]).first()
        if not user:
            user = User(
                username=u_def["username"],
                email=u_def["email"],
                password_hash=hash_password(u_def["password"]),
                role=u_def["role"],
                is_active=True
            )
            db.add(user)
            db.flush()
            logger.info(f"Created user: {user.username} ({user.role})")
        users_map[user.username] = user

    # 2. Patients
    patient_definitions = [
        {
            "patient_number": "P00010001",
            "first_name": "John",
            "last_name": "Tan",
            "date_of_birth": "1980-03-15",
            "gender": "Male",
            "phone": "+65 9123 4567",
            "email": "john.tan@example.com",
            "address": "Blk 124 Bishan St 12 #08-412, Singapore 570124",
            "nric_passport": "S****123A",
            "username": "john.tan"
        },
        {
            "patient_number": "P00010008",
            "first_name": "Jane",
            "last_name": "Wong",
            "date_of_birth": "1975-01-12",
            "gender": "Female",
            "phone": "+65 9234 5678",
            "email": "jane.wong@example.com",
            "address": "18 Orchard Boulevard #14-02, Singapore 248643",
            "nric_passport": "S****567B",
            "username": None
        },
        {
            "patient_number": "P00010014",
            "first_name": "David",
            "last_name": "Lim",
            "date_of_birth": "1968-07-22",
            "gender": "Male",
            "phone": "+65 9345 6789",
            "email": "david.lim@example.com",
            "address": "55 Tampines Central 1 #05-18, Singapore 529541",
            "nric_passport": "S****890C",
            "username": None
        },
        {
            "patient_number": "P00010022",
            "first_name": "Mary",
            "last_name": "Chen",
            "date_of_birth": "1992-11-04",
            "gender": "Female",
            "phone": "+65 9456 7890",
            "email": "mary.chen@example.com",
            "address": "88 River Valley Road #19-01, Singapore 179041",
            "nric_passport": "T****234D",
            "username": None
        },
        {
            "patient_number": "P00010035",
            "first_name": "Robert",
            "last_name": "Koh",
            "date_of_birth": "1959-09-30",
            "gender": "Male",
            "phone": "+65 9567 8901",
            "email": "robert.koh@example.com",
            "address": "32 Dunearn Road #03-08, Singapore 309425",
            "nric_passport": "S****678E",
            "username": None
        }
    ]

    patients_map = {}
    for p_def in patient_definitions:
        patient = db.query(Patient).filter(Patient.patient_number == p_def["patient_number"]).first()
        user_id = users_map[p_def["username"]].id if p_def["username"] else None
        if not patient:
            patient = Patient(
                patient_number=p_def["patient_number"],
                first_name=p_def["first_name"],
                last_name=p_def["last_name"],
                date_of_birth=p_def["date_of_birth"],
                gender=p_def["gender"],
                phone=p_def["phone"],
                email=p_def["email"],
                address=p_def["address"],
                nric_passport=p_def["nric_passport"],
                user_id=user_id
            )
            db.add(patient)
            db.flush()
            logger.info(f"Created patient: {patient.full_name} ({patient.patient_number})")
        patients_map[patient.patient_number] = patient

    # 3. Doctors
    doctor_definitions = [
        {
            "doctor_number": "D00021",
            "first_name": "Sarah",
            "last_name": "Lim",
            "specialty": "Orthopaedic Surgery & Sports Medicine",
            "clinic": "Singapore Sports & Orthopaedic Clinic",
            "email": "sarah.lim@orthocare.sg",
            "phone": "+65 6734 8812",
            "username": "sarah.lim"
        },
        {
            "doctor_number": "D00025",
            "first_name": "James",
            "last_name": "Wong",
            "specialty": "Neurology & Stroke Medicine",
            "clinic": "Novena Neuroscience Partners",
            "email": "james.wong@neuromed.sg",
            "phone": "+65 6250 1928",
            "username": "james.wong"
        },
        {
            "doctor_number": "D00030",
            "first_name": "Emily",
            "last_name": "Tan",
            "specialty": "Family Medicine & Health Screening",
            "clinic": "SMG Primary Care Clinic (Paragon)",
            "email": "emily.tan@smgcare.sg",
            "phone": "+65 6836 2911",
            "username": "emily.tan"
        },
        {
            "doctor_number": "D00001",
            "first_name": "Michael",
            "last_name": "Lee",
            "specialty": "Consultant Diagnostic Neuroradiologist",
            "clinic": "SMG Radiology Department",
            "email": "michael.lee@smgrad.com",
            "phone": "+65 6321 4455",
            "username": "michael.lee"
        }
    ]

    doctors_map = {}
    for d_def in doctor_definitions:
        doctor = db.query(Doctor).filter(Doctor.doctor_number == d_def["doctor_number"]).first()
        user_id = users_map[d_def["username"]].id if d_def["username"] else None
        if not doctor:
            doctor = Doctor(
                doctor_number=d_def["doctor_number"],
                first_name=d_def["first_name"],
                last_name=d_def["last_name"],
                specialty=d_def["specialty"],
                clinic=d_def["clinic"],
                email=d_def["email"],
                phone=d_def["phone"],
                user_id=user_id
            )
            db.add(doctor)
            db.flush()
            logger.info(f"Created doctor: {doctor.full_name} ({doctor.doctor_number})")
        doctors_map[doctor.doctor_number] = doctor

    # 4. Studies
    study_definitions = [
        # John Tan (P00010001) - 8 studies
        {
            "patient_number": "P00010001",
            "accession_number": "ACC-2026-009812",
            "study_date": "2026-09-20",
            "modality": "MRI",
            "body_part": "Brain",
            "description": "MRI Brain with and without contrast + MRA Circle of Willis",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Headache for 3 months with intermittent visual blurring. R/O intracranial mass.",
            "referring_doctor": "Dr. James Wong",
            "assigned_doctors": ["D00025"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Axial T2 FSE (5mm)",
                    "modality": "MRI",
                    "plane": "Axial",
                    "scan_type": "brain-axial",
                    "slices": 6,
                    "total": 24
                },
                {
                    "series_number": 2,
                    "description": "Sagittal T1 3D Volumetric",
                    "modality": "MRI",
                    "plane": "Sagittal",
                    "scan_type": "brain-sagittal",
                    "slices": 4,
                    "total": 30
                },
                {
                    "series_number": 3,
                    "description": "Coronal FLAIR Brain",
                    "modality": "MRI",
                    "plane": "Coronal",
                    "scan_type": "brain-coronal",
                    "slices": 3,
                    "total": 22
                }
            ],
            "report": {
                "order_item_id": 104821,
                "clinical_history": "Headache for 3 months with intermittent visual blurring and tension. Rule out intracranial space-occupying lesion or vascular abnormality.",
                "technique": "Multi-planar, multi-sequence MRI of the brain was performed on a 3.0T Siemens Vida system. Sequences acquired include Axial T1 SE, T2 FSE, FLAIR, DWI, ADC map, and post-gadolinium T1 volumetric sequences. 3D MR Angiography of the Circle of Willis was also performed.",
                "comparison": "No previous imaging available for direct comparison.",
                "findings": "1. BRAIN PARENCHYMA:\nThere is no focal intra-axial or extra-axial mass, acute territorial infarction, or hemorrhage. Gray-white matter differentiation is preserved. Normal signal intensity of the basal ganglia, internal capsules, and thalami.\n\n2. VENTRICULAR SYSTEM & CISTERNS:\nThe lateral, third, and fourth ventricles are normal in size, shape, and midline configuration. Basal cisterns and cortical sulci are unremarkable for age. No midline shift or hydrocephalus.\n\n3. DIFFUSION & CONTRAST:\nNo restricted diffusion on DWI/ADC to suggest acute ischemia. No abnormal intra-axial or dural enhancement following intravenous contrast administration.\n\n4. SELLA & ORBITS:\nPituitary gland demonstrates normal height and convex superior contour within the sella. Optic chiasm and retro-orbital structures are within normal limits.\n\n5. VASCULATURE (3D-MRA):\nThe intracranial internal carotid arteries, middle cerebral arteries, anterior cerebral arteries, basilar artery, and posterior cerebral arteries are patent with smooth luminal contours. No aneurysm, vascular malformation, or hemodynamically significant stenosis.\n\n6. PARANASAL SINUSES & MASTOIDS:\nMinimal mucosal thickening in the left maxillary sinus. Mastoid air cells are well-aerated bilaterally.",
                "impression": "1. Normal MRI brain examination. No acute infarction, hemorrhage, or intracranial mass lesion.\n2. Normal 3D MR angiography of the intracranial Circle of Willis; no vascular malformation or aneurysm.\n3. Mild incidental mucosal thickening in the left maxillary sinus.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-09-20",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010001",
            "accession_number": "ACC-2026-009740",
            "study_date": "2026-09-15",
            "modality": "MRI",
            "body_part": "Left Knee",
            "description": "MRI Left Knee non-contrast",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Sports injury playing badminton 2 weeks ago. Medial joint tenderness.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Sagittal PD FS Knee",
                    "modality": "MRI",
                    "plane": "Sagittal",
                    "scan_type": "knee-mri",
                    "slices": 3,
                    "total": 18
                },
                {
                    "series_number": 2,
                    "description": "Coronal T2 FS Knee",
                    "modality": "MRI",
                    "plane": "Coronal",
                    "scan_type": "knee-mri",
                    "slices": 2,
                    "total": 18
                }
            ],
            "report": {
                "order_item_id": 104712,
                "clinical_history": "Twisting injury while playing badminton 2 weeks ago. Persistent medial joint line pain and catching sensation. Rule out meniscus or ACL tear.",
                "technique": "MRI of the left knee was performed in sagittal, coronal, and axial planes using proton density (PD) fat-suppressed and T1-weighted sequences without contrast.",
                "comparison": "None.",
                "findings": "1. MENISCI:\nMedial Meniscus: Linear hyperintense signal extending to the inferior articular surface on sagittal and coronal PD-FS sequences in the posterior horn, compatible with a Grade 3 horizontal cleavage tear. The anterior horn and body are preserved.\nLateral Meniscus: Normal morphology and low signal intensity throughout the anterior horn, body, and posterior horn. No tear.\n\n2. LIGAMENTS & TENDONS:\nCruciate Ligaments: The Anterior Cruciate Ligament (ACL) demonstrates mild intrasubstance hyperintensity consistent with Grade 1 low-grade sprain, but fibers remain continuous and taut. The Posterior Cruciate Ligament (PCL) is intact with normal curvature.\nCollateral Ligaments: Medial Collateral Ligament (MCL) and Lateral Collateral Ligament (LCL) complexes are intact without disruption.\nExtensor Mechanism: Quadriceps tendon and patellar tendon are unremarkable.\n\n3. CARTILAGE & BONE:\nMild articular cartilage fraying along the medial femoral condyle (Grade 2 chondromalacia). Small bone marrow contusion in the posterior medial tibial plateau.",
                "impression": "1. Grade 3 horizontal cleavage tear involving the posterior horn of the medial meniscus.\n2. Grade 1 interstitial sprain of the anterior cruciate ligament without full-thickness disruption.\n3. Mild medial compartment chondromalacia.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-09-15",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010001",
            "accession_number": "ACC-2026-009110",
            "study_date": "2026-08-10",
            "modality": "X-Ray",
            "body_part": "Chest",
            "description": "Chest X-Ray PA Erect",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Routine pre-operative / health screening evaluation.",
            "referring_doctor": "Dr. Emily Tan",
            "assigned_doctors": ["D00030", "D00021"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Chest PA Erect",
                    "modality": "X-Ray",
                    "plane": "Coronal",
                    "scan_type": "chest-xray",
                    "slices": 1,
                    "total": 1
                }
            ],
            "report": {
                "order_item_id": 104102,
                "clinical_history": "Pre-operative evaluation. No active respiratory symptoms.",
                "technique": "Standard posteroanterior (PA) erect chest radiograph.",
                "comparison": "None.",
                "findings": "Lungs are clear bilaterally without focal consolidation, pleural effusion, or pneumothorax. Cardiothoracic ratio is normal (less than 50%). Mediastinum and hilar contours are unremarkable. Bony thorax and visualised soft tissues are intact.",
                "impression": "Normal chest radiograph. No acute cardiopulmonary abnormality.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-08-10",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010001",
            "accession_number": "ACC-2026-008900",
            "study_date": "2026-07-04",
            "modality": "CT",
            "body_part": "Abdomen & Pelvis",
            "description": "CT Abdomen & Pelvis with IV Contrast",
            "facility": "SMG Paragon Imaging",
            "radiologist": "Dr. Michael Lee",
            "status": "IN_PROGRESS",
            "clinical_history": "Recurrent right lower quadrant discomfort.",
            "referring_doctor": "Dr. Emily Tan",
            "assigned_doctors": ["D00030"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Axial Abdomen Venous Phase",
                    "modality": "CT",
                    "plane": "Axial",
                    "scan_type": "brain-axial",
                    "slices": 1,
                    "total": 40
                }
            ]
        },
        {
            "patient_number": "P00010001",
            "accession_number": "ACC-2026-007800",
            "study_date": "2026-05-18",
            "modality": "Ultrasound",
            "body_part": "Abdomen",
            "description": "Ultrasound Hepatobiliary & Renal",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Screening for fatty liver and renal calculi.",
            "referring_doctor": "Dr. Emily Tan",
            "assigned_doctors": ["D00030"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Liver & Gallbladder B-Mode",
                    "modality": "Ultrasound",
                    "plane": "Coronal",
                    "scan_type": "knee-mri",
                    "slices": 1,
                    "total": 10
                }
            ],
            "report": {
                "order_item_id": 103980,
                "clinical_history": "Screening examination. Mild elevated ALT.",
                "technique": "Real-time grayscale sonography of the upper abdomen.",
                "comparison": "None.",
                "findings": "Liver: Diffusely increased echogenicity with mild posterior sound attenuation, compatible with mild diffuse hepatic steatosis (fatty liver). No focal hepatic mass or intrahepatic biliary duct dilation.\nGallbladder: Normal wall thickness. No gallstone or acoustic shadowing.\nSpleen & Pancreas: Unremarkable.\nKidneys: Both kidneys demonstrate normal size and cortical thickness. No hydronephrosis, calculus, or solid mass.",
                "impression": "1. Mild diffuse hepatic steatosis (Grade 1 fatty liver).\n2. Otherwise normal upper abdominal sonography.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-05-18",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010001",
            "accession_number": "ACC-2026-006200",
            "study_date": "2026-03-11",
            "modality": "X-Ray",
            "body_part": "Lumbar Spine",
            "description": "X-Ray Lumbar Spine AP & Lateral",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Mechanical lower back strain.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021"],
            "series": [
                {
                    "series_number": 1,
                    "description": "L-Spine AP & Lateral",
                    "modality": "X-Ray",
                    "plane": "Sagittal",
                    "scan_type": "chest-xray",
                    "slices": 1,
                    "total": 2
                }
            ],
            "report": {
                "order_item_id": 102910,
                "clinical_history": "Lower back pain following lifting heavy weights.",
                "technique": "AP and lateral radiographs of the lumbar spine.",
                "comparison": "None.",
                "findings": "Vertebral body heights and alignment are preserved. Normal lumbar lordosis. Mild disk space narrowing at L5-S1 with early anterior osteophyte formation. Posterior elements and pedicles are intact.",
                "impression": "Mild degenerative disk disease at L5-S1. No acute fracture or spondylolisthesis.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-03-11",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010001",
            "accession_number": "ACC-2026-005110",
            "study_date": "2026-01-20",
            "modality": "MRI",
            "body_part": "Cervical Spine",
            "description": "MRI Cervical Spine non-contrast",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Neck stiffness and right arm radicular tingling.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021", "D00025"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Sagittal T2 C-Spine",
                    "modality": "MRI",
                    "plane": "Sagittal",
                    "scan_type": "knee-mri",
                    "slices": 1,
                    "total": 14
                }
            ],
            "report": {
                "order_item_id": 101820,
                "clinical_history": "Neck pain radiating into right thumb and index finger.",
                "technique": "Sagittal and axial T1 and T2 weighted imaging of the cervical spine.",
                "comparison": "None.",
                "findings": "Normal cervical alignment. At C5-C6, small right paracentral/foraminal disc protrusion causing mild right neural foraminal narrowing and potential irritation of exiting right C6 nerve root. Cervical spinal cord is normal in caliber and signal intensity.",
                "impression": "Small C5-C6 right paracentral disc protrusion with mild foraminal stenosis.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-01-20",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010001",
            "accession_number": "ACC-2026-009950",
            "study_date": "2026-10-05",
            "modality": "MRI",
            "body_part": "Right Shoulder",
            "description": "MRI Right Shoulder Arthrogram",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "SCHEDULED",
            "clinical_history": "Upcoming rotator cuff follow-up.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021"],
            "series": []
        },

        # Jane Wong (P00010008)
        {
            "patient_number": "P00010008",
            "accession_number": "ACC-2026-008450",
            "study_date": "2026-09-22",
            "modality": "CT",
            "body_part": "Chest",
            "description": "HRCT Thorax non-contrast",
            "facility": "SMG Paragon Imaging",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Chronic cough for 6 weeks. Rule out bronchiectasis.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021", "D00030"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Axial High Resolution Thorax",
                    "modality": "CT",
                    "plane": "Axial",
                    "scan_type": "chest-xray",
                    "slices": 1,
                    "total": 50
                }
            ],
            "report": {
                "order_item_id": 104230,
                "clinical_history": "Persistent non-productive cough for 6 weeks.",
                "technique": "High-resolution computed tomography of the chest without intravenous contrast.",
                "comparison": "None.",
                "findings": "No evidence of bronchiectasis, honeycombing, or interstitial lung disease. Trachea and mainstem bronchi are patent. Minimal tree-in-bud opacities in the right middle lobe, likely infectious or post-inflammatory.",
                "impression": "Mild right middle lobe bronchiolitis. No underlying interstitial lung disease or bronchiectasis.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-09-22",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010008",
            "accession_number": "ACC-2026-007120",
            "study_date": "2026-08-14",
            "modality": "Mammogram",
            "body_part": "Bilateral Breasts",
            "description": "Digital 3D Tomosynthesis Mammography & Ultrasound",
            "facility": "SMG Breast Diagnostic Centre",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Annual bilateral screening mammography.",
            "referring_doctor": "Dr. Emily Tan",
            "assigned_doctors": ["D00030"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Bilateral MLO & CC Views",
                    "modality": "Mammogram",
                    "plane": "Coronal",
                    "scan_type": "chest-xray",
                    "slices": 1,
                    "total": 4
                }
            ]
        },

        # David Lim (P00010014)
        {
            "patient_number": "P00010014",
            "accession_number": "ACC-2026-008120",
            "study_date": "2026-09-18",
            "modality": "Ultrasound",
            "body_part": "Abdomen",
            "description": "Ultrasound Hepatobiliary System (HBS)",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Fatty liver surveillance and abnormal LFTs.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Upper Abdomen Sonography",
                    "modality": "Ultrasound",
                    "plane": "Coronal",
                    "scan_type": "knee-mri",
                    "slices": 1,
                    "total": 8
                }
            ],
            "report": {
                "order_item_id": 104190,
                "clinical_history": "Fatty liver surveillance.",
                "technique": "Targeted ultrasound of the liver and biliary tree.",
                "comparison": "Previous study 1 year ago.",
                "findings": "Stable moderate diffuse hepatic steatosis without focal lesions. Gallbladder is acalculous. Normal portal venous flow.",
                "impression": "Stable moderate fatty liver disease. No focal suspicious liver lesion.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-09-18",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010014",
            "accession_number": "ACC-2026-009890",
            "study_date": "2026-09-29",
            "modality": "MRI",
            "body_part": "Right Knee",
            "description": "MRI Right Knee Joint",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "IN_PROGRESS",
            "clinical_history": "Knee effusion and joint locking post-fall.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Sagittal PD FS Knee",
                    "modality": "MRI",
                    "plane": "Sagittal",
                    "scan_type": "knee-mri",
                    "slices": 1,
                    "total": 16
                }
            ]
        },

        # Mary Chen (P00010022)
        {
            "patient_number": "P00010022",
            "accession_number": "ACC-2026-007620",
            "study_date": "2026-09-12",
            "modality": "MRI",
            "body_part": "Lumbar Spine",
            "description": "MRI Lumbar Spine + Sacroiliac Joints",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Inflammatory lower back stiffness. HLA-B27 positive.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Sagittal T1 & T2 STIR",
                    "modality": "MRI",
                    "plane": "Sagittal",
                    "scan_type": "knee-mri",
                    "slices": 1,
                    "total": 20
                }
            ],
            "report": {
                "order_item_id": 103850,
                "clinical_history": "Suspected ankylosing spondylitis / axial spondyloarthritis.",
                "technique": "MRI of the lumbar spine and bilateral sacroiliac joints with fat-suppressed STIR sequences.",
                "comparison": "None.",
                "findings": "Active subchondral bone marrow edema along both sides of the sacroiliac joints, predominantly right-sided, consistent with active sacroiliitis. Mild lumbar syndesmophyte formation at L1-L2.",
                "impression": "Bilateral active sacroiliitis consistent with axial spondyloarthritis.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-09-12",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010022",
            "accession_number": "ACC-2026-009988",
            "study_date": "2026-10-01",
            "modality": "X-Ray",
            "body_part": "Pelvis & Hips",
            "description": "Pelvis AP Erect",
            "facility": "SMG Medical Centre (Novena)",
            "radiologist": "Dr. Michael Lee",
            "status": "SCHEDULED",
            "clinical_history": "Assessment of sacroiliac joints.",
            "referring_doctor": "Dr. Sarah Lim",
            "assigned_doctors": ["D00021"],
            "series": []
        },

        # Robert Koh (P00010035)
        {
            "patient_number": "P00010035",
            "accession_number": "ACC-2026-006890",
            "study_date": "2026-09-08",
            "modality": "CT",
            "body_part": "Coronary Angiography",
            "description": "CT Coronary Angiogram & Calcium Score",
            "facility": "SMG Paragon Imaging",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Atypical angina on exertion. Agatston score calculation.",
            "referring_doctor": "Dr. James Wong",
            "assigned_doctors": ["D00025"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Coronary CTA 3D Volume Render",
                    "modality": "CT",
                    "plane": "3D",
                    "scan_type": "chest-xray",
                    "slices": 1,
                    "total": 1
                }
            ],
            "report": {
                "order_item_id": 103110,
                "clinical_history": "Chest discomfort on moderate exertion. Agatston score assessment.",
                "technique": "ECG-gated CT coronary angiography on dual-source 128-slice CT scanner.",
                "comparison": "None.",
                "findings": "Total Agatston Calcium Score is 42 (mild calcification). LAD demonstrates mild non-calcified plaque in mid-vessel with 25-30% stenosis. LCx and RCA are patent without significant stenosis. Left ventricular ejection fraction is preserved (approx 62%).",
                "impression": "Mild non-obstructive coronary artery disease. Calcium score: 42.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-09-08",
                "status": "FINAL"
            }
        },
        {
            "patient_number": "P00010035",
            "accession_number": "ACC-2026-005880",
            "study_date": "2026-07-28",
            "modality": "PET/CT",
            "body_part": "Whole Body",
            "description": "18F-FDG PET/CT Whole Body Oncology",
            "facility": "SMG Novena Oncology Imaging",
            "radiologist": "Dr. Michael Lee",
            "status": "REPORTED",
            "clinical_history": "Lymphoma staging follow-up.",
            "referring_doctor": "Dr. Emily Tan",
            "assigned_doctors": ["D00030"],
            "series": [
                {
                    "series_number": 1,
                    "description": "Whole Body MIP Projection",
                    "modality": "PET/CT",
                    "plane": "Coronal",
                    "scan_type": "brain-coronal",
                    "slices": 1,
                    "total": 1
                }
            ],
            "report": {
                "order_item_id": 102550,
                "clinical_history": "Follow-up post-chemotherapy for diffuse large B-cell lymphoma.",
                "technique": "Whole body 18F-FDG PET/CT from skull base to mid-thigh following IV injection of 250 MBq FDG.",
                "comparison": "Baseline PET/CT 6 months prior.",
                "findings": "Complete metabolic resolution of previously documented hypermetabolic cervical and mediastinal lymphadenopathy. No new hypermetabolic focus to suggest disease recurrence or metastatic disease.",
                "impression": "Complete metabolic response (Deauville Score 1). No evidence of active lymphoma.",
                "reported_by": "Dr. Michael Lee",
                "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
                "reported_date": "2026-07-28",
                "status": "FINAL"
            }
        }
    ]

    for s_def in study_definitions:
        patient = patients_map[s_def["patient_number"]]
        study = db.query(ImagingStudy).filter(ImagingStudy.accession_number == s_def["accession_number"]).first()
        if not study:
            study = ImagingStudy(
                patient_id=patient.id,
                accession_number=s_def["accession_number"],
                study_date=s_def["study_date"],
                modality=s_def["modality"],
                body_part=s_def["body_part"],
                study_description=s_def["description"],
                facility=s_def["facility"],
                radiologist_name=s_def["radiologist"],
                status=s_def["status"],
                clinical_history=s_def.get("clinical_history"),
                referring_doctor_name=s_def.get("referring_doctor")
            )
            db.add(study)
            db.flush()
            logger.info(f"Created study: {study.accession_number} ({study.modality} - {study.body_part})")

            # Series & Images
            for s_item in s_def.get("series", []):
                series = StudySeries(
                    study_id=study.id,
                    series_instance_uid=f"1.2.840.113619.2.{study.id}.{s_item['series_number']}",
                    series_number=s_item["series_number"],
                    description=s_item["description"],
                    modality=s_item["modality"],
                    plane=s_item["plane"],
                    thumbnail_url=create_medical_scan_svg(s_item["scan_type"], 1, s_item["total"]),
                    slice_thickness="5.0mm" if s_item["modality"] == "CT" else "3.0mm",
                    kvp="120"
                )
                db.add(series)
                db.flush()

                for img_idx in range(1, s_item["slices"] + 1):
                    image_svg = create_medical_scan_svg(s_item["scan_type"], img_idx, s_item["total"])
                    image = StudyImage(
                        series_id=series.id,
                        instance_number=img_idx,
                        image_url=image_svg,
                        thumbnail_url=image_svg
                    )
                    db.add(image)

            # Doctor assignments
            for doc_num in s_def.get("assigned_doctors", []):
                doctor = doctors_map.get(doc_num)
                if doctor:
                    assignment = StudyAssignment(
                        study_id=study.id,
                        doctor_id=doctor.id,
                        assigned_at=datetime.now(timezone.utc),
                        assigned_by="SYSTEM",
                        is_active=True
                    )
                    db.add(assignment)

            # Report
            rep_data = s_def.get("report")
            if rep_data:
                report = RadiologyReport(
                    study_id=study.id,
                    accession_number=study.accession_number,
                    order_item_id=rep_data.get("order_item_id"),
                    clinical_history=rep_data["clinical_history"],
                    technique=rep_data["technique"],
                    comparison=rep_data.get("comparison"),
                    findings=rep_data["findings"],
                    impression=rep_data["impression"],
                    reported_by=rep_data["reported_by"],
                    radiologist_title=rep_data.get("radiologist_title"),
                    reported_date=rep_data["reported_date"],
                    status=rep_data.get("status", "FINAL")
                )
                db.add(report)

    db.commit()
    logger.info("Deterministic database seed completed successfully!")


def main():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
