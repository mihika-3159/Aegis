import { WeatherData, RiskAssessment } from '@/types';

export const calculateRisks = (weather: WeatherData): RiskAssessment[] => {
  const risks: RiskAssessment[] = [];

  // Flood / Flash Flood
  if (weather.rainfall > 50 || weather.humidity > 90) {
    risks.push({
      type: 'flood',
      probability: Math.min(0.92, weather.rainfall / 100 + 0.2),
      severity: weather.rainfall > 80 ? 'extreme' : 'high',
      impactExplanation: `Rainfall of ${weather.rainfall}mm recorded. Flash flooding risk in low-lying and coastal areas. Underpasses and wadi crossings may be impassable.`,
      recommendation: 'Avoid underpasses and wadi areas. Move valuables above floor level. Do not drive through flooded roads.',
    });
  }

  // Heatwave
  if (weather.temp > 38) {
    risks.push({
      type: 'heatwave',
      probability: Math.min(0.96, (weather.temp - 30) / 18),
      severity: weather.temp > 44 ? 'extreme' : 'high',
      impactExplanation: `Temperature of ${weather.temp}°C recorded — ${weather.temp > 44 ? 'life-threatening' : 'dangerous'} heat levels. Outdoor workers are at highest risk.`,
      recommendation: 'Stay in air-conditioned spaces. Drink water every 30 min. Outdoor work banned 12–3 PM (UAE law).',
    });
  }

  // Cyclone / Severe Storm
  if (weather.windSpeed > 60) {
    risks.push({
      type: 'cyclone',
      probability: Math.min(0.92, weather.windSpeed / 120),
      severity: weather.windSpeed > 120 ? 'extreme' : 'high',
      impactExplanation: `Wind speeds of ${weather.windSpeed}km/h detected. Risk of structural damage, flying debris, and coastal storm surge.`,
      recommendation: 'Stay indoors away from windows. Secure loose outdoor items. Monitor Dubai Media Office for evacuation orders.',
    });
  }

  // Dust Storm (Haboob) – UAE-specific
  if (weather.humidity < 20 && weather.windSpeed > 30 && weather.rainfall === 0) {
    risks.push({
      type: 'storm',
      probability: Math.min(0.75, weather.windSpeed / 80),
      severity: weather.windSpeed > 50 ? 'high' : 'moderate',
      impactExplanation: `Low humidity (${weather.humidity}%) and high winds (${weather.windSpeed}km/h) indicate haboob (dust storm) conditions. Visibility may drop to near zero.`,
      recommendation: 'Stay indoors with windows sealed. Wear a mask if outdoors. Avoid driving. Keep lights on if driving is unavoidable.',
    });
  }

  return risks;
};

export const getSimulationData = (
  scenario: string
): { weather: WeatherData; risks: RiskAssessment[] } => {
  switch (scenario) {
    case 'Dubai Flash Flood': {
      const w: WeatherData = {
        temp: 28,
        humidity: 92,
        windSpeed: 45,
        rainfall: 130,
        condition: 'Torrential Rain',
        location: 'Dubai, UAE',
      };
      return { weather: w, risks: calculateRisks(w) };
    }
    case 'Hypercane Aegis': {
      const w: WeatherData = {
        temp: 30,
        humidity: 85,
        windSpeed: 195,
        rainfall: 95,
        condition: 'Category 5 Cyclone',
        location: 'Dubai, UAE',
      };
      return { weather: w, risks: calculateRisks(w) };
    }
    case 'Gulf Heatwave Extreme': {
      const w: WeatherData = {
        temp: 50,
        humidity: 12,
        windSpeed: 18,
        rainfall: 0,
        condition: 'Extreme Heat',
        location: 'Dubai, UAE',
      };
      return { weather: w, risks: calculateRisks(w) };
    }
    case 'Haboob Dust Storm': {
      const w: WeatherData = {
        temp: 41,
        humidity: 8,
        windSpeed: 65,
        rainfall: 0,
        condition: 'Dust Storm',
        location: 'Dubai, UAE',
      };
      return { weather: w, risks: calculateRisks(w) };
    }
    default: {
      const w: WeatherData = {
        temp: 38,
        humidity: 55,
        windSpeed: 22,
        rainfall: 0,
        condition: 'Clear',
        location: 'Dubai, UAE',
      };
      return { weather: w, risks: [] };
    }
  }
};
