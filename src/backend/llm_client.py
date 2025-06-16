import requests
from typing import List, Dict, Any
import json

class LLMClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        # Podrazumevano koristimo Mistral model
        self.model = "mistral"
    
    async def generate_response(self, prompt: str, system_prompt: str = "") -> str:
        """
        Generiše odgovor koristeći Ollama API.
        """
        try:
            # Formatiramo prompt sa system promptom
            full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
            
            # Ollama API endpoint za generisanje
            url = f"{self.base_url}/api/generate"
            
            # Parametri za zahtev
            data = {
                "model": self.model,
                "prompt": full_prompt,
                "stream": False
            }
            
            # Šaljemo zahtev
            response = requests.post(url, json=data)
            response.raise_for_status()
            
            # Parsiramo odgovor
            result = response.json()
            return result.get("response", "")
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Greška pri komunikaciji sa Ollama: {str(e)}"
            if "Connection refused" in str(e):
                error_msg = "Nije moguće povezati se sa Ollama servisom. Proverite da li je Ollama pokrenuta."
            raise Exception(error_msg)
        except Exception as e:
            raise Exception(f"Neočekivana greška: {str(e)}")

# Kreiramo globalnu instancu
llm_client = LLMClient() 