import { MapPin, Clock, Percent } from 'lucide-react';
import { Detection } from '@/types/inspection';
import { SeverityBadge } from './SeverityBadge';
import { cn } from '@/lib/utils';

interface DetectionCardProps {
  detection: Detection;
  onClick?: () => void;
  isSelected?: boolean;
}

export function DetectionCard({ detection, onClick, isSelected }: DetectionCardProps) {
  return (
    <div 
      className={cn(
        'group cursor-pointer rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md',
        isSelected ? 'ring-2 ring-accent border-accent' : 'border-border hover:border-accent/50'
      )}
      onClick={onClick}
    >
      {/* Detection Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-3">
        {detection.frameUrl ? (
          <img 
            src={detection.frameUrl} 
            alt={`Detection ${detection.id}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}
        
        {/* Bounding box overlay would go here */}
        <div className="absolute top-2 left-2">
          <SeverityBadge severity={detection.severityScore} size="sm" />
        </div>
        
        <div className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm px-2 py-0.5">
          <span className="text-xs font-medium capitalize">{detection.classLabel}</span>
        </div>
      </div>

      {/* Detection Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Percent className="h-4 w-4" />
          <span>{(detection.confidence * 100).toFixed(1)}% confidence</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate font-mono text-xs">
            {detection.latitude.toFixed(5)}, {detection.longitude.toFixed(5)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{new Date(detection.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {detection.notes && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 border-t border-border pt-3">
          {detection.notes}
        </p>
      )}
    </div>
  );
}
