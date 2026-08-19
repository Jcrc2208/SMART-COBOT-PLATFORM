#backend/app/core/database.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
  # Solo para uso en entorno local, en producción se recomienda usar variables de entorno
  MONGO_DETAILS: str = os.getenv(
      "MONGO_DETAILS", "mongodb://localhost:27017"
  )
  DATABASE_NAME: str = "smart_cobot_db"

  class Config:
    env_file = ".env"


settings = Settings()

# Instancias globales para el cliente y la base de datos
client: AsyncIOMotorClient = None
database = None


async def connect_to_mongo():
  global client, database
  client = AsyncIOMotorClient(settings.MONGO_DETAILS)
  database = client[settings.DATABASE_NAME]
  print("¡Conectado exitosamente a MongoDB! 🚀")


async def close_mongo_connection():
  global client
  if client:
    client.close()
    print("Conexión a MongoDB cerrada.")