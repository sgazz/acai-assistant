import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

# Konfiguracija logovanja
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

logger.info(f"Učitavam Supabase konfiguraciju...")
logger.info(f"SUPABASE_URL je postavljen: {'Da' if SUPABASE_URL else 'Ne'}")
logger.info(f"SUPABASE_SERVICE_KEY je postavljen: {'Da' if SUPABASE_SERVICE_KEY else 'Ne'}")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("SUPABASE_URL i SUPABASE_SERVICE_KEY moraju biti postavljeni u .env fajlu")

try:
    logger.info("Pokušavam da inicijalizujem Supabase klijenta...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    logger.info("Supabase klijent je uspešno inicijalizovan!")
except Exception as e:
    logger.error(f"Greška pri inicijalizaciji Supabase klijenta: {str(e)}")
    raise 