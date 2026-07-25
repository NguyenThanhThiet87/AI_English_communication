import React, { useState } from 'react';
import type { Topic, TopicPersona } from '../types';
import { Coffee, Plane, Briefcase, Utensils, TrendingUp, Award, ArrowRight, UserCheck, ShieldCheck, Hotel, Target, GraduationCap } from 'lucide-react';

interface TopicSelectorProps {
  topics: Topic[];
  onSelectTopicPersona: (topic: Topic, persona: TopicPersona) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Coffee: <Coffee size={26} />,
  Plane: <Plane size={26} />,
  Briefcase: <Briefcase size={26} />,
  Utensils: <Utensils size={26} />,
  TrendingUp: <TrendingUp size={26} />,
  Award: <Award size={26} />,
  ShieldCheck: <ShieldCheck size={20} />,
  Hotel: <Hotel size={20} />,
  UserCheck: <UserCheck size={20} />,
  Target: <Target size={20} />,
  GraduationCap: <GraduationCap size={20} />
};

export const TopicSelector: React.FC<TopicSelectorProps> = ({ topics, onSelectTopicPersona }) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {/* 3-Step Guide Banner */}
      <div className="step-banner">
        <div className="step-item">
          <div className="step-number">1</div>
          <span>Chọn chủ đề & Vai trò AI</span>
        </div>
        <ArrowRight size={16} color="var(--text-subtle)" />
        <div className="step-item">
          <div className="step-number" style={{ background: 'var(--accent-cyan)' }}>2</div>
          <span>Nhấn Mic & Nói bằng tiếng Anh</span>
        </div>
        <ArrowRight size={16} color="var(--text-subtle)" />
        <div className="step-item">
          <div className="step-number" style={{ background: 'var(--success-text)', color: '#000' }}>3</div>
          <span>AI Sửa lỗi ngữ pháp & Nói tiếp</span>
        </div>
      </div>

      <div className="topics-header">
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>
          Chọn Tình Huống Bạn Muốn Luyện Nói
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '680px', margin: '0 auto' }}>
          AI sẽ đóng vai tương ứng (Nhà tuyển dụng, Nhân viên hải quan, Phục vụ nhà hàng,...) để bạn thực hành phản xạ tự nhiên nhất.
        </p>
      </div>

      <div className="topics-grid">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="glass-panel topic-card"
            onClick={() => setSelectedTopic(topic)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="topic-icon-badge">
                  {ICON_MAP[topic.icon] || <Coffee size={26} />}
                </div>
                <span className="tag" style={{ background: 'rgba(255,255,255,0.08)', color: '#A5B4FC' }}>
                  {topic.level}
                </span>
              </div>
              <h3 className="topic-title">{topic.title}</h3>
              <p className="topic-desc">{topic.description}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                {topic.personas.length} Nhân vật AI đóng vai
              </span>
              <button
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), #4F46E5)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                Vào Luyện <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Persona Selection */}
      {selectedTopic && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={() => setSelectedTopic(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '600px',
              width: '100%',
              padding: '2.2rem',
              background: '#111827',
              border: '1px solid var(--glass-border-active)',
              boxShadow: 'var(--shadow-glow)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="topic-icon-badge" style={{ margin: 0 }}>
                {ICON_MAP[selectedTopic.icon] || <Coffee size={26} />}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedTopic.title}</h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Vui lòng chọn 1 đối tượng bạn sẽ trò chuyện cùng:</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
              {selectedTopic.personas.map((persona) => (
                <div
                  key={persona.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onClick={() => {
                    onSelectTopicPersona(selectedTopic, persona);
                    setSelectedTopic(null);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#A5B4FC' }}>{persona.name}</h4>
                    <span className="tag" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38BDF8' }}>
                      {persona.role}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{persona.description}</p>
                  <div style={{ fontSize: '0.82rem', color: '#E0E7FF', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
                    <b>Câu mở đầu của AI:</b> "{persona.initial_message}"
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="nav-tab-btn"
                style={{ background: 'rgba(255,255,255,0.08)', padding: '0.6rem 1.4rem' }}
                onClick={() => setSelectedTopic(null)}
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
