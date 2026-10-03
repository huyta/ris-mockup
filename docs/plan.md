Below is an **AI-coding-agent-ready implementation plan** for a mockup/demo inspired by the HMI Radiology Portal, but adapted to your **SMG RIS + React + MedDream/PACS** demo architecture.

The goal is **demo-ready UI and simulated workflows**, not production PACS/security implementation.

# SMG Radiology Portal Mockup Demo

## 1. Objective

Build a frontend-only mockup/demo of a radiology portal inspired by the HMI/Zed-style Patient and Doctor portals.

The demo must allow:

1. Patient login
2. Patient viewing their imaging studies
3. Patient opening a DICOM Medical Viewer
4. Patient viewing the corresponding PDF radiology report
5. Doctor/external specialist login
6. Doctor viewing assigned patients/studies
7. Doctor filtering/searching studies
8. Doctor opening Medical Viewer
9. Doctor opening the corresponding report
10. Demonstrating the relationship:

```text
Patient
   │
   ├── Orders
   │      │
   │      └── Imaging Studies
   │              │
   │              ├── DICOM Viewer
   │              │
   │              └── Radiology Report
   │
   └── Portal Access
```

The implementation should use **mock data and simulated API calls**.

Do NOT implement real authentication, PACS integration, DICOM retrieval, report generation, or database changes for this demo.

---

# 2. Existing Technology Context

Assume the existing SMG frontend is:

* React
* Existing SMG UI/design system
* Existing routing
* Existing authentication structure where possible
* Existing PWO / Result Entry APIs may already exist
* MedDream will be used as the future medical viewer
* DICOM/PACS integration is out of scope for this mockup
* PDF report can be represented by an existing report page, PDF preview, or mock PDF viewer

The AI coding agent MUST first inspect the existing codebase.

Do not introduce a new framework or replace the existing architecture.

---

# 3. Important Implementation Principle

## Minimum-change rule

Before creating anything:

1. Inspect existing React application.
2. Identify:

   * routing
   * authentication
   * layout
   * sidebar
   * header
   * reusable tables
   * buttons
   * modal/dialog components
   * existing patient portal
   * existing doctor portal
   * existing PWO screens
   * existing Result Entry/report screens
   * existing Medical Viewer integration
3. Reuse existing components wherever possible.
4. Do not duplicate components that already exist.
5. Do not modify existing business logic unless required.
6. Do not change existing APIs.
7. Do not change database schema.
8. Do not introduce Redux/Zustand/etc. if the project does not already use them.

---

# 4. Demo Personas

Create three mock users.

## Patient

```text
Name: John Tan
Patient ID: P00010001
Email: john.tan@example.com
Role: Patient
```

John can only see his own studies.

## External Specialist

```text
Name: Dr. Sarah Lim
Doctor ID: D00021
Role: Referring Doctor
Specialty: Orthopaedics
```

Sarah can only see patients/studies assigned to her.

## Radiologist

```text
Name: Dr. Michael Lee
Doctor ID: D00001
Role: Radiologist
```

The radiologist is optional for this demo and does not need a complete workflow.

---

# 5. Application Structure

The demo should conceptually contain:

```text
Portal
│
├── Login
│
├── Patient Portal
│   ├── Dashboard
│   ├── My Studies
│   ├── Study Details
│   ├── Medical Viewer
│   └── Report
│
└── Doctor Portal
    ├── Dashboard
    ├── Patients
    ├── Imaging Studies
    ├── Study Details
    ├── Medical Viewer
    └── Report
```

---

# 6. Routes

Implement routes similar to:

```text
/login

/patient
/patient/studies
/patient/studies/:studyId
/patient/studies/:studyId/viewer
/patient/studies/:studyId/report

/doctor
/doctor/patients
/doctor/studies
/doctor/studies/:studyId
/doctor/studies/:studyId/viewer
/doctor/studies/:studyId/report
```

If the existing application has a different routing convention, follow the existing convention instead.

---

# 7. Login Screen

Create a clean radiology-portal-style login screen.

