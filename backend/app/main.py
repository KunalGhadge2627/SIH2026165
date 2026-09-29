from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db.store import init_db
from .db.firestore_store import init_firestore
from .api.routes import router

app = FastAPI(title=settings.app_name, version='5.0.0', description='AI/NLP prototype for detecting Serious Injury & Fatality precursors in OIL safety reports.')
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_list, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
app.include_router(router, prefix=settings.api_prefix)

@app.on_event('startup')
def startup():
    init_db()
    init_firestore()

