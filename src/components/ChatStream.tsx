import React, { useRef, useEffect } from 'react';
import type { ChatMessage, TopicPersona } from '../types';

interface ChatStreamProps {
  messages: ChatMessage[];
  persona: TopicPersona;
  isRecording: boolean;
  isProcessing: boolean;
  onToggleRecord: () => void;
  onReplayAudio: (base64Audio?: string, text?: string) => void;
  onSelectFeedbackMessage: (msg: ChatMessage) => void;
  onTranslateMessage?: (msgId: string, text: string) => void;
}

export const ChatStream: React.FC<ChatStreamProps> = ({
  messages,
  persona,
  isRecording,
  isProcessing,
  onToggleRecord,
  onReplayAudio,
  onSelectFeedbackMessage,
  onTranslateMessage
}) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording]);

  return (
    <div className="flex flex-col w-full">
      {/* Main Interaction Area */}
      <div className="flex flex-col flex-1 px-xl py-lg gap-xl mb-48">
        <div className="flex flex-col gap-lg max-w-3xl mx-auto w-full">
          
          {/* User & AI Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-xs group opacity-100 translate-y-0 transition-all duration-700 ease-out`}>
              <div className="flex items-center gap-sm px-sm">
                {msg.sender === 'ai' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                <span className="text-label-sm uppercase tracking-widest text-outline">
                  {msg.sender === 'user' ? 'You' : persona.name}
                </span>
                {msg.sender === 'user' && <div className="w-2 h-2 rounded-full bg-secondary"></div>}
              </div>
              
              <div className={`relative w-fit max-w-[85%] ${msg.sender === 'user' ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-surface-container-low rounded-tl-none border-l-4 border-tertiary'} rounded-2xl p-md shadow-sm`}>
                <div className="flex flex-col gap-md">
                  {/* Feedback Tooltip if it's AI sending feedback */}
                  {msg.sender === 'ai' && msg.fluency_score && (
                    <div className="p-sm bg-tertiary-fixed rounded-lg flex items-start gap-sm">
                      <span className="material-symbols-outlined text-tertiary text-body-lg">lightbulb</span>
                      <div className="flex flex-col">
                         <span className="text-label-sm font-bold text-on-tertiary-fixed">Score: {msg.fluency_score}/100</span>
                      </div>
                    </div>
                  )}
                  <p className="text-body-lg break-words">{msg.text}</p>
                  
                  {msg.translated_text && (
                    <div className="mt-2 pt-2 border-t border-outline-variant/30">
                      <p className="text-body-md text-on-surface-variant italic">{msg.translated_text}</p>
                    </div>
                  )}
                </div>
                
                <div className={`flex gap-sm mt-md transition-opacity duration-200 ${msg.sender === 'user' ? 'justify-end' : ''} ${msg.sender === 'user' && msg.corrected_text ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {msg.sender === 'ai' && (
                    <>
                      <button onClick={() => onReplayAudio(msg.audio_base64, msg.text)} className="flex items-center justify-center p-xs rounded-full hover:bg-surface-container-high text-primary transition-colors" title="Nghe lại">
                        <span className="material-symbols-outlined text-body-md">volume_up</span>
                      </button>
                      <button onClick={() => onTranslateMessage && onTranslateMessage(msg.id, msg.text)} className="flex items-center justify-center p-xs rounded-full hover:bg-surface-container-high text-secondary transition-colors" title="Dịch sang tiếng Việt">
                        <span className="material-symbols-outlined text-body-md">translate</span>
                      </button>
                    </>
                  )}
                  {msg.sender === 'user' && msg.corrected_text && (
                    <button onClick={() => onSelectFeedbackMessage(msg)} className="flex items-center justify-center px-sm py-xs rounded-full bg-on-primary/10 hover:bg-on-primary/20 text-on-primary transition-colors" title="Xem sửa lỗi cú pháp">
                      <span className="material-symbols-outlined text-body-md mr-1">auto_fix_high</span>
                      <span className="text-label-sm">Sửa lỗi cú pháp</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isProcessing && (
            <div className="flex flex-col items-start gap-xs group opacity-100 translate-y-0 transition-all duration-700 ease-out">
              <div className="flex items-center gap-sm px-sm">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-label-sm uppercase tracking-widest text-outline">{persona.name}</span>
              </div>
              <div className="relative w-fit bg-surface-container-low rounded-2xl rounded-tl-none p-md shadow-sm flex gap-1 items-center h-12">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1s_infinite_0ms]"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1s_infinite_200ms]"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1s_infinite_400ms]"></div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* Bottom Interaction (Floating) */}
      <div className="fixed bottom-0 left-[20%] right-[20%] p-lg bg-gradient-to-t from-surface via-surface/90 to-transparent flex flex-col items-center gap-md z-40 pb-8">
        {/* Waveform Animation */}
        <div className={`flex items-end justify-center gap-1 h-12 w-full max-w-md transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-20'}`}>
          <div className={`w-1.5 bg-primary rounded-full ${isRecording ? 'animate-[pulse_1s_infinite_0ms]' : ''}`} style={{height: '40%'}}></div>
          <div className={`w-1.5 bg-secondary rounded-full ${isRecording ? 'animate-[pulse_1s_infinite_150ms]' : ''}`} style={{height: '80%'}}></div>
          <div className={`w-1.5 bg-primary rounded-full ${isRecording ? 'animate-[pulse_1s_infinite_300ms]' : ''}`} style={{height: '60%'}}></div>
          <div className={`w-1.5 bg-secondary rounded-full ${isRecording ? 'animate-[pulse_1s_infinite_450ms]' : ''}`} style={{height: '90%'}}></div>
          <div className={`w-1.5 bg-primary rounded-full ${isRecording ? 'animate-[pulse_1s_infinite_600ms]' : ''}`} style={{height: '50%'}}></div>
          <div className={`w-1.5 bg-secondary rounded-full ${isRecording ? 'animate-[pulse_1s_infinite_750ms]' : ''}`} style={{height: '75%'}}></div>
          <div className={`w-1.5 bg-primary rounded-full ${isRecording ? 'animate-[pulse_1s_infinite_900ms]' : ''}`} style={{height: '30%'}}></div>
        </div>
        
        {/* Mic Button */}
        <div className="flex flex-col items-center gap-sm">
          <div className={`text-label-md font-bold text-primary ${isRecording ? 'animate-pulse' : ''} tracking-widest uppercase`}>
            {isRecording ? 'Recording...' : 'Tap to Speak'}
          </div>
          <button onClick={onToggleRecord} className="group relative flex items-center justify-center">
            {isRecording && <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150"></div>}
            <div className={`relative w-20 h-20 text-on-primary rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-10 ${isRecording ? 'bg-error' : 'bg-primary'}`}>
              <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>mic</span>
            </div>
          </button>
          <span className="text-label-sm text-outline">{isRecording ? 'Tap to Stop' : ''}</span>
        </div>
      </div>
    </div>
  );
};
