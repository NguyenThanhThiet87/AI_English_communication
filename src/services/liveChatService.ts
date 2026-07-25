import type { AIStructuredResponse } from '../types';

export class LiveChatService {
  private socket: WebSocket | null = null;
  public sessionId: string = '';
  
  // Callbacks
  public onAiTranscript: ((text: string) => void) | null = null;
  public onGrammarFeedback: ((data: AIStructuredResponse) => void) | null = null;
  public onStatus: ((status: string) => void) | null = null;
  
  // Audio playback state
  private audioContext: AudioContext | null = null;
  private nextPlayTime: number = 0;

  public currentTopicId: string = '';
  public currentPersonaId: string = '';

  public connect(sessionId: string, topicId: string, personaId: string, voiceName: string = "Aoede") {
    if (this.socket && this.sessionId === sessionId && this.currentTopicId === topicId && this.currentPersonaId === personaId) {
       return; // Already connecting or connected to this session with same persona
    }
    this.disconnect();
    this.sessionId = sessionId;
    this.currentTopicId = topicId;
    this.currentPersonaId = personaId;

    const wsBase = import.meta.env.VITE_BACKEND_WS_URL || `ws://localhost:8000`;
    const wsUrl = `${wsBase}/api/live/ws/${sessionId}`;

    try {
      this.socket = new WebSocket(wsUrl);
      // We expect binary data from server (PCM audio chunks)
      this.socket.binaryType = 'arraybuffer';

      this.socket.onopen = () => {
        if (this.onStatus) this.onStatus('Connected to Live API');
        // Send setup context
        this.socket?.send(JSON.stringify({
          topic_id: topicId,
          persona_id: personaId,
          voice_name: voiceName
        }));
      };

      this.socket.onmessage = async (event) => {
        if (event.data instanceof ArrayBuffer) {
          console.log(`Live WS: Received audio chunk of size ${event.data.byteLength}`);
          this.playPCMChunk(event.data);
        } else {
          // JSON message
          console.log(`Live WS: Received JSON: ${event.data}`);
          try {
            const payload = JSON.parse(event.data);
            if (payload.type === 'ai_transcript' && this.onAiTranscript) {
              this.onAiTranscript(payload.text);
            } else if (payload.type === 'grammar_feedback' && this.onGrammarFeedback) {
              this.onGrammarFeedback(payload.data);
            }
          } catch (e) {
            console.error("Live WS Parse error:", e);
          }
        }
      };

      this.socket.onerror = (err) => {
        console.error("Live WebSocket error:", err);
      };

      this.socket.onclose = () => {
        if (this.onStatus) this.onStatus('Disconnected');
      };
    } catch (e) {
      console.error("Failed to create Live WebSocket:", e);
    }
  }

  public sendMessage(text: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ text }));
      // Reset audio time when we send a new message so AI can interrupt itself or start fresh
      if (this.audioContext) {
        this.nextPlayTime = this.audioContext.currentTime;
      }
    }
  }

  private async playPCMChunk(arrayBuffer: ArrayBuffer) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      // Gemini Live usually returns 24kHz PCM by default, standard API might be 16kHz or 24kHz.
      // We'll assume 24000 Hz, as Gemini 2.0 Flash returns 24kHz audio.
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const int16Array = new Int16Array(arrayBuffer);
    // Convert 16-bit PCM to Float32
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    // Create AudioBuffer
    const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    // Schedule playback seamlessly
    const currentTime = this.audioContext.currentTime;
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime;
    }

    source.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const liveChatService = new LiveChatService();
