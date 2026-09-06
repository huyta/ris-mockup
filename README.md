# HealthSys RIS – Complete System Mockup

A **standalone, clickable HTML mockup** of the full end-to-end Radiology Information System (RIS) and Interop workflow. No backend, database, or build step required.

## 🚀 How to Run

1. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
2. That's it. No server needed. Everything runs via `file://`.
3. State is persisted in `localStorage` across browser sessions.

## 📂 Project Structure

```
mockup/
├── index.html          ← Main entry point (open this)
├── README.md           ← This file
├── css/
│   └── styles.css      ← Complete design system (765 lines)
├── js/
│   ├── mock-data.js    ← Comprehensive mock data (8 patients, 12 orders, etc.)
│   ├── state.js        ← State management, event bus, status transitions
│   ├── components.js   ← Reusable UI component factories
│   └── app.js          ← SPA router, all page views, actions, scenarios
└── assets/             ← (Reserved for future icons/images)
```

## 🖥️ Main Screens

| Screen | Description |
|--------|-------------|
| **Dashboard** | KPIs, recent activity, quick actions, system health |
| **Patient Registry** | Patient list, search, registration (ADT simulation) |
| **Patient Detail** | Demographics, encounters, orders, status history |
| **Radiology Orders** | Order list with status tabs, create new order (ORM) |
| **Order Detail** | Full order info, linked study/report, status transitions |
| **Scheduling** | Appointment calendar, unscheduled orders, slot management |
| **Tech Worklist (MWL)** | Modality worklist simulator: check-in → start → complete |
| **Rad Worklist** | Reading queue sorted by priority, PACS viewer launch |
| **PACS Viewer** | Fullscreen overlay with image mock, report editor, sign-off |
| **Dispatch & Interop** | Outsourced tests, reflex/add-on, HL7 messages, retry/fail |
| **System Flow** | Interactive architecture diagram (clickable to navigate) |
| **Demo Scenarios** | 7 guided scenarios to demonstrate major workflows |

## 🎬 Demo Scenarios

| # | Scenario | What It Does |
|---|----------|-------------|
| 1 | **Normal Radiology Workflow** | Creates order → schedule → check-in → start → complete → read → report → finalize → HL7 ORU |
| 2 | **Outsourced Test (Interop)** | Origin dispatches test to partner lab, tracks receiving → processing → result sync |
| 3 | **Add-on Testing** | Destination lab adds extra test, shares barcode, syncs back |
| 4 | **Reflex Testing** | Auto-triggered follow-up test from initial findings |
| 5 | **Shared Barcode** | 3 tests sharing one barcode across dispatch records |
| 6 | **Failed Sync + Retry** | HL7 outbound fails, user retries, recovers |
| 7 | **Report Workflow** | Study ready for reading → open viewer → draft → sign → finalize → ORU |

Access via the **"Demo Scenarios"** sidebar link or the **Developer Panel** (bottom-right).

## 🔧 Developer Panel

The floating panel in the bottom-right corner shows:
- Current view and state counts
- Activity log (HL7, DICOM, MPPS events)
- Quick access to Demo Scenarios and State Reset

## 📊 Mock Data Overview

- **8 Patients** (diverse demographics, ages 25-82)
- **10 Encounters** (Outpatient, Inpatient, Emergency)
- **12 Orders** (all RIS statuses represented)
- **8 Appointments**
- **6 Modalities** (MR, CT, CR, US, MG, NM – Siemens, GE, Philips, Canon)
- **4 Rooms**
- **4 Radiologists** + **4 Technologists**
- **8 DICOM Studies**
- **6 Reports** (Draft, Preliminary, Finalized, Addendum, Amended)
- **6 Dispatch/Interop Records**
- **8 Outbound HL7/FHIR Messages**
- **15 Status History Events**
- **10 Procedure Catalog Items**

## 🔄 State Management

- State is initialized from `MOCK_DATA` on first load
- All changes are persisted to `localStorage` (`ris_mockup_state` key)
- Click **"Reset State"** in the Developer Panel to restore initial data
- Status transitions follow a validated state machine (e.g., `Scheduled` → `Arrived` → `In Progress` → `Completed`)

## ➕ How to Add a New Screen

1. In `js/app.js`, add a new entry to the `Pages` object:
   ```javascript
   Pages['my-new-page'] = {
     title: 'My New Page',
     render(params) {
       return UI.card('Title', 'Content here');
     }
   };
   ```
2. In `index.html`, add a sidebar nav link:
   ```html
   <a href="#" onclick="navigate('my-new-page');return false;" id="nav-my-new-page">📄 My New Page</a>
   ```
3. Navigate to it: `navigate('my-new-page')` or `navigate('my-new-page', { someParam: 'value' })`

## ⚠️ Important Notes

- This is a **UI mockup only** – no real API calls, DICOM connections, or HL7 messages.
- All state changes are simulated in JavaScript with realistic delays.
- No production source code was modified. Everything is self-contained in `mockup/`.
