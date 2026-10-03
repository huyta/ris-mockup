# SMG Radiology Portal — Frozen API Contract v1

This document specifies the frozen REST API contract for the SMG Radiology Portal between the React frontend and the FastAPI backend.

Base URL (Local): `http://localhost:8000/api/v1`  
Production Target: `https://api.smgradiology.sg/api/v1`

All authenticated requests require standard HTTP Bearer token:
```http
Authorization: Bearer <jwt_access_token>
```

---

## 1. Authentication

### 1.1 Login
* **Method**: `POST`
* **Path**: `/auth/login`
* **Auth**: Public
* **Request Body**:
  ```json
  {
    "username": "john.tan",
    "password": "demo123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "username": "john.tan",
      "email": "john.tan@example.com",
      "name": "John Tan",
      "role": "PATIENT",
      "patient_id": 1,
      "patient_number": "P00010001",
      "doctor_id": null,
      "doctor_number": null,
      "facility": "SMG Medical Centre (Novena)",
      "specialty": null,
      "avatar_url": "https://..."
    }
  }
  ```
* **Error Responses**:
  * `401 Unauthorized`: `{"detail": "Invalid username or password"}`
  * `422 Unprocessable Entity`: Request body validation failed.

### 1.2 Current User Profile
* **Method**: `GET`
* **Path**: `/auth/me`
* **Auth**: Bearer Token
* **Success Response (200 OK)**:
  Same schema as `user` object in Login response.
* **Error Responses**:
  * `401 Unauthorized`: Token invalid, expired, or missing.

---

## 2. Patient Portal Endpoints

> **Authorization Rule**: Patient endpoints strictly enforce `current_user.role == 'PATIENT'`. All data returned is automatically scoped to the authenticated patient's profile (`patient_id`). Frontend cannot query other patients' studies.

### 2.1 Patient Dashboard
* **Method**: `GET`
* **Path**: `/patient/dashboard`
* **Auth**: Bearer Token (Patient)
* **Success Response (200 OK)**:
  ```json
  {
    "total_studies": 8,
    "recent_studies": 8,
    "reports_available": 6,
    "latest_study_date": "2026-10-05"
  }
  ```

### 2.2 Patient Studies List
* **Method**: `GET`
* **Path**: `/patient/studies`
* **Auth**: Bearer Token (Patient)
* **Query Parameters**:
  * `page`: integer (default 1)
  * `page_size`: integer (default 20, max 100)
  * `modality`: string (e.g. `MRI`, `CT`, `X-Ray`, `Ultrasound`, `Mammogram`, `PET/CT`)
  * `status`: string (`SCHEDULED`, `IN_PROGRESS`, `REPORTED`)
  * `body_part`: string (case-insensitive substring)
  * `date_from`: string (`YYYY-MM-DD`)
  * `date_to`: string (`YYYY-MM-DD`)
  * `search`: string (keyword across accession number, description, modality, body part)
  * `sort_by`: string (`study_date`, `modality`, `accession_number`, `status`)
  * `sort_order`: string (`asc` or `desc`, default `desc`)
* **Success Response (200 OK)**:
  ```json
  {
    "items": [
      {
        "id": 1,
        "patient_id": 1,
        "patient_number": "P00010001",
        "patient_name": "John Tan",
        "patient_dob": "1980-03-15",
        "gender": "Male",
        "accession_number": "ACC-2026-009812",
        "study_date": "2026-09-20",
        "modality": "MRI",
        "body_part": "Brain",
        "description": "MRI Brain with and without contrast + MRA Circle of Willis",
        "facility": "SMG Medical Centre (Novena)",
        "radiologist": "Dr. Michael Lee",
        "status": "REPORTED",
        "has_report": true,
        "report_id": 1,
        "referring_doctor_name": "Dr. James Wong",
        "assigned_doctor_ids": ["D00025"]
      }
    ],
    "page": 1,
    "page_size": 20,
    "total": 8
  }
  ```

### 2.3 Patient Study Detail
* **Method**: `GET`
* **Path**: `/patient/studies/{study_id}`
* **Auth**: Bearer Token (Patient)
* **Authorization**: Returns `404 Not Found` if study does not exist OR does not belong to the authenticated patient.
* **Success Response (200 OK)**:
  Contains study metadata plus `clinical_history` and `series` list.

### 2.4 Patient Study Viewer
* **Method**: `GET`
* **Path**: `/patient/studies/{study_id}/viewer`
* **Auth**: Bearer Token (Patient)
* **Success Response (200 OK)**:
  ```json
  {
    "study": { ... },
    "series": [
      {
        "id": 1,
        "series_number": 1,
        "description": "Axial T2 FSE (5mm)",
        "modality": "MRI",
        "plane": "Axial",
        "thumbnail_url": "data:image/svg+xml;...",
        "slice_thickness": "3.0mm",
        "kvp": "120",
        "images": [
          "data:image/svg+xml;...",
          "data:image/svg+xml;..."
        ]
      }
    ],
    "viewer": {
      "type": "MOCK",
      "url": null
    }
  }
  ```

