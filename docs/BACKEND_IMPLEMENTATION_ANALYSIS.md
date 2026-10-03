# Backend Implementation Analysis: SMG Radiology Portal

## 1. Executive Summary

This document fulfills **Phase 1 (Backend Analysis)** of the SMG Radiology Portal Backend Implementation Plan (`BE_PLAN.MD`).

The objective is to implement a production-grade FastAPI backend with SQLite, SQLAlchemy 2.x, Alembic, and JWT Authentication that completely powers the existing React portal mockup (`HMI`). All mock data and simulated latencies in the frontend will be replaced with real RESTful HTTP APIs, while maintaining the existing UI aesthetics, workflows, and component contracts.

---

## 2. Existing System Inspection

### 2.1 Backend Status
- **Current State**: No backend exists in the repository. The frontend currently runs in standalone mode using mock data and in-memory simulated delay.
- **Python Runtime**: Python 3.11 / 3.13 virtual environment (`.venv`) is configured with `fastapi`, `uvicorn`, `sqlalchemy>=2.0`, `alembic`, `pydantic v2`, `pyjwt`, `bcrypt`, `httpx`, and `pytest`.

### 2.2 Frontend API & Service Layer
- **Core Service**: `src/services/portalService.ts` exports `portalService`, exposing:
  - `getCurrentUser()`
  - `loginAsPatient(patientId)`
  - `loginAsDoctor(doctorId)`
  - `login(user)`
  - `logout()`
  - `getPatients()`
  - `getPatientById(id)`
  - `getPatientsForDoctor(doctorId)`
  - `getAllStudies()`
  - `getPatientStudies(patientId, filters)`
  - `getDoctorStudies(doctorId, filters)`
  - `getStudy(studyId)`
  - `getStudySeries(studyId)`
  - `getReport(studyIdOrReportId)`
- **Domain Types**: `src/types/portal.ts` defines:
  - `PortalUser`, `UserRole` (`PATIENT`, `DOCTOR`, `RADIOLOGIST`)
  - `Patient`, `Doctor`
  - `ImagingStudy`, `StudySeries`, `StudyStatus`
  - `RadiologyReport`
  - `StudyFilterState`
- **State & Context**:
  - `AuthContext.tsx` handles current user session, quick login shortcuts, and role flags (`isPatient`, `isDoctor`).
  - `NavigationContext.tsx` manages client-side navigation.

### 2.3 Reusable Components & UI Integration Points
- `src/components/common/Header.tsx`: Displays active user, role indicator, and quick user switchers.
- `src/pages/auth/Login.tsx`: Login form with demo quick-select buttons for John Tan and Dr. Sarah Lim.
- `src/pages/patient/`:
  - `PatientDashboard.tsx`: Displays metric cards (total studies, recent studies, reports available, latest date).
  - `PatientStudies.tsx`: Study list with filters.
  - `PatientStudyDetails.tsx`: Study metadata and series breakdown.
  - `PatientViewer.tsx`: Canvas medical viewer (`MedicalViewer`).
  - `PatientReport.tsx`: Diagnostic letterhead radiology report (`RadiologyReportViewer`).
- `src/pages/doctor/`:
  - `DoctorDashboard.tsx`: Metrics for assigned patients, new studies, available reports.
  - `DoctorPatients.tsx` & `DoctorPatientDetails.tsx`: Assigned patients and their imaging history.
  - `DoctorStudies.tsx` & `DoctorStudyDetails.tsx`: Assigned study list with quick search and filters.
  - `DoctorViewer.tsx` & `DoctorReport.tsx`: Specialist image viewer and report inspection.

---

## 3. Recommended Architecture & Directory Structure

To keep commands like `python -m app.db.seed` and `uvicorn app.main:app` straightforward from the workspace root while preserving the React frontend in `src/`, the backend follows the layered design specified in `BE_PLAN.MD`:

```text
/Users/matt/Desktop/HMI/
├── app/
│   ├── main.py                     # FastAPI application instance, middleware, router mounts
│   ├── core/
│   │   ├── config.py               # Pydantic Settings (.env, JWT secrets, CORS)
│   │   ├── security.py             # Bcrypt hashing, PyJWT token creation/verification
│   │   ├── dependencies.py         # DB session, get_current_user, role authorization
│   │   ├── logging.py              # Structured request logging middleware
│   │   └── exceptions.py           # Centralized exception handlers
│   ├── db/
│   │   ├── database.py             # SQLAlchemy 2.0 Engine & sessionmaker
│   │   ├── models/                 # SQLAlchemy ORM declarative models
│   │   │   ├── __init__.py
│   │   │   ├── user.py             # User model & roles
│   │   │   ├── patient.py          # Patient demographics
│   │   │   ├── doctor.py           # Doctor profiles
│   │   │   ├── study.py            # ImagingStudy model
│   │   │   ├── series.py           # StudySeries & StudyImage models
│   │   │   ├── assignment.py       # StudyAssignment model
│   │   │   ├── report.py           # RadiologyReport model
│   │   │   └── audit.py            # AuditLog model
│   │   └── seed.py                 # Idempotent database seeder with demo accounts & studies
│   ├── schemas/
│   │   ├── auth.py                 # LoginRequest, TokenResponse, CurrentUserResponse
│   │   ├── patient.py              # Patient schemas
│   │   ├── doctor.py               # Doctor schemas
│   │   ├── study.py                # ImagingStudy, Series, Image schemas
│   │   ├── report.py               # RadiologyReport schemas
│   │   ├── dashboard.py            # Patient & Doctor dashboard response schemas
│   │   └── common.py               # PaginatedResponse[T], ErrorResponse
│   ├── repositories/
│   │   ├── user_repository.py
│   │   ├── patient_repository.py
│   │   ├── doctor_repository.py
│   │   ├── study_repository.py
│   │   └── report_repository.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── patient_service.py
│   │   ├── doctor_service.py
│   │   ├── study_service.py
│   │   ├── report_service.py
│   │   └── viewer_service.py       # Abstraction for Mock vs Future MedDream viewer
│   └── api/
│       └── v1/
│           ├── auth.py
│           ├── patient.py
│           └── doctor.py
├── alembic/                        # Database migration scripts
├── tests/                          # Pytest automated test suite
├── docs/
│   └── API_CONTRACT.md             # Formal frozen API contract
├── .env.example
├── alembic.ini
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

---

## 4. Database Schema & Entity Relationships

The relational design in SQLite (`smg_radiology.db`) uses clean foreign keys and indexes:

1. **`users`**: Authentication credentials, username, role (`PATIENT`, `DOCTOR`, `ADMIN`), active status.
2. **`patients`**: Links to `users.id` via 1-to-1 relationship. Contains `patient_number` (e.g. `P00010001`), full name, DOB, gender, phone, email, address, NRIC.
3. **`doctors`**: Links to `users.id` via 1-to-1 relationship. Contains `doctor_number` (e.g. `D00021`), full name, specialty, clinic, email, phone.
4. **`imaging_studies`**: Foreign key to `patients.id`. Holds `accession_number`, `study_date`, `modality`, `body_part`, `study_description`, `facility`, `radiologist_name`, `status` (`SCHEDULED`, `IN_PROGRESS`, `REPORTED`), and clinical history.
5. **`study_series`**: Foreign key to `imaging_studies.id`. Stores series metadata (series number, description, modality, plane).
6. **`study_images`**: Foreign key to `study_series.id`. Stores instance numbers, image URLs, and thumbnails.
7. **`study_assignments`**: Many-to-many relationship linking `imaging_studies.id` to `doctors.id`, with assignment timestamp and active flag. Essential for external specialist authorization.
8. **`radiology_reports`**: Foreign key to `imaging_studies.id`. Clinical history, technique, comparison, findings, impression, reported by, reported date, and status (`DRAFT`, `FINAL`).
9. **`audit_logs`**: Tracks user access (`VIEW_STUDY`, `VIEW_REPORT`, `LOGIN`, etc.) for HIPAA/GDPR clinical compliance readiness.

---

## 5. Security & Authorization Rules

1. **Patient Authorization**:
   - Patient users can **only** access studies where `imaging_studies.patient_id == current_user.patient_id`.
   - Access to unowned studies returns `404 Not Found` (to prevent ID enumeration).
2. **Doctor Authorization**:
   - Referring doctors can **only** access studies where an active entry exists in `study_assignments` for `doctor_id == current_user.doctor_id`.
   - Doctor patient list only returns patients with at least one study assigned to the doctor.
   - Access to unassigned studies or unassigned patients returns `404 Not Found`.
3. **Role Checks**:
   - Patients attempting to call `/api/v1/doctor/*` receive `403 Forbidden`.
   - Doctors attempting to call `/api/v1/patient/*` receive `403 Forbidden`.
4. **Token Security**:
   - Passwords stored as Bcrypt salted hashes.
   - JWT tokens signed with HS256 algorithm and validated per request via FastAPI HTTPBearer dependencies.

---

## 6. Frontend Integration Plan

1. **`src/services/apiClient.ts`**:
   - Provide standard HTTP client with automatic `Authorization: Bearer <token>` injection.
   - Handle base URL configuration via `import.meta.env.VITE_API_BASE_URL` (default: `http://localhost:8000/api/v1`).
   - Automatically parse API errors and handle 401 token expiry.
2. **`src/services/portalService.ts`**:
   - Adapt existing service methods to call the backend endpoints.
   - Convert backend camelCase/snake_case responses to match the TypeScript interfaces in `src/types/portal.ts`.
3. **`src/context/AuthContext.tsx`**:
   - Maintain JWT token in `localStorage`.
   - On initialization, call `GET /api/v1/auth/me` to restore the active session.
   - Update `loginAsPatient` and `loginAsDoctor` to authenticate with credentials (`demo123`).

---

## 7. Files to Create and Modify

### Backend Files to Create:
- `.env.example`, `.env`
- `requirements.txt`
- `alembic.ini`
- `alembic/env.py`, `alembic/script.py.mako`
- `app/main.py`
- `app/core/config.py`, `security.py`, `dependencies.py`, `logging.py`, `exceptions.py`
- `app/db/database.py`
- `app/db/models/__init__.py`, `user.py`, `patient.py`, `doctor.py`, `study.py`, `series.py`, `assignment.py`, `report.py`, `audit.py`
- `app/db/seed.py`
- `app/schemas/common.py`, `auth.py`, `patient.py`, `doctor.py`, `study.py`, `report.py`, `dashboard.py`
- `app/repositories/user_repository.py`, `patient_repository.py`, `doctor_repository.py`, `study_repository.py`, `report_repository.py`
- `app/services/auth_service.py`, `patient_service.py`, `doctor_service.py`, `study_service.py`, `report_service.py`, `viewer_service.py`
- `app/api/v1/auth.py`, `patient.py`, `doctor.py`
- `tests/conftest.py`, `test_auth.py`, `test_patients.py`, `test_doctors.py`, `test_security.py`
- `docs/API_CONTRACT.md`
- `Dockerfile`, `docker-compose.yml`

### Frontend Files to Modify:
- `src/services/apiClient.ts` (new file)
- `src/services/portalService.ts` (replace mock delays with apiClient calls)
- `src/context/AuthContext.tsx` (connect to backend JWT login & /auth/me)
- `src/pages/auth/Login.tsx` (support direct username/password form submission alongside quick demo buttons)

---

## 8. Next Steps & Approval

With this analysis complete, proceed immediately to:
- **Phase 2**: FastAPI Foundation (configuration, core security, DB setup, logging, health check)
- **Phase 3**: Database Models, Alembic Migrations, and Seed Data
- **Phase 4**: Authentication APIs & Security
- **Phase 5 & 6**: Patient & Doctor APIs with strict authorization
- **Phase 7 & 8**: React Integration
- **Phase 9**: Automated Test Suite, Build Validation & Final Demo Verification
