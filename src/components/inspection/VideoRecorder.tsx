import { useState, useRef, useEffect, useCallback } from 'react';
import { Video, StopCircle, Pause, Play, MapPin, Battery, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GPSPoint, Detection } from '@/types/inspection';
import { cn } from '@/lib/utils';
import { potholeDetector } from '@/integrations/ml/potholeDetector';
import { detectionStore } from '@/integrations/storage/detectionStore';
import { useToast } from '@/hooks/use-toast';

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob, gpsPoints: GPSPoint[], detections: Detection[]) => void;
  onRecordingStart?: () => void;
}

export function VideoRecorder({ onRecordingComplete, onRecordingStart }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsPoints, setGpsPoints] = useState<GPSPoint[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [modelLoading, setModelLoading] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const gpsIntervalRef = useRef<number | null>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);
  const videoIdRef = useRef<string>(`video-${Date.now()}`);
  
  const { toast } = useToast();

  // Initialize camera
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: true
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Failed to access camera:', err);
        toast({
          title: 'Camera Error',
          description: 'Failed to access camera. Please check permissions.',
          variant: 'destructive',
        });
      }
    }
    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  // GPS tracking
  const startGPSTracking = useCallback(() => {
    if (!navigator.geolocation) return;

    const options = { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 };
    
    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLocked(true);
        setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setGpsLocked(false),
      options
    );

    // Track position every second
    gpsIntervalRef.current = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocked(true);
          setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          
          const point: GPSPoint = {
            id: Date.now().toString(),
            videoId: '',
            timestamp: new Date(),
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            speed: pos.coords.speed || undefined,
            heading: pos.coords.heading || undefined,
          };
          setGpsPoints(prev => [...prev, point]);
        },
        () => setGpsLocked(false),
        options
      );
    }, 1000);
  }, []);

  const stopGPSTracking = useCallback(() => {
    if (gpsIntervalRef.current) {
      clearInterval(gpsIntervalRef.current);
      gpsIntervalRef.current = null;
    }
  }, []);

  // Frame capture and ML inference
  const startFrameCapture = useCallback(() => {
    frameIntervalRef.current = window.setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        // Draw current frame
        ctx.drawImage(videoRef.current, 0, 0);

        // Get current GPS point
        const gpsPoint = gpsPoints[gpsPoints.length - 1] || null;

        // Run ML inference
        const frameDetections = await potholeDetector.detectFrame(canvasRef.current, gpsPoint);

        if (frameDetections.length > 0) {
          // Convert to Database format
          const dbDetections = await potholeDetector.convertDetectionsToDatabase(
            frameDetections,
            videoIdRef.current,
            frameCountRef.current,
            new Date(),
            gpsPoint
          );

          // Store detections
          detectionStore.addDetections(dbDetections);
          setDetections(prev => [...prev, ...dbDetections]);
          setDetectionCount(prev => prev + dbDetections.length);

          console.log(`Frame ${frameCountRef.current}: ${dbDetections.length} detections found`);
        }

        frameCountRef.current++;
      } catch (error) {
        console.error('Frame capture error:', error);
      }
    }, 3000); // Capture every 3 seconds
  }, [gpsPoints]);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    // Load ML model
    setModelLoading(true);
    potholeDetector.loadModel().then(() => {
      setModelLoading(false);
    }).catch(err => {
      console.error('Failed to load model:', err);
      toast({
        title: 'Model Load Error',
        description: 'ML model could not be loaded. Continuing without detection.',
      });
      setModelLoading(false);
    });

    chunksRef.current = [];
    setGpsPoints([]);
    setDetections([]);
    setDetectionCount(0);
    frameCountRef.current = 0;
    
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9,opus'
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      stopFrameCapture();
      onRecordingComplete(blob, gpsPoints, detections);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000); // Collect data every second
    
    setIsRecording(true);
    setIsPaused(false);
    startGPSTracking();
    startFrameCapture();
    onRecordingStart?.();

    // Start timer
    timerRef.current = window.setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  }, [gpsPoints, detections, onRecordingComplete, onRecordingStart, startGPSTracking, startFrameCapture, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopGPSTracking();
      stopFrameCapture();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
    }
  }, [isRecording, stopGPSTracking]);

  const stopFrameCapture = useCallback(() => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  }, []);

  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    setIsPaused(!isPaused);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-foreground aspect-video">
      {/* Video Preview */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="h-full w-full object-cover"
      />

      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40">
        {/* Top Status Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* GPS Status */}
            <div className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium',
              gpsLocked ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
            )}>
              <MapPin className="h-4 w-4" />
              {gpsLocked ? 'GPS Locked' : 'Acquiring...'}
            </div>

            {/* Model Status */}
            {modelLoading && (
              <div className="flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1.5 text-sm text-accent animate-pulse">
                <Zap className="h-4 w-4" />
                Loading Model...
              </div>
            )}

            {/* Battery Indicator */}
            <div className="flex items-center gap-1.5 rounded-full bg-background/50 backdrop-blur-sm px-3 py-1.5 text-sm text-foreground">
              <Battery className="h-4 w-4" />
              <span>85%</span>
            </div>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center gap-2 rounded-full bg-destructive/90 px-3 py-1.5">
              <span className={cn(
                'h-2 w-2 rounded-full bg-white',
                !isPaused && 'animate-pulse'
              )} />
              <span className="text-sm font-medium text-white">
                {isPaused ? 'PAUSED' : 'REC'} {formatTime(elapsedTime)}
              </span>
            </div>
          )}
        </div>

        {/* Current Position */}
        {currentPosition && (
          <div className="absolute top-16 left-4 rounded-lg bg-background/70 backdrop-blur-sm p-3">
            <p className="text-xs text-muted-foreground">Current Position</p>
            <p className="font-mono text-sm">
              {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
            </p>
          </div>
        )}

        {/* Detection Counter */}
        {isRecording && detectionCount > 0 && (
          <div className="absolute top-16 right-4 rounded-lg bg-background/70 backdrop-blur-sm p-3">
            <p className="text-xs text-muted-foreground">Detections</p>
            <p className="font-mono text-sm text-accent font-bold">
              {detectionCount}
            </p>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center justify-center gap-4">
            {!isRecording ? (
              <Button 
                size="xl" 
                variant="record"
                onClick={startRecording}
                disabled={modelLoading}
                className="rounded-full h-20 w-20 p-0"
              >
                <Video className="h-8 w-8" />
              </Button>
            ) : (
              <>
                <Button
                  size="icon-lg"
                  variant="secondary"
                  onClick={togglePause}
                  className="rounded-full"
                >
                  {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                </Button>
                
                <Button 
                  size="xl" 
                  variant="destructive"
                  onClick={stopRecording}
                  className="rounded-full h-20 w-20 p-0"
                >
                  <StopCircle className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>

          {isRecording && (
            <p className="text-center mt-4 text-sm text-muted-foreground">
              {gpsPoints.length} GPS points • {frameCountRef.current} frames processed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
