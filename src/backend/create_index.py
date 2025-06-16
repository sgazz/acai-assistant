from rag.rag_service import RAGService
import os

def create_initial_index():
    # Kreiranje instance RAG servisa
    rag_service = RAGService()
    
    # Osnovni dokumenti za indeks
    initial_documents = [
        {
            "content": "ACAI Assistant je AI asistent koji koristi RAG tehnologiju za pružanje preciznih odgovora.",
            "metadata": {"source": "system", "type": "description"}
        },
        {
            "content": "RAG (Retrieval-Augmented Generation) je tehnika koja kombinuje pretragu dokumenata sa generativnim AI modelima.",
            "metadata": {"source": "system", "type": "explanation"}
        }
    ]
    
    # Dodavanje dokumenata u indeks
    rag_service.add_documents(initial_documents)
    
    # Čuvanje indeksa
    index_path = os.path.join("data", "rag_index")
    rag_service.save_index(index_path)
    
    print("Indeks je uspešno kreiran!")

if __name__ == "__main__":
    create_initial_index() 