import React, { useRef, useEffect } from 'react';
import type { ChatMessage, Topic, TopicPersona } from '../types';
import { MicButton } from './MicButton';
import { FeedbackCard } from './FeedbackCard';
import { AudioVisualizer } from './AudioVisualizer';
import { Volume2, Bot, Sparkles } from 'lucide-react';

interface ChatViewProps {
  topic: Topic;
  persona: TopicPersona;
  messages: ChatMessage[];
  isRecording: boolean;
  onToggleRecord: () => void;
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: () => void;
  statusText: string;
  isProcessing: boolean;
  onReplayAudio: (base64Audio?: string, text?: string) => void;
  activeMessageFeedback?: ChatMessage | null;
  onSelectFeedbackMessage: (msg: ChatMessage) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  topic,
  persona,
  messages,
  isRecording,
  onToggleRecord,
  inputText,
  setInputText,
  onSendMessage,
  statusText,
  isProcessing,
  onReplayAudio,
  activeMessageFeedback,
  onSelectFeedbackMessage
}) => {
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, statusText]);

  return (
    <div className="chat-layout">
      {/* Main Chat Conversation Timeline */}
      <div className="glass-panel chat-main">
        {/* Persona Header Bar */}
        <div className="persona-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--accent-primary), #4338CA)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              <Bot size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{persona.name}</h3>
                <span className="tag" style={{ background: 'rgba(6,182,212,0.15)', color: '#38BDF8' }}>
                  {persona.role}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Chủ đề đang thực hành: <b style={{ color: '#E0E7FF' }}>{topic.title}</b>
              </p>
            </div>
          </div>

          <AudioVisualizer isActive={isProcessing || isRecording} label={isRecording ? "Đang lắng nghe giọng bạn..." : isProcessing ? "AI đang phân tích..." : ""} />
        </div>

        {/* Chat Messages */}
        <div className="chat-messages-container">
          {/* Persona Starter Prompt */}
          <div className="msg-wrapper ai">
            <div className="msg-bubble ai">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.4rem' }}>
                <Bot size={14} /> {persona.name} ({persona.role})
              </div>
              <p>{persona.initial_message}</p>
              <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onReplayAudio(undefined, persona.initial_message)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-muted)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  <Volume2 size={14} color="var(--accent-cyan)" /> Nghe giọng AI
                </button>
              </div>
            </div>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`msg-wrapper ${msg.sender}`}>
              <div className={`msg-bubble ${msg.sender}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', fontSize: '0.76rem', color: msg.sender === 'user' ? '#E0E7FF' : 'var(--accent-cyan)', fontWeight: 800, marginBottom: '0.35rem' }}>
                  <span>{msg.sender === 'user' ? 'Bạn' : persona.name}</span>
                  {msg.fluency_score !== undefined && (
                    <span style={{ background: 'rgba(0,0,0,0.35)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: '#34D399', fontWeight: 800 }}>
                      Điểm: {msg.fluency_score}/100
                    </span>
                  )}
                </div>

                <p>{msg.text}</p>

                {msg.sender === 'ai' && (
                  <div style={{ marginTop: '0.6rem' }}>
                    <button
                      onClick={() => onReplayAudio(msg.audio_base64, msg.text)}
                      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#A5B4FC', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      <Volume2 size={14} /> Phát giọng nói (TTS)
                    </button>
                  </div>
                )}

                {msg.sender === 'user' && msg.corrected_text && (
                  <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    <button
                      onClick={() => onSelectFeedbackMessage(msg)}
                      style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', fontWeight: 700 }}
                    >
                      <Sparkles size={13} color="#FBBF24" /> Xem AI Sửa Lỗi Câu Này
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {statusText && (
            <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--accent-cyan)', textAlign: 'center', margin: '0.5rem 0', fontWeight: 600 }}>
              ⏳ {statusText}
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input & Microphone Control Bar */}
        <div className="chat-controls-bar">
          <MicButton
            isRecording={isRecording}
            onToggleRecord={onToggleRecord}
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={onSendMessage}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Sidebar Live Feedback Card */}
      <FeedbackCard
        score={activeMessageFeedback?.fluency_score}
        correctedText={activeMessageFeedback?.corrected_text}
        naturalExpression={activeMessageFeedback?.natural_expression}
        errors={activeMessageFeedback?.grammar_errors}
        feedbackSummary={activeMessageFeedback?.feedback_summary}
      />
    </div>
  );
};
