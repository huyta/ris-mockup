# SMG Radiology Portal

## FastAPI Backend + SQLite + React Mockup Integration Plan

## 1. Objective

Build a backend API for the existing SMG Radiology Portal mockup.

The backend will replace the frontend mock-data/service layer with real HTTP APIs while preserving the existing UI and user workflows.

### Technology

```text
Frontend
React
   │
   │ REST/JSON
   ▼
Backend
Python
FastAPI
   │
   ├── SQLAlchemy
   ├── Pydantic
   └── JWT Authentication
   │
   ▼
SQLite
```

Future production architecture:

```text
React
   │
   ▼
FastAPI
   │
   ├── Auth
   ├── Patient Portal
   ├── Doctor Portal
   ├── Study Service
   ├── Report Service
   └── Viewer Integration
          │
          ├── RIS
          ├── PACS
          └── MedDream
```

---

# 2. Scope

## In scope

Implement:

* Authentication
* Patient users
* Doctor users
* Patient profiles
* Doctor profiles
* Study management
* Study assignment
* Series metadata
* Report metadata/content
* Patient study APIs
* Doctor study APIs
* Search/filter APIs
* Study authorization
* Report access
* Viewer metadata
* Dashboard APIs
* SQLite database
* Database seed data
* OpenAPI/Swagger
* React API integration
* Error handling
* API validation
* Basic audit logging

## Out of scope

Do NOT implement yet:

* Real PACS integration
* DICOM C-FIND
* DICOM C-MOVE
* DICOMweb
* Real MedDream authentication
* Real DICOM image transfer
* HL7
* FHIR
* SMS
* Email
* Production SSO
* Production patient identity verification
* Billing
* Appointment scheduling
* Real report PDF generation

---

# 3. Main Design Principle

The API must reproduce the same workflows already demonstrated by the mockup.

Do NOT redesign the UI.

Current:

```text
React
   │
   ▼
Mock Service
   │
   ▼
Mock Data
```

Target:

```text
React
   │
   ▼
API Service
   │
   ▼
FastAPI
   │
   ▼
SQLite
```

The React component APIs should remain as similar as possible to the existing mock service APIs.

---

# 4. Repository Structure

If frontend and backend are currently separate repositories, keep them separate.

Recommended backend:

```text
smg-radiology-api/
│
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── dependencies.py
│   │
│   ├── db/
│   │   ├── database.py
│   │   ├── models/
│   │   └── seed.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── doctor.py
│   │   ├── study.py
│   │   ├── series.py
│   │   ├── report.py
│   │   └── dashboard.py
│   │
│   ├── repositories/
│   │   ├── user_repository.py
│   │   ├── patient_repository.py
│   │   ├── doctor_repository.py
│   │   ├── study_repository.py
│   │   └── report_repository.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── patient_service.py
│   │   ├── doctor_service.py
│   │   ├── study_service.py
│   │   ├── report_service.py
│   │   └── dashboard_service.py
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── patients.py
│   │       ├── doctors.py
│   │       ├── studies.py
│   │       ├── reports.py
│   │       └── dashboard.py
│   │
│   └── utils/
│       └── pagination.py
│
├── tests/
│   ├── test_auth.py
│   ├── test_patients.py
│   ├── test_doctors.py
│   ├── test_studies.py
│   └── test_reports.py
│
├── alembic/
│
├── .env.example
├── requirements.txt
├── alembic.ini
├── Dockerfile
└── README.md
```

Use the existing project's structure if the backend already exists.

---

# 5. Python Stack

Recommended:

```text
Python 3.12+
FastAPI
Uvicorn
SQLAlchemy 2.x
Alembic
Pydantic v2
pydantic-settings
python-jose OR PyJWT
passlib/bcrypt or pwdlib
pytest
httpx
```

Optional:

```text
python-multipart
```

if OAuth2 form authentication is used.

Do not add unnecessary dependencies.

---

# 6. Database

Use SQLite initially:

```text
smg_radiology.db
```

SQLAlchemy should be used rather than writing raw SQL throughout the application.

Database configuration:

```text
DATABASE_URL=sqlite:///./smg_radiology.db
```

The architecture must allow:

```text
SQLite
   ↓
PostgreSQL/MySQL
```

