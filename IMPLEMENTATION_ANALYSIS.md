# Implementation Analysis: SMG / HMI Radiology Portal Mockup Demo

## 1. Executive Summary

This document fulfills **Phase 1 (Codebase Analysis)** of the SMG Radiology Portal Mockup Demo implementation plan (`plan.md`). 

The objective is to deliver a frontend-only, demo-ready mockup inspired by the **HMI Radiology Portal** (as demonstrated in `doctor-radiologyportal.hmimedical.com` powered by Zed, captured in the reference screenshot) and tailored to the **SMG RIS + React + MedDream/PACS** architecture.

### Key Workflows:
1. **Patient Flow**: Login → Patient Dashboard → My Studies → Study Details (e.g. MRI Brain) → Medical DICOM Viewer → Radiology Report → Back to Viewer.
2. **Doctor / Specialist Flow**: Login → Doctor Dashboard → Patients List → Patient Detail → Studies List (with Quick Search & Filters) → Medical Viewer → Radiology Report.
3. **Authorization Simulation**: Role-based access where Patients can only view their own records (`patientId === currentUser.patientId`) and Referring Doctors can only view studies assigned to them (`currentUser.doctorId in study.assignedDoctorIds`).
4. **DICOM Viewer & Report Relationship**: Deeply linked experience between multi-series imaging views and print-ready enterprise radiology reports.

---

## 2. Codebase & Environment Inspection

### Environment Check:
* **Workspace Path**: `/Users/matt/Desktop/HMI`
* **Node.js Environment**:
  * Node.js v20.20.2 / npm 10.8.2 (available via `~/.nvm/versions/node/v20.20.2`)
  * Node.js v16.15.1 (default system node)
* **Initial Workspace Contents**:
  * `plan.md` — Complete specification blueprint
  * Reference screenshots: `screenshot1.png` (HMI Radiology Doctor Portal "Powered by Zed", showing exact layout, header bar, quick search filters, and table styling)
  * Adjacent repositories:
    * `/Users/matt/Desktop/GenReport`: Python/RabbitMQ/MinIO PDF report service confirming SMG RIS report data structures (OrderItemId, Patient Demographics, Clinical History, Technique, Findings, Impression, Radiologist signature).
    * `/Users/matt/Desktop/FLASKAPP/SMG`: DICOM archive and file movement utilities.

### Design System & Visual Language:
Based on the reference HMI/Zed screenshot and healthcare portal standards:
* **Header Bar**: Dark navy/slate header (`#1e293b` / `#0f172a`), brand title ("SMG / HMI Radiology"), "Powered by Zed" badge, notification bell, user profile indicator, demo mode tag, and logout action.
* **Navigation**: Collapsible sidebar with high-contrast icon set (Dashboard, Patients, Studies, Reports, Settings).
* **Color Palette**:
  * Primary: Medical Blue (`#0284c7` / `#0369a1`)
  * Surface & Background: Crisp neutral slate/white (`#f8fafc`, `#ffffff`)
  * Borders & Dividers: Subtle slate (`#e2e8f0`)
  * Accents & Status: Emerald for Reported/Final (`#10b981`), Amber for In Progress (`#f59e0b`), Blue for Scheduled (`#3b82f6`)
* **Medical Viewer Canvas**: True radiology dark theme (`#0b0f17` / `#000000`), HUD overlays, series thumbnail ribbon, interactive toolbars (Zoom, Pan, Window/Level, Invert, Rotate, Measure, Reset).
* **Report View**: Clean clinical white-coat style document formatted for high-fidelity browser printing and PDF export.

---

## 3. Architecture & Project Structure

The project will be built with **Vite + React + TypeScript** with zero unnecessary bloat, clean modular CSS, Lucide icons, and modern Web APIs.