## Layout

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│                       SMG RADIOLOGY                          │
│                                                              │
│                  Radiology Portal                            │
│                                                              │
│              ┌────────────────────────┐                      │
│              │ Email / Username       │                      │
│              └────────────────────────┘                      │
│                                                              │
│              ┌────────────────────────┐                      │
│              │ Password               │                      │
│              └────────────────────────┘                      │
│                                                              │
│              ☑ Remember me                                   │
│                                                              │
│              [        Sign In        ]                       │
│                                                              │
│                 Forgot Password?                             │
│                                                              │
│       Demo: Patient | Doctor                                 │
└──────────────────────────────────────────────────────────────┘
```

## Demo login shortcuts

Because this is a mockup, provide:

```text
[Login as Patient]

[Login as Doctor]
```

These buttons should populate the correct mock user and navigate to the appropriate dashboard.

Do not require real credentials.

---

# 8. Patient Portal

## 8.1 Patient Dashboard

Display:

### Header

```text
SMG Radiology
Patient Portal

John Tan
[Profile] [Logout]
```

### Summary cards

```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Total Studies│ │ Recent Study │ │ Reports      │
│      8       │ │ 20 Sep 2026  │ │      8       │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Recent Studies

Columns:

```text
Date
Study
Modality
Body Part
Facility
Status
Report
Images
```

Example:

```text
20 Sep 2026
MRI Knee
MRI
Left Knee
SMG Medical Centre
Reported
View Report
View Images
```

---

# 9. Patient Study List

Route:

```text
/patient/studies
```

## Filters

Provide:

```text
Date From
Date To
Modality
Body Part
Status
Search
```

Example modality values:

```text
All
CT
MRI
X-Ray
Ultrasound
Mammography
PET/CT
```

## Table

Columns:

```text
Study Date
Accession Number
Study Description
Modality
Body Part
Radiologist
Status
Actions
```

Actions:

```text
View
Images
Report
```

---

# 10. Patient Study Details

Route:

```text
/patient/studies/:studyId
```

Display:

```text
Study Details

MRI Brain

Study Date: 20 Sep 2026
Accession: ACC-2026-009812
Patient: John Tan
DOB: 15 Mar 1980
Modality: MRI
Body Part: Brain
Facility: SMG Medical Centre
Radiologist: Dr Michael Lee
Status: Final
```

Then:

```text
Clinical Information

Headache for 3 months.
```

Buttons:

```text
[View Medical Images]
[View Report]
```

---

# 11. Medical Viewer Mockup

Route:

```text
/patient/studies/:studyId/viewer
```

For the demo, do not implement a real DICOM viewer unless an existing MedDream integration already exists.

Instead provide a realistic viewer shell.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ Study: MRI Brain          John Tan       20 Sep 2026         │
├────────────┬─────────────────────────────────────────────────┤
│ Series     │                                                 │
│            │                                                 │
│ [Thumb 1]  │                 DICOM VIEWER                    │
│ [Thumb 2]  │                                                 │
│ [Thumb 3]  │                  IMAGE AREA                     │
│ [Thumb 4]  │                                                 │
│            │                                                 │
├────────────┴─────────────────────────────────────────────────┤
│ Zoom | Pan | Window | Measure | Reset | Fullscreen | Report │
└──────────────────────────────────────────────────────────────┘
```

## Viewer controls

Mock controls:

```text
Zoom In
Zoom Out
Pan
Window/Level
Rotate
Invert
Measure
Reset
Fullscreen
```

These controls do not need to manipulate real DICOM images.

They should provide visible UI feedback.

Example:

```text
Zoom: 125%
Window: 400
Level: 40
```

---

# 12. DICOM Viewer Demo Image

Use a small set of safe demo medical-imaging placeholder images already available in the project or generic non-identifying sample images.

Create mock series:

```text
Series 1 — Axial
Series 2 — Coronal
Series 3 — Sagittal
```

Each series should contain thumbnails.

Clicking a thumbnail changes the main displayed image.

The objective is to make the demo visually convincing, not medically diagnostic.

---

# 13. Report Screen

Route:

```text
/patient/studies/:studyId/report
```

The report page should visually resemble the existing SMG Result Entry "Print Final Report".

This is important:

## Do NOT create a second unrelated report design.

Reuse the existing final-report UI/component if available.

The flow should be:

```text
Study
   │
   ├── Medical Images
   │
   └── View Report
             │
             ▼
      Same report design
      as Result Entry
