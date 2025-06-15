# Tehnološki Stack - EduTech AI Platform

## Frontend

### Next.js
- React framework
- Server-side rendering
- API routes
- Optimizovano za SEO
- Automatski deployment na Vercel

### Tailwind CSS
- Utility-first CSS framework
- Brz development
- Responzivan dizajn
- Custom komponente

### Supabase Client
- Real-time subscriptions
- Auth management
- Database operations
- Storage management

## Backend

### FastAPI (Python)
- Brz i modern web framework
- Automatska dokumentacija
- Async support
- Type hints

### Mistral 7B
- Open source LLM
- Lokalno pokretanje
- 32k context window
- Fine-tuning mogućnosti

### Supabase
- PostgreSQL baza
- pgvector za vektor bazu
- Real-time funkcionalnosti
- Auth system
- Storage

## RAG Pipeline

### LangChain
- RAG implementacija
- Document processing
- Chain management
- Prompt templates

### all-MiniLM-L6-v2
- Embedding model
- 384-dimenzionalni vektori
- Brz i efikasan
- Besplatan za korišćenje

### Supabase pgvector
- Vektor baza podataka
- Efikasno pretraživanje
- Integracija sa PostgreSQL
- Besplatno za početak

## Development Tools

### Git
- Version control
- GitHub za hosting
- GitHub Actions za CI/CD

### Vercel
- Hosting
- CI/CD
- Analytics
- SSL

### Docker
- Containerization
- Development environment
- Deployment

## Testing

### Jest
- Unit testing
- Integration testing
- Frontend testing

### Pytest
- Python testing
- Backend testing
- API testing

## Monitoring

### Vercel Analytics
- Performance monitoring
- User analytics
- Error tracking

### Supabase Analytics
- Database performance
- Query analytics
- Usage metrics

### Custom Logging
- Application logs
- Error tracking
- Performance metrics

## Development Environment

### VS Code
- Code editor
- Extensions
- Debugging

### Python Virtual Environment
- Dependency management
- Isolated environment
- Version control

### Node.js
- Frontend development
- Package management
- Build tools

## Verzije i Zavisnosti

### Frontend Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

### Backend Dependencies
```python
# requirements.txt
fastapi==0.104.0
uvicorn==0.24.0
langchain==0.0.350
sentence-transformers==2.2.2
supabase==2.0.0
python-dotenv==1.0.0
pytest==7.4.3
```

## Setup i Instalacija

### Frontend Setup
```bash
# Kreiranje Next.js projekta
npx create-next-app@latest frontend --typescript --tailwind

# Instalacija dodatnih zavisnosti
cd frontend
npm install @supabase/supabase-js
```

### Backend Setup
```bash
# Kreiranje Python virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ili
.\venv\Scripts\activate  # Windows

# Instalacija zavisnosti
pip install -r requirements.txt
```

### Supabase Setup
1. Kreirati novi projekat na Supabase
2. Podesiti pgvector ekstenziju
3. Konfigurisati environment varijable
4. Inicijalizovati database schema

### Mistral 7B Setup
1. Preuzeti model
2. Konfigurisati lokalno okruženje
3. Testirati inference
4. Podesiti RAG pipeline