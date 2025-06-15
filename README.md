# ACAI Assistant - EduTech AI Platform

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