later by changing configuration and migration/database-specific details.

---

# 7. Database Model

Create the following core entities.

```text
User
Patient
Doctor
ImagingStudy
StudySeries
StudyAssignment
RadiologyReport
AuditLog
```

---

# 8. User Table

```text
users

id
username
email
password_hash
role
is_active
created_at
updated_at
```

Roles:

```text
PATIENT
DOCTOR
ADMIN
```

For the current demo only:

```text
PATIENT
DOCTOR
```

---

# 9. Patient Table

```text
patients

id
patient_number
first_name
last_name
date_of_birth
gender
phone
email
created_at
updated_at
```

Relationship:

```text
User
  │
  └── Patient
```

A patient user references:

```text
patients.id
```

---

# 10. Doctor Table

```text
doctors

id
doctor_number
first_name
last_name
specialty
email
phone
created_at
updated_at
```

Relationship:

```text
User
  │
  └── Doctor
```

---

# 11. Imaging Study

Create:

```text
imaging_studies

id
patient_id
accession_number
study_date
modality
body_part
study_description
facility
radiologist_name
status
clinical_history
created_at
updated_at
```

Status:

```text
SCHEDULED
IN_PROGRESS
REPORTED
```

Future statuses can be added without changing the API architecture.

---

# 12. Study Series

Create:

```text
study_series

id
study_id
series_instance_uid
series_number
description
modality
body_part
created_at
```

This represents DICOM series metadata.

Do NOT store real DICOM images in SQLite.

---

# 13. Study Images

For the mock viewer, optionally create:

```text
study_images

id
series_id
instance_number
image_url
thumbnail_url
created_at
```

For the first demo, these URLs can point to static demo images.

Future:

```text
image_url
      ↓
MedDream / PACS
```

---

# 14. Study Assignment

This is important for the External Specialist Portal.

Create:

```text
study_assignments

id
study_id
doctor_id
assigned_at
assigned_by
is_active
```

Relationship:

```text
Study
  │
  ├── Doctor A
  ├── Doctor B
  └── Doctor C
```

This supports your existing requirement that one order/study can be assigned to multiple external doctors.

---

# 15. Radiology Report

Create:

```text
radiology_reports

id
study_id
clinical_history
technique
findings
impression
reported_by
reported_date
status
created_at
updated_at
```

Status:

```text
DRAFT
FINAL
```

One study should normally have one current report for this demo.

Future versions can support report revisions.

---

# 16. Audit Log

Create a lightweight audit table:

```text
audit_logs

id
user_id
action
resource_type
resource_id
timestamp
metadata
```

Examples:

```text
VIEW_STUDY
VIEW_REPORT
OPEN_VIEWER
LOGIN
LOGOUT
```

This is particularly useful because the real system deals with patient medical information.

---

# 17. Relationships

Final database relationship:

```text
                    User
                  /      \
                 /        \
            Patient       Doctor
               │             │
               │             │
               ▼             │
          Imaging Study ◄────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
    Series           Assignment
       │                │
       ▼                ▼
    Images           Doctors
       │
       │
       ▼
     Viewer

Imaging Study
      │
      ▼
Radiology Report
```

---

# 18. Authentication API

## Login

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "username": "john.tan",
  "password": "demo123"
}
```

Response:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Tan",
    "role": "PATIENT"
  }
}
```

Use JWT for the demo.

---

# 19. Current User

```http
GET /api/v1/auth/me
```

Response:

```json
{
  "id": 1,
  "name": "John Tan",
  "role": "PATIENT",
  "patient_id": 1
}
```

React should use this endpoint to restore the session.

---

# 20. Patient Dashboard API

```http
GET /api/v1/patient/dashboard
```

Response:

```json
{
  "total_studies": 8,
  "recent_studies": 2,
  "reports_available": 8,
  "latest_study_date": "2026-09-20"
}
```

The API derives this from the authenticated patient.

The frontend must NOT send:

```text
patientId
```

for this endpoint.

The backend gets the patient from the JWT.

---

# 21. Patient Studies

```http
GET /api/v1/patient/studies
```

Query parameters:

```text
page
page_size
date_from
date_to
modality
status
search
```

Example:

```http
GET /api/v1/patient/studies?modality=MRI&status=REPORTED
```

