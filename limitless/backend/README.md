# Limitless Backend

AI-powered multi-tenant team updates system with hybrid retrieval (pgvector + full-text) and LLM-grounded question answering.

## Architecture

- **FastAPI** async REST API with multi-tenant isolation
- **PostgreSQL + pgvector** for immutable message storage, full-text search, and vector similarity
- **OpenAI** for embeddings (`text-embedding-3-small`) and answer generation (`gpt-4o-mini`)
- **Hybrid retrieval**: Reciprocal Rank Fusion over lexical (`ts_rank`) + semantic (cosine) results
- **QueryPlanner**: LLM-structured intent extraction (`intent`, `entity`, `time_range`) before retrieval

## Setup

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Copy and configure environment

```bash
cp .env.example .env
# Edit .env — fill in OPENAI_API_KEY at minimum
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run database migrations

```bash
alembic upgrade head
```

### 5. Seed sample data

```bash
python seed.py
```

### 6. Start the API server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tenants` | Create a tenant |
| POST | `/users` | Create a user within a tenant |
| POST | `/messages` | Ingest a team update message |
| POST | `/query` | Ask a question grounded in stored messages |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | — | asyncpg PostgreSQL DSN |
| `OPENAI_API_KEY` | — | OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o-mini` | Chat completion model |
| `EMBEDDING_MODEL` | `text-embedding-3-small` | Embedding model (1536 dims) |
| `RETRIEVAL_TOP_K` | `10` | Number of messages to retrieve per query |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