```

Display:

```text
SMG MEDICAL CENTRE

RADIOLOGY REPORT

Patient:
John Tan

DOB:
15 Mar 1980

Accession Number:
ACC-2026-009812

Study:
MRI Brain

Clinical History:
Headache for 3 months.

Technique:
MRI examination of the brain...

Findings:
...

Impression:
...

Reported By:
Dr Michael Lee

Reported Date:
20 Sep 2026
```

Buttons:

```text
[Back to Study]
[Open Images]
[Print]
[Download PDF]
```

For the mockup:

* Print can call browser print.
* Download PDF can use a mock/static PDF if one already exists.
* Do not build a PDF generation service.

---

# 14. Doctor Portal

The Doctor Portal should be more operational than the Patient Portal.

Route:

```text
/doctor
```

Dashboard:

```text
┌─────────────────────────────────────────────────────────────┐
│ Doctor Portal                                               │
│ Dr Sarah Lim                         [Profile] [Logout]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Assigned Patients     24                                    │
│ New Studies           5                                     │
│ Reports Available     18                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Recent Imaging Studies                                     │
│                                                             │
│ Patient | Study | Date | Modality | Status | Actions        │
└─────────────────────────────────────────────────────────────┘
```

---

# 15. Doctor Patient List

Route:

```text
/doctor/patients
```

## Filters

```text
Patient Name
Patient ID
DOB
Study Date
Study Type
Status
```

## Table

```text
Patient ID
Patient Name
DOB
Gender
Latest Study
Study Date
Number of Studies
Actions
```

Actions:

```text
View Patient
View Studies
```

---

# 16. Doctor Patient Detail

Example:

```text
Patient: Jane Wong
Patient ID: P00010008
DOB: 12 Jan 1975
Gender: Female
```

Tabs:

```text
Overview
Imaging Studies
Reports
```

### Imaging Studies

```text
Date
Study
Modality
Accession
Status
Images
Report
```

---

# 17. Doctor Imaging Study List

Route:

```text
/doctor/studies
```

Provide a strong filtering experience.

Filters:

```text
Patient
Patient ID
Accession Number
Date From
Date To
Modality
Body Part
Report Status
```

Buttons:

```text
Search
Reset
```

---

# 18. Doctor Study Details

Display:

```text
Patient Information
Study Information
Clinical Information
Report Status
```

Actions:

```text
[View Medical Images]
[View Report]
```

The Medical Viewer and Report screens should reuse the same components as the Patient Portal.

The only difference is authorization/context.

---

# 19. Assignment Model

The demo should simulate your existing requirement:

> An order/order item can be assigned to one or multiple external specialists.

Mock data:

```javascript
{
  studyId: "STUDY-1001",
  patientId: "P00010001",
  assignedDoctors: [
    "D00021",
    "D00025"
  ]
}
```

Doctor D00021 can see the study.

Doctor D00030 cannot.

---

# 20. Mock Data Model

Create:

```text
src/
  mock/
    users.ts
    patients.ts
    doctors.ts
    studies.ts
    reports.ts
```

Or follow the existing project structure.

## User

```typescript
interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
  patientId?: string;
  doctorId?: string;
}
```

## Patient

```typescript
interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
  email?: string;
}
```

## Study

```typescript
interface ImagingStudy {
  id: string;
  patientId: string;
  accessionNumber: string;
  studyDate: string;
  modality: string;
  bodyPart: string;
  description: string;
  facility: string;
  radiologist: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'REPORTED';
  assignedDoctorIds: string[];
  series: StudySeries[];
  reportId?: string;
}
```

## Series

```typescript
interface StudySeries {
  id: string;
  description: string;
  modality: string;
  images: string[];
}
```

## Report

```typescript
interface RadiologyReport {
  id: string;
  studyId: string;
  clinicalHistory: string;
  technique: string;
  findings: string;
  impression: string;
  reportedBy: string;
  reportedDate: string;
  status: 'DRAFT' | 'FINAL';
}
```

---

# 21. Recommended Mock Dataset

Create at least:

## Patients

5 patients.

Example:

```text
John Tan
Jane Wong
David Lim
Mary Chen
Robert Koh
```

## Studies

At least 15 studies.

Mix:

```text
MRI Brain
MRI Knee
CT Chest
CT Abdomen
X-Ray Chest
X-Ray Knee
Ultrasound Abdomen
Mammogram
```

## Statuses

Include:

```text
Reported
In Progress
Pending
```

## Doctors

At least:

```text
Dr Sarah Lim
Dr James Wong
Dr Emily Tan
```

Assign different studies to different doctors.

This allows the filtering and authorization behavior to be demonstrated.

---

# 22. Simulated API Layer

Do not put mock data directly inside UI components.

Create a simple service abstraction.

Example:

```text
services/
  portalService.ts
