from fastapi import APIRouter
from typing import List, Dict, Any
from database import db_instance
from routers.chat import IN_MEMORY_SESSIONS

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("/sessions")
async def get_learning_sessions():
    """Fetch summary stats of all practice sessions"""
    sessions = []
    
    if db_instance.is_connected and db_instance.db is not None:
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$session_id",
                        "topic_id": {"$first": "$topic_id"},
                        "persona_id": {"$first": "$persona_id"},
                        "message_count": {"$sum": 1},
                        "avg_fluency": {"$avg": "$fluency_score"},
                        "last_updated": {"$max": "$timestamp"}
                    }
                },
                {"$sort": {"last_updated": -1}}
            ]
            cursor = db_instance.db.chat_history.aggregate(pipeline)
            async for doc in cursor:
                sessions.append({
                    "session_id": doc["_id"],
                    "topic_id": doc.get("topic_id", "daily-life"),
                    "persona_id": doc.get("persona_id", ""),
                    "message_count": doc.get("message_count", 0),
                    "avg_fluency": round(doc.get("avg_fluency", 80.0), 1),
                    "last_updated": doc.get("last_updated", "")
                })
        except Exception as e:
            pass
            
    if not sessions and IN_MEMORY_SESSIONS:
        for sid, logs in IN_MEMORY_SESSIONS.items():
            if logs:
                scores = [l.get("fluency_score", 80) for l in logs]
                avg_score = sum(scores) / len(scores) if scores else 80.0
                sessions.append({
                    "session_id": sid,
                    "topic_id": logs[0].get("topic_id", "daily-life"),
                    "persona_id": logs[0].get("persona_id", ""),
                    "message_count": len(logs),
                    "avg_fluency": round(avg_score, 1),
                    "last_updated": logs[-1].get("timestamp", "")
                })
    return sessions

@router.get("/session/{session_id}")
async def get_session_details(session_id: str):
    """Fetch full chat timeline and feedback for a specific session"""
    messages = []
    if db_instance.is_connected and db_instance.db is not None:
        try:
            cursor = db_instance.db.chat_history.find({"session_id": session_id}).sort("timestamp", 1)
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                messages.append(doc)
        except Exception as e:
            pass
            
    if not messages and session_id in IN_MEMORY_SESSIONS:
        messages = IN_MEMORY_SESSIONS[session_id]
        
    return {"session_id": session_id, "messages": messages}

@router.get("/errors")
async def get_common_errors():
    """Fetch list of all grammar & vocabulary mistakes made for review"""
    error_list = []
    
    if db_instance.is_connected and db_instance.db is not None:
        try:
            cursor = db_instance.db.chat_history.find({"grammar_errors.0": {"$exists": True}})
            async for doc in cursor:
                for err in doc.get("grammar_errors", []):
                    error_list.append({
                        "session_id": doc.get("session_id"),
                        "original_phrase": err.get("original_phrase"),
                        "correction": err.get("correction"),
                        "explanation": err.get("explanation"),
                        "category": err.get("category", "Grammar"),
                        "timestamp": doc.get("timestamp")
                    })
        except Exception as e:
            pass
            
    if not error_list and IN_MEMORY_SESSIONS:
        for sid, logs in IN_MEMORY_SESSIONS.items():
            for doc in logs:
                for err in doc.get("grammar_errors", []):
                    error_list.append({
                        "session_id": sid,
                        "original_phrase": err.get("original_phrase"),
                        "correction": err.get("correction"),
                        "explanation": err.get("explanation"),
                        "category": err.get("category", "Grammar"),
                        "timestamp": doc.get("timestamp")
                    })

    return error_list