Response:

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 8
}
```

---

# 22. Patient Study Detail

```http
GET /api/v1/patient/studies/{study_id}
```

The backend must verify:

```text
study.patient_id == current_user.patient_id
```

Otherwise:

```http
403 Forbidden
```

or preferably:

```http
404 Not Found
```

to avoid exposing whether another patient's study exists.

---

# 23. Study Viewer API

```http
GET /api/v1/patient/studies/{study_id}/viewer
```

Response:

```json
{
  "study": {},
  "series": [
    {
      "id": 1,
      "description": "Axial",
      "images": []
    },
    {
      "id": 2,
      "description": "Coronal",
      "images": []
    }
  ],
  "viewer": {
    "type": "MOCK",
    "url": null
  }
}
```

Future production:

```json
{
  "viewer": {
    "type": "MEDDREAM",
    "url": "..."
  }
}
```

The React viewer should not need to know how the viewer URL was generated.

---

# 24. Patient Report API

```http
GET /api/v1/patient/studies/{study_id}/report
```

Backend verifies patient ownership.

Response:

```json
{
  "id": 1,
  "study_id": 1,
  "status": "FINAL",
  "clinical_history": "...",
  "technique": "...",
  "findings": "...",
  "impression": "...",
  "reported_by": "Dr Michael Lee",
  "reported_date": "2026-09-20"
}
```

---

# 25. Doctor Dashboard API

```http
GET /api/v1/doctor/dashboard
```

Response:

```json
{
  "assigned_patients": 5,
  "new_studies": 3,
  "reports_available": 7
}
```

Only studies assigned to the authenticated doctor count.

---

# 26. Doctor Patients API

```http
GET /api/v1/doctor/patients
```

Query:

```text
page
page_size
search
patient_id
date_from
date_to
```

The query must return only patients having at least one assigned study.

---

# 27. Doctor Patient Detail

```http
GET /api/v1/doctor/patients/{patient_id}
```

Authorization:

```text
doctor has at least one active assignment
for the patient
```

Return:

```json
{
  "patient": {},
  "study_count": 4,
  "studies": []
}
```

---

# 28. Doctor Studies

```http
GET /api/v1/doctor/studies
```

Filters:

```text
patient
patient_id
accession_number
date_from
date_to
modality
body_part
status
search
```

Important:

The API must automatically restrict results to:

```text
study_assignments.doctor_id == current_doctor_id
```

The frontend cannot bypass this by passing another doctor ID.

---

# 29. Doctor Study Detail

```http
GET /api/v1/doctor/studies/{study_id}
```

Authorization:

```text
study is assigned to current doctor
```

Otherwise:

```text
404
```

---

# 30. Doctor Viewer

```http
GET /api/v1/doctor/studies/{study_id}/viewer
```

Same viewer response contract as Patient Portal.

This allows React to use the same:

```text
MedicalViewer
```

component.

---

# 31. Doctor Report

```http
GET /api/v1/doctor/studies/{study_id}/report
```

Only assigned doctors can access it.

The report response should use the same schema as the patient endpoint.

---

# 32. API Response Standards

Use consistent responses.

Successful collection:

```json
{
  "items": [],
  "page": 1,
  "page_size": 20,
  "total": 0
}
```

Validation error:

```json
{
  "detail": "Invalid request"
}
```

Not found:

```json
{
  "detail": "Study not found"
}
```

Do not expose SQLAlchemy exceptions directly.

---

# 33. Pagination

All potentially large collections must support pagination.

Default:

```text
page = 1
page_size = 20
```

Maximum:

```text
page_size = 100
```

The frontend table should use server-side pagination.

---

# 34. Filtering

Filtering must happen in the backend.

Do NOT retrieve all studies and filter in React.

Example:

```text
React
  │
  │ modality=MRI
  ▼
FastAPI
  │
  ▼
SQL
  │
  ▼
Only MRI studies
```

---

# 35. Sorting

Support:

```text
sort_by
sort_order
```

Allowed fields:

```text
study_date
patient_name
modality
accession_number
status
```

Do not allow arbitrary SQL field names from the client.

---

# 36. API Service Layer

Recommended:

```text
Router
   ↓
Service
   ↓
Repository
   ↓
SQLAlchemy
   ↓
