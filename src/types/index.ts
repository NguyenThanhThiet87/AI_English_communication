export interface GrammarError {
  original_phrase: string;
  correction: string;
  explanation: string;
  category: string;
}

export interface AIStructuredResponse {
  user_transcript: string;
  grammar_errors: GrammarError[];
  corrected_text: string;
  natural_expression: string;
  fluency_score: number;
  ai_reply: string;
  feedback_summary: string;
}

export interface TopicPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar_icon: string;
  initial_message: string;
  voice_name?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: string;
  personas: TopicPersona[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  corrected_text?: string;
  natural_expression?: string;
  grammar_errors?: GrammarError[];
  fluency_score?: number;
  feedback_summary?: string;
  audio_base64?: string;
  translated_text?: string;
  timestamp: string;
}

export interface PracticeSession {
  session_id: string;
  topic_id: string;
  persona_id: string;
  message_count: number;
  avg_fluency: number;
  last_updated: string;
}

export interface SavedErrorRecord {
  session_id: string;
  original_phrase: string;
  correction: string;
  explanation: string;
  category: string;
  timestamp: string;
}
