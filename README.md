# QueryDoc

A complete full-stack application for securely chatting with PDF documents using Retrieval-Augmented Generation (RAG) and Google's Gemini API.

## Project Architecture

- **Frontend**: React + TypeScript + Vite. A polished, single-page application with a modern SaaS CSS design.
- **Backend**: FastAPI (Python). Handles embedding generation, vector search, and LLM interaction.
- **Infrastructure**: Docker & Docker Compose for easy deployment.

### System Diagram

```mermaid
graph TD
    User([User])
    subgraph "Frontend (React + Vite)"
        UI[Browser UI]
        State[Local State]
    end
    subgraph "Backend (FastAPI)"
        API[API Endpoints]
        subgraph "Ingestion"
            PDF[PDF Loader]
            Split[Text Splitter]
        end
        subgraph "Vector Store"
            VS[(FAISS Index)]
            JSON[(JSON Chunks)]
        end
        LLM[Gemini Pro API]
    end

    User <--> UI
    UI <--> State
    State <--> API
    API --> PDF
    PDF --> Split
    Split --> LLM
    LLM --> VS
    API --> VS
    VS --> JSON
    JSON --> LLM
    LLM --> API
```

### RAG Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant FAISS
    participant Gemini

    Note over User, Gemini: Document Ingestion
    User->>Frontend: Upload PDF
    Frontend->>Backend: POST /upload
    Backend->>Backend: Extract & Split Text
    Backend->>Gemini: Generate Embeddings
    Gemini-->>Backend: Vector Data
    Backend->>FAISS: Save Index & Chunks
    Backend-->>Frontend: Ready (200 OK)

    Note over User, Gemini: Retrieval-Augmented Generation
    User->>Frontend: Ask Question
    Frontend->>Backend: POST /ask
    Backend->>Gemini: Embed Question
    Gemini-->>Backend: Query Vector
    Backend->>FAISS: Similarity Search
    FAISS-->>Backend: Context Chunks
    Backend->>Gemini: Context + Question
    Gemini-->>Backend: Generated Answer
    Backend-->>Frontend: Answer
    Frontend-->>User: Display Response
```

## Quick Start (Docker)

The easiest way to run the entire system is with Docker Compose.

1. **Prerequisites**: Ensure Docker and Docker Compose are installed.
2. **Run**:
   ```bash
   docker-compose up --build
   ```
3. **Access**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

## Manual Development Setup

### Backend
Navigate to `backend/` and follow the `README.md` to start the FastAPI server on port 8000.

### Frontend
Navigate to `frontend/` and follow the `README.md` to start the Vite dev server on port 5173.

Ensure the backend is running before using the frontend.

## Features

- **Private by Design**: Your API key stays in your browser memory and is sent directly to the backend for that session only.
- **Session Isolation**: Each user session gets its own vector store.
- **Responsive Design**: Works on desktop and mobile.
- **Type Safety**: Full TypeScript support in frontend, Pydantic validation in backend.
