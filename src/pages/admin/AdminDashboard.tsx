import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FileText, AlertTriangle, TrendingUp, 
  ArrowRight, MapPin, Calendar, Activity 
} from 'lucide-react';
import { StatCard } from '@/components/inspection/StatCard';
import { SeverityBadge } from '@/components/inspection/SeverityBadge';
import { Button } from '@/components/ui/button';
import { generateReportFromDetections, getAllVideos } from '@/data/mockData';
import { detectionStore } from '@/integrations/storage/detectionStore';

export default function AdminDashboard() {
  const allReports = useMemo(() => {
    const videos = getAllVideos().filter(v => v.processingStatus === 'completed');
    return videos
      .map(v => generateReportFromDetections(v.id, v.userId, v))
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, []);

  const stats = useMemo(() => {
    const totalDetections = allReports.reduce((acc, r) => acc + r.summary.totalDetections, 0);
    const highSeverity = allReports.reduce((acc, r) => 
      acc + r.summary.bySeverity.high + r.summary.bySeverity.critical, 0
    );

    const uniqueInspectors = new Set(
      detectionStore.getAllVideos().map((v) => v.userId)
    ).size;

    return {
      totalReports: allReports.length,
      totalDetections,
      highSeverity,
      activeInspectors: uniqueInspectors,
    };
  }, [allReports]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of all road inspections and system activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={stats.totalReports}
          subtitle="All time"
          icon={FileText}
          trend={{ value: 8, label: 'this week' }}
        />
        <StatCard
          title="Total Detections"
          value={stats.totalDetections}
          subtitle="Across all inspections"
          icon={MapPin}
          variant="accent"
        />
        <StatCard
          title="High Priority Issues"
          value={stats.highSeverity}
          subtitle="Requiring attention"
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          title="Active Inspectors"
          value={stats.activeInspectors}
          subtitle="Users who have recorded inspections"
          icon={Users}
          variant="success"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Reports */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/reports">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {allReports.slice(0, 5).map((report) => {
              const maxSeverity = report.summary.bySeverity.critical > 0 ? 'critical' :
                report.summary.bySeverity.high > 0 ? 'high' :
                report.summary.bySeverity.medium > 0 ? 'medium' : 'low';

              return (
                <div
                  key={report.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{report.inspectorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{report.summary.totalDetections}</p>
                    <p className="text-xs text-muted-foreground">detections</p>
                  </div>
                  <SeverityBadge severity={maxSeverity} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions & Pending */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/admin/heatmap"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <MapPin className="h-5 w-5 text-accent" />
                <span className="font-medium">View Heatmap</span>
              </Link>
              <Link
                to="/admin/reports"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">All Reports</span>
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Users className="h-5 w-5 text-success" />
                <span className="font-medium">Manage Users</span>
              </Link>
              <Link
                to="/admin/alerts"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="font-medium">View Alerts</span>
              </Link>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">System Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Activity className="h-4 w-4 text-success" />
                <span>System operational</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>12 inspections today</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span>23% increase this week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
