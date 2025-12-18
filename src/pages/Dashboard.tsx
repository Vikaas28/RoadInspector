import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Video, AlertTriangle, FileText, 
  TrendingUp, ArrowRight, Clock, MapPin 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/inspection/StatCard';
import { SeverityBadge } from '@/components/inspection/SeverityBadge';
import { getVideosByUser, getDetectionsByVideo } from '@/data/mockData';
import { detectionStore } from '@/integrations/storage/detectionStore';

export default function Dashboard() {
  const { user } = useAuth();

  const videos = useMemo(() => getVideosByUser(user?.id || '1'), [user?.id]);
  const recentDetections = useMemo(() => {
    const completedVideos = videos.filter(v => v.processingStatus === 'completed');
    const allDetections = completedVideos.flatMap(v => detectionStore.getDetectionsByVideo(v.id));
    return allDetections.slice(-6);
  }, [videos]);

  const stats = useMemo(() => {
    const allDetections = videos.flatMap(v => detectionStore.getDetectionsByVideo(v.id));
    return {
      totalInspections: videos.length,
      totalDetections: allDetections.length,
      highSeverity: allDetections.filter(d => d.severityScore === 'high' || d.severityScore === 'critical').length,
      processingVideos: videos.filter(v => v.processingStatus === 'processing').length,
    };
  }, [videos]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your road inspections</p>
        </div>
        <Button size="lg" asChild>
          <Link to="/inspect">
            <Plus className="h-5 w-5 mr-2" />
            New Inspection
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inspections"
          value={stats.totalInspections}
          subtitle="This month"
          icon={Video}
          trend={{ value: 12, label: 'vs last month' }}
        />
        <StatCard
          title="Total Detections"
          value={stats.totalDetections}
          subtitle="Road damage found"
          icon={MapPin}
          variant="accent"
        />
        <StatCard
          title="High Severity"
          value={stats.highSeverity}
          subtitle="Require attention"
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          title="Processing"
          value={stats.processingVideos}
          subtitle="Videos in queue"
          icon={Clock}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Inspections */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Recent Inspections</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/inspections">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {videos.slice(0, 4).map((video) => (
              <Link
                key={video.id}
                to={`/inspections/${video.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Video className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{video.originalFilename}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(video.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {video.processingStatus === 'completed' ? (
                    <p className="font-medium">{video.detectionCount} detections</p>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      {video.processingStatus}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Detections */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Recent Detections</h2>
          </div>
          <div className="p-4 space-y-3">
            {recentDetections.slice(0, 5).map((detection) => (
              <div
                key={detection.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
                  <img
                    src={detection.frameUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{detection.classLabel}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {detection.latitude.toFixed(4)}, {detection.longitude.toFixed(4)}
                  </p>
                </div>
                <SeverityBadge severity={detection.severityScore} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/inspect"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">Start Recording</p>
            <p className="text-sm text-muted-foreground">Begin a new road inspection</p>
          </div>
        </Link>

        <Link
          to="/reports"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">View Reports</p>
            <p className="text-sm text-muted-foreground">Access generated reports</p>
          </div>
        </Link>

        <Link
          to="/inspections"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-colors">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">My Inspections</p>
            <p className="text-sm text-muted-foreground">Review past inspections</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
