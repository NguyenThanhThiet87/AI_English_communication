export class AudioPlayerService {
  private currentAudio: HTMLAudioElement | null = null;

  public playBase64Audio(base64Data: string, onEnd?: () => void) {
    this.stop();
    if (!base64Data) {
      return;
    }

    try {
      const audioUrl = `data:audio/mp3;base64,${base64Data}`;
      this.currentAudio = new Audio(audioUrl);
      
      if (onEnd) {
        this.currentAudio.onended = onEnd;
        this.currentAudio.onerror = () => {
          console.warn("Base64 audio playback failed");
          onEnd();
        };
      }

      this.currentAudio.play().catch((err) => {
        console.warn("Audio autoplay blocked or failed:", err);
        if (onEnd) onEnd();
      });
    } catch (e) {
      console.error("Audio player error:", e);
      if (onEnd) onEnd();
    }
  }

  public speakBrowserTTS(text: string, onEnd?: () => void) {
    this.stop();
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    // Pick crisp English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const ttsPlayer = new AudioPlayerService();
