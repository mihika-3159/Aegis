import { create } from 'zustand';
import { AegisState, WeatherData, RiskAssessment } from '@/types';

export interface Notification {
  id: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
  time: string;
  read: boolean;
}

export interface AegisExtendedState extends AegisState {
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  userCoords: { lat: number; lng: number } | null;
  setUserCoords: (coords: { lat: number; lng: number }) => void;
}

const dubaiNotifications: Notification[] = [
  {
    id: '1',
    title: '🌡️ Extreme Heat Advisory',
    body: 'Temperature expected to reach 46°C in Dubai this afternoon. Avoid outdoor activity between 12–4 PM.',
    severity: 'critical',
    time: '09:30 AM',
    read: false,
  },
  {
    id: '2',
    title: '💨 Dust Storm Warning',
    body: 'A haboob is approaching from the Al Ain region. Expect reduced visibility in Dubai and Sharjah.',
    severity: 'warning',
    time: '08:15 AM',
    read: false,
  },
  {
    id: '3',
    title: '🌊 Coastal Surge Alert',
    body: 'Wave heights of 1.5–2.5m expected along Jumeirah Beach. Swimmers advised to stay out of water.',
    severity: 'warning',
    time: '07:00 AM',
    read: true,
  },
  {
    id: '4',
    title: '✅ Air Quality: Acceptable',
    body: 'AQI in Dubai is 72 (Moderate). Sensitive groups should reduce prolonged outdoor exertion.',
    severity: 'info',
    time: '06:00 AM',
    read: true,
  },
];

export const useAegisStore = create<AegisExtendedState>((set) => ({
  weather: {
    temp: 38,
    humidity: 55,
    windSpeed: 22,
    rainfall: 0,
    condition: 'Clear',
    location: 'Dubai, UAE',
  },
  risks: [
    {
      type: 'heatwave',
      probability: 0.78,
      severity: 'high',
      impactExplanation:
        'Temperatures exceeding 38°C are forecast for Dubai over the next 72 hours, increasing risk of heat exhaustion and infrastructure strain.',
      recommendation: 'Stay indoors during peak hours (12–4 PM). Drink water regularly. Check on elderly neighbours.',
    },
  ],
  isSimulationMode: false,
  isEmergencyMode: false,
  simulationScenario: null,
  preparednessScore: 82,
  notifications: dubaiNotifications,
  userCoords: { lat: 25.0734, lng: 55.2979 }, // Dubai default

  setWeather: (weather) => set({ weather }),
  setRisks: (risks) => set({ risks }),
  toggleSimulationMode: (scenario) =>
    set((state) => ({
      isSimulationMode: !state.isSimulationMode,
      simulationScenario: scenario || null,
    })),
  toggleEmergencyMode: (active) => set({ isEmergencyMode: active }),
  updatePreparednessScore: (score) => set({ preparednessScore: score }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  setUserCoords: (coords) => set({ userCoords: coords }),
}));