```

Methods:

```typescript
loginAsPatient()
loginAsDoctor()

getCurrentUser()

getPatientStudies(patientId)

getDoctorStudies(doctorId)

getPatientsForDoctor(doctorId)

getStudy(studyId)

getReport(studyId)

getStudySeries(studyId)
```

Initially these methods can return mock data.

Example:

```typescript
export async function getPatientStudies(patientId: string) {
  return mockStudies.filter(
    study => study.patientId === patientId
  );
}
```

Use `Promise`/async APIs even though data is local.

This makes it easy to replace with real APIs later.

---

# 23. Loading/Error States

Even though this is a mockup, simulate:

```text
Loading
Empty
Error
Success
```

Example:

```text
Loading studies...
```

Empty state:

```text
No imaging studies found.
```

Error:

```text
Unable to load imaging studies.
[Retry]
```

---

# 24. Responsive Design

Support:

```text
Desktop
Tablet
Mobile
```

Primary demo target:

```text
1440 × 900
```

The desktop experience should look polished first.

Mobile should not break the application.

---

# 25. Visual Design

Use the existing SMG design system where possible.

If no design system exists, use a professional healthcare style:

* clean white background
* dark text
* restrained healthcare blue
* light grey borders
* compact tables
* rounded cards
* clear status badges
* consistent spacing
* accessible contrast

Avoid excessive decorative elements.

The application should look like a **real enterprise radiology portal**, not a generic admin dashboard.

---

# 26. Navigation

Patient:

```text
SMG Radiology
│
├── Dashboard
├── My Studies
├── Reports
└── Profile
```

Doctor:

```text
SMG Radiology
│
├── Dashboard
├── Patients
├── Imaging Studies
└── Profile
```

Keep the Medical Viewer and Report pages outside the normal sidebar navigation because they are opened from a study.

---

# 27. Global Header

Header:

```text
SMG Radiology

[Portal Name]

User Name
Role
[Logout]
```

Example:

```text
SMG Radiology
Doctor Portal

Dr Sarah Lim
Referring Doctor
```

---

# 28. Study Actions

Every study should have a consistent action pattern.

```text
[View]
[Images]
[Report]
```

On desktop, use buttons or an action menu.

Do not create different action names on different screens.

---

# 29. Important UX Flow — Patient

Implement this exact demo flow:

```text
Login
  ↓
Patient Dashboard
  ↓
My Studies
  ↓
Select MRI Brain
  ↓
Study Details
  ↓
View Medical Images
  ↓
Medical Viewer
  ↓
Click Report
  ↓
Radiology Report
```

The user must be able to complete this flow without returning to the dashboard.

---

# 30. Important UX Flow — Doctor

Implement:

```text
Login
  ↓
Doctor Dashboard
  ↓
Patients
  ↓
Select Patient
  ↓
Patient Imaging Studies
  ↓
Select Study
  ↓
View Medical Images
  ↓
Medical Viewer
  ↓
View Report
  ↓
Radiology Report
```

---

# 31. Important UX Flow — Doctor Filtering

Demo:

```text
Doctor Dashboard
       ↓
Imaging Studies
       ↓
Select Date Range
       ↓
Select Modality = MRI
       ↓
Search
       ↓
Filtered Studies
```

Also demonstrate:

```text
Patient Name
Modality
Study Date
Report Status
```

---

# 32. Authorization Simulation

Implement frontend-only authorization.

Patient:

```text
patientId === currentUser.patientId
```

Doctor:

```text
currentUser.doctorId
    exists in
