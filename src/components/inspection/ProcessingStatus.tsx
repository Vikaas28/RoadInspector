import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, FileVideo, Cpu, MapPin, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  videoId: string;
  onComplete: () => void;
}

type ProcessingStep = 'uploading' | 'extracting' | 'detecting' | 'mapping' | 'complete' | 'error';

const steps = [
  { id: 'uploading', label: 'Uploading Video', icon: FileVideo },
  { id: 'extracting', label: 'Extracting Frames', icon: FileVideo },
  { id: 'detecting', label: 'Running Detection', icon: Cpu },
  { id: 'mapping', label: 'Mapping GPS Data', icon: MapPin },
  { id: 'complete', label: 'Complete', icon: CheckCircle },
];

export function ProcessingStatus({ videoId, onComplete }: ProcessingStatusProps) {
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('uploading');
  const [progress, setProgress] = useState(0);
  const [framesProcessed, setFramesProcessed] = useState(0);
  const [totalFrames, setTotalFrames] = useState(1800); // Simulated
  const [detectionsFound, setDetectionsFound] = useState(0);

  // Simulate processing
  useEffect(() => {
    const stepDurations = {
      uploading: 2000,
      extracting: 3000,
      detecting: 8000,
      mapping: 2000,
    };

    let stepIndex = 0;
    const stepKeys = ['uploading', 'extracting', 'detecting', 'mapping', 'complete'] as const;

    const progressStep = () => {
      if (stepIndex >= stepKeys.length - 1) {
        setCurrentStep('complete');
        return;
      }

      setCurrentStep(stepKeys[stepIndex]);
      const duration = stepDurations[stepKeys[stepIndex] as keyof typeof stepDurations] || 1000;

      // Progress animation
      let localProgress = 0;
      const interval = setInterval(() => {
        localProgress += 5;
        if (localProgress >= 100) {
          clearInterval(interval);
          stepIndex++;
          setTimeout(progressStep, 300);
        } else {
          setProgress((stepIndex * 100 + localProgress) / (stepKeys.length - 1));
          
          if (stepKeys[stepIndex] === 'extracting') {
            setFramesProcessed(Math.floor((localProgress / 100) * totalFrames));
          }
          if (stepKeys[stepIndex] === 'detecting') {
            if (localProgress % 20 === 0) {
              setDetectionsFound(prev => prev + Math.floor(Math.random() * 5) + 1);
            }
          }
        }
      }, duration / 20);
    };

    const timer = setTimeout(progressStep, 500);
    return () => clearTimeout(timer);
  }, [videoId, totalFrames]);

  const getStepStatus = (stepId: string) => {
    const stepOrder = steps.findIndex(s => s.id === stepId);
    const currentOrder = steps.findIndex(s => s.id === currentStep);

    if (currentStep === 'error') return 'error';
    if (stepOrder < currentOrder) return 'complete';
    if (stepOrder === currentOrder) return 'active';
    return 'pending';
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={cn(
          'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
          currentStep === 'complete' ? 'bg-success/20' : 'bg-accent/20'
        )}>
          {currentStep === 'complete' ? (
            <CheckCircle className="h-8 w-8 text-success" />
          ) : currentStep === 'error' ? (
            <AlertCircle className="h-8 w-8 text-destructive" />
          ) : (
            <Loader2 className="h-8 w-8 text-accent animate-spin" />
          )}
        </div>
        <h2 className="text-xl font-semibold">
          {currentStep === 'complete' ? 'Processing Complete!' : 'Processing Your Video'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {currentStep === 'complete' 
            ? `Found ${detectionsFound} potential issues`
            : 'This may take a few minutes...'}
        </p>
      </div>

      {/* Overall Progress */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-center mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.slice(0, -1).map((step) => {
          const status = getStepStatus(step.id);
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-4 rounded-lg p-4 transition-all',
                status === 'active' && 'bg-accent/10 border border-accent/30',
                status === 'complete' && 'bg-success/5',
                status === 'pending' && 'opacity-50'
              )}
            >
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                status === 'active' && 'bg-accent/20',
                status === 'complete' && 'bg-success/20',
                status === 'pending' && 'bg-muted'
              )}>
                {status === 'active' ? (
                  <Loader2 className="h-5 w-5 text-accent animate-spin" />
                ) : status === 'complete' ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <StepIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <p className={cn(
                  'font-medium',
                  status === 'active' && 'text-accent',
                  status === 'complete' && 'text-success'
                )}>
                  {step.label}
                </p>
                {status === 'active' && step.id === 'extracting' && (
                  <p className="text-sm text-muted-foreground">
                    {framesProcessed.toLocaleString()} / {totalFrames.toLocaleString()} frames
                  </p>
                )}
                {status === 'active' && step.id === 'detecting' && (
                  <p className="text-sm text-muted-foreground">
                    {detectionsFound} detections found so far...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      {currentStep === 'complete' && (
        <div className="mt-8 text-center">
          <Button size="lg" onClick={onComplete}>
            <FileText className="h-5 w-5 mr-2" />
            View Results
          </Button>
        </div>
      )}
    </div>
  );
}
