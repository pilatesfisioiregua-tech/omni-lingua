"""
Modal Whisper app · transcribe audio EN → texto.

Usage:
  pip install modal
  modal token new
  modal deploy infra/modal/whisper.py

Devuelve el endpoint URL · añadirlo a Vercel env como MODAL_TRANSCRIBE_ENDPOINT.

Coste estimado: $30 free GPU credit/mes · suficiente para uso personal.
"""

import modal
import io

app = modal.App("omni-lingua-whisper")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "openai-whisper==20231117",
        "torch==2.2.0",
        "fastapi[standard]==0.115.0",
    )
    .apt_install("ffmpeg")
)

with image.imports():
    import whisper
    import torch


@app.cls(image=image, gpu="T4", scaledown_window=120)
class Transcriber:
    model = None

    @modal.enter()
    def load(self):
        self.model = whisper.load_model("small.en")  # small.en suficiente · más rápido que medium

    @modal.fastapi_endpoint(method="POST")
    async def transcribe(self, audio: bytes = modal.fastapi.File(...)):
        if not self.model:
            return {"error": "model_not_loaded"}
        with io.BytesIO(audio) as buf:
            buf.seek(0)
            # whisper espera path · escribimos a /tmp
            import tempfile
            with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
                f.write(audio)
                tmp_path = f.name
        try:
            result = self.model.transcribe(tmp_path, language="en", fp16=torch.cuda.is_available())
            return {
                "transcript": result["text"].strip(),
                "language": "en",
                "duration": result.get("duration", 0),
                "segments": [
                    {"start": s["start"], "end": s["end"], "text": s["text"]}
                    for s in result.get("segments", [])[:50]
                ],
            }
        except Exception as e:
            return {"error": "transcribe_failed", "detail": str(e)}
