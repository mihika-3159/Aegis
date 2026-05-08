export type DisasterType = 'flood' | 'cyclone' | 'wildfire' | 'heatwave' | 'storm' | 'earthquake';

export interface RiskAssessment {
  type: DisasterType;
  probability: number; // 0 to 1
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  impactExplanation: string;
  recommendation: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: string;
  location: string;
}

export interface AegisState {
  weather: WeatherData | null;
  risks: RiskAssessment[];
  isSimulationMode: boolean;
  isEmergencyMode: boolean;
  simulationScenario: string | null;
  preparednessScore: number;
  
  setWeather: (weather: WeatherData) => void;
  setRisks: (risks: RiskAssessment[]) => void;
  toggleSimulationMode: (scenario?: string) => void;
  toggleEmergencyMode: (active: boolean) => void;
  updatePreparednessScore: (score: number) => void;
}
