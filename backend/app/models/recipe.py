#backend/app/models/recipe.py
from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class RecipeCreate(BaseModel):
  recipe_name: str
  parameters: Dict[
      str, Any
  ]  # Parámetros libres (ej. ingredientes, intensidades, variables para el S7-1200)


class RecipeInDB(RecipeCreate):
  id: Optional[str] = Field(default=None, alias="_id")
  user_email: str
  created_at: datetime = Field(default_factory=datetime.utcnow)

  class Config:
    populate_by_name = True
    arbitrary_types_allowed = True

