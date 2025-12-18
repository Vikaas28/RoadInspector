import { Detection, GPSPoint } from "@/types/inspection";

export interface DetectionResult {
  classLabel: "pothole" | "crack" | "other";
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  severityScore: "low" | "medium" | "high" | "critical";
}

const BACKEND_URL =
  (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:8000";

class PotholeDetector {
  private modelReady = false;

  async loadModel(): Promise<void> {
    if (this.modelReady) return;

    // For backend mode we just health‑check the API once
    try {
      const res = await fetch(`${BACKEND_URL}/health`).catch(() => null);
      if (!res || !res.ok) {
        console.warn(
          "Detection backend not reachable, will skip detections and return empty results."
        );
      } else {
        console.log("Detection backend is reachable.");
      }
    } catch (error) {
      console.warn("Error checking detection backend:", error);
    } finally {
      this.modelReady = true;
    }
  }

  async detectFrame(
    canvas: HTMLCanvasElement,
    gpsPoint: GPSPoint | null
  ): Promise<DetectionResult[]> {
    if (!this.modelReady) {
      await this.loadModel();
    }

    try {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

      const response = await fetch(`${BACKEND_URL}/detect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: dataUrl,
          gps: gpsPoint
            ? {
                latitude: gpsPoint.latitude,
                longitude: gpsPoint.longitude,
              }
            : null,
        }),
      });

      if (!response.ok) {
        console.error("Detection backend error:", await response.text());
        return [];
      }

      const data = await response.json();
      return (data.detections || []) as DetectionResult[];
    } catch (error) {
      console.error("Detection request failed:", error);
      return [];
    }
  }

  async convertDetectionsToDatabase(
    detections: DetectionResult[],
    videoId: string,
    frameIndex: number,
    timestamp: Date,
    gpsPoint: GPSPoint | null
  ): Promise<Detection[]> {
    return detections.map((det, idx) => ({
      id: `det-${videoId}-${frameIndex}-${idx}`,
      videoId,
      frameIndex,
      timestamp,
      bbox: det.bbox,
      classLabel: det.classLabel,
      confidence: det.confidence,
      severityScore: det.severityScore,
      latitude: gpsPoint?.latitude || 0,
      longitude: gpsPoint?.longitude || 0,
      notes: `Detection confidence: ${(det.confidence * 100).toFixed(1)}%`,
      createdAt: new Date(),
    }));
  }

  async dispose(): Promise<void> {
    this.modelReady = false;
  }
}

export const potholeDetector = new PotholeDetector();