```text
/Users/matt/Desktop/HMI/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── types/
│   │   └── portal.ts          # Core domain models (User, Patient, Study, Series, Report, Filters)
│   │
│   ├── mock/
│   │   ├── users.ts           # John Tan (Patient), Dr. Sarah Lim (Doctor), Dr. Michael Lee (Radiologist)
│   │   ├── patients.ts        # 5 realistic patient records
│   │   ├── doctors.ts         # 3 referring specialists
│   │   ├── studies.ts         # 16+ diverse imaging studies (MRI, CT, X-Ray, US, Mammography)
│   │   └── reports.ts         # Diagnostic radiology reports with clinical findings & impressions
│   │
│   ├── services/
│   │   └── portalService.ts   # Async Promise-based API layer simulating backend queries & auth filtering
│   │
│   ├── context/
│   │   └── AuthContext.tsx    # Session management, role switching, demo shortcuts
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx     # Global header matching HMI/Zed screenshot + Demo Mode indicator
│   │   │   ├── Sidebar.tsx    # Role-adaptive sidebar navigation
│   │   │   ├── Layout.tsx     # Responsive portal frame
│   │   │   ├── StatusBadge.tsx # Semantic status pill
│   │   │   ├── Modal.tsx      # Reusable accessible dialog
│   │   │   └── Toast.tsx      # Notifications & feedback
│   │   ├── studies/
│   │   │   ├── StudyTable.tsx # Paginated, sortable study list with action buttons
│   │   │   ├── StudyFilters.tsx # Quick search bar mirroring the HMI portal filter panel
│   │   │   └── StudySummaryCards.tsx # Metric cards (Total, Recent, Reported)
│   │   ├── viewer/
│   │   │   ├── MedicalViewer.tsx # Shell supporting 'mock' mode and future 'meddream' integration
│   │   │   ├── ViewerHeader.tsx  # Patient banner & study HUD
│   │   │   ├── SeriesPanel.tsx   # Axial / Coronal / Sagittal series thumbnails
│   │   │   ├── ImageViewport.tsx # Canvas/viewport with interactive zoom, pan, W/L, invert
│   │   │   └── ViewerToolbar.tsx # Bottom control dock
│   │   └── reports/
│   │       └── RadiologyReportViewer.tsx # Formal SMG radiology report preview with print/download
│   │
│   └── pages/
│       ├── auth/
│       │   └── Login.tsx         # Enterprise login with 1-click Demo shortcuts (Patient & Doctor)
│       ├── patient/
│       │   ├── PatientDashboard.tsx
│       │   ├── PatientStudies.tsx
│       │   ├── PatientStudyDetails.tsx
│       │   ├── PatientViewer.tsx
│       │   └── PatientReport.tsx
│       └── doctor/
│           ├── DoctorDashboard.tsx
│           ├── DoctorPatients.tsx
│           ├── DoctorPatientDetails.tsx
│           ├── DoctorStudies.tsx
│           ├── DoctorStudyDetails.tsx
│           ├── DoctorViewer.tsx
│           └── DoctorReport.tsx
```

---

## 4. Reusable Component Inventory & Contracts

1. **`MedicalViewer`** (`src/components/viewer/MedicalViewer.tsx`)
   * **Props**: `study: ImagingStudy`, `reportId?: string`, `onReportClick?: () => void`, `viewerMode?: 'mock' | 'meddream'`
   * **Features**: Fullscreen toggle, Zoom in/out, Pan drag, Window/Level adjustments, Invert, Rotate 90°, Crosshair/Measure ruler, Reset, Series switching.
2. **`RadiologyReportViewer`** (`src/components/reports/RadiologyReportViewer.tsx`)
   * **Props**: `study: ImagingStudy`, `report: RadiologyReport`, `onViewerClick?: () => void`
   * **Features**: Clean clinical letterhead ("SMG MEDICAL CENTRE - RADIOLOGY DEPARTMENT"), barcode simulation, structured Clinical History, Technique, Findings, Impression, Digital Signature, "Print Report" (`window.print()`), "Download PDF" (simulated save).
3. **`StudyFilters`** (`src/components/studies/StudyFilters.tsx`)
   * **Props**: `filters: StudyFilterState`, `onFilterChange: (f: StudyFilterState) => void`, `onReset: () => void`, `isDoctorView?: boolean`
   * **Fields**: Patient Name, Patient ID, Patient DOB, Accession No., Modality dropdown, Date Range, Status.
4. **`StudyTable`** (`src/components/studies/StudyTable.tsx`)
   * **Columns**: Study Date, Accession #, Description, Modality, Body Part, Referring Doctor / Radiologist, Status, Actions (`[View Details]`, `[Images]`, `[Report]`).

---

## 5. Security & Authorization Matrix

| User Role | Assigned Studies | Unassigned Studies | Other Patients' Records |
| :--- | :--- | :--- | :--- |
| **Patient (John Tan)** | Full Access (Viewer + Report) | Access Denied | Access Denied |
| **Referring Doctor (Dr. Sarah Lim)** | Full Access (Viewer + Report) | Access Denied ("You do not have permission...") | Filtered from Patient list |
| **Radiologist (Dr. Michael Lee)** | Full Diagnostic Access | Full Diagnostic Access | Authorized across department |

---

## 6. Implementation Roadmap

* **Phase 1**: Codebase & Architecture Analysis *(Completed)*
* **Phase 2**: Mock Domain Models & Asynchronous Service Layer (`mock/*`, `types/*`, `services/*`)
* **Phase 3**: Core Shell, Authentication & Layout (HMI Zed style login, header, sidebar, demo badge)
* **Phase 4**: Patient Portal Workflow (Dashboard, My Studies, Study Details, Medical Viewer, Report)
* **Phase 5**: Doctor Portal Workflow (Operational Dashboard, Patients Directory, Comprehensive Filters, Studies, Viewer, Report)
* **Phase 6**: Frontend Authorization Enforcement & Access Denial Screens
* **Phase 7**: Visual Polish, Loading/Empty/Error States, Responsive Design
* **Phase 8**: Build Validation, E2E Smoke Testing & Demo Verification
