export type UserRole = 'inspector' | 'admin';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type DetectionClass = 'pothole' | 'crack' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  approved: boolean;
  createdAt: Date;
}

export interface GPSPoint {
  id: string;
  videoId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}

export interface Detection {
  id: string;
  videoId: string;
  frameIndex: number;
  timestamp: Date;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  classLabel: DetectionClass;
  confidence: number;
  severityScore: SeverityLevel;
  latitude: number;
  longitude: number;
  frameUrl?: string;
  notes?: string;
  createdAt: Date;
}

export interface Video {
  id: string;
  userId: string;
  originalFilename: string;
  storageUrl: string;
  uploadedAt: Date;
  startTime: Date;
  endTime: Date;
  processingStatus: ProcessingStatus;
  totalFrames?: number;
  processedFrames?: number;
  detectionCount?: number;
}

export interface Report {
  id: string;
  videoId: string;
  userId: string;
  inspectorName: string;
  organization: string;
  createdAt: Date;
  summary: {
    totalDetections: number;
    bySeverity: Record<SeverityLevel, number>;
    byClass: Record<DetectionClass, number>;
    routeStartLat: number;
    routeStartLng: number;
    routeEndLat: number;
    routeEndLng: number;
  };
  pdfUrl?: string;
  jsonUrl?: string;
}

export interface InspectionSession {
  id: string;
  isRecording: boolean;
  startTime?: Date;
  gpsPoints: GPSPoint[];
  videoBlob?: Blob;
}
