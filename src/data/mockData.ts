import { Detection, Video, Report, SeverityLevel, DetectionClass } from '@/types/inspection';
import { detectionStore } from '@/integrations/storage/detectionStore';

// Get real detections from store instead of generating mock data
export function getDetectionsByVideo(videoId: string): Detection[] {
  return detectionStore.getDetectionsByVideo(videoId);
}

// Get real videos from store
export function getVideosByUser(userId: string): Video[] {
  return detectionStore.getVideosByUser(userId);
}

// Get all videos
export function getAllVideos(): Video[] {
  return detectionStore.getAllVideos();
}

// Generate reports from real detections
export function generateReportFromDetections(videoId: string, userId: string, video: Video | undefined): Report | null {
  if (!video) return null;

  const detections = detectionStore.getDetectionsByVideo(videoId);
  
  if (detections.length === 0) {
    return null;
  }

  const bySeverity: Record<SeverityLevel, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  const byClass: Record<DetectionClass, number> = {
    pothole: 0,
    crack: 0,
    other: 0,
  };

  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

  detections.forEach(det => {
    bySeverity[det.severityScore]++;
    byClass[det.classLabel]++;
    minLat = Math.min(minLat, det.latitude);
    maxLat = Math.max(maxLat, det.latitude);
    minLng = Math.min(minLng, det.longitude);
    maxLng = Math.max(maxLng, det.longitude);
  });

  return {
    id: `report-${videoId}`,
    videoId,
    userId,
    inspectorName: 'Road Inspector',
    organization: 'Inspection System',
    createdAt: new Date(),
    summary: {
      totalDetections: detections.length,
      bySeverity,
      byClass,
      routeStartLat: minLat,
      routeStartLng: minLng,
      routeEndLat: maxLat,
      routeEndLng: maxLng,
    },
  };
}
