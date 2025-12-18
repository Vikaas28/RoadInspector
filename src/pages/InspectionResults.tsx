import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, FileText, Filter, 
  Grid3X3, List, MapPin, BarChart3 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetectionCard } from '@/components/inspection/DetectionCard';
import { DetectionMap } from '@/components/inspection/DetectionMap';
import { StatCard } from '@/components/inspection/StatCard';
import { SeverityBadge } from '@/components/inspection/SeverityBadge';
import { SeverityLevel, DetectionClass } from '@/types/inspection';
import { useToast } from '@/hooks/use-toast';
import { detectionStore } from '@/integrations/storage/detectionStore';

export default function InspectionResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'all'>('all');
  const [classFilter, setClassFilter] = useState<DetectionClass | 'all'>('all');

  const detections = useMemo(() => id ? detectionStore.getDetectionsByVideo(id) : [], [id]);

  const filteredDetections = useMemo(() => {
    return detections.filter(d => {
      if (severityFilter !== 'all' && d.severityScore !== severityFilter) return false;
      if (classFilter !== 'all' && d.classLabel !== classFilter) return false;
      return true;
    });
  }, [detections, severityFilter, classFilter]);

  const stats = useMemo(() => {
    const bySeverity = detections.reduce((acc, d) => {
      acc[d.severityScore] = (acc[d.severityScore] || 0) + 1;
      return acc;
    }, {} as Record<SeverityLevel, number>);

    const byClass = detections.reduce((acc, d) => {
      acc[d.classLabel] = (acc[d.classLabel] || 0) + 1;
      return acc;
    }, {} as Record<DetectionClass, number>);

    return { bySeverity, byClass };
  }, [detections]);

  const handleGenerateReport = () => {
    toast({
      title: 'Generating Report',
      description: 'Your PDF report will be ready shortly.',
    });
  };

  if (detections.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Inspection Results</h1>
            <p className="text-muted-foreground">No detections in this inspection</p>
          </div>
        </div>
        <div className="text-center py-16">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No road damages detected</h3>
          <p className="text-muted-foreground mt-1">This road section appears to be in good condition</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Inspection Results</h1>
            <p className="text-muted-foreground">
              {detections.length} detections found • {detections[0] ? new Date(detections[0].createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Detections"
          value={detections.length}
          icon={MapPin}
          variant="accent"
        />
        <StatCard
          title="Potholes"
          value={stats.byClass.pothole || 0}
          icon={BarChart3}
          variant="destructive"
        />
        <StatCard
          title="Cracks"
          value={stats.byClass.crack || 0}
          icon={BarChart3}
          variant="warning"
        />
        <StatCard
          title="High Severity"
          value={(stats.bySeverity.high || 0) + (stats.bySeverity.critical || 0)}
          icon={BarChart3}
          variant="destructive"
        />
      </div>

      {/* Severity Distribution */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Severity Distribution</h3>
        <div className="flex gap-4 flex-wrap">
          {(['low', 'medium', 'high', 'critical'] as SeverityLevel[]).map((severity) => (
            <div key={severity} className="flex items-center gap-3">
              <SeverityBadge severity={severity} />
              <span className="text-2xl font-bold">{stats.bySeverity[severity] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detections */}
      <Tabs defaultValue="detections" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="detections">Detections</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {/* Filters */}
            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as any)}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={classFilter} onValueChange={(v) => setClassFilter(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="crack">Crack</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-border p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon-sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon-sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="detections">
          {filteredDetections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No detections match your filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDetections.map((detection) => (
                <DetectionCard key={detection.id} detection={detection} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDetections.map((detection) => (
                <div
                  key={detection.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="h-16 w-24 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={detection.frameUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{detection.classLabel}</span>
                      <SeverityBadge severity={detection.severityScore} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {detection.latitude.toFixed(5)}, {detection.longitude.toFixed(5)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{(detection.confidence * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">confidence</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="map">
          <div className="rounded-xl border border-border bg-card p-4">
            <DetectionMap 
              detections={filteredDetections} 
              title="Detection Locations Map"
            />
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="rounded-xl border border-border bg-muted/30 h-[500px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">Timeline View</p>
              <p className="text-muted-foreground">Scrub through video with detection overlay</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
