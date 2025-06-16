from typing import List, Dict, Any
import PyPDF2
import docx
import os
import logging

# Konfiguracija logovanja
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentProcessor:
    @staticmethod
    def process_file(file_path: str) -> List[Dict[str, Any]]:
        """Procesira fajl i vraća listu dokumenta"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        logger.info(f"Procesiranje fajla: {file_path}")
        
        if file_extension == '.pdf':
            return DocumentProcessor._process_pdf(file_path)
        elif file_extension == '.docx':
            return DocumentProcessor._process_docx(file_path)
        else:
            raise ValueError(f"Ne podržani format fajla: {file_extension}")

    @staticmethod
    def _process_pdf(file_path: str) -> List[Dict[str, Any]]:
        """Procesira PDF fajl"""
        documents = []
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                total_pages = len(pdf_reader.pages)
                logger.info(f"PDF fajl ima {total_pages} strana")
                
                for page_num in range(total_pages):
                    try:
                        page = pdf_reader.pages[page_num]
                        text = page.extract_text()
                        
                        if not text.strip():
                            logger.warning(f"Strana {page_num + 1} je prazna")
                            continue
                            
                        documents.append({
                            "content": text,
                            "metadata": {
                                "source": file_path,
                                "page": page_num + 1,
                                "type": "pdf"
                            }
                        })
                        logger.info(f"Uspešno procesirana strana {page_num + 1}")
                    except Exception as e:
                        logger.error(f"Greška pri procesiranju stranice {page_num + 1}: {str(e)}")
                        continue
                        
            if not documents:
                logger.error("Nijedna stranica nije uspešno procesirana")
                raise Exception("Nije moguće izvući tekst iz PDF fajla")
                
            return documents
        except Exception as e:
            logger.error(f"Greška pri procesiranju PDF fajla: {str(e)}")
            raise

    @staticmethod
    def _process_docx(file_path: str) -> List[Dict[str, Any]]:
        """Procesira DOCX fajl"""
        documents = []
        try:
            doc = docx.Document(file_path)
            logger.info(f"Procesiranje DOCX fajla: {file_path}")
            
            # Grupišemo paragrafe u veće delove
            current_chunk = []
            for para in doc.paragraphs:
                if para.text.strip():
                    current_chunk.append(para.text)
                    if len(current_chunk) >= 3:  # Grupišemo po 3 paragrafa
                        documents.append({
                            "content": "\n".join(current_chunk),
                            "metadata": {
                                "source": file_path,
                                "type": "docx"
                            }
                        })
                        current_chunk = []
            
            # Dodajemo preostale paragrafe
            if current_chunk:
                documents.append({
                    "content": "\n".join(current_chunk),
                    "metadata": {
                        "source": file_path,
                        "type": "docx"
                    }
                })
            
            if not documents:
                logger.error("Nijedan paragraf nije uspešno procesiran")
                raise Exception("Nije moguće izvući tekst iz DOCX fajla")
                
            logger.info(f"Uspešno procesirano {len(documents)} delova teksta")
            return documents
        except Exception as e:
            logger.error(f"Greška pri procesiranju DOCX fajla: {str(e)}")
            raise 