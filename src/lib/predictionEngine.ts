import { WeatherData, RiskAssessment, DisasterType } from '@/types';

export const calculateRisks = (weather: WeatherData): RiskAssessment[] => {
  const risks: RiskAssessment[] = [];

  // Flood Risk Logic
  if (weather.rainfall > 50 || weather.humidity > 90) {
    risks.push({
      type: 'flood',
      probability: Math.min(0.9, (weather.rainfall / 100) + 0.2),
      severity: weather.rainfall > 80 ? 'extreme' : 'high',
      impactExplanation: `High rainfall of ${weather.rainfall}mm detected. Potential for flash flooding in low-lying areas.`,
      recommendation: 'Move to higher ground. Secure valuable items.',
    });
  }

  // Heatwave Risk Logic
  if (weather.temp > 38) {
    risks.push({
      type: 'heatwave',
      probability: Math.min(0.95, (weather.temp - 30) / 15),
      severity: weather.temp > 42 ? 'extreme' : 'high',
      impactExplanation: `Critical temperature of ${weather.temp}°C reached. High risk of heatstroke.`,
      recommendation: 'Seek climate-controlled shelter. Avoid sun exposure.',
    });
  }

  // Cyclone/Storm Risk Logic
  if (weather.windSpeed > 60) {
    risks.push({
      type: 'storm',
      probability: Math.min(0.9, weather.windSpeed / 120),
      severity: weather.windSpeed > 100 ? 'extreme' : 'high',
      impactExplanation: `Severe wind speeds of ${weather.windSpeed}km/h detected. Potential for structural damage.`,
      recommendation: 'Stay indoors. Secure loose outdoor objects.',
    });
  }

  return risks;
};

export const getSimulationData = (scenario: string): { weather: WeatherData; risks: RiskAssessment[] } => {
  switch (scenario) {
    case 'Great Flood 2026':
      const floodWeather = { temp: 22, humidity: 95, windSpeed: 30, rainfall: 120, condition: 'Torrential Rain', location: 'Delta Region' };
      return { weather: floodWeather, risks: calculateRisks(floodWeather) };
    case 'Hypercane Aegis':
      const cycloneWeather = { temp: 26, humidity: 88, windSpeed: 180, rainfall: 90, condition: 'Category 5 Cyclone', location: 'Coastal Sector' };
      return { weather: cycloneWeather, risks: calculateRisks(cycloneWeather) };
    case 'Solar Flare Heatwave':
      const heatWeather = { temp: 48, humidity: 15, windSpeed: 5, rainfall: 0, condition: 'Extreme Heat', location: 'Inland Basin' };
      return { weather: heatWeather, risks: calculateRisks(heatWeather) };
    default:
      const defaultWeather = { temp: 24, humidity: 65, windSpeed: 12, rainfall: 0, condition: 'Clear', location: 'Veridian Coast' };
      return { weather: defaultWeather, risks: [] };
  }
};