### 2.5 Patient Study Report
* **Method**: `GET`
* **Path**: `/patient/studies/{study_id}/report`
* **Auth**: Bearer Token (Patient)
* **Authorization**: Returns `404 Not Found` if study does not belong to the patient or report is not finalized/available.
* **Success Response (200 OK)**:
  ```json
  {
    "id": 1,
    "study_id": 1,
    "accession_number": "ACC-2026-009812",
    "order_item_id": 104821,
    "patient_id": "P00010001",
    "patient_name": "John Tan",
    "patient_dob": "1980-03-15",
    "modality": "MRI",
    "body_part": "Brain",
    "study_date": "2026-09-20",
    "facility": "SMG Medical Centre (Novena)",
    "clinical_history": "Headache for 3 months with intermittent visual blurring...",
    "technique": "Multi-planar, multi-sequence MRI of the brain was performed on a 3.0T...",
    "comparison": "No previous imaging available for direct comparison.",
    "findings": "1. BRAIN PARENCHYMA:\n...",
    "impression": "1. Normal MRI brain examination...",
    "reported_by": "Dr. Michael Lee",
    "radiologist_title": "Senior Consultant Radiologist (MBBS, FRCR, FAMS)",
    "reported_date": "2026-09-20",
    "status": "FINAL"
  }
  ```

---

## 3. Doctor Portal Endpoints

> **Authorization Rule**: Doctor endpoints strictly enforce `current_user.role in ['DOCTOR', 'RADIOLOGIST', 'ADMIN']`. Studies and patient lists are strictly filtered to those assigned to the authenticated doctor via `study_assignments`.

### 3.1 Doctor Dashboard
* **Method**: `GET`
* **Path**: `/doctor/dashboard`
* **Auth**: Bearer Token (Doctor)
* **Success Response (200 OK)**:
  ```json
  {
    "assigned_patients": 4,
    "new_studies": 3,
    "reports_available": 7
  }
  ```

### 3.2 Doctor Patients List
* **Method**: `GET`
* **Path**: `/doctor/patients`
* **Auth**: Bearer Token (Doctor)
* **Query Parameters**:
  * `page`, `page_size`, `search`, `date_from`, `date_to`
* **Success Response (200 OK)**:
  Returns only patients who have at least one study assigned to the doctor.

### 3.3 Doctor Patient Detail
* **Method**: `GET`
* **Path**: `/doctor/patients/{patient_id}`
* **Auth**: Bearer Token (Doctor)
* **Authorization**: Returns `404 Not Found` if the doctor does not have any active study assignment for this patient.
* **Success Response (200 OK)**:
  ```json
  {
    "patient": {
      "id": 1,
      "patient_number": "P00010001",
      "first_name": "John",
      "last_name": "Tan",
      "full_name": "John Tan",
      "date_of_birth": "1980-03-15",
      "gender": "Male",
      "phone": "+65 9123 4567",
      "email": "john.tan@example.com",
      "address": "Blk 124 Bishan St 12 #08-412, Singapore 570124",
      "nric_passport": "S****123A"
    },
    "study_count": 5,
    "studies": [ ... ]
  }
  ```

### 3.4 Doctor Studies List
* **Method**: `GET`
* **Path**: `/doctor/studies`
* **Auth**: Bearer Token (Doctor)
* **Query Parameters**:
  * `patient_id`: string
  * `patient_name`: string
  * `accession_number`: string
  * `modality`: string
  * `body_part`: string
  * `status`: string
  * `date_from`: string
  * `date_to`: string
  * `referring_physician`: string
  * `search`: string
  * `sort_by`, `sort_order`, `page`, `page_size`
* **Success Response (200 OK)**:
  Returns paginated list of studies assigned to the doctor.

### 3.5 Doctor Study Detail
* **Method**: `GET`
* **Path**: `/doctor/studies/{study_id}`
* **Auth**: Bearer Token (Doctor)
* **Authorization**: Returns `404 Not Found` if study is not assigned to this doctor.

### 3.6 Doctor Study Viewer
* **Method**: `GET`
* **Path**: `/doctor/studies/{study_id}/viewer`
* **Auth**: Bearer Token (Doctor)
* **Authorization**: Returns `404 Not Found` if study is not assigned to this doctor.

### 3.7 Doctor Study Report
* **Method**: `GET`
* **Path**: `/doctor/studies/{study_id}/report`
* **Auth**: Bearer Token (Doctor)
* **Authorization**: Returns `404 Not Found` if study is not assigned to this doctor.

---

## 4. System & Health Endpoints

### 4.1 Health Check
* **Method**: `GET`
* **Path**: `/health`
* **Auth**: Public
* **Success Response (200 OK)**:
  ```json
  {
    "status": "healthy"
  }
  ```
