import os
from typing import List, Dict, Any
from fastapi import UploadFile
import tempfile
from rag.rag_service import RAGService
from rag.document_processor import DocumentProcessor
from supabase_client import supabase
import logging
import uuid

# Konfiguracija logovanja
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGClient:
    def __init__(self):
        self.rag_service = RAGService()
        self.index_path = os.path.join(os.path.dirname(__file__), "data", "rag_index")
        self.temp_dir = os.path.join(os.path.dirname(__file__), "data", "temp")
        os.makedirs(self.temp_dir, exist_ok=True)
        self._load_or_create_index()

    def _load_or_create_index(self):
        """Učitava postojeći indeks ili kreira novi"""
        if os.path.exists(self.index_path):
            try:
                self.rag_service.load_index(self.index_path)
            except Exception as e:
                logger.error(f"Greška pri učitavanju indeksa: {str(e)}")
                os.makedirs(self.index_path, exist_ok=True)
        else:
            os.makedirs(self.index_path, exist_ok=True)

    async def process_document(self, file: UploadFile) -> Dict[str, Any]:
        """Procesira uploadovani dokument"""
        temp_file_path = os.path.join(self.temp_dir, file.filename)
        logger.info(f"Započinjem procesiranje dokumenta: {file.filename}")
        
        try:
            # Čuvamo fajl u privremeni direktorijum
            logger.info("Čuvam fajl u privremeni direktorijum...")
            content = await file.read()
            with open(temp_file_path, 'wb') as f:
                f.write(content)
            logger.info(f"Fajl uspešno sačuvan u: {temp_file_path}")
            
            # Procesiramo dokument
            logger.info("Započinjem procesiranje dokumenta...")
            documents = DocumentProcessor.process_file(temp_file_path)
            logger.info(f"Dokument uspešno procesiran. Broj stranica: {len(documents)}")
            
            # Čuvamo dokument u Supabase
            try:
                logger.info("Pokušavam da sačuvam dokument u Supabase...")
                # Generišemo UUID za dokument
                document_id = str(uuid.uuid4())
                
                # Prvo čuvamo osnovne informacije o dokumentu
                document_data = {
                    "id": document_id,
                    "filename": file.filename,
                    "file_type": os.path.splitext(file.filename)[1].lower(),
                    "total_pages": len(documents),
                    "status": "processed"
                }
                
                logger.info(f"Čuvam osnovne informacije o dokumentu: {document_data}")
                # Čuvamo dokument u Supabase
                result = supabase.table("documents").insert(document_data).execute()
                logger.info(f"Osnovne informacije uspešno sačuvane. Result: {result}")
                
                # Čuvamo sadržaj stranica
                logger.info("Započinjem čuvanje sadržaja stranica...")
                for i, doc in enumerate(documents):
                    page_data = {
                        "id": str(uuid.uuid4()),
                        "document_id": document_id,
                        "page_number": i + 1,
                        "content": doc["content"],
                        "metadata": doc["metadata"]
                    }
                    page_result = supabase.table("document_pages").insert(page_data).execute()
                    logger.info(f"Stranica {i+1} uspešno sačuvana")
                
                logger.info(f"Dokument uspešno sačuvan u Supabase sa ID: {document_id}")
            except Exception as e:
                logger.error(f"Greška pri čuvanju dokumenta u Supabase: {str(e)}")
                raise
            
            # Dodajemo u indeks
            logger.info("Dodajem dokument u RAG indeks...")
            self.rag_service.add_documents(documents)
            
            # Čuvamo indeks
            logger.info("Čuvam RAG indeks...")
            self.rag_service.save_index(self.index_path)
            logger.info("RAG indeks uspešno sačuvan")
            
            return {
                "status": "success",
                "message": f"Uspešno procesiran dokument: {file.filename}",
                "documents_processed": len(documents),
                "document_id": document_id
            }
        except Exception as e:
            logger.error(f"Greška pri procesiranju dokumenta: {str(e)}")
            raise
        finally:
            # Čistimo privremeni fajl
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                logger.info("Privremeni fajl obrisan")

    def search_documents(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """Pretražuje dokumente na osnovu upita"""
        return self.rag_service.search(query, k)

    def get_context_for_query(self, query: str, k: int = 3) -> Dict[str, Any]:
        """Dobavlja kontekst za upit koji će se koristiti sa LLM-om"""
        results = self.search_documents(query, k)
        context = "\n\n".join([doc["content"] for doc in results])
        sources = [
            {
                "filename": doc["metadata"].get("source", "Unknown"),
                "page_number": doc["metadata"].get("page", 0),
                "content": doc["content"][:200] + "..." if len(doc["content"]) > 200 else doc["content"]  # Dodajemo kratak citat
            }
            for doc in results
        ]
        return {
            "context": context,
            "sources": sources
        } 