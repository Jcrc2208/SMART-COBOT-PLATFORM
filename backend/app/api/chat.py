# backend/app/api/chat.py
import os
import httpx
from fastapi import APIRouter
from pydantic import BaseModel


def _load_env():
    path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
    path = os.path.abspath(path)
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                os.environ.setdefault(key, value)


_load_env()

router = APIRouter(prefix="/api", tags=["chat"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "openai/gpt-oss-20b"

SYSTEM_PROMPT = """Eres el asistente de **Fragrance Bar**, una perfumería artesanal de lujo.
Tu rol es ayudar al cliente a descubrir y crear su fragancia ideal.

Guidelines:
- Pregunta sobre preferencias: ¿le gustan las notas florales, amaderadas, cítricas, orientales, frescas?
- Sugiere combinaciones de fragancias y explica por qué funcionan juntas.
- Si el cliente describe un recuerdo o emoción, tradúcelo a notas de fragancia.
- Sé cálido, elegante y persuasivo sin ser insistente.
- Responde en el idioma que el cliente use (español o inglés).
- Sé conciso: máximo 2-3 párrafos por respuesta.
- Cuando tengas suficiente info, propón una fórmula concreta con notas de salida, corazón y fondo."""


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message.strip():
        return ChatResponse(reply="")

    if not GROQ_API_KEY:
        return ChatResponse(reply="Falta la clave de API de Groq. Configura GROQ_API_KEY en el .env.")

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in req.history:
        role = h.get("role")
        content = h.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": req.message})

    payload = {
        "model": MODEL,
        "temperature": 0.7,
        "max_tokens": 512,
        "messages": messages,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(GROQ_URL, json=payload, headers=headers)
        data = res.json()
        reply = data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error llamando a Groq: {e}")
        reply = "Lo siento, tuve un problema al generar la respuesta. Intenta de nuevo."

    return ChatResponse(reply=reply)