SQLite
```

Example:

```text
GET /doctor/studies
        ↓
doctor_router
        ↓
study_service
        ↓
study_repository
        ↓
SQLAlchemy
        ↓
SQLite
```

Do not put complex database queries directly in FastAPI route functions.

---

# 37. Security Layer

Implement:

```text
JWT
Bearer token
Password hashing
Role checks
Resource authorization
```

Dependencies:

```python
get_current_user()
require_patient()
require_doctor()
```

Example conceptual flow:

```text
Authorization: Bearer JWT
             │
             ▼
       Decode token
             │
             ▼
       Current User
             │
       ┌─────┴─────┐
       ▼           ▼
   PATIENT       DOCTOR
```

---

# 38. Frontend Integration

Replace the existing mock service.

Current:

```text
portalService
    ↓
mock data
```

Change to:

```text
portalService
    ↓
HTTP API
    ↓
FastAPI
```

Keep the same service method names where possible.

For example:

```typescript
getPatientStudies()
```

should continue to exist.

Only its implementation changes.

---

# 39. API Client

Create/reuse:

```text
apiClient
```

Responsibilities:

* base URL
* Authorization header
* JSON parsing
* common errors
* 401 handling
* timeout
* request cancellation if already supported

Example:

```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Production:

```text
VITE_API_BASE_URL=https://api.example.com/api/v1
```

---

# 40. Authentication Integration

Frontend flow:

```text
Login
   │
   ▼
POST /auth/login
   │
   ▼
JWT
   │
   ▼
Store token
   │
   ▼
GET /auth/me
   │
   ▼
Determine portal
```

Then:

```text
PATIENT → /patient
DOCTOR  → /doctor
```

---

# 41. Route Protection

React routes:

```text
<ProtectedRoute>
```

Rules:

```text
PATIENT
  → patient routes

DOCTOR
  → doctor routes
```

If unauthorized:

```text
→ /login
```

But remember:

**Frontend route protection is only UX protection.**

Real authorization remains in FastAPI.

---

# 42. API ↔ UI Mapping

## Patient

```text
UI
          API

Dashboard
          GET /patient/dashboard

Studies
          GET /patient/studies

Study Detail
          GET /patient/studies/{id}

Viewer
          GET /patient/studies/{id}/viewer

Report
          GET /patient/studies/{id}/report
```

## Doctor

```text
UI
          API

Dashboard
          GET /doctor/dashboard

Patients
          GET /doctor/patients

Patient
          GET /doctor/patients/{id}

Studies
          GET /doctor/studies

Study
          GET /doctor/studies/{id}

Viewer
          GET /doctor/studies/{id}/viewer

Report
          GET /doctor/studies/{id}/report
```

---

# 43. Mock Viewer Integration

Initially:

```text
FastAPI
   │
   ▼
Mock Viewer Metadata
   │
   ▼
React MockViewer
```

Later:

```text
FastAPI
   │
   ▼
MedDream Integration Service
   │
   ▼
Secure Viewer URL/token
   │
   ▼
React MedDreamViewer
```

Do not hard-code MedDream URLs inside React.

---

# 44. Report Integration

Initially:

```text
FastAPI
   │
   ▼
SQLite report content
   │
   ▼
RadiologyReportViewer
```

Later:

```text
FastAPI
   │
   ▼
SMG Report Service
   │
   ▼
Final Report
```

The UI remains unchanged.

---

# 45. Seed Data

Create a command:

```bash
python -m app.db.seed
```

It should:

1. Create users
2. Create patients
3. Create doctors
4. Create studies
5. Create series
6. Create images
7. Create assignments
8. Create reports

Running the seed repeatedly should not create duplicates.

---

# 46. Demo Accounts

Seed:

```text
Patient

username: john.tan
password: demo123
```

Doctor:

```text
username: sarah.lim
password: demo123
```

Optional:

```text
username: james.wong
password: demo123
```

These are DEMO credentials only.

---

# 47. Demo Images

Store sample images under:

```text
static/
  viewer/
    study-001/
      axial-01.jpg
      axial-02.jpg
      coronal-01.jpg
      sagittal-01.jpg
```

Do not store images as SQLite BLOBs.

API returns URLs:

```json
{
  "image_url": "/static/viewer/study-001/axial-01.jpg"
}
```

