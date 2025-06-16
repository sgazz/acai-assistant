from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from llm_client import llm_client
from supabase_client import supabase

app = FastAPI()

# Učitavanje environment promenljivih
load_dotenv()

# Konfiguracija CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class MessageIn(BaseModel):
    content: str
    sender: str  # 'user' ili 'assistant'
    timestamp: Optional[str] = None

class MessageOut(BaseModel):
    id: int
    content: str
    sender: str
    timestamp: str

@app.get("/")
def read_root():
    return {"message": "ACAI Assistant backend radi!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/users")
def get_users():
    response = supabase.table("users").select("*").execute()
    return response.data

@app.get("/messages", response_model=List[MessageOut])
def get_messages():
    try:
        response = supabase.table("messages").select("*").order("timestamp", desc=False).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/messages", response_model=MessageOut)
def save_message(message: MessageIn):
    try:
        data = message.dict()
        if not data.get("timestamp"):
            from datetime import datetime
            data["timestamp"] = datetime.utcnow().isoformat()
        response = supabase.table("messages").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    try:
        # Sistem prompt koji definiše ponašanje asistenta
        system_prompt = """Ti si ACAI (Advanced Coding AI) Assistant, napredni AI asistent za programiranje.
        Tvoj zadatak je da pomažeš korisnicima sa programiranjem, razvojem softvera i tehničkim pitanjima.
        Odgovaraj na srpskom jeziku, jasno i koncizno.
        Fokusiraj se na pružanje praktičnih saveta i konkretnih primera."""
        
        # Generisanje odgovora preko Ollama
        response = await llm_client.generate_response(
            prompt=message.message,
            system_prompt=system_prompt
        )
        
        return ChatResponse(response=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 