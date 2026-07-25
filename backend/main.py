import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection, db_instance
from routers import topics, chat, history

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("speakmate")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting SpeakMate AI FastAPI Backend...")
    await connect_to_mongo()
    yield
    # Shutdown
    logger.info("Shutting down SpeakMate AI Backend...")
    await close_mongo_connection()

app = FastAPI(
    title="SpeakMate AI - AI English Speaking Tutor API",
    description="FastAPI Backend for SpeakMate AI featuring WebSocket voice chat, Gemini Multi-task structured evaluation, Edge-TTS audio generation, and MongoDB storage.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import topics, chat, history, live_chat

# Include Routers
app.include_router(topics.router)
app.include_router(chat.router)
app.include_router(history.router)
app.include_router(live_chat.router)

@app.get("/")
async def root():
    return {
        "app": "SpeakMate AI API",
        "status": "online",
        "mongodb_connected": db_instance.is_connected
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "mongodb_status": "connected" if db_instance.is_connected else "fallback_in_memory"
    }

if __name__ == "__main__":
    import uvicorn
    from config import settings
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
