import React, { useEffect, useState } from 'react';
import type { PracticeSession, SavedErrorRecord } from '../types';
import { History, Award, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [errors, setErrors] = useState<SavedErrorRecord[]>([]);

  const fetchHistory = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const [resSessions, resErrors] = await Promise.all([
        fetch(`${baseUrl}/api/history/sessions`),
        fetch(`${baseUrl}/api/history/errors`)
      ]);

      if (resSessions.ok) {
        const data = await resSessions.json();
        setSessions(data);
      }
      if (resErrors.ok) {
        const data = await resErrors.json();
        setErrors(data);
      }
    } catch (e) {
      console.warn("Could not fetch history from backend:", e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalSessions = sessions.length;
  const overallAvgFluency = sessions.length
    ? Math.round(sessions.reduce((acc, s) => acc + s.avg_fluency, 0) / sessions.length)
    : 82;

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Lịch Sử Học Tập & Ôn Tập Lỗi Sai (MongoDB)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Hệ thống tự động tổng hợp toàn bộ các câu bạn đã phát biểu, phân tích lỗi sai và điểm số trôi chảy.
          </p>
        </div>

        <button
          className="nav-tab-btn"
          style={{ background: 'rgba(255,255,255,0.08)', padding: '0.6rem 1.2rem' }}
          onClick={fetchHistory}
        >
          <RefreshCw size={16} /> Làm Mới Dữ Liệu
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.15)', color: 'var(--success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={30} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>ĐIỂM TRÔI CHẢY TRUNG BÌNH</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--success-text)', marginTop: '2px' }}>{overallAvgFluency} / 100</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'rgba(6,182,212,0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History size={30} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>BUỔI LUYỆN ĐÃ TẠO</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '2px' }}>{totalSessions} buổi</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.15)', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={30} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>LỖI CẦN RÚT KINH NGHIỆM</span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--warning-text)', marginTop: '2px' }}>{errors.length} lỗi</h2>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Past Practice Sessions */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} color="var(--accent-primary)" /> Các Buổi Luyện Đã Thực Hiện
          </h3>

          {sessions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
              Chưa có lịch sử buổi luyện. Vui lòng chọn một chủ đề và thực hành lượt nói đầu tiên!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sessions.map((s, i) => (
                <div key={i} style={{ padding: '1.1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#F9FAFB' }}>Chủ đề: {s.topic_id}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.message_count} lượt câu đã nói</p>
                  </div>
                  <div>
                    <span className="tag" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', fontSize: '0.88rem' }}>
                      Điểm: {s.avg_fluency}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aggregated Errors Revision List */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} color="var(--danger-text)" /> Danh Sách Lỗi Cần Ôn Tập Lại
          </h3>

          {errors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', color: 'var(--success-text)', fontSize: '0.9rem', fontWeight: 600 }}>
              🎉 Chưa phát hiện lỗi sai tồn đọng! Bạn đang phản xạ tiếng Anh rất chuẩn xác.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
              {errors.map((err, i) => (
                <div key={i} className="error-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="tag" style={{ background: 'rgba(245,158,11,0.15)', color: '#FBBF24' }}>
                      {err.category || 'Ngữ pháp'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                    🔴 <b>Câu bạn nói:</b> <span style={{ color: 'var(--danger-text)', textDecoration: 'line-through' }}>{err.original_phrase}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', marginBottom: '0.45rem' }}>
                    🟢 <b>Sửa lại đúng:</b> <span style={{ color: 'var(--success-text)', fontWeight: 700 }}>{err.correction}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.45, borderLeft: '3px solid var(--accent-primary)' }}>
                    💡 <b>Giải thích:</b> {err.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
