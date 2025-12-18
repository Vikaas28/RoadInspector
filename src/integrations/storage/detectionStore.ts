import { Detection, Video } from "@/types/inspection";

// Simple in-memory storage for detections
// In production, this would use Supabase or another backend
class DetectionStore {
  private detections: Map<string, Detection[]> = new Map();
  private videos: Map<string, Video> = new Map();

  // Detection methods
  addDetection(detection: Detection): void {
    const videoDetections = this.detections.get(detection.videoId) || [];
    videoDetections.push(detection);
    this.detections.set(detection.videoId, videoDetections);
  }

  addDetections(detections: Detection[]): void {
    detections.forEach((det) => this.addDetection(det));
  }

  getDetectionsByVideo(videoId: string): Detection[] {
    return this.detections.get(videoId) || [];
  }

  getAllDetections(): Detection[] {
    const all: Detection[] = [];
    this.detections.forEach((dets) => all.push(...dets));
    return all;
  }

  clearDetections(videoId: string): void {
    this.detections.delete(videoId);
  }

  // Video methods
  createVideo(video: Video): void {
    this.videos.set(video.id, video);
  }

  getVideo(videoId: string): Video | undefined {
    return this.videos.get(videoId);
  }

  getAllVideos(): Video[] {
    return Array.from(this.videos.values());
  }

  getVideosByUser(userId: string): Video[] {
    return Array.from(this.videos.values()).filter((v) => v.userId === userId);
  }

  updateVideoStatus(videoId: string, status: Video["processingStatus"]): void {
    const video = this.videos.get(videoId);
    if (video) {
      video.processingStatus = status;
      video.processedFrames = status === "completed" ? video.totalFrames : 0;
      video.detectionCount = 
        status === "completed" 
          ? this.getDetectionsByVideo(videoId).length 
          : undefined;
      this.videos.set(videoId, video);
    }
  }

  deleteVideo(videoId: string): void {
    this.videos.delete(videoId);
    this.detections.delete(videoId);
  }

  // Persistence helpers
  toJSON() {
    return {
      detections: Array.from(this.detections.entries()),
      videos: Array.from(this.videos.entries()),
    };
  }

  fromJSON(data: any) {
    this.detections = new Map(data.detections || []);
    this.videos = new Map(data.videos || []);
  }

  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem("detection_store");
      if (stored) {
        this.fromJSON(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load detection store from localStorage:", error);
    }
  }

  saveToLocalStorage(): void {
    try {
      localStorage.setItem(
        "detection_store",
        JSON.stringify(this.toJSON())
      );
    } catch (error) {
      console.error("Failed to save detection store to localStorage:", error);
    }
  }
}

export const detectionStore = new DetectionStore();

// Load from localStorage on init
if (typeof window !== "undefined") {
  detectionStore.loadFromLocalStorage();
}
