import React from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  label?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, label }) => {
  if (!isActive) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div className="equalizer">
        <div className="eq-bar"></div>
        <div className="eq-bar"></div>
        <div className="eq-bar"></div>
        <div className="eq-bar"></div>
        <div className="eq-bar"></div>
      </div>
      {label && <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{label}</span>}
    </div>
  );
};
