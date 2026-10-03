from typing import Optional
from pydantic import BaseModel, ConfigDict


class PatientDashboardResponse(BaseModel):
    total_studies: int
    recent_studies: int
    reports_available: int
    latest_study_date: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DoctorDashboardResponse(BaseModel):
    assigned_patients: int
    new_studies: int
    reports_available: int

    model_config = ConfigDict(from_attributes=True)