study.assignedDoctorIds
```

If unauthorized:

```text
You do not have permission to view this study.
```

Do not rely on hidden buttons as the only protection.

The route/component must also verify authorization.

---

# 33. Medical Viewer Architecture

Create a reusable component:

```text
MedicalViewer
```

Props:

```typescript
interface MedicalViewerProps {
  study: ImagingStudy;
  onReportClick?: () => void;
}
```

Structure:

```text
MedicalViewer
├── ViewerHeader
├── SeriesPanel
├── ImageViewport
├── ViewerToolbar
└── ViewerFooter
```

Future MedDream integration should be possible without redesigning the portal.

For example:

```text
MedicalViewer
      │
      ├── MockViewer
      │
      └── MedDreamViewer
```

Initially:

```text
viewerMode = "mock"
```

Later:

```text
viewerMode = "meddream"
```

---

# 34. Report Architecture

Create reusable:

```text
RadiologyReportViewer
```

Used by:

```text
Patient Report
Doctor Report
```

The report component should receive:

```typescript
{
  study,
  report
}
```

This ensures the Patient and Doctor portals show the same report.

---

# 35. Report + Viewer Relationship

The UI should make it obvious that:

```text
Study
 ├── Images
 └── Report
```

Inside the viewer:

```text
[View Report]
```

Inside the report:

```text
[View Images]
```

This creates a two-way navigation flow.

---

# 36. Mock DICOM Viewer Requirements

The viewer should visually demonstrate:

### Left

Series list.

### Center

Large image.

### Right

Optional study information.

### Bottom

Toolbar.

Example:

```text
┌─────────────┬─────────────────────────────┬──────────────┐
│ SERIES      │                             │ STUDY INFO   │
│             │                             │              │
│ ○ Axial     │                             │ MRI Brain    │
│ ○ Coronal   │        IMAGE                │ 20 Sep 2026  │
│ ○ Sagittal  │                             │              │
│             │                             │              │
└─────────────┴─────────────────────────────┴──────────────┘

[Zoom+] [Zoom-] [Pan] [W/L] [Measure] [Rotate] [Reset]
```

---

# 37. Demo Mode

Add a small visible indicator:

```text
DEMO MODE
```

This prevents users from assuming that the viewer/report data is connected to production PACS.

Do not expose this too prominently.

A small badge in the header is sufficient.

---

# 38. Do Not Implement

The AI coding agent MUST NOT implement:

* Real PACS authentication
* Real DICOM C-FIND
* Real DICOM C-MOVE
* DICOMweb
* Real MedDream authentication
* Real patient authentication
* Real password reset
* Production authorization
* Database migrations
* Real report generation
* HL7
* FHIR
* Billing
* Appointment management
* Real SMS
* Real email
* Production audit logging

These are outside the mockup scope.

---

# 39. Component Structure

Suggested structure:

```text
src/
├── components/
│   ├── portal/
│   │   ├── PortalHeader
│   │   ├── PortalSidebar
│   │   ├── PortalLayout
│   │   └── DemoModeBadge
│   │
│   ├── studies/
│   │   ├── StudyTable
│   │   ├── StudyFilters
│   │   ├── StudySummary
│   │   └── StudyActions
│   │
│   ├── viewer/
│   │   ├── MedicalViewer
│   │   ├── ViewerToolbar
│   │   ├── SeriesList
│   │   └── ImageViewport
│   │
│   └── reports/
│       └── RadiologyReportViewer
│
├── pages/
│   ├── auth/
│   │   └── Login
│   │
│   ├── patient/
│   │   ├── PatientDashboard
│   │   ├── PatientStudies
│   │   ├── PatientStudyDetails
│   │   ├── PatientViewer
│   │   └── PatientReport
│   │
│   └── doctor/
│       ├── DoctorDashboard
│       ├── DoctorPatients
│       ├── DoctorPatientDetails
│       ├── DoctorStudies
│       ├── DoctorStudyDetails
│       ├── DoctorViewer
│       └── DoctorReport
│
├── services/
│   └── portalService
│
├── mock/
│   ├── users
│   ├── patients
│   ├── doctors
│   ├── studies
│   └── reports
│
└── types/
    └── portal
