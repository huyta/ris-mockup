from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class StudyImageResponse(BaseModel):
    id: int
    instance_number: int
    image_url: str
    thumbnail_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class StudySeriesResponse(BaseModel):
    id: int
    series_number: int
    description: str
    modality: str
    plane: str
    thumbnail_url: Optional[str] = None
    slice_thickness: Optional[str] = None
    kvp: Optional[str] = None
    images: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class StudyListItemResponse(BaseModel):
    id: int
    patient_id: int
    patient_number: str
    patient_name: str
    patient_dob: str
    gender: str
    accession_number: str
    study_date: str
    modality: str
    body_part: str
    description: str
    facility: str
    radiologist: str
    status: str
    has_report: bool = False
    report_id: Optional[int] = None
    referring_doctor_name: Optional[str] = None
    assigned_doctor_ids: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class StudyDetailResponse(StudyListItemResponse):
    clinical_history: Optional[str] = None
    series: List[StudySeriesResponse] = []


class ViewerInfo(BaseModel):
    type: str = "MOCK"
    url: Optional[str] = None


class ViewerResponse(BaseModel):
    study: StudyDetailResponse
    series: List[StudySeriesResponse]
    viewer: ViewerInfo
