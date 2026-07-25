import json
import logging
from typing import Dict, Any, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from datetime import datetime
from config import settings

from services.gemini_service import gemini_service
from services.tts_service import tts_service
from database import db_instance
from routers.topics import TOPICS_DATA
from schemas import AIStructuredResponse, MessageRecord

logger = logging.getLogger("speakmate")
router = APIRouter(prefix="/api/chat", tags=["Chat"])

# Memory fallback storage if MongoDB connection is unavailable
IN_MEMORY_SESSIONS: Dict[str, List[Dict[str, Any]]] = {}

class ChatRequest(BaseModel):
    session_id: str
    user_text: str
    topic_id: str
    persona_id: str
    voice: str = "en-US-AvaNeural"

def find_topic_and_persona(topic_id: str, persona_id: str):
    topic_title = "Daily Conversation"
    topic_desc = "General chat"
    persona_role = "Friendly Tutor"
    initial_msg = "Hello!"

    for t in TOPICS_DATA:
        if t.id == topic_id:
            topic_title = t.title
            topic_desc = t.description
            for p in t.personas:
                if p.id == persona_id:
                    persona_role = p.role
                    initial_msg = p.initial_message
                    break
            break
    return topic_title, topic_desc, persona_role, initial_msg

async def save_chat_to_db(session_id: str, topic_id: str, persona_id: str, user_text: str, response: AIStructuredResponse, audio_base64: str):
    record = {
        "session_id": session_id,
        "topic_id": topic_id,
        "persona_id": persona_id,
        "user_text": user_text,
        "corrected_text": response.corrected_text,
        "natural_expression": response.natural_expression,
        "grammar_errors": [e.model_dump() for e in response.grammar_errors],
        "fluency_score": response.fluency_score,
        "ai_reply": response.ai_reply,
        "feedback_summary": response.feedback_summary,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    if db_instance.is_connected and db_instance.db is not None:
        try:
            await db_instance.db.chat_history.insert_one(record)
        except Exception as e:
            logger.error(f"Error saving to MongoDB: {e}")
    else:
        if session_id not in IN_MEMORY_SESSIONS:
            IN_MEMORY_SESSIONS[session_id] = []
        IN_MEMORY_SESSIONS[session_id].append(record)

async def get_session_history_records(session_id: str) -> List[Dict[str, str]]:
    history = []
    if db_instance.is_connected and db_instance.db is not None:
        try:
            cursor = db_instance.db.chat_history.find({"session_id": session_id}).sort("timestamp", 1)
            async for doc in cursor:
                history.append({"sender": "user", "text": doc.get("user_text", "")})
                history.append({"sender": "ai", "text": doc.get("ai_reply", "")})
        except Exception as e:
            logger.error(f"Error reading history from Mongo: {e}")
    elif session_id in IN_MEMORY_SESSIONS:
        for doc in IN_MEMORY_SESSIONS[session_id]:
            history.append({"sender": "user", "text": doc.get("user_text", "")})
            history.append({"sender": "ai", "text": doc.get("ai_reply", "")})
    return history

@router.post("/message")
async def send_message_rest(req: ChatRequest):
    """HTTP REST endpoint for conversation turn"""
    topic_title, topic_desc, persona_role, initial_msg = find_topic_and_persona(req.topic_id, req.persona_id)
    history = await get_session_history_records(req.session_id)
    
    ai_response = await gemini_service.analyze_and_respond(
        user_message=req.user_text,
        topic_title=topic_title,
        topic_description=topic_desc,
        persona_role=persona_role,
        initial_message=initial_msg,
        history=history
    )

    audio_base64 = await tts_service.generate_speech_base64(ai_response.ai_reply, req.voice)
    await save_chat_to_db(req.session_id, req.topic_id, req.persona_id, req.user_text, ai_response, audio_base64)

    return {
        "status": "success",
        "data": ai_response.model_dump(),
        "audio_base64": audio_base64
    }

class TranslateRequest(BaseModel):
    text: str

@router.post("/translate")
async def translate_text(req: TranslateRequest):
    try:
        from deep_translator import GoogleTranslator
        translator = GoogleTranslator(source='auto', target='vi')
        translated = translator.translate(req.text)
        return {"status": "success", "translated": translated}
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"Translation error: {e}")
        return {"status": "error", "message": f"Failed to translate: {e}"}

class TTSRequest(BaseModel):
    text: str
    voice: str = "en-US-AvaNeural"

@router.post("/tts")
async def generate_tts(req: TTSRequest):
    try:
        audio_base64 = await tts_service.generate_speech_base64(req.text, req.voice)
        return {"status": "success", "audio_base64": audio_base64}
    except Exception as e:
        logger.error(f"TTS endpoint error: {e}")
        return {"status": "error", "message": str(e)}

@router.websocket("/ws/{session_id}")
async def websocket_chat_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    logger.info(f"WebSocket connected for session: {session_id}")
    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            
            user_text = data.get("text", "").strip()
            topic_id = data.get("topic_id", "daily-life")
            persona_id = data.get("persona_id", "friendly-roommate")
            voice = data.get("voice", "en-US-AvaNeural")

            if not user_text:
                continue

            topic_title, topic_desc, persona_role, initial_msg = find_topic_and_persona(topic_id, persona_id)
            history = await get_session_history_records(session_id)

            # Send processing indicator
            await websocket.send_json({"type": "status", "message": "Analyzing speech & grammar..."})

            ai_response = await gemini_service.analyze_and_respond(
                user_message=user_text,
                topic_title=topic_title,
                topic_description=topic_desc,
                persona_role=persona_role,
                initial_message=initial_msg,
                history=history
            )

            await websocket.send_json({"type": "status", "message": "Generating AI audio voice..."})
            audio_base64 = await tts_service.generate_speech_base64(ai_response.ai_reply, voice)

            await save_chat_to_db(session_id, topic_id, persona_id, user_text, ai_response, audio_base64)

            payload = {
                "type": "ai_response",
                "session_id": session_id,
                "data": ai_response.model_dump(),
                "audio_base64": audio_base64
            }
            await websocket.send_json(payload)

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass
