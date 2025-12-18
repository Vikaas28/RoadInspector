import { useState, useCallback } from 'react';
import { Upload, File, X, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoUploaderProps {
  onUploadComplete: (file: File, gpsData?: any) => void;
}

export function VideoUploader({ onUploadComplete }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [gpsFile, setGpsFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(f => f.type.startsWith('video/'));
    const gpsDataFile = files.find(f => f.name.endsWith('.gpx') || f.name.endsWith('.json'));

    if (videoFile) setSelectedFile(videoFile);
    if (gpsDataFile) setGpsFile(gpsDataFile);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleGpsFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGpsFile(file);
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedFile) {
      onUploadComplete(selectedFile, gpsFile);
    }
  }, [selectedFile, gpsFile, onUploadComplete]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200',
          isDragging 
            ? 'border-accent bg-accent/5' 
            : 'border-border hover:border-accent/50 hover:bg-muted/50',
          selectedFile && 'border-success bg-success/5'
        )}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="text-lg font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">Drop your video here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports MP4, WebM, MOV up to 2GB
            </p>
          </div>
        )}
      </div>

      {/* GPS Data Upload */}
      <div className={cn(
        'rounded-xl border p-6 transition-all',
        gpsFile ? 'border-success bg-success/5' : 'border-border'
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            gpsFile ? 'bg-success/20' : 'bg-muted'
          )}>
            <MapPin className={cn('h-6 w-6', gpsFile ? 'text-success' : 'text-muted-foreground')} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">GPS Data (Optional)</h4>
            <p className="text-sm text-muted-foreground">
              Upload a GPX or JSON file with GPS coordinates
            </p>
            
            {gpsFile ? (
              <div className="mt-3 flex items-center gap-2">
                <File className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">{gpsFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setGpsFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".gpx,.json"
                    onChange={handleGpsFileSelect}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <span>Select GPS File</span>
                  </Button>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button 
        className="w-full" 
        size="lg"
        disabled={!selectedFile}
        onClick={handleSubmit}
      >
        <Upload className="h-5 w-5 mr-2" />
        Upload & Process Video
      </Button>
    </div>
  );
}