FastAPI serves static demo assets.

---

# 48. CORS

Development:

```text
http://localhost:3000
http://localhost:5173
```

Configure through environment variables.

Example:

```text
CORS_ORIGINS=http://localhost:5173
```

Do not use:

```text
allow_origins=["*"]
```

as the final configuration.

---

# 49. Environment Configuration

Create:

```text
.env.example
```

Example:

```text
APP_NAME=SMG Radiology API
ENVIRONMENT=development

DATABASE_URL=sqlite:///./smg_radiology.db

JWT_SECRET_KEY=change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

CORS_ORIGINS=http://localhost:5173
```

Never commit the real JWT secret.

---

# 50. Swagger/OpenAPI

FastAPI should expose:

```text
/docs
/redoc
/openapi.json
```

Organize endpoints using tags:

```text
Authentication
Patient Portal
Doctor Portal
Studies
Reports
Viewer
```

The OpenAPI documentation should be sufficient for frontend developers to understand the API.

---

# 51. Automated Tests

Use pytest.

Minimum tests:

## Authentication

```text
test_login_patient
test_login_doctor
test_invalid_login
test_me
```

## Patient

```text
test_patient_dashboard
test_patient_studies
test_patient_study_detail
test_patient_report
test_patient_viewer
```

## Doctor

```text
test_doctor_dashboard
test_doctor_patients
test_doctor_studies
test_doctor_study_detail
test_doctor_report
test_doctor_viewer
```

## Security

Critical tests:

```text
test_patient_cannot_access_other_patient_study

test_doctor_cannot_access_unassigned_study

test_patient_cannot_access_doctor_endpoint

test_doctor_cannot_access_patient_endpoint
```

---

# 52. Integration Test

The final test should simulate:

```text
Login
 ↓
JWT
 ↓
GET Dashboard
 ↓
GET Studies
 ↓
GET Study
 ↓
GET Viewer
 ↓
GET Report
```

for both:

```text
Patient
Doctor
```

---

# 53. Docker

Provide:

```text
Dockerfile
docker-compose.yml
```

Development architecture:

```text
┌──────────────────────┐
│ React Frontend       │
│ :5173                │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ FastAPI              │
│ :8000                │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ SQLite               │
│ smg_radiology.db     │
└──────────────────────┘
```

---

# 54. Health Check

Implement:

```http
GET /health
```

Response:

```json
{
  "status": "healthy"
}
```

Optional:

```http
GET /ready
```

for future Kubernetes deployment.

---

# 55. Logging

Implement structured application logging.

Log:

```text
request
method
path
status_code
duration
user_id if available
```

Do NOT log:

* passwords
* JWT tokens
* sensitive patient data unnecessarily

---

# 56. Error Handling

Create centralized exception handling.

Handle:

```text
ValidationError
NotFound
Unauthorized
Forbidden
Database errors
Unexpected exceptions
```

Return consistent JSON.

Do not expose stack traces in production mode.

---

# 57. Database Migration

Use Alembic from the beginning.

Commands:

```bash
alembic revision --autogenerate -m "initial radiology portal schema"

alembic upgrade head
```

Do not depend on:

```python
Base.metadata.create_all()
```

for production migration management.

For the local demo, it can be used only as a convenience if necessary, but Alembic remains the source of truth.

---

# 58. Implementation Phases

## Phase 1 — Backend Analysis

AI agent first inspects the existing repository.

Deliver:

```text
BACKEND_IMPLEMENTATION_ANALYSIS.md
```

Include:

* existing backend
* existing frontend API layer
* existing authentication
* reusable components
* dependencies
* recommended directory structure
* integration points
* files to create
* files to modify

Do not start implementation until analysis is complete.

---

# 59. Phase 2 — FastAPI Foundation

Implement:

* FastAPI application
* configuration
* database
* SQLAlchemy
* Alembic
* health check
* CORS
* logging
* error handling

Acceptance:

```text
GET /health
```

returns:

```json
{
  "status": "healthy"
}
```

Swagger must work.

---

# 60. Phase 3 — Database

Implement:

```text
User
Patient
Doctor
ImagingStudy
StudySeries
StudyImage
StudyAssignment
RadiologyReport
AuditLog
```

