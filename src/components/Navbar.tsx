import React from 'react';
import { Bot, MessageSquare, History, Sparkles, Volume2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'topics' | 'chat' | 'history';
  setActiveTab: (tab: 'topics' | 'chat' | 'history') => void;
  selectedTopicTitle?: string;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedTopicTitle,
  selectedVoice,
  setSelectedVoice
}) => {
  return (
    <header className="navbar">
      <div className="logo-group">
        <div className="logo-icon">
          <Bot size={26} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="logo-title">SpeakMate AI</span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--accent-pink), var(--accent-primary))', color: 'white', fontWeight: 800 }}>
              AI TUTOR
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Luyện Nói Tiếng Anh Giao Tiếp Trực Tuyến</p>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          <Sparkles size={18} />
          1. Chọn Chủ đề
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={18} />
          2. Luyện Nói Trực Tiếp
          {selectedTopicTitle && (
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.2)', color: 'white', marginLeft: '4px' }}>
              {selectedTopicTitle}
            </span>
          )}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} />
          3. Sửa Lỗi & Thống Kê
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
        <Volume2 size={16} color="var(--accent-cyan)" />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Giọng AI:</span>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="en-US-AvaNeural" style={{ background: '#111827' }}>🇺🇸 US Ava (Nữ)</option>
          <option value="en-US-AndrewNeural" style={{ background: '#111827' }}>🇺🇸 US Andrew (Nam)</option>
          <option value="en-GB-SoniaNeural" style={{ background: '#111827' }}>🇬🇧 UK Sonia (Nữ)</option>
          <option value="en-GB-RyanNeural" style={{ background: '#111827' }}>🇬🇧 UK Ryan (Nam)</option>
        </select>
      </div>
    </header>
  );
};
