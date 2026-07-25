// Web Speech API Interface Declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechRecognitionService {
  private recognition: any = null;
  public isListening: boolean = false;
  private onResultCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onStatusCallback: ((status: string) => void) | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false; // Turn-based speech recognition is more reliable
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.onStatusCallback) this.onStatusCallback('Đang lắng nghe giọng bạn...');
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const text = (finalTranscript || interimTranscript).trim();
          if (text && this.onResultCallback) {
            this.onResultCallback(text, !!finalTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          this.isListening = false;
          let userFriendlyMsg = event.error;
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            userFriendlyMsg = 'Bạn chưa cấp quyền truy cập Microphone cho trình duyệt. Vui lòng nhấn vào biểu tượng ổ khóa/micro trên thanh địa chỉ URL để Cho phép (Allow).';
          } else if (event.error === 'no-speech') {
            userFriendlyMsg = 'Không nghe thấy âm thanh. Vui lòng thử nói to rõ hơn.';
          } else if (event.error === 'network') {
            userFriendlyMsg = 'Lỗi kết nối mạng nhận diện giọng nói.';
          }

          if (this.onErrorCallback) {
            this.onErrorCallback(userFriendlyMsg);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onStatusCallback) this.onStatusCallback('Đã dừng nhận diện');
        };
      } catch (e) {
        console.error('Failed to instantiate SpeechRecognition:', e);
        this.recognition = null;
      }
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public async start(
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (err: string) => void,
    onStatus?: (status: string) => void
  ) {
    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    this.onStatusCallback = onStatus || null;

    if (!this.isSupported()) {
      if (this.onErrorCallback) {
        this.onErrorCallback('Trình duyệt không hỗ trợ Web Speech API. Bạn vui lòng sử dụng Google Chrome hoặc Microsoft Edge.');
      }
      return;
    }

    // Request Microphone permission explicitly first
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (permErr: any) {
      console.warn('Microphone permission denied:', permErr);
      if (this.onErrorCallback) {
        this.onErrorCallback('Bạn chưa cấp quyền Micro trên trình duyệt! Hãy nhấn vào biểu tượng ổ khóa 🔒 trên thanh URL và bật cấp quyền Microphone.');
      }
      return;
    }

    // Re-instantiate if needed
    if (!this.recognition) {
      this.initRecognition();
    }

    try {
      if (this.isListening) {
        this.recognition.stop();
      }
      this.recognition.start();
    } catch (e: any) {
      console.warn('Error starting speech recognition:', e);
      if (e.name === 'InvalidStateError') {
        // Recognition is already active
        this.isListening = true;
      } else if (this.onErrorCallback) {
        this.onErrorCallback(`Lỗi khởi tạo mic: ${e.message || e}`);
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
      this.isListening = false;
    }
  }
}

export const speechRecognizer = new SpeechRecognitionService();