Create migration.

Seed demo data.

Verify relationships.

---

# 61. Phase 4 — Authentication

Implement:

```text
POST /auth/login
GET /auth/me
```

Implement:

```text
JWT
password hashing
current user
role authorization
```

Acceptance:

```text
Patient login → PATIENT
Doctor login → DOCTOR
```

---

# 62. Phase 5 — Patient APIs

Implement:

```text
GET /patient/dashboard
GET /patient/studies
GET /patient/studies/{id}
GET /patient/studies/{id}/viewer
GET /patient/studies/{id}/report
```

Add tests.

---

# 63. Phase 6 — Doctor APIs

Implement:

```text
GET /doctor/dashboard
GET /doctor/patients
GET /doctor/patients/{id}
GET /doctor/studies
GET /doctor/studies/{id}
GET /doctor/studies/{id}/viewer
GET /doctor/studies/{id}/report
```

Add assignment-based authorization.

---

# 64. Phase 7 — React Integration

Replace mock services with HTTP services.

Do this incrementally.

First:

```text
Login
```

Then:

```text
Patient Dashboard
```

Then:

```text
Patient Studies
```

Then:

```text
Study Details
```

Then:

```text
Viewer
```

Then:

```text
Report
```

Then repeat for Doctor Portal.

Do not replace all mock services in one large change.

---

# 65. Phase 8 — Remove Mock Data Dependency

After API integration is verified:

Remove or disable:

```text
frontend mock data
frontend filtering
frontend authorization logic that duplicates backend rules
```

Keep UI-level authorization for navigation, but backend remains authoritative.

---

# 66. Phase 9 — End-to-End Validation

Validate:

```text
Patient Login
       ↓
Dashboard
       ↓
Studies
       ↓
Study
       ↓
Viewer
       ↓
Report
```

Then:

```text
Doctor Login
       ↓
Dashboard
       ↓
Patients
       ↓
Studies
       ↓
Viewer
       ↓
Report
```

Then test unauthorized access.

---

# 67. API Contract Freeze

Before connecting the React UI, freeze the first API contract.

Create:

```text
docs/
  API_CONTRACT.md
```

Document:

* endpoint
* HTTP method
* authentication
* request
* query parameters
* response
* errors
* authorization rules

The frontend and backend should then develop against this contract.

---

# 68. Future Production Migration

The demo should deliberately prepare for:

```text
SQLite
   ↓
MySQL/PostgreSQL
```

and:

```text
MockViewer
   ↓
MedDream
```

and:

```text
MockReport
   ↓
SMG Report Service
```

and:

```text
Mock Authentication
   ↓
SMG Authentication / SSO
```

and:

```text
Mock Study Data
   ↓
SMG RIS
```

The portal UI should not need a major rewrite when these integrations are introduced.

---

# 69. Final Target Architecture

```text
                         ┌─────────────────────┐
                         │   React Portal      │
                         │                     │
                         │ Patient / Doctor    │
                         └──────────┬──────────┘
                                    │
                                  REST
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     FastAPI         │
                         │                     │
                         │ Auth                │
                         │ Patient Portal      │
                         │ Doctor Portal       │
                         │ Study Service       │
                         │ Report Service      │
                         │ Viewer Service      │
                         └──────────┬──────────┘
                                    │
                              SQLAlchemy
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       SQLite        │
                         │                     │
                         │ Users               │
                         │ Patients            │
                         │ Doctors             │
                         │ Studies             │
                         │ Assignments         │
                         │ Reports             │
                         └─────────────────────┘


Future:

                         FastAPI
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
             RIS          PACS         Report
                            │           Service
                            ▼
                         MedDream
```

# 70. AI Coding Agent Master Instruction

Use the following as the main coding-agent prompt:

