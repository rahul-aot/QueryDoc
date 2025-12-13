from fastapi import FastAPI
from app.api import validate, upload, ask, clear

app = FastAPI(title="QueryDoc Backend")

app.include_router(validate.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(ask.router, prefix="/api")
app.include_router(clear.router, prefix="/api")
