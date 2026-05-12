'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useAegisStore } from '@/store/useAegisStore';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((m) => m.Circle),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);

// Fixed risk zone offsets per index – avoids Math.random() hydration mismatch
const RISK_OFFSETS: Array<[number, number]> = [
  [0.18, -0.22],
  [-0.25, 0.3],
  [0.35, 0.12],
  [-0.1, -0.38],
];

// Dubai emergency shelters (real landmarks used as safe-zone proxies)
const DUBAI_SHELTERS = [
  { name: 'Dubai Civil Defence HQ', lat: 25.065, lng: 55.135, type: 'shelter' as const },
  { name: 'Rashid Hospital', lat: 25.239, lng: 55.328, type: 'medical' as const },
  { name: 'Dubai World Trade Centre', lat: 25.2199, lng: 55.2844, type: 'shelter' as const },
  { name: 'Dubai Airport Terminal 3', lat: 25.252, lng: 55.364, type: 'shelter' as const },
];

export const RiskMap = () => {
  const risks = useAegisStore((state) => state.risks);
  const userCoords = useAegisStore((state) => state.userCoords);
  const [leafletReady, setLeafletReady] = useState(false);
  const [shelterIcon, setShelterIcon] = useState<any>(null);
  const [medIcon, setMedIcon] = useState<any>(null);

  // Load leaflet only on client
  useEffect(() => {
    import('leaflet').then((L) => {
      // Fix default marker icons
      (L.Icon.Default as any).mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      setShelterIcon(
        L.divIcon({
          html: `<div style="background:#00f2ff;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px #00f2ff"></div>`,
          className: '',
          iconSize: [12, 12],
        })
      );
      setMedIcon(
        L.divIcon({
          html: `<div style="background:#ef4444;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px #ef4444"></div>`,
          className: '',
          iconSize: [12, 12],
        })
      );

      setLeafletReady(true);
    });
  }, []);

  if (!leafletReady) {
    return (
      <div className="w-full h-[500px] bg-slate-900 animate-pulse rounded-3xl flex items-center justify-center">
        <p className="text-xs uppercase font-bold opacity-30">Loading Intelligence Map…</p>
      </div>
    );
  }

  const center: [number, number] = userCoords
    ? [userCoords.lat, userCoords.lng]
    : [25.0734, 55.2979]; // Dubai fallback

  return (
    <div
      id="risk-map"
      className="w-full h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative"
    >
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%', background: '#020617' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {risks.map((risk, i) => {
          const offset = RISK_OFFSETS[i % RISK_OFFSETS.length];
          const circleCenter: [number, number] = [
            center[0] + offset[0],
            center[1] + offset[1],
          ];
          return (
            <Circle
              key={`risk-${i}`}
              center={circleCenter}
              radius={risk.severity === 'extreme' ? 30000 : 20000}
              pathOptions={{
                fillColor:
                  risk.severity === 'extreme' || risk.severity === 'high'
                    ? '#ef4444'
                    : '#f59e0b',
                fillOpacity: 0.25,
                color:
                  risk.severity === 'extreme' || risk.severity === 'high'
                    ? '#ef4444'
                    : '#f59e0b',
                weight: 2,
                dashArray: '6 10',
              }}
            >
              <Popup>
                <div style={{ background: '#0f172a', color: 'white', padding: '10px', borderRadius: '8px', minWidth: '180px' }}>
                  <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', opacity: 0.5 }}>{risk.type} risk zone</p>
                  <p style={{ fontWeight: 'bold', marginTop: '4px' }}>{risk.severity.toUpperCase()} severity</p>
                  <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>{risk.recommendation}</p>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {shelterIcon && medIcon &&
          DUBAI_SHELTERS.map((s) => (
            <Marker
              key={s.name}
              position={[s.lat, s.lng]}
              icon={s.type === 'medical' ? medIcon : shelterIcon}
            >
              <Popup>
                <div style={{ background: '#0f172a', color: 'white', padding: '10px', borderRadius: '8px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '12px' }}>{s.name}</p>
                  <p style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase' }}>
                    {s.type === 'medical' ? '🏥 Medical Centre' : '🛡️ Evacuation Shelter'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Overlay badges */}
      <div className="absolute top-6 left-6 z-[1000] space-y-2">
        <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-neon">Live Risk Tracking · Dubai</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-[1000] glass p-4 rounded-2xl border-white/10 w-52">
        <h4 className="text-[10px] font-bold uppercase opacity-50 mb-3">Map Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger-neon/50 border border-danger-neon" />
            <span className="text-[10px] uppercase">Extreme / High Danger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-neon/50 border border-amber-neon" />
            <span className="text-[10px] uppercase">Moderate Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-neon/60 border border-cyan-neon" />
            <span className="text-[10px] uppercase">Evacuation Shelter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger-neon/60 border border-danger-neon" />
            <span className="text-[10px] uppercase">Medical Centre</span>
          </div>
        </div>
      </div>
    </div>
  );
};
