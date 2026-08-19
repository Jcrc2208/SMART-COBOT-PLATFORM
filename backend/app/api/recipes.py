
from app.core.database import database
from app.models.recipe import RecipeCreate
from bson import ObjectId
from datetime import datetime


async def create_recipe_in_db(user_email: str, recipe_in: RecipeCreate):
  """Guarda una nueva receta o configuración en la colección 'recipes' de MongoDB."""
  recipe_data = recipe_in.dict()
  recipe_data["user_email"] = user_email
  recipe_data["created_at"] = datetime.utcnow()

  # Inserta el documento en MongoDB
  result = await database["recipes"].insert_one(recipe_data)

  # Recupera el documento insertado transformando el ObjectId a string para que Pydantic no llore
  created_recipe = await database["recipes"].find_one(
      {"_id": result.inserted_id}
  )
  created_recipe["_id"] = str(created_recipe["_id"])

  return created_recipe


async def get_user_recipes(user_email: str):
  """Obtiene todas las recetas guardadas de un usuario específico."""
  cursor = database["recipes"].find({"user_email": user_email}).sort(
      "created_at", -1
  )
  recipes = []
  async for document in cursor:
    document["_id"] = str(document["_id"])
    recipes.append(document)
  return recipes


async def get_recipe_by_id(recipe_id: str):
  """Busca una receta específica por su ID (para cuando el usuario quiera repetirla en el PLC)."""
  if not ObjectId.is_valid(recipe_id):
    return None

  document = await database["recipes"].find_one({"_id": ObjectId(recipe_id)})
  if document:
    document["_id"] = str(document["_id"])
  return document