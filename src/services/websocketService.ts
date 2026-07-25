import type { AIStructuredResponse } from '../types';

export interface WSMessagePayload {
  type: string;
  session_id?: string;
  data?: AIStructuredResponse;
  audio_base64?: string;
  message?: string;
}

export class WebSocketChatService {
  private socket: WebSocket | null = null;
  private sessionId: string = '';
  private onMessageCallback: ((payload: WSMessagePayload) => void) | null = null;
  private onStatusCallback: ((status: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  public connect(
    sessionId: string, 
    onMessage: (payload: WSMessagePayload) => void,
    onStatus?: (status: string) => void,
    onError?: (err: string) => void
  ) {
    this.disconnect();
    this.sessionId = sessionId;
    this.onMessageCallback = onMessage;
    this.onStatusCallback = onStatus || null;
    this.onErrorCallback = onError || null;

    const wsBase = import.meta.env.VITE_BACKEND_WS_URL || `ws://localhost:8000`;
    const wsUrl = `${wsBase}/api/chat/ws/${sessionId}`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        if (this.onStatusCallback) this.onStatusCallback('Connected');
      };

      this.socket.onmessage = (event) => {
        try {
          const payload: WSMessagePayload = JSON.parse(event.data);
          if (payload.type === 'status' && this.onStatusCallback) {
            this.onStatusCallback(payload.message || 'Processing...');
          } else if (payload.type === 'ai_response' && this.onMessageCallback) {
            this.onMessageCallback(payload);
          }
        } catch (e) {
          console.error("WS Parse error:", e);
        }
      };

      this.socket.onerror = (err) => {
        console.warn("WebSocket error, fallback to HTTP REST:", err);
        if (this.onErrorCallback) this.onErrorCallback("WebSocket connection error");
      };

      this.socket.onclose = () => {
        if (this.onStatusCallback) this.onStatusCallback('Disconnected');
      };
    } catch (e) {
      console.warn("Failed to create WebSocket, HTTP REST fallback enabled:", e);
    }
  }

  public sendMessage(text: string, topicId: string, personaId: string, voice: string = "en-US-AvaNeural") {
    const messageData = {
      text,
      topic_id: topicId,
      persona_id: personaId,
      voice
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(messageData));
    } else {
      // Fallback to HTTP REST endpoint
      this.sendViaREST(text, topicId, personaId, voice);
    }
  }

  private async sendViaREST(text: string, topicId: string, personaId: string, voice: string) {
    if (this.onStatusCallback) this.onStatusCallback('Sending via HTTP...');
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          user_text: text,
          topic_id: topicId,
          persona_id: personaId,
          voice
        })
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const json = await response.json();

      if (json.status === 'success' && this.onMessageCallback) {
        this.onMessageCallback({
          type: 'ai_response',
          session_id: this.sessionId,
          data: json.data,
          audio_base64: json.audio_base64
        });
      }
    } catch (e: any) {
      console.error("HTTP REST Fallback Error:", e);
      if (this.onErrorCallback) this.onErrorCallback(e.message || "Failed to send message");
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsChatService = new WebSocketChatService();
