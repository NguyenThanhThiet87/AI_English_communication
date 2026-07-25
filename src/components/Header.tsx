import React from 'react';
import type { Topic } from '../types';

interface HeaderProps {
  topic: Topic;
  sessionTimeStr: string;
  selectedVoice: string;
  onChangeVoice: (voice: string) => void;
}

export const VOICES = [
  { id: "en-US-AvaNeural", label: "Ava (Nữ, Mỹ)" },
  { id: "en-US-AndrewNeural", label: "Andrew (Nam, Mỹ)" },
  { id: "en-GB-SoniaNeural", label: "Sonia (Nữ, Anh)" },
  { id: "en-GB-RyanNeural", label: "Ryan (Nam, Anh)" },
  { id: "en-AU-NatashaNeural", label: "Natasha (Nữ, Úc)" }
];

export const Header: React.FC<HeaderProps> = ({ topic, sessionTimeStr, selectedVoice, onChangeVoice }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-[60] px-2 sm:px-md flex items-center justify-between">
      <div className="flex items-center gap-1 sm:gap-sm lg:w-[25%]">
        <span className="material-symbols-outlined text-[24px] sm:text-[32px] text-primary">record_voice_over</span>
        <span className="text-body-md sm:text-headline-md font-display-lg text-primary hidden md:block">SpeakMate</span>
      </div>
      
      <div className="flex flex-1 justify-center items-center gap-2 sm:gap-lg overflow-hidden">
        <div className="flex flex-col items-center truncate">
          <span className="text-label-sm text-outline uppercase hidden sm:block">Topic</span>
          <span className="text-label-sm sm:text-label-md font-bold truncate max-w-[120px] sm:max-w-none">{topic.title}</span>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant hidden sm:block"></div>
        <div className="flex-col items-center text-primary hidden md:flex">
          <span className="text-label-sm uppercase">Session Time</span>
          <span className="text-label-md font-bold font-mono">{sessionTimeStr}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-end lg:w-[25%] gap-2 sm:gap-4">
        <div className="flex items-center bg-surface-container-low rounded-lg px-2 py-1 shadow-sm border border-outline-variant/30 max-w-[110px] sm:max-w-[200px]">
          <span className="material-symbols-outlined text-outline text-body-md mr-1 hidden sm:block">record_voice_over</span>
          <select 
            value={selectedVoice} 
            onChange={(e) => onChangeVoice(e.target.value)}
            className="bg-transparent text-label-sm sm:text-label-md text-on-surface focus:outline-none cursor-pointer truncate w-full"
          >
            {VOICES.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>
        <img 
          alt="Profile" 
          className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10 shrink-0" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuILK-7XD1zCE-y4ME-RtrQVaSjZeMhbFaGryf8IBnsPFl9ReDZNNOnggJPpxdxgZCe0bj1sw9s3LpCr_0qyTUYQUXh8crtml7w371O4VYrP8gNipNGXqVFiP41sXn7ttRhj9SXZUeOAJWVaxjvqPOuN2-2hCyJj_XP_cJdlLbTpy4P3Wc9gZmY2rmpeA1OWWuZOABZbtEtA2cw1ds5lsV-PlR0NozZND5vZvIeUHJ7bDlQn4wBPtoPmvmwBSxXRKHPm1tCjzJ1diA"
        />
      </div>
    </header>
  );
};
