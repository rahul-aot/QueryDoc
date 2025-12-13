# RAG Backend API

This is the FastAPI backend for the Document RAG (Retrieval-Augmented Generation) application. It handles file processing, embeddings, vector storage, and chat interactions using Google's Gemini API.

## Features

- **Document Processing**: Upload and parse PDF documents.
- **RAG Implementation**: Uses vector store to retrieve relevant context for queries.
- **Session Management**: Isolated vector stores per session.
- **API Key Security**: Validates Gemini API keys without storing them persistently.

## Setup

1. **Install Python 3.11+**
2. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running

Start the server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.
Docs available at `http://localhost:8000/docs`.

## API Endpoints

- `POST /api/validate-key`: Validate Gemini API key.
- `POST /api/upload`: Upload PDF for processing.
- `POST /api/ask`: Ask a question about the uploaded document.
- `DELETE /api/clear`: Clear session data.
