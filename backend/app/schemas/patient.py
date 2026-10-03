from typing import Optional
from pydantic import BaseModel, ConfigDict


class PatientResponse(BaseModel):
    id: int
    patient_number: str
    first_name: str
    last_name: str
    full_name: str
    date_of_birth: str
    gender: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    nric_passport: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
