from fastapi import APIRouter, Depends
import shutil
from app.config import UPLOAD_DIR, VECTOR_DIR
from app.deps import get_session_id

router = APIRouter()

@router.delete("/clear")
def clear_session(session_id: str = Depends(get_session_id)):
    shutil.rmtree(UPLOAD_DIR / session_id, ignore_errors=True)
    shutil.rmtree(VECTOR_DIR / session_id, ignore_errors=True)
    return {"cleared": True}
