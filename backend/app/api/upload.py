from fastapi import APIRouter, UploadFile, Depends, HTTPException
from pathlib import Path

from app.config import UPLOAD_DIR, VECTOR_DIR
from app.deps import get_session_id, get_gemini_key
from app.utils.pdf_loader import extract_text_from_pdf
from app.utils.text_splitter import split_text
from app.utils.gemini import get_client, embed_texts
from app.utils.vector_store import create_or_load_index, add_vectors, save_index
import json


router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile,
    session_id: str = Depends(get_session_id),
    api_key: str = Depends(get_gemini_key),
):
    # 1. Validate file
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF supported")

    # 2. Create Gemini client (per request)
    client = get_client(api_key)

    # 3. Save file
    session_upload = UPLOAD_DIR / session_id
    session_upload.mkdir(parents=True, exist_ok=True)

    file_path = session_upload / file.filename
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # 4. Extract + split text
    text = extract_text_from_pdf(str(file_path))
    chunks = split_text(text)

    if not chunks:
        raise HTTPException(status_code=400, detail="No text found in PDF")

    # 5. Generate embeddings
    embeddings = embed_texts(chunks, client)

    # 6. Create / append vector store
    session_vector = VECTOR_DIR / session_id
    session_vector.mkdir(parents=True, exist_ok=True)

    index_path = session_vector / "index.faiss"
    index = create_or_load_index(index_path, len(embeddings[0]))

    add_vectors(index, embeddings)
    save_index(index, index_path)

        # ✅ SAVE CHUNK TEXT (REQUIRED FOR RAG)
    chunk_map = {str(i): chunk for i, chunk in enumerate(chunks)}

    with open(session_vector / "chunks.json", "w", encoding="utf-8") as f:
        json.dump(chunk_map, f, ensure_ascii=False, indent=2)


    return {
        "status": "READY",
        "filename": file.filename,
        "chunks": len(chunks),
    }


