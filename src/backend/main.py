from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from llm_client import llm_client
from supabase_client import supabase
from rag_client import RAGClient

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

# Inicijalizacija RAG klijenta
rag_client = RAGClient()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[Dict[str, Any]]] = None

class MessageIn(BaseModel):
    content: str
    sender: str  # 'user' ili 'assistant'
    timestamp: Optional[str] = None

class MessageOut(BaseModel):
    id: int
    content: str
    sender: str
    timestamp: str

class Document(BaseModel):
    id: str
    filename: str
    file_type: str
    total_pages: int
    status: str
    created_at: Optional[str] = None

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
        
        VAŽNO - DOKUMENT MODE:
        1. Koristi informacije iz dostavljenog konteksta kao primarni izvor za svoje odgovore.
        2. Ako informacija nije u kontekstu, jasno kaži "Ova informacija nije dostupna u dokumentu."
        3. Možeš koristiti svoje postojeće znanje SAMO ako je potrebno za:
           - Objašnjavanje koncepata iz dokumenta
           - Povezivanje informacija iz dokumenta
           - Davanje praktičnih primera
        4. Ako kontekst nije dostupan ili je prazan, možeš dati opšti odgovor, ali jasno naznači da nema specifičnih informacija iz dokumenta.
        
        Pravila za odgovore:
        - Odgovaraj na srpskom jeziku
        - Budi precizan i koncizan
        - Citiraj tačne delove iz dokumenta kada je to relevantno
        - Ako je potrebno više informacija, traži da se uploaduje dodatna dokumentacija"""
        
        # Dobavljanje relevantnog konteksta iz RAG sistema
        rag_result = rag_client.get_context_for_query(message.message)
        context = rag_result["context"]
        sources = rag_result["sources"]
        
        # Dodavanje konteksta u prompt ako postoji
        if context:
            enhanced_prompt = f"""DOKUMENT MODE - Koristi sledeći kontekst iz dokumenta kao primarni izvor:
            {context}
            
            Korisničko pitanje: {message.message}
            
            VAŽNO: 
            - Koristi gore navedeni kontekst kao primarni izvor informacija
            - Ako informacija nije u kontekstu, kaži "Ova informacija nije dostupna u dokumentu"
            - Možeš koristiti svoje znanje za objašnjavanje i povezivanje informacija iz dokumenta"""
        else:
            enhanced_prompt = f"""DOKUMENT MODE - Nema dostupnog konteksta iz dokumenta.
            
            Korisničko pitanje: {message.message}
            
            VAŽNO: 
            - Pošto nema dostupnog konteksta, možeš dati opšti odgovor
            - Jasno naznači da nema specifičnih informacija iz dokumenta
            - Fokusiraj se na praktične savete i primere"""
        
        # Generisanje odgovora preko Ollama
        response = await llm_client.generate_response(
            prompt=enhanced_prompt,
            system_prompt=system_prompt
        )
        
        return ChatResponse(response=response, sources=sources)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents", response_model=List[Document])
async def get_documents():
    """Endpoint za dohvatanje liste dokumenata"""
    try:
        response = supabase.table("documents").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents/{document_id}/pages")
async def get_document_pages(document_id: str):
    """Endpoint za dohvatanje stranica dokumenta"""
    try:
        response = supabase.table("document_pages").select("*").eq("document_id", document_id).order("page_number").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    """Endpoint za upload dokumenata"""
    try:
        result = await rag_client.process_document(file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents/search")
async def search_documents(query: str, k: int = 3):
    """Endpoint za pretragu dokumenata"""
    try:
        results = rag_client.search_documents(query, k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Endpoint za brisanje dokumenta"""
    try:
        # Prvo brišemo stranice dokumenta (cascade delete će se izvršiti automatski)
        response = supabase.table("documents").delete().eq("id", document_id).execute()
        return {"status": "success", "message": "Dokument uspešno obrisan"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents/check-duplicate")
async def check_duplicate_document(filename: str):
    """Endpoint za proveru duplikata dokumenata"""
    try:
        response = supabase.table("documents").select("id").eq("filename", filename).execute()
        is_duplicate = len(response.data) > 0
        return {"isDuplicate": is_duplicate}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 