from fastapi import APIRouter, Depends
from app.deps import get_gemini_key
from app.utils.gemini import get_client, embed_texts

router = APIRouter()

@router.post("/validate-key")
def validate_key(api_key: str = Depends(get_gemini_key)):
    client = get_client(api_key)
    embed_texts(["ping"], client)
    return {"valid": True}
