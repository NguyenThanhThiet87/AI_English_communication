import { useState, useEffect } from 'react';
import type { Topic, TopicPersona, ChatMessage } from './types';
import { wsChatService } from './services/websocketService';
import { speechRecognizer } from './services/speechRecognition';
import { ttsPlayer } from './services/ttsPlayer';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RightSidebar } from './components/RightSidebar';
import { ChatStream } from './components/ChatStream';
import { SessionSummary } from './components/SessionSummary';

const DEFAULT_TOPICS: Topic[] = [
  {
    id: "job-interview",
    title: "Job Interview",
    description: "Luyện phỏng vấn xin việc, trả lời câu hỏi.",
    icon: "Briefcase",
    level: "B1 Intermediate",
    personas: [
      {
        id: "hr-manager",
        name: "Sarah Jenkins",
        role: "Senior HR Manager",
        description: "Đặt câu hỏi phỏng vấn chuẩn doanh nghiệp.",
        avatar_icon: "UserCheck",
        initial_message: "Welcome to our office! Could you tell me a little about yourself?",
        voice_name: "en-US-AvaNeural"
      }
    ]
  },
  {
    id: "daily-life",
    title: "Daily Conversation",
    description: "Luyện giao tiếp hằng ngày.",
    icon: "Coffee",
    level: "A2 Beginner",
    personas: [
      {
        id: "friendly-roommate",
        name: "Alex",
        role: "Friendly Roommate",
        description: "Nói chuyện tự nhiên, gần gũi.",
        avatar_icon: "User",
        initial_message: "Hey there! How was your day today?",
        voice_name: "en-US-AndrewNeural"
      }
    ]
  }
];

