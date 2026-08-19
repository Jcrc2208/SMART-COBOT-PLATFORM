# backend/app/services/ai_service.py
import os
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

# Inicializa el cliente de OpenAI (asegúrate de tener tu OPENAI_API_KEY en el archivo .env)
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# 1. Define el esquema exacto que la IA debe entregar (Pydantic Structured Outputs)
class RecetaPLCParameters(BaseModel):
  recipe_name: str = Field(
      description=(
          "Un nombre creativo para la receta o producto generado (ej. Perfume"
          " Cítrico Nocturno)"
      )
  )
  nota_salida: str = Field(description="Ingrediente o componente de salida")
  nota_corazon: str = Field(description="Ingrediente o componente principal")
  intensidad_ml: int = Field(
      description="Cantidad o volumen numérico entre 1 y 50"
  )
  velocidad_cobot: int = Field(
      description=(
          "Nivel de velocidad para el robot colaborativo, de 1 (lento) a 3"
          " (rápido)"
      )
  )
  id_rutina_plc: int = Field(
      description=(
          "Número de rutina interna que el S7-1200/1500 debe ejecutar (ej. 1,"
          " 2 o 3)"
      )
  )


async def procesar_conversacion_con_ia(historial_mensajes: list):
  """Envía el historial del chat a OpenAI y fuerza a que la respuesta

  cumpla estrictamente con el esquema Pydantic para el PLC.
  """
  try:
    response = await client.beta.chat.completions.parse(
        model="gpt-4o",  # O gpt-4o-mini que es más económico y rápido
        messages=historial_mensajes,
        response_format=RecetaPLCParameters,
    )

    # El objeto estructurado listo para guardarse en MongoDB y mandarse al PLC
    receta_estructurada = response.choices[0].message.parsed
    return receta_estructurada

  except Exception as e:
    print(f"Error procesando la IA: {e}")
    return None