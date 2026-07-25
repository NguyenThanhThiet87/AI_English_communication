import React from 'react';
import type { GrammarError } from '../types';
import { CheckCircle2, Sparkles, BookOpen, ThumbsUp } from 'lucide-react';

interface FeedbackCardProps {
  score?: number;
  correctedText?: string;
  naturalExpression?: string;
  errors?: GrammarError[];
  feedbackSummary?: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  score = 85,
  correctedText,
  naturalExpression,
  errors = [],
  feedbackSummary
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'var(--success-text)';
    if (s >= 70) return 'var(--warning-text)';
    return 'var(--danger-text)';
  };

  const getScoreBorder = (s: number) => {
    if (s >= 85) return 'var(--success-border)';
    if (s >= 70) return 'var(--warning-border)';
    return 'var(--danger-border)';
  };

  return (
    <div className="glass-panel feedback-panel">
      {/* Score Header */}
      <div style={{ textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '1rem', marginBottom: '0.8rem' }}>
          <Sparkles size={18} /> KẾT QUẢ PHÂN TÍCH AI (FEEDBACK)
        </div>

        <div
          className="score-badge-large"
          style={{
            borderColor: getScoreBorder(score),
            color: getScoreColor(score)
          }}
        >
          {score}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 600 }}>
          Điểm Trôi Chảy & Chuẩn Xác (0 - 100)
        </div>
      </div>

      {/* Corrected Text Section */}
      {correctedText ? (
        <div className="card-box success">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success-text)', fontSize: '0.86rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            <CheckCircle2 size={16} /> CÂU ĐÃ SỬA CHUẨN NGỮ PHÁP:
          </div>
          <p style={{ fontSize: '0.96rem', color: '#F9FAFB', fontWeight: 600, lineHeight: 1.5 }}>
            "{correctedText}"
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-subtle)', fontStyle: 'italic', fontSize: '0.85rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
          👈 Hãy nhấn Mic và phát biểu câu tiếng Anh để nhận phản hồi phân tích trực tiếp!
        </div>
      )}

      {/* Natural Native Expression */}
      {naturalExpression && (
        <div className="card-box cyan">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.86rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            <Sparkles size={16} /> GỢI Ý CÁCH NÓI TỰ NHIÊN HƠN (NATIVE):
          </div>
          <p style={{ fontSize: '0.94rem', color: '#E0F2FE', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{naturalExpression}"
          </p>
        </div>
      )}

      {/* Error Breakdown List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.8rem' }}>
          <BookOpen size={16} color="var(--accent-primary)" /> CHI TIẾT LỖI CẦN RÚT KINH NGHIỆM ({errors.length}):
        </div>

        {errors.length === 0 ? (
          correctedText && (
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', color: 'var(--success-text)', fontSize: '0.86rem', fontWeight: 600 }}>
              🎉 Tuyệt vời! Bạn không mắc lỗi ngữ pháp lớn nào trong lượt nói này.
            </div>
          )
        ) : (
          errors.map((err, idx) => (
            <div key={idx} className="error-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="tag" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger-text)' }}>
                  {err.category || 'Ngữ pháp'}
                </span>
              </div>
              <div style={{ fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                🔴 <b>Lỗi bạn nói:</b> <span style={{ color: 'var(--danger-text)', textDecoration: 'line-through' }}>{err.original_phrase}</span>
              </div>
              <div style={{ fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                🟢 <b>Sửa lại đúng:</b> <span style={{ color: 'var(--success-text)', fontWeight: 700 }}>{err.correction}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.45, borderLeft: '3px solid var(--warning-text)' }}>
                💡 <b>Giải thích:</b> {err.explanation}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Encouragement Summary */}
      {feedbackSummary && (
        <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#A5B4FC', fontSize: '0.84rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            <ThumbsUp size={14} /> Nhận xét tổng quan:
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{feedbackSummary}</p>
        </div>
      )}
    </div>
  );
};
