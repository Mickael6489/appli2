import React, { useEffect, useRef } from 'react';
import { GeoHole } from '../types';

declare global {
  interface Window {
    L: any;
  }
}

interface BlastMapProps {
  center: { lat: number; lng: number };
  holes: GeoHole[];
  theme: 'light' | 'dark';
}

const BlastMap: React.FC<BlastMapProps> = ({ center, holes, theme }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    // Initialize Map if not exists
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapContainerRef.current).setView([center.lat, center.lng], 19);

      // Add Tile Layer (OpenStreetMap)
      // Use a dark map for dark mode, light for light
      const tileUrl = theme === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      
      const attribution = theme === 'dark'
        ? '&copy; OpenStreetMap &copy; CARTO'
        : '&copy; OpenStreetMap contributors';

      window.L.tileLayer(tileUrl, {
        attribution: attribution,
        maxZoom: 22
      }).addTo(mapInstanceRef.current);

      layerGroupRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
    }

    // Update Map Center
    mapInstanceRef.current.setView([center.lat, center.lng]);

    // Clear Previous Holes
    layerGroupRef.current.clearLayers();

    // Draw Holes
    holes.forEach(hole => {
      const circle = window.L.circleMarker([hole.lat, hole.lng], {
        radius: 4,
        fillColor: '#ef4444', // Red-500
        color: '#7f1d1d',     // Red-900
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
      });
      
      circle.bindPopup(`<b>Hole ${hole.row + 1}-${hole.col + 1}</b><br>Lat: ${hole.lat.toFixed(6)}<br>Lng: ${hole.lng.toFixed(6)}`);
      circle.addTo(layerGroupRef.current);
    });

    // Draw Bench Outline (Convex Hull Approximation via Bounds)
    if (holes.length > 0) {
      const lats = holes.map(h => h.lat);
      const lngs = holes.map(h => h.lng);
      const bounds = [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)]
      ];
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [center.lat, center.lng, holes.length, theme]); // Re-run when center or hole count changes

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 px-3 py-2 rounded shadow text-xs">
        <span className="font-bold">Real-World Projection</span>
        <br/>
        Lat: {center.lat.toFixed(5)}, Lng: {center.lng.toFixed(5)}
      </div>
    </div>
  );
};

export default BlastMap;