```

Adapt this to the existing project's conventions.

---

# 40. Implementation Phases

## Phase 1 — Codebase Analysis

AI agent must first inspect:

```text
package.json
src/
routing
authentication
layouts
existing PWO
existing Result Entry
existing report
existing Medical Viewer
API services
UI component library
```

Deliverable:

```text
IMPLEMENTATION_ANALYSIS.md
```

containing:

* existing architecture
* reusable components
* existing routes
* existing APIs
* recommended integration points
* files that will be modified
* files that will be created

Do not modify code during this phase unless necessary.

---

# 41. Phase 2 — Mock Data

Implement:

```text
users
patients
doctors
studies
series
reports
```

Acceptance criteria:

* 5 patients
* 3 doctors
* 15+ studies
* multiple modalities
* multiple statuses
* multiple assigned doctors

---

# 42. Phase 3 — Portal Layout

Implement:

* Header
* Sidebar
* Patient layout
* Doctor layout
* Login
* Demo mode

Acceptance:

```text
Patient login → Patient Dashboard

Doctor login → Doctor Dashboard
```

---

# 43. Phase 4 — Patient Portal

Implement:

1. Dashboard
2. Study list
3. Filters
4. Study detail
5. Viewer
6. Report

Acceptance:

```text
Patient can navigate:

Dashboard
→ Study
→ Images
→ Report
→ Images
```

---

# 44. Phase 5 — Doctor Portal

Implement:

1. Dashboard
2. Patient list
3. Patient detail
4. Study list
5. Study filters
6. Study detail
7. Viewer
8. Report

Acceptance:

Doctor can:

```text
Find patient
→ Find study
→ View image
→ View report
```

---

# 45. Phase 6 — Authorization

Implement:

```text
Patient sees own studies only.

Doctor sees assigned studies only.
```

Test:

```text
Patient A cannot open Patient B study.

Doctor A cannot open Doctor B-only study.
```

---

# 46. Phase 7 — UX Polish

Review:

* spacing
* typography
* responsive layout
* table usability
* empty states
* loading states
* error states
* button consistency
* navigation
* browser back/forward
* modal behavior
* accessibility

---

# 47. Phase 8 — Demo Preparation

Create a predictable demo dataset.

## Patient Demo

```text
John Tan
```

Login:

```text
[Login as Patient]
```

Expected:

```text
8 studies
3 reports
multiple modalities
```

## Doctor Demo

```text
Dr Sarah Lim
```

Expected:

```text
5 assigned patients
multiple imaging studies
reports
```

---

# 48. Demo Script

The finished application should support this 5-minute demo.

## Demo 1 — Patient

```text
1. Open portal
2. Login as Patient
3. Show dashboard
4. Open My Studies
5. Filter MRI
6. Open MRI Brain
7. Show study details
8. Open Medical Viewer
9. Select another series
10. Click View Report
11. Show final report
12. Click View Images
```

## Demo 2 — Doctor

```text
1. Logout
2. Login as Doctor
3. Show dashboard
4. Open Patients
5. Select patient
6. Open Imaging Studies
7. Filter MRI
8. Open study
9. Open Medical Viewer
10. Open Report
```

---

# 49. Acceptance Criteria

The implementation is complete when:

### Authentication

* [ ] Patient demo login works.
* [ ] Doctor demo login works.
* [ ] Logout works.

### Patient

* [ ] Patient dashboard works.
* [ ] Patient study list works.
* [ ] Study filters work.
* [ ] Study details work.
* [ ] Viewer opens.
* [ ] Series selection works.
* [ ] Viewer toolbar provides visible feedback.
* [ ] Report opens.
* [ ] Report links back to viewer.

### Doctor

* [ ] Doctor dashboard works.
* [ ] Patient list works.
* [ ] Patient details work.
* [ ] Study list works.
* [ ] Filters work.
* [ ] Viewer opens.
* [ ] Report opens.

### Authorization

* [ ] Patient cannot access another patient's study.
* [ ] Doctor cannot access an unassigned study.

### UI

* [ ] Desktop layout polished.
* [ ] Tablet layout usable.
* [ ] Mobile layout does not break.
* [ ] Loading states exist.
* [ ] Empty states exist.
* [ ] Error states exist.
* [ ] Demo mode is clearly indicated.

---

# 50. AI Coding Agent Instructions

Use the following instructions as the implementation contract:

```text
You are implementing a frontend mockup/demo for an SMG Radiology Portal.

