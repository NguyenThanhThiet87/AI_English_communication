from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class GrammarError(BaseModel):
    original_phrase: str = Field(description="Cụm từ gốc bị sai của người dùng")
    correction: str = Field(description="Cách sửa đúng")
    explanation: str = Field(description="Giải thích nguyên nhân bằng tiếng Việt chi tiết")
    category: str = Field(default="Grammar", description="Loại lỗi: Grammar, Vocabulary, Word Order, Naturalness")

class AIStructuredResponse(BaseModel):
    user_transcript: str = Field(description="Văn bản nhận diện câu nói của người dùng")
    grammar_errors: List[GrammarError] = Field(default_factory=list, description="Danh sách các lỗi sai tìm thấy")
    corrected_text: str = Field(description="Câu được sửa hoàn chỉnh đúng ngữ pháp")
    natural_expression: str = Field(description="Câu diễn đạt tự nhiên chuẩn bản xứ hơn")
    fluency_score: int = Field(default=80, description="Điểm số độ trôi chảy và ngữ pháp từ 0 đến 100")
    ai_reply: str = Field(description="Câu trả lời tiếp tục cuộc hội thoại bằng tiếng Anh theo đúng vai (Persona)")
    feedback_summary: str = Field(description="Nhận xét ngắn gọn truyền cảm hứng bằng tiếng Việt")

class TopicPersona(BaseModel):
    id: str
    name: str
    role: str
    description: str
    avatar_icon: str
    initial_message: str

class Topic(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    level: str
    personas: List[TopicPersona]

class MessageRecord(BaseModel):
    id: Optional[str] = None
    session_id: str
    sender: str  # "user" or "ai"
    text: str
    corrected_text: Optional[str] = None
    natural_expression: Optional[str] = None
    grammar_errors: List[GrammarError] = Field(default_factory=list)
    fluency_score: Optional[int] = None
    audio_url: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ConversationSession(BaseModel):
    session_id: str
    topic_id: str
    persona_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    message_count: int = 0
    avg_fluency_score: float = 0.0