export function App() {
  const [appState, setAppState] = useState<'chat' | 'summary'>('chat');
  const [topics] = useState<Topic[]>(DEFAULT_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(DEFAULT_TOPICS[0]);
  const [selectedPersona, setSelectedPersona] = useState<TopicPersona>(DEFAULT_TOPICS[0].personas[0]);
  
  const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: `msg-initial-${Date.now()}`,
      sender: 'ai',
      text: DEFAULT_TOPICS[0].personas[0].initial_message,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeFeedbackMsg, setActiveFeedbackMsg] = useState<ChatMessage | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>("en-US-AvaNeural");

  // Play initial message when topic changes
  useEffect(() => {
    if (appState === 'chat' && selectedPersona.initial_message) {
      const fetchAndPlayInitialMessage = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedPersona.initial_message, voice: selectedVoice })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success' && data.audio_base64) {
              ttsPlayer.playBase64Audio(data.audio_base64);
              setMessages(prev => {
                const updated = [...prev];
                if (updated.length > 0 && updated[0].id.startsWith('msg-initial-')) {
                   updated[0] = { ...updated[0], audio_base64: data.audio_base64 };
                }
                return updated;
              });
            } else {
              ttsPlayer.speakBrowserTTS(selectedPersona.initial_message);
            }
          }
        } catch (e) {
          console.warn("Failed to fetch initial TTS", e);
          ttsPlayer.speakBrowserTTS(selectedPersona.initial_message);
        }
      };
      
      // Stop any current audio and add a small delay before playing the new topic's message
      ttsPlayer.stop();
      setTimeout(fetchAndPlayInitialMessage, 500);
    }
  }, [selectedTopic.id, selectedPersona.id, appState]);

  // Update initial message audio silently when voice changes
  useEffect(() => {
    if (appState === 'chat' && selectedPersona.initial_message) {
      const fetchSilentInitialMessage = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedPersona.initial_message, voice: selectedVoice })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success' && data.audio_base64) {
              setMessages(prev => {
                const updated = [...prev];
                if (updated.length > 0 && updated[0].id.startsWith('msg-initial-')) {
                   updated[0] = { ...updated[0], audio_base64: data.audio_base64 };
                }
                return updated;
              });
            }
          }
        } catch (e) {
          console.warn("Failed to silently fetch TTS", e);
        }
      };
      fetchSilentInitialMessage();
    }
  }, [selectedVoice]);

  // Auto-scroll logic if needed can go here, but ChatStream handles it

  // Connect WebSocket when in chat state
  useEffect(() => {
    if (appState === 'chat') {
      wsChatService.connect(
        sessionId,
        (payload) => {
          setIsProcessing(false);
          if (payload.data) {
             const data = payload.data;
             setMessages(prev => {
                const updated = [...prev];
                // Update the user's message with grammar feedback
                for (let i = updated.length - 1; i >= 0; i--) {
                  if (updated[i].sender === 'user') {
                    updated[i] = {
                      ...updated[i],
                      corrected_text: data.corrected_text,
                      natural_expression: data.natural_expression,
                      grammar_errors: data.grammar_errors,
                      fluency_score: data.fluency_score,
                      feedback_summary: data.feedback_summary
                    };
                    setActiveFeedbackMsg(updated[i]);
                    break;
                  }
                }
                
                // Add AI's reply
                updated.push({
                   id: `msg-ai-${Date.now()}`,
                   sender: 'ai',
                   text: data.ai_reply,
                   timestamp: new Date().toLocaleTimeString(),
                   audio_base64: payload.audio_base64
                });
                return updated;
             });

             // Auto-play the audio response
             if (payload.audio_base64) {
               ttsPlayer.playBase64Audio(payload.audio_base64);
             } else if (data.ai_reply) {
               ttsPlayer.speakBrowserTTS(data.ai_reply);
             }
          }
        },
        (status) => {
           console.log("WS Status:", status);
        },
        (err) => {
           console.error("WS Error:", err);
           setIsProcessing(false);
        }
      );
    } else {
      wsChatService.disconnect();
    }
    return () => {
      wsChatService.disconnect();
    };
  }, [appState, sessionId, selectedTopic.id, selectedPersona.id]);

  const handleToggleRecord = async () => {
    if (isRecording) {
      speechRecognizer.stop();
      setIsRecording(false);
    } else {
      if (!speechRecognizer.isSupported()) {
        alert("Web Speech API not supported.");
        return;
      }
      setIsRecording(true);
      await speechRecognizer.start(
        (text, isFinal) => {
          if (isFinal && text.trim()) {
            handleSendMessage(text);
            setIsRecording(false);
          }
        },
        (err) => {
          console.warn("Speech Rec Error:", err);
          setIsRecording(false);
        },
        () => {}
      );
    }
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend) return;
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    
    // Simulate summary trigger if messages get too long
    if (messages.length > 15) {
      setTimeout(() => setAppState('summary'), 3000);
    }

    wsChatService.sendMessage(textToSend, selectedTopic.id, selectedPersona.id, selectedVoice);
  };

  const handleTranslateMessage = async (msgId: string, text: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.translated) {
          setMessages(prev => prev.map(msg => 
            msg.id === msgId ? { ...msg, translated_text: data.translated } : msg
          ));
        }
      }
    } catch (err) {
      console.error("Translation error:", err);
    }
  };

  const handleReplayAudio = (base64Audio?: string, text?: string) => {
    if (base64Audio) ttsPlayer.playBase64Audio(base64Audio);
    else if (text) ttsPlayer.speakBrowserTTS(text);
  };

  const handleSelectTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId) || topics[0];
    setSelectedTopic(topic);
    setSelectedPersona(topic.personas[0]);
    
    // Update voice if the persona has a preferred voice
    if (topic.personas[0].voice_name) {
      setSelectedVoice(topic.personas[0].voice_name);
    }

    setSessionId(`session-${topic.id}-${Date.now()}`);
    setMessages([
      {
        id: `msg-initial-${Date.now()}`,
        sender: 'ai',
        text: topic.personas[0].initial_message,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setActiveFeedbackMsg(null);
    setAppState('chat');
  };

  return (
    <>
      <Sidebar 
        topics={topics} 
        selectedTopicId={selectedTopic.id} 
        onSelectTopic={handleSelectTopic} 
      />
      
      <div className="w-full lg:pl-[20%] lg:pr-[20%]">
        <Header 
          topic={selectedTopic} 
          sessionTimeStr="12:35" 
          selectedVoice={selectedVoice}
          onChangeVoice={setSelectedVoice}
        />
        
        <main className="relative pt-16 min-h-screen bg-surface">
          {appState === 'chat' && (
            <ChatStream 
              messages={messages}
              persona={selectedPersona}
              isRecording={isRecording}
              isProcessing={isProcessing}
              onToggleRecord={handleToggleRecord}
              onReplayAudio={handleReplayAudio}
              onSelectFeedbackMessage={(msg) => setActiveFeedbackMsg(msg)}
              onTranslateMessage={handleTranslateMessage}
            />
          )}
          
          {appState === 'summary' && (
            <SessionSummary 
              onBackToTopics={() => setAppState('chat')}
              onNewSession={() => handleSelectTopic(selectedTopic.id)}
            />
          )}
        </main>
      </div>

      <RightSidebar activeMessageFeedback={activeFeedbackMsg} />
    </>
  );
}

export default App;
