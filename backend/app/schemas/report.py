from typing import Optional
from pydantic import BaseModel, ConfigDict


class RadiologyReportResponse(BaseModel):
    id: int
    study_id: int
    accession_number: str
    order_item_id: Optional[int] = None
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    patient_dob: Optional[str] = None
    modality: Optional[str] = None
    body_part: Optional[str] = None
    study_date: Optional[str] = None
    facility: Optional[str] = None
    clinical_history: str
    technique: str
    comparison: Optional[str] = None
    findings: str
    impression: str
    reported_by: str
    radiologist_title: Optional[str] = None
    reported_date: str
    status: str

    model_config = ConfigDict(from_attributes=True)
