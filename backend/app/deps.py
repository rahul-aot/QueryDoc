from fastapi import Header, HTTPException

def get_session_id(x_session_id: str = Header(...)):
    return x_session_id

def get_gemini_key(x_gemini_key: str = Header(None)):
    if not x_gemini_key:
        raise HTTPException(status_code=401, detail="Gemini API key required")
    return x_gemini_key
