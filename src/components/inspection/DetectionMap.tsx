import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Detection } from '@/types/inspection';
import 'leaflet/dist/leaflet.css';

interface DetectionMapProps {
  detections: Detection[];
  title?: string;
}

// Fix Leaflet default icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const severityColors = {
  low: '#fbbf24',     // amber
  medium: '#f97316',  // orange
  high: '#ef4444',    // red
  critical: '#7c2d12', // dark red
};

export function DetectionMap({ detections, title = 'Detection Locations' }: DetectionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([40.7128, -74.0060], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add detection markers
    if (detections.length > 0) {
      detections.forEach(detection => {
        const color = severityColors[detection.severityScore];
        
        // Create custom marker with color
        const markerIcon = L.icon({
          iconUrl: `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
              <text x="12" y="15" text-anchor="middle" font-size="12" font-weight="bold" fill="white">
                ${detection.classLabel === 'pothole' ? 'P' : 'C'}
              </text>
            </svg>
          `)}`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([detection.latitude, detection.longitude], {
          icon: markerIcon,
        }).addTo(map.current!);

        const popupContent = `
          <div class="p-2">
            <p class="font-semibold capitalize">${detection.classLabel}</p>
            <p class="text-sm text-gray-600">Severity: <span class="font-medium capitalize">${detection.severityScore}</span></p>
            <p class="text-sm text-gray-600">Confidence: ${(detection.confidence * 100).toFixed(1)}%</p>
            <p class="text-xs text-gray-500 font-mono">
              ${detection.latitude.toFixed(4)}, ${detection.longitude.toFixed(4)}
            </p>
            ${detection.notes ? `<p class="text-xs text-gray-600 mt-1">${detection.notes}</p>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      });

      // Fit map to markers
      const group = new L.FeatureGroup(markersRef.current);
      map.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [detections]);

  return (
    <div className="w-full h-full flex flex-col">
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      <div
        ref={mapContainer}
        className="flex-1 rounded-lg overflow-hidden border border-border"
        style={{ minHeight: '400px' }}
      />
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {Object.entries(severityColors).map(([severity, color]) => (
          <div key={severity} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize">{severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
