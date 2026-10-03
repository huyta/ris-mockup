from typing import List, Optional
from pydantic import BaseModel, ConfigDict

from app.schemas.patient import PatientResponse
from app.schemas.study import StudyListItemResponse


class DoctorResponse(BaseModel):
    id: int
    doctor_number: str
    first_name: str
    last_name: str
    full_name: str
    specialty: str
    clinic: str
    email: str
    phone: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DoctorPatientDetailResponse(BaseModel):
    patient: PatientResponse
    study_count: int
    studies: List[StudyListItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
