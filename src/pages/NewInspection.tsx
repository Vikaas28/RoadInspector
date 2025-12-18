import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Upload, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { VideoRecorder } from '@/components/inspection/VideoRecorder';
import { VideoUploader } from '@/components/inspection/VideoUploader';
import { ProcessingStatus } from '@/components/inspection/ProcessingStatus';
import { GPSPoint, Detection, Video as VideoType } from '@/types/inspection';
import { useToast } from '@/hooks/use-toast';
import { detectionStore } from '@/integrations/storage/detectionStore';
import { useAuth } from '@/contexts/AuthContext';

type InspectionState = 'input' | 'processing' | 'complete';

export default function NewInspection() {
  const [state, setState] = useState<InspectionState>('input');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    frameRate: 3,
    confidenceThreshold: 0.3,
    gpsInterval: 1,
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRecordingComplete = useCallback((blob: Blob, gpsPoints: GPSPoint[], detections: Detection[]) => {
    console.log('Recording complete:', { size: blob.size, gpsPoints: gpsPoints.length, detections: detections.length });
    
    // Use the same videoId that was used when saving detections so results page can find them
    const existingVideoId = detections[0]?.videoId;
    const newVideoId = existingVideoId || `video-${Date.now()}`;
    const video: VideoType = {
      id: newVideoId,
      userId: user?.id || '1',
      originalFilename: `inspection_${new Date().toISOString().split('T')[0]}.webm`,
      storageUrl: URL.createObjectURL(blob),
      uploadedAt: new Date(),
      startTime: new Date(Date.now() - gpsPoints.length * 1000),
      endTime: new Date(),
      processingStatus: 'completed',
      totalFrames: Math.ceil(gpsPoints.length),
      processedFrames: Math.ceil(gpsPoints.length),
      detectionCount: detections.length,
    };

    // Store video (detections were already stored during recording)
    detectionStore.createVideo(video);
    detectionStore.saveToLocalStorage();
    
    setVideoId(newVideoId);
    setState('processing');
    
    toast({
      title: 'Recording complete!',
      description: `${detections.length} road damages detected during inspection.`,
    });

    // Auto-navigate after short delay
    setTimeout(() => {
      navigate(`/inspections/${newVideoId}`);
    }, 2000);
  }, [user, toast, navigate]);

  const handleUploadComplete = useCallback((file: File, gpsData?: any) => {
    console.log('Upload complete:', { name: file.name, size: file.size, gpsData });
    
    const newVideoId = `video-${Date.now()}`;
    setVideoId(newVideoId);
    setState('processing');
    
    toast({
      title: 'Video uploaded',
      description: 'Processing has started...',
    });
  }, [toast]);

  const handleProcessingComplete = useCallback(() => {
    navigate(`/inspections/${videoId}`);
  }, [navigate, videoId]);

  if (state === 'processing' && videoId) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <ProcessingStatus videoId={videoId} onComplete={handleProcessingComplete} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Inspection</h1>
            <p className="text-muted-foreground">Record or upload road footage for analysis</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
          <h3 className="font-semibold mb-4">Processing Settings</h3>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-3">
              <Label>Frame Rate: {settings.frameRate} FPS</Label>
              <Slider
                value={[settings.frameRate]}
                onValueChange={([v]) => setSettings(s => ({ ...s, frameRate: v }))}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">Higher = more frames, slower processing</p>
            </div>
            <div className="space-y-3">
              <Label>Confidence Threshold: {(settings.confidenceThreshold * 100).toFixed(0)}%</Label>
              <Slider
                value={[settings.confidenceThreshold * 100]}
                onValueChange={([v]) => setSettings(s => ({ ...s, confidenceThreshold: v / 100 }))}
                min={10}
                max={90}
                step={5}
              />
              <p className="text-xs text-muted-foreground">Lower = more detections, more false positives</p>
            </div>
            <div className="space-y-3">
              <Label>GPS Interval: {settings.gpsInterval}s</Label>
              <Slider
                value={[settings.gpsInterval]}
                onValueChange={([v]) => setSettings(s => ({ ...s, gpsInterval: v }))}
                min={1}
                max={5}
                step={1}
              />
              <p className="text-xs text-muted-foreground">How often to record GPS coordinates</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="record" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="record" className="gap-2">
            <Video className="h-4 w-4" />
            Record
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <VideoRecorder 
              onRecordingComplete={handleRecordingComplete}
            />
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="font-medium mb-2">Recording Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Hold your device steady while driving</li>
              <li>• Ensure GPS is enabled for accurate location tagging</li>
              <li>• Drive at a consistent speed (recommended: 15-25 mph)</li>
              <li>• Record during daylight for best detection results</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <VideoUploader onUploadComplete={handleUploadComplete} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
