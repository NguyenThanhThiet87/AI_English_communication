import base64
import logging
import io
import edge_tts

logger = logging.getLogger("speakmate")

# Default crisp English voices
DEFAULT_VOICES = {
    "en-US-Female": "en-US-AvaNeural",
    "en-US-Male": "en-US-AndrewNeural",
    "en-GB-Female": "en-GB-SoniaNeural",
    "en-GB-Male": "en-GB-RyanNeural"
}

class TTSService:
    async def generate_speech_bytes(self, text: str, voice: str = "en-US-AvaNeural") -> bytes:
        """Generate MP3 audio bytes from text using Microsoft Edge TTS"""
        try:
            communicate = edge_tts.Communicate(text, voice)
            audio_data = bytearray()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data.extend(chunk["data"])
            return bytes(audio_data)
        except Exception as e:
            logger.error(f"Edge-TTS generation error: {e}")
            return b""

    async def generate_speech_base64(self, text: str, voice: str = "en-US-AvaNeural") -> str:
        """Returns base64 encoded string of MP3 audio for immediate browser playback"""
        audio_bytes = await self.generate_speech_bytes(text, voice)
        if audio_bytes:
            return base64.b64encode(audio_bytes).decode('utf-8')
        return ""

tts_service = TTSService()
