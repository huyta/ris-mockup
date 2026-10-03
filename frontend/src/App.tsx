import React from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigation } from './context/NavigationContext';
import { Layout } from './components/common/Layout';
import { Login } from './pages/auth/Login';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientStudies } from './pages/patient/PatientStudies';
import { PatientStudyDetails } from './pages/patient/PatientStudyDetails';
import { PatientViewer } from './pages/patient/PatientViewer';
import { PatientReport } from './pages/patient/PatientReport';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorPatients } from './pages/doctor/DoctorPatients';
import { DoctorPatientDetails } from './pages/doctor/DoctorPatientDetails';
import { DoctorStudies } from './pages/doctor/DoctorStudies';
import { DoctorStudyDetails } from './pages/doctor/DoctorStudyDetails';
import { DoctorViewer } from './pages/doctor/DoctorViewer';
import { DoctorReport } from './pages/doctor/DoctorReport';

export const App: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentPath, params } = useNavigation();

  // If on /login or not authenticated, render Login
  if (currentPath === '/login' || !currentUser) {
    return <Login />;
  }

  // Determine current page component
  const renderContent = () => {
    // Patient Routes
    if (currentPath === '/patient') {
      return <PatientDashboard />;
    }
    if (currentPath === '/patient/studies' || currentPath.startsWith('/patient/studies?')) {
      return <PatientStudies />;
    }
    if (currentPath.includes('/patient/studies/') && currentPath.endsWith('/viewer')) {
      return <PatientViewer />;
    }
    if (currentPath.includes('/patient/studies/') && currentPath.endsWith('/report')) {
      return <PatientReport />;
    }
    if (currentPath.startsWith('/patient/studies/') && params.studyId) {
      return <PatientStudyDetails />;
    }

    // Doctor Routes
    if (currentPath === '/doctor') {
      return <DoctorDashboard />;
    }
    if (currentPath === '/doctor/patients') {
      return <DoctorPatients />;
    }
    if (currentPath.startsWith('/doctor/patients/') && params.patientId) {
      return <DoctorPatientDetails />;
    }
    if (currentPath === '/doctor/studies' || currentPath.startsWith('/doctor/studies?')) {
      return <DoctorStudies />;
    }
    if (currentPath.includes('/doctor/studies/') && currentPath.endsWith('/viewer')) {
      return <DoctorViewer />;
    }
    if (currentPath.includes('/doctor/studies/') && currentPath.endsWith('/report')) {
      return <DoctorReport />;
    }
    if (currentPath.startsWith('/doctor/studies/') && params.studyId) {
      return <DoctorStudyDetails />;
    }

    // Fallback based on role
    if (currentUser.role === 'PATIENT') {
      return <PatientDashboard />;
    } else {
      return <DoctorDashboard />;
    }
  };

  return <Layout>{renderContent()}</Layout>;
};
