import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Video, Clock, CheckCircle, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getVideosByUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'text-muted-foreground', bg: 'bg-muted' },
  processing: { icon: Clock, label: 'Processing', color: 'text-accent', bg: 'bg-accent/10' },
  completed: { icon: CheckCircle, label: 'Completed', color: 'text-success', bg: 'bg-success/10' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-destructive', bg: 'bg-destructive/10' },
};

export default function Inspections() {
  const { user } = useAuth();
  const videos = useMemo(() => getVideosByUser(user?.id || '1'), [user?.id]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Inspections</h1>
          <p className="text-muted-foreground">View and manage your road inspection videos</p>
        </div>
        <Button asChild>
          <Link to="/inspect">
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Link>
        </Button>
      </div>

      {/* Videos Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const status = statusConfig[video.processingStatus];
          const StatusIcon = status.icon;

          return (
            <Link
              key={video.id}
              to={video.processingStatus === 'completed' ? `/inspections/${video.id}` : '#'}
              className={cn(
                'group rounded-xl border border-border bg-card p-5 transition-all',
                video.processingStatus === 'completed' 
                  ? 'hover:border-accent/50 hover:shadow-md cursor-pointer'
                  : 'opacity-80'
              )}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-lg bg-muted mb-4 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-10 w-10 text-muted-foreground" />
                </div>
                
                {/* Status Badge */}
                <div className={cn(
                  'absolute top-2 right-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                  status.bg, status.color
                )}>
                  <StatusIcon className={cn('h-3 w-3', video.processingStatus === 'processing' && 'animate-spin')} />
                  {status.label}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <h3 className="font-medium truncate group-hover:text-accent transition-colors">
                  {video.originalFilename}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{new Date(video.uploadedAt).toLocaleDateString()}</span>
                  {video.processingStatus === 'completed' && video.detectionCount !== undefined && (
                    <span className="font-medium text-foreground">
                      {video.detectionCount} detections
                    </span>
                  )}
                  {video.processingStatus === 'processing' && (
                    <span>
                      {video.processedFrames?.toLocaleString()} / {video.totalFrames?.toLocaleString()} frames
                    </span>
                  )}
                </div>

                {/* Progress bar for processing */}
                {video.processingStatus === 'processing' && video.totalFrames && video.processedFrames && (
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${(video.processedFrames / video.totalFrames) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              {/* View Results Link */}
              {video.processingStatus === 'completed' && (
                <div className="mt-4 flex items-center text-sm text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Results
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-16">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No inspections yet</h3>
          <p className="text-muted-foreground mt-1">Start by recording or uploading a video</p>
          <Button className="mt-4" asChild>
            <Link to="/inspect">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
