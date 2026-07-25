import json
import logging
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from google import genai
from google.genai import types

from config import settings
from routers.chat import find_topic_and_persona
from services.gemini_service import gemini_service
import struct
import re

logger = logging.getLogger("speakmate")
router = APIRouter(prefix="/api/live", tags=["Live Chat"])

def create_wav_header(pcm_data: bytes, sample_rate: int = 24000, num_channels: int = 1, bits_per_sample: int = 16) -> bytes:
    byte_rate = sample_rate * num_channels * (bits_per_sample // 8)
    block_align = num_channels * (bits_per_sample // 8)
    data_size = len(pcm_data)
    chunk_size = 36 + data_size
    header = struct.pack('<4sI4s4sIHHIIHH4sI',
        b'RIFF', chunk_size, b'WAVE',
        b'fmt ', 16, 1, num_channels, sample_rate, byte_rate, block_align, bits_per_sample,
        b'data', data_size
    )
    return header + pcm_data

@router.websocket("/ws/{session_id}")
async def live_websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    logger.info(f"Live WebSocket connected for session: {session_id}")
    
    # We will receive an initial JSON setup message from client
    try:
        raw_setup = await websocket.receive_text()
        setup_data = json.loads(raw_setup)
        topic_id = setup_data.get("topic_id", "daily-life")
        persona_id = setup_data.get("persona_id", "friendly-roommate")
        voice_name = setup_data.get("voice_name", "Aoede")
        
        topic_title, topic_desc, persona_role, initial_msg = find_topic_and_persona(topic_id, persona_id)
        
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        system_instruction = f"""You are SpeakMate AI, an expert English Speaking Tutor.
Your Persona: {persona_role}
Topic Context: {topic_title} - {topic_desc}
Initial Context: {initial_msg}

RULES:
- Be highly conversational, warm, and friendly.
- Keep your answers relatively short (2-3 sentences) so the conversation flows fast.
- Never write out formatting tags. Just speak naturally.
- Ask a follow-up question often to keep the user engaged.
"""

        config = types.LiveConnectConfig(
            response_modalities=[types.Modality.AUDIO],
            system_instruction=types.Content(parts=[types.Part.from_text(text=system_instruction)]),
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=voice_name
                    )
                )
            )
        )

        async with client.aio.live.connect(model="gemini-3.1-flash-live-preview", config=config) as session:
            logger.info("Connected to Gemini Live API")
            
            # Task to receive audio from Client and send to Gemini
            async def receive_from_client():
                try:
                    while True:
                        message = await websocket.receive()
                        if "text" in message:
                            text_data = json.loads(message["text"])
                            user_text = text_data.get("text", "").strip()
                            if user_text:
                                logger.info(f"Sending text to Gemini: {user_text}")
                                # Send text to Gemini Live
                                await session.send(
                                    input=user_text, 
                                    end_of_turn=True
                                )
                                
                                # Async grammar check
                                asyncio.create_task(process_grammar(user_text))
                except WebSocketDisconnect:
                    logger.info("Client disconnected")
                except Exception as e:
                    logger.error(f"Error reading from client: {e}")

            async def process_grammar(user_text: str):
                if not user_text.strip(): return
                result = await gemini_service.analyze_grammar_only(user_text)
                try:
                    await websocket.send_json({
                        "type": "grammar_feedback",
                        "data": result.model_dump()
                    })
                except:
                    pass

            async def transcribe_audio(pcm_data: bytes):
                try:
                    wav_data = create_wav_header(pcm_data)
                    logger.info(f"Sending audio of size {len(wav_data)} bytes for transcription...")
                    
                    # Create a standard client for transcription (needs its own client instance or the global one)
                    transcription_client = genai.Client(api_key=settings.GEMINI_API_KEY)
                    response = await transcription_client.aio.models.generate_content(
                        model='gemini-2.0-flash',
                        contents=[
                            types.Content(parts=[
                                types.Part.from_bytes(data=wav_data, mime_type='audio/wav'),
                                types.Part.from_text(text='Transcribe exactly what is said in this audio. Output ONLY the transcript without any formatting.')
                            ])
                        ]
                    )
                    transcript = response.text.strip()
                    logger.info(f"Transcription result: {transcript}")
                    await websocket.send_json({
                        "type": "ai_transcript",
                        "text": transcript
                    })
                except Exception as e:
                    logger.error(f"Transcription failed: {e}")

            # Task to receive audio from Gemini and send to Client
            async def receive_from_gemini():
                try:
                    turn_transcript_sent = False
                    current_turn_audio = bytearray()
                    
                    async for response in session.receive():
                        server_content = response.server_content
                        if server_content is not None:
                            model_turn = server_content.model_turn
                            if model_turn is not None:
                                for part in model_turn.parts:
                                    if part.inline_data and part.inline_data.data:
                                        # Accumulate audio for transcription
                                        current_turn_audio.extend(part.inline_data.data)
                                        
                                        # Send audio binary to client
                                        logger.info(f"Sending audio chunk of size {len(part.inline_data.data)}")
                                        await websocket.send_bytes(part.inline_data.data)
                                        
                                        if not turn_transcript_sent:
                                            # Send a placeholder transcript to stop the loading state
                                            await websocket.send_json({
                                                "type": "ai_transcript",
                                                "text": ""
                                            })
                                            turn_transcript_sent = True
                            if server_content.turn_complete:
                                turn_transcript_sent = False
                                if len(current_turn_audio) > 0:
                                    # Start background transcription task
                                    asyncio.create_task(transcribe_audio(bytes(current_turn_audio)))
                                    current_turn_audio = bytearray()
                except Exception as e:
                    logger.error(f"Error receiving from Gemini: {e}")

            client_task = asyncio.create_task(receive_from_client())
            gemini_task = asyncio.create_task(receive_from_gemini())

            done, pending = await asyncio.wait(
                [client_task, gemini_task],
                return_when=asyncio.FIRST_COMPLETED
            )
            for task in pending:
                task.cancel()

    except Exception as e:
        logger.error(f"Live WebSocket setup error: {e}")
        try:
            await websocket.close()
        except:
            pass
