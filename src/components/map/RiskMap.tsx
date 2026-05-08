'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useAegisStore } from '@/store/useAegisStore';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export const RiskMap = () => {
  const risks = useAegisStore((state) => state.risks);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!L) return <div className="w-full h-[400px] bg-slate-900 animate-pulse rounded-3xl" />;

  const center: [number, number] = [20.5937, 78.9629]; // Default India center for demo

  return (
    <div className="w-full h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer 
        center={center} 
        zoom={5} 
        style={{ height: '100%', width: '100%', background: '#020617' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {risks.map((risk, i) => (
          <Circle
            key={i}
            center={[center[0] + (Math.random() - 0.5) * 5, center[1] + (Math.random() - 0.5) * 5]}
            radius={200000}
            pathOptions={{
              fillColor: risk.severity === 'extreme' ? '#ef4444' : '#f59e0b',
              fillOpacity: 0.3,
              color: risk.severity === 'extreme' ? '#ef4444' : '#f59e0b',
              weight: 2,
              dashArray: '5, 10'
            }}
          >
            <Popup>
              <div className="bg-slate-900 text-white p-2 rounded">
                <p className="font-bold uppercase text-xs">{risk.type} risk</p>
                <p className="text-sm">{risk.severity} severity</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      <div className="absolute top-6 left-6 z-[1000] space-y-2">
        <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border-cyan-neon/30">
          <div className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-neon">Live Risk Tracking</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-[1000] glass p-4 rounded-2xl border-white/10 w-48">
        <h4 className="text-[10px] font-bold uppercase opacity-50 mb-2">Map Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger-neon/50 border border-danger-neon" />
            <span className="text-[10px] uppercase">Extreme Danger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-neon/50 border border-amber-neon" />
            <span className="text-[10px] uppercase">Moderate Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-neon/20 border border-cyan-neon" />
            <span className="text-[10px] uppercase">Shelter/Safe Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};
