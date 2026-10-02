# CLI Radiology Portal — SMG RIS Demo

A high-fidelity frontend mockup and interactive prototype for the **CLI Radiology Portal**, inspired by enterprise RIS & DICOM portals (powered by modern RIS + MedDream / PACS architecture).

🌐 **Live Demo (GitHub Pages):** [https://huyta.github.io/ris-mockup/](https://huyta.github.io/ris-mockup/)

---

## 🎯 Key Features

1. **Role-Based Workflows**:
   - **Patient Portal (John Tan - `P00010001`)**:
     - Dashboard with imaging history and metrics.
     - Search & filter studies by modality (MRI, CT, X-Ray, Ultrasound, Mammogram).
     - Study details and clinical indication review.
     - Direct launch of multi-series DICOM Medical Viewer and verified radiology reports.
   - **Referring Doctor / Specialist Portal (Dr. Sarah Lim - `D00021`)**:
     - Specialist dashboard with operational referral metrics.
     - Assigned Patients Directory with search by name, ID, or DOB.
     - Multi-tab patient record (*Imaging Studies*, *Radiology Reports*, *Demographics*).
     - Advanced Quick Search filter panel.
2. **Interactive Medical DICOM Viewer**:
   - Multi-series selection ribbon (*Axial T2*, *Sagittal T1*, *Coronal FLAIR*, *3D*).
   - Real-time controls: Zoom +/-, Pan drag, Window/Level presets (Bone, Brain, Soft Tissue), Grayscale inversion, 90° rotation, caliper distance measurement, fullscreen, and HUD overlay.
   - Seamless two-way navigation between medical images and verified diagnostic reports.
3. **Formal Radiology Report Viewer**:
   - High-fidelity letterhead replicating SMG Result Entry format.
   - Structured Clinical History, Technique, Comparison, Findings, Impression, and electronic authentication by consultant radiologist (Dr. Michael Lee).
   - One-click browser printing (`window.print()`) and simulated PDF download.
4. **Simulated Frontend Authorization**:
   - Enforces strict patient data privacy (`study.patientId === currentUser.patientId`).
   - Restricts physician access to assigned studies (`currentUser.doctorId in study.assignedDoctorIds`).
   - Clean, secure *Access Denied* fallbacks for unauthorized URLs.
5. **1-Click Demo Personas**:
   - Fast login buttons on the sign-in screen.
   - Top-bar persona switcher to toggle between Patient, Referring Specialist, Neurologist, and GP.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ (or Node 20)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/huyta/ris-mockup.git
cd ris-mockup

# Switch to the demo branch
git checkout cli-demo

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open **[http://localhost:3000/#/login](http://localhost:3000/#/login)** in your browser.

---

## 📦 Build & Deploy

```bash
# Type check and build production bundle
npm run build

# Deploy to GitHub Pages
npm run deploy
```

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages upon pushing to `cli-demo` or `main`.

---

## 🛠 Tech Stack
- **React 18**
- **TypeScript**
- **Vite 4**
- **Lucide Icons**
- **Vanilla CSS** with healthcare design system tokens
