#backend/app/models/user.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserInDB(BaseModel):
  id: Optional[str] = Field(default=None, alias="_id")
  google_id: str
  email: EmailStr
  name: str
  avatar_url: Optional[str] = None
  created_at: datetime = Field(default_factory=datetime.utcnow)

  class Config:
    populate_by_name = True
    arbitrary_types_allowed = True