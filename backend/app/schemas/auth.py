from typing import Optional
from pydantic import BaseModel, ConfigDict


class LoginRequest(BaseModel):
    username: str
    password: str


class UserInfo(BaseModel):
    id: int
    username: str
    email: str
    name: str
    role: str
    patient_id: Optional[int] = None
    patient_number: Optional[str] = None
    doctor_id: Optional[int] = None
    doctor_number: Optional[str] = None
    facility: Optional[str] = None
    specialty: Optional[str] = None
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo
