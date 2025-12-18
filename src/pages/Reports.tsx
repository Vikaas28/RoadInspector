import { useMemo } from 'react';
import { FileText, Download, Eye, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from '@/components/inspection/SeverityBadge';
import { getVideosByUser, generateReportFromDetections } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Reports() {
  const { user } = useAuth();
  
  const reports = useMemo(() => {
    const videos = getVideosByUser(user?.id || '1');
    return videos
      .map(v => generateReportFromDetections(v.id, user?.id || '1', v))
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [user?.id]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">View and download inspection reports</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Reports Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Report ID</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Date</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Detections</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Severity</th>
                <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => {
                const highSeverityCount = report.summary.bySeverity.high + report.summary.bySeverity.critical;
                const maxSeverity = report.summary.bySeverity.critical > 0 ? 'critical' :
                  report.summary.bySeverity.high > 0 ? 'high' :
                  report.summary.bySeverity.medium > 0 ? 'medium' : 'low';

                return (
                  <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium font-mono text-sm">{report.id.slice(0, 12)}</p>
                          <p className="text-xs text-muted-foreground">{report.organization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-lg font-semibold">{report.summary.totalDetections}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{report.summary.byClass.pothole} potholes</span>
                          <span>•</span>
                          <span>{report.summary.byClass.crack} cracks</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <SeverityBadge severity={maxSeverity} />
                        {highSeverityCount > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {highSeverityCount} high priority
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {reports.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No reports yet</h3>
          <p className="text-muted-foreground mt-1">Complete an inspection to generate a report</p>
        </div>
      )}
    </div>
  );
}
