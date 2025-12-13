from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import faiss
import numpy as np
import json

from app.config import VECTOR_DIR
from app.deps import get_session_id, get_gemini_key
from app.utils.gemini import get_client, embed_texts, generate_answer

router = APIRouter()


class Question(BaseModel):
    question: str


@router.post("/ask")
def ask(
    payload: Question,
    session_id: str = Depends(get_session_id),
    api_key: str = Depends(get_gemini_key),
):
    # 1. Check vector store
    session_vector = VECTOR_DIR / session_id
    index_path = session_vector / "index.faiss"
    chunks_path = session_vector / "chunks.json"

    if not index_path.exists() or not chunks_path.exists():
        raise HTTPException(
            status_code=400,
            detail="No document uploaded for this session"
        )

    # 2. Gemini client (per request)
    client = get_client(api_key)

    # 3. Load FAISS index
    index = faiss.read_index(str(index_path))

    # 4. Embed question
    q_embedding = embed_texts([payload.question], client)[0]

    # 5. Similarity search
    _, indices = index.search(
        np.array([q_embedding]).astype("float32"),
        k=5
    )

    # 6. Load chunk metadata
    with open(chunks_path, "r", encoding="utf-8") as f:
        chunk_map = json.load(f)

    # 7. Build real context from retrieved chunks
    retrieved_chunks = []
    for idx in indices[0]:
        text = chunk_map.get(str(idx))
        if text:
            retrieved_chunks.append(text)

    context = "\n\n".join(retrieved_chunks)

    # 8. Prompt (strict RAG)
    prompt = f"""
You are answering strictly from the document context below.

If the answer is not present in the context, respond with:
"Not found in the document"

Context:
{context}

Question:
{payload.question}
"""

    # 9. Generate answer
    answer = generate_answer(prompt, client)

    return {"answer": answer}