Before changing code, inspect the entire existing frontend architecture.

The application already has existing SMG functionality. Reuse existing components, routing, authentication patterns, API services, styling, Result Entry report components, and Medical Viewer integration wherever possible.

Do NOT introduce unnecessary libraries.

Do NOT rewrite existing architecture.

Do NOT modify existing business logic unless required.

Do NOT change database schema.

Do NOT implement real PACS/DICOM integration.

Do NOT implement production authentication.

Use mock data and a service abstraction for all portal data.

The demo must support two personas:

1. Patient
2. External Specialist / Referring Doctor

Patient workflow:

Login
→ Dashboard
→ My Studies
→ Study Details
→ Medical Viewer
→ Radiology Report
→ back to Medical Viewer

Doctor workflow:

Login
→ Dashboard
→ Patients
→ Patient Details
→ Imaging Studies
→ Study Details
→ Medical Viewer
→ Radiology Report

Patient authorization:
Only allow access to studies where study.patientId === currentUser.patientId.

Doctor authorization:
Only allow access to studies where currentUser.doctorId exists in study.assignedDoctorIds.

Create reusable components for:

- StudyTable
- StudyFilters
- StudyActions
- MedicalViewer
- SeriesList
- ViewerToolbar
- RadiologyReportViewer

The report must use the existing SMG final-report design/component if one already exists.

The Medical Viewer must be implemented behind a reusable abstraction so that the mock viewer can later be replaced by MedDream.

Create at least:

- 5 patients
- 3 doctors
- 15 imaging studies
- multiple modalities
- multiple report statuses
- multiple assigned doctors

Use realistic but fictional patient data.

Do not use real patient information.

The finished UI should look like a professional enterprise radiology portal.

After implementation:

1. Run lint.
2. Run TypeScript/build validation.
3. Fix errors.
4. Test all routes.
5. Test patient workflow.
6. Test doctor workflow.
7. Test authorization.
8. Verify browser refresh on nested routes.
9. Verify responsive layout.
10. Provide a concise implementation summary and list all modified/created files.
```

# 51. Future Integration Architecture

The mockup should deliberately prepare for the real architecture:

```text
                 ┌──────────────────────┐
                 │      SMG Portal      │
                 │       React          │
                 └──────────┬───────────┘
                            │
                     Portal API
                            │
                ┌───────────┴────────────┐
                │                        │
             Patient                  Doctor
             Access                  Access
                │                        │
                └───────────┬────────────┘
                            │
                         SMG RIS
                            │
             ┌──────────────┴──────────────┐
             │                             │
         Study Metadata                Reports
             │                             │
             ▼                             ▼
          PACS/DICOM                  Report Service
             │
             ▼
         MedDream
             │
             ▼
       DICOM Medical Viewer
```

The mockup therefore becomes the **UI prototype for the future real implementation**, rather than a throwaway demo.

# 52. Priority

Implement in this order:

```text
P0
Login
Patient Dashboard
Patient Studies
Study Details
Medical Viewer Mock
Report Viewer

P1
Doctor Dashboard
Doctor Patients
Doctor Studies
Doctor Filters
Doctor Viewer
Doctor Report

P2
Authorization
Loading/Error/Empty states
Responsive design
UX polish

P3
MedDream integration preparation
Real API integration preparation
```

The P0 flow must be fully demoable before spending time on P2/P3.

### Recommended execution approach

For your current project, I would **not give the coding agent the entire plan as one giant “build everything” task**. Use the phases as separate agent tasks:

1. **Analyze existing codebase → produce implementation analysis**
2. **Build mock data + service layer**
3. **Build Patient Portal**
4. **Build Doctor/External Specialist Portal**
5. **Integrate/reuse existing Report + Viewer**
6. **Add authorization + polish**
7. **Run end-to-end demo validation**

This reduces the chance that the agent creates a parallel architecture instead of reusing your existing **PWO, Result Entry, report and MedDream-related components**.
