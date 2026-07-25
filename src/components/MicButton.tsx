import React from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

interface MicButtonProps {
  isRecording: boolean;
  onToggleRecord: () => void;
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: () => void;
  isProcessing: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({
  isRecording,
  onToggleRecord,
  inputText,
  setInputText,
  onSendMessage,
  isProcessing
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%' }}>
      <button
        className={`mic-btn-main ${isRecording ? 'recording pulsing-mic' : ''}`}
        onClick={onToggleRecord}
        title={isRecording ? "Nhấn để dừng ghi âm và gửi câu" : "Nhấn để nói tiếng Anh"}
        disabled={isProcessing}
      >
        {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
      </button>

      <div style={{ flex: 1, position: 'relative' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          placeholder={isRecording ? "Đang lắng nghe câu nói của bạn..." : "Nói bằng mic hoặc gõ câu tiếng Anh..."}
          disabled={isProcessing}
          style={{
            width: '100%',
            background: 'rgba(18, 24, 36, 0.8)',
            border: isRecording ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 3.5rem 1rem 1.2rem',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border 0.2s ease'
          }}
        />

        <button
          onClick={onSendMessage}
          disabled={!inputText.trim() || isProcessing}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: inputText.trim() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
            color: inputText.trim() ? 'white' : 'var(--text-subtle)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
