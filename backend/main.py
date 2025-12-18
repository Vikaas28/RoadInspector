from __future__ import annotations

import base64
import io
from pathlib import Path
from typing import Literal, List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "best.pt"

app = FastAPI(title="RoadInspector Pothole Detection API")

# Allow local dev origins (Vite/localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic models (API schema) -------------------------------------------------

SeverityLevel = Literal["low", "medium", "high", "critical"]
DetectionClass = Literal["pothole", "crack", "other"]


class BBox(BaseModel):
    x: float
    y: float
    width: float
    height: float


class DetectionOut(BaseModel):
    classLabel: DetectionClass
    confidence: float
    bbox: BBox
    severityScore: SeverityLevel


class GPSPoint(BaseModel):
    latitude: float
    longitude: float


class DetectRequest(BaseModel):
    # Data URL or base64 string of a JPEG/PNG image coming from the browser
    image: str
    gps: Optional[GPSPoint] = None


class DetectResponse(BaseModel):
    detections: List[DetectionOut]


# --- Model loading ----------------------------------------------------------------

model: YOLO | None = None


def load_model() -> YOLO:
    global model
    if model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"best.pt not found at {MODEL_PATH}")
        model = YOLO(str(MODEL_PATH))
    return model


# --- Helpers ----------------------------------------------------------------------

def decode_image(data: str) -> Image.Image:
    """
    Accepts a data URL (e.g. 'data:image/jpeg;base64,...') or a raw base64 string.
    Returns a PIL Image.
    """
    if data.startswith("data:"):
        header, b64data = data.split(",", 1)
    else:
        b64data = data

    img_bytes = base64.b64decode(b64data)
    return Image.open(io.BytesIO(img_bytes)).convert("RGB")


def map_confidence_to_severity(conf: float) -> SeverityLevel:
    if conf < 0.5:
        return "low"
    if conf < 0.7:
        return "medium"
    if conf < 0.9:
        return "high"
    return "critical"


def map_yolo_class_name(name: str) -> DetectionClass:
    name_lower = name.lower()
    if "pothole" in name_lower:
        return "pothole"
    if "crack" in name_lower:
        return "crack"
    return "other"


# --- Routes -----------------------------------------------------------------------

@app.get("/health")
def health() -> Dict[str, Any]:
    return {"status": "ok"}


@app.post("/detect", response_model=DetectResponse)
def detect(req: DetectRequest) -> DetectResponse:
    """
    Run pothole detection on a frame image using best.pt (YOLO model).
    """
    try:
        img = decode_image(req.image)
    except Exception as exc:  # pragma: no cover - debug logging
        print("Failed to decode image:", exc)
        raise HTTPException(status_code=400, detail="Invalid image payload") from exc

    try:
        mdl = load_model()
    except FileNotFoundError as exc:
        print("Model not found:", exc)
        raise HTTPException(status_code=500, detail="Model file best.pt not found") from exc
    except Exception as exc:
        print("Failed to load model:", exc)
        raise HTTPException(status_code=500, detail="Failed to load model") from exc

    try:
        results = mdl(img, verbose=False)[0]
    except Exception as exc:  # pragma: no cover - debug logging
        print("Inference error:", exc)
        raise HTTPException(status_code=500, detail="Inference failed") from exc

    detections: List[DetectionOut] = []

    if results.boxes is not None and len(results.boxes) > 0:
        boxes = results.boxes.xywh  # [x, y, w, h] in absolute pixels
        scores = results.boxes.conf
        classes = results.boxes.cls

        names = results.names or {}

        for xywh, conf, cls_idx in zip(boxes, scores, classes):
            x, y, w, h = [float(v) for v in xywh.tolist()]
            confidence = float(conf.item())
            class_name = names.get(int(cls_idx.item()), "pothole")

            detections.append(
                DetectionOut(
                    classLabel=map_yolo_class_name(class_name),
                    confidence=confidence,
                    bbox=BBox(x=x, y=y, width=w, height=h),
                    severityScore=map_confidence_to_severity(confidence),
                )
            )

    return DetectResponse(detections=detections)


# For local testing:
#   cd backend
#   uvicorn main:app --reload --host 0.0.0.0 --port 8000


