import { useState } from 'react';
import { Map, Layers, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminHeatmap() {
  const [radius, setRadius] = useState([500]);
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Detection Heatmap</h1>
          <p className="text-muted-foreground">Visualize road damage density across the city</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h3>

            <div className="space-y-3">
              <Label>Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Cluster Radius: {radius[0]}m</Label>
              <Slider
                value={radius}
                onValueChange={setRadius}
                min={100}
                max={1000}
                step={50}
              />
            </div>

            <div className="space-y-3">
              <Label>Severity Filter</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High & Critical Only</SelectItem>
                  <SelectItem value="medium">Medium & Above</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Detection Type</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pothole">Potholes Only</SelectItem>
                  <SelectItem value="crack">Cracks Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Layers className="h-4 w-4" />
              Legend
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full bg-severity-low" />
                <span className="text-sm">Low Density (1-5)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full bg-severity-medium" />
                <span className="text-sm">Medium Density (6-15)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full bg-severity-high" />
                <span className="text-sm">High Density (16-30)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full bg-severity-critical" />
                <span className="text-sm">Critical (30+)</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Clusters</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hotspots</span>
                <span className="font-medium text-destructive">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coverage Area</span>
                <span className="font-medium">12.4 km²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-muted/30 min-h-[600px] flex items-center justify-center">
          <div className="text-center p-8">
            <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Heatmap</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Connect to Lovable Cloud to enable interactive mapping with Leaflet.
              View detection clusters, zoom into hotspots, and export location data.
            </p>
            <Button variant="accent">
              Enable Lovable Cloud
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
