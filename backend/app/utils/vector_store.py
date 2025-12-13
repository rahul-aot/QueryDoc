import faiss
import numpy as np
from pathlib import Path

def create_or_load_index(path: Path, dim: int):
    if path.exists():
        return faiss.read_index(str(path))
    return faiss.IndexFlatL2(dim)

def save_index(index, path: Path):
    faiss.write_index(index, str(path))

def add_vectors(index, embeddings: list[list[float]]):
    vectors = np.array(embeddings).astype("float32")
    index.add(vectors)

def search(index, query_embedding, k=5):
    q = np.array([query_embedding]).astype("float32")
    _, indices = index.search(q, k)
    return indices[0]
