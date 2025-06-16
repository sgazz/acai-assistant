# ACAI Assistant

## Opis
ACAI Assistant je napredni AI asistent za programiranje koji koristi Llama/Mistral model preko Ollama za generisanje odgovora. Aplikacija je razvijena koristeći Next.js za frontend i FastAPI za backend, sa Supabase kao bazom podataka.

## Tehnologije
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **Baza podataka**: Supabase
- **AI Model**: Llama/Mistral preko Ollama
- **State Management**: React Context API

## Struktura projekta
```
acai-assistant/
├── src/
│   ├── frontend/          # Next.js frontend aplikacija
│   │   ├── components/    # React komponente
│   │   ├── context/       # React Context za state management
│   │   ├── lib/          # API i utility funkcije
│   │   └── types/        # TypeScript tipovi
│   └── backend/          # FastAPI backend
│       ├── main.py       # Glavni backend fajl
│       ├── llm_client.py # Klijent za komunikaciju sa Ollama
│       └── supabase_client.py # Klijent za Supabase
├── start_servers.sh      # Skripta za pokretanje servera
└── ACAI_Assistant.command # Desktop ikonica za macOS
```

## Podešavanje
1. Klonirajte repozitorijum
2. Instalirajte zavisnosti:
   ```bash
   # Backend
   cd src/backend
   python -m venv venv
   source venv/bin/activate  # Na Windows-u: venv\Scripts\activate
   pip install -r requirements.txt

   # Frontend
   cd src/frontend
   npm install
   ```

3. Podesite environment varijable:
   ```bash
   # U src/backend direktorijumu
   cp .env.example .env
   ```
   Zatim uredite `.env` fajl i dodajte svoje vrednosti:
   ```
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_KEY=your_supabase_service_key_here
   OLLAMA_BASE_URL=http://localhost:11434
   ```

4. Pokrenite aplikaciju:
   - Koristite `start_servers.sh` skriptu ili
   - Pokrenite `ACAI_Assistant.command` na macOS-u

## Funkcionalnosti
- 💬 Chat interfejs sa podrškom za razmenu poruka
- 🤖 Integracija sa Llama/Mistral modelom preko Ollama
- 💾 Čuvanje istorije razgovora u Supabase bazi
- 🌙 Podrška za tamnu temu
- 🎨 Responzivan dizajn
- ⚡ Brzo učitavanje i odgovori

## Razvoj
- Implementiran je sistem za upravljanje stanjem koristeći React Context API
- Dodata je podrška za čuvanje poruka u Supabase bazi
- Implementirana je integracija sa Ollama za AI odgovore
- Dodata je skripta za lakše pokretanje servera
- Kreirana je desktop ikonica za macOS

## TODO
- [ ] Implementirati autentifikaciju korisnika
- [ ] Dodati podršku za različite jezike programiranja
- [ ] Implementirati sistem za čuvanje konverzacija
- [ ] Dodati podršku za deljenje konverzacija
- [ ] Implementirati sistem za ocenjivanje odgovora

## Licenca
MIT

[English](#english) | [Serbian](#serbian)

<a name="english"></a>
## English

### About the Project

ACAI Assistant is a modern web-based education system that uses RAG (Retrieval Augmented Generation) to provide a personalized learning experience.

### Technologies

- **Frontend**: Next.js, Tailwind CSS, Supabase Client
- **Backend**: FastAPI, Mistral 7B, Supabase
- **RAG Pipeline**: LangChain, all-MiniLM-L6-v2, pgvector

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/sgazz/acai-assistant.git
cd acai-assistant
```

2. Set up the development environment:
```bash
# Frontend
cd src/frontend
npm install
npm run dev

# Backend
cd src/backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Documentation

Detailed documentation is available in the `docs` directory:

- [Architecture](./docs/architecture/README.md)
- [API Documentation](./docs/api/README.md)
- [Development Guide](./docs/development/README.md)
- [Deployment](./docs/deployment/README.md)
- [Contributing](./docs/contributing/README.md)

### Contributing

Please read the [Contributing Guidelines](./docs/contributing/README.md) before starting work on the project.

### License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<a name="serbian"></a>
## Serbian

### O projektu

ACAI Assistant je modern web-based sistem za edukaciju koji koristi RAG (Retrieval Augmented Generation) za pružanje personalizovanog iskustva učenja.

### Tehnologije

- **Frontend**: Next.js, Tailwind CSS, Supabase Client
- **Backend**: FastAPI, Mistral 7B, Supabase
- **RAG Pipeline**: LangChain, all-MiniLM-L6-v2, pgvector

### Brzi Start

1. Klonirajte repozitorijum:
```bash
git clone https://github.com/sgazz/acai-assistant.git
cd acai-assistant
```

2. Postavite development environment:
```bash
# Frontend
cd src/frontend
npm install
npm run dev

# Backend
cd src/backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ili
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Dokumentacija

Detaljna dokumentacija se nalazi u `docs` direktorijumu:

- [Arhitektura](./docs/architecture/README.md)
- [API Dokumentacija](./docs/api/README.md)
- [Development Guide](./docs/development/README.md)
- [Deployment](./docs/deployment/README.md)
- [Contributing](./docs/contributing/README.md)

### Contributing

Molimo vas da pročitate [Contributing Guidelines](./docs/contributing/README.md) pre nego što počnete sa radom na projektu.

### License

MIT License - pogledajte [LICENSE](LICENSE) fajl za detalje.