```text
Implement the backend API for the existing SMG Radiology Portal mockup.

Technology:
- Python 3.12+
- FastAPI
- SQLAlchemy 2.x
- Pydantic v2
- Alembic
- SQLite
- JWT authentication
- pytest

The React frontend already contains a completed portal mockup. Do NOT redesign the UI.

First inspect both the backend repository and the existing frontend integration/service layer.

Reuse existing conventions where possible.

Build a clean FastAPI backend using:

Router
→ Service
→ Repository
→ SQLAlchemy
→ SQLite

Implement:

Authentication:
POST /api/v1/auth/login
GET /api/v1/auth/me

Patient:
GET /api/v1/patient/dashboard
GET /api/v1/patient/studies
GET /api/v1/patient/studies/{id}
GET /api/v1/patient/studies/{id}/viewer
GET /api/v1/patient/studies/{id}/report

Doctor:
GET /api/v1/doctor/dashboard
GET /api/v1/doctor/patients
GET /api/v1/doctor/patients/{id}
GET /api/v1/doctor/studies
GET /api/v1/doctor/studies/{id}
GET /api/v1/doctor/studies/{id}/viewer
GET /api/v1/doctor/studies/{id}/report

Database entities:

User
Patient
Doctor
ImagingStudy
StudySeries
StudyImage
StudyAssignment
RadiologyReport
AuditLog

Patient authorization:
A patient may access only studies belonging to the authenticated patient.

Doctor authorization:
A doctor may access only studies assigned to the authenticated doctor through StudyAssignment.

Do not trust patientId or doctorId sent by the frontend for authorization.

Use JWT to identify the authenticated user.

Use pagination and server-side filtering.

Support:
- date_from
- date_to
- modality
- body_part
- status
- patient
- patient_id
- accession_number
- search
- sorting

Create Alembic migrations.

Create deterministic seed data with:

5 patients
3 doctors
15+ imaging studies
multiple modalities
multiple study statuses
multiple reports
multiple doctor assignments

Create demo credentials:

Patient:
john.tan / demo123

Doctor:
sarah.lim / demo123

Create demo image metadata and static placeholder image URLs for the mock DICOM viewer.

Do not implement real DICOM/PACS/MedDream integration.

Instead create a Viewer Service abstraction so that:

Mock Viewer
can later be replaced by:
MedDream Viewer

Do not generate real medical images.

Do not use real patient data.

Integrate the existing React frontend incrementally.

Replace its mock service implementation with HTTP calls to FastAPI while keeping the existing component contracts where possible.

Do not rewrite working UI components.

Do not duplicate the report component if an existing SMG final-report component exists.

The final report displayed in the portal must use the same report representation as the existing SMG Result Entry final report whenever technically possible.

Implement:

- centralized error handling
- CORS
- structured logging
- health endpoint
- OpenAPI documentation
- validation
- JWT authentication
- role authorization
- resource-level authorization

Add pytest tests for:

- authentication
- patient dashboard
- patient studies
- patient study authorization
- patient report
- patient viewer
- doctor dashboard
- doctor studies
- doctor assignment authorization
- doctor report
- doctor viewer
- cross-patient access
- cross-doctor access

After implementation:

1. Run migrations.
2. Seed database.
3. Start FastAPI.
4. Verify /health.
5. Verify /docs.
6. Test all API endpoints.
7. Start React.
8. Test patient login.
9. Test patient study flow.
10. Test patient viewer.
11. Test patient report.
12. Test doctor login.
13. Test doctor patient flow.
14. Test doctor viewer.
15. Test doctor report.
16. Test unauthorized access.
17. Run backend tests.
18. Run frontend lint/build.
19. Fix all errors.

At completion provide:

- architecture summary
- API endpoint list
- database schema summary
- created files
- modified files
- environment variables
- commands to run backend
- commands to seed database
- commands to run frontend
- test results
- known limitations
- next steps for real RIS/PACS/MedDream integration
```

# 71. Recommended Development Order

Use these as **separate AI-agent tasks**, rather than asking the agent to implement everything simultaneously:

```text
Task 1
Analyze existing frontend + backend
        ↓
Task 2
FastAPI foundation + SQLite
        ↓
Task 3
Database models + Alembic + seed
        ↓
Task 4
Authentication + JWT
        ↓
Task 5
Patient APIs
        ↓
Task 6
Doctor APIs + assignments
        ↓
Task 7
Connect Patient UI
        ↓
Task 8
Connect Doctor UI
        ↓
Task 9
Viewer + Report integration
        ↓
Task 10
Security + tests
        ↓
Task 11
Docker + demo deployment
```

This gives you a clean progression from the existing **UI-only mockup → functional local portal → API-backed demo → future RIS/PACS/MedDream integration**.
