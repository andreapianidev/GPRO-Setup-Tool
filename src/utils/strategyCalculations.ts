// GPRO Setup Tool - Strategy Calculation Utilities

import { TyreCompound, Track } from '../types/gpro';

export interface FuelCalculationResult {
  perLap: string;
  total: string;
  safety: string;
  recommendation: string;
  efficiency: 'optimal' | 'good' | 'poor';
}

export interface TyreRecommendation {
  primary: TyreCompound['type'];
  secondary: TyreCompound['type'];
  reason: string;
  confidence: number;
  expectedDegradation: number;
}

export interface PitWindowAnalysis {
  optimal: number;
  alternative: number[];
  trafficFactor: number;
  weatherRisk: number;
}

export interface StrategyScenario {
  name: string;
  strategy: string;
  estimatedTime: string;
  position: number;
  risk: 'Basso' | 'Medio' | 'Alto';
  probability: number;
  fuelSavings: number;
  tyreLife: number;
}

export const calculateAdvancedFuel = (
  track: Track,
  laps: number,
  driverSkill: number = 85,
  carEfficiency: number = 80
): FuelCalculationResult => {
  const baseFuelConsumption = 2.8; // L/lap baseline
  
  // Track-specific factors
  const trackMultipliers = {
    'Monaco': 0.85, // Slow speed, less fuel
    'Monza': 1.25, // High speed, more fuel
    'Silverstone': 1.1,
    'Spa': 1.15,
    'Singapore': 0.9
  };
  
  const trackMultiplier = trackMultipliers[track.name as keyof typeof trackMultipliers] || 1.0;
  
  // Weather impact
  const weatherCondition = track.weather[0]?.type || 'Sunny';
  const weatherMultiplier = weatherCondition === 'Heavy Rain' ? 1.15 : 
                           weatherCondition === 'Light Rain' ? 1.08 : 1.0;
  
  // Driver skill impact (better drivers use less fuel)
  const driverMultiplier = 1.0 - ((driverSkill - 70) * 0.002);
  
  // Car efficiency impact
  const carMultiplier = 1.0 - ((carEfficiency - 70) * 0.001);
  
  const actualConsumption = baseFuelConsumption * trackMultiplier * weatherMultiplier * 
                           driverMultiplier * carMultiplier;
  
  const totalFuel = actualConsumption * laps;
  const safetyFuel = totalFuel * 1.05; // 5% safety margin
  
  const efficiency = actualConsumption < 2.5 ? 'optimal' : 
                    actualConsumption < 3.0 ? 'good' : 'poor';
  
  let recommendation = '';
  if (efficiency === 'optimal') {
    recommendation = 'Setup ottimale per il consumo carburante';
  } else if (efficiency === 'good') {
    recommendation = 'Considera di ridurre l\'aggressività per risparmiare carburante';
  } else {
    recommendation = 'Rivedi setup motore e stile di guida per migliorare efficienza';
  }
  
  return {
    perLap: actualConsumption.toFixed(2),
    total: totalFuel.toFixed(1),
    safety: safetyFuel.toFixed(1),
    recommendation,
    efficiency
  };
};

export const getAdvancedTyreRecommendation = (
  track: Track,
  driverSkill: number = 85,
  carHandling: number = 80
): TyreRecommendation => {
  const temperature = track.weather[0]?.temperature || 25;
  const condition = track.weather[0]?.type || 'Sunny';
  const trackDifficulty = track.difficulty;
  
  // Weather-based recommendations
  if (condition === 'Heavy Rain' || condition === 'Light Rain') {
    return {
      primary: condition === 'Heavy Rain' ? 'Wet' : 'Intermediate',
      secondary: 'Intermediate',
      reason: 'Condizioni di pioggia richiedono gomme specifiche',
      confidence: 95,
      expectedDegradation: condition === 'Heavy Rain' ? 15 : 20
    };
  }
  
  // Temperature and track-based logic
  let primary: TyreCompound['type'];
  let secondary: TyreCompound['type'];
  let reason: string;
  let confidence: number;
  let degradation: number;
  
  if (temperature > 35) {
    primary = 'Hard';
    secondary = 'Medium';
    reason = 'Temperature molto elevate richiedono gomme dure';
    confidence = 90;
    degradation = 25;
  } else if (temperature > 28) {
    primary = trackDifficulty === 'Very Hard' ? 'Hard' : 'Medium';
    secondary = 'Hard';
    reason = 'Temperature elevate e usura pista';
    confidence = 85;
    degradation = 30;
  } else if (temperature < 15) {
    primary = 'Soft';
    secondary = 'Medium';
    reason = 'Temperature basse richiedono gomme morbide per il grip';
    confidence = 88;
    degradation = 35;
  } else {
    // Optimal temperature range
    if (trackDifficulty === 'Very Hard') {
      primary = 'Medium';
      secondary = 'Hard';
      reason = 'Pista impegnativa richiede compromesso grip/durata';
      confidence = 82;
      degradation = 28;
    } else {
      primary = 'Medium';
      secondary = 'Soft';
      reason = 'Condizioni ottimali per gomme medie';
      confidence = 90;
      degradation = 22;
    }
  }
  
  // Adjust for driver skill and car handling
  const skillFactor = (driverSkill + carHandling) / 2;
  confidence += Math.floor((skillFactor - 75) / 5);
  degradation -= Math.floor((skillFactor - 75) / 10);
  
  return {
    primary,
    secondary,
    reason,
    confidence: Math.min(98, Math.max(70, confidence)),
    expectedDegradation: Math.max(15, Math.min(45, degradation))
  };
};

export const calculatePitWindow = (
  totalLaps: number,
  tyreLife: number = 30,
  trafficDensity: number = 70
): PitWindowAnalysis => {
  // Calculate optimal pit window based on tyre degradation and traffic
  const tyreOptimal = tyreLife;
  
  // Traffic is usually lighter in the middle third of the race
  const lowTrafficStart = Math.floor(totalLaps * 0.3);
  const lowTrafficEnd = Math.floor(totalLaps * 0.7);
  
  const optimal = Math.min(Math.max(tyreOptimal, lowTrafficStart), lowTrafficEnd);
  
  const alternatives = [
    Math.max(1, optimal - 8),
    optimal - 4,
    optimal + 4,
    Math.min(totalLaps - 5, optimal + 8)
  ].filter(lap => lap > 0 && lap < totalLaps - 3);
  
  const trafficFactor = trafficDensity / 100;
  const weatherRisk = 0.2; // 20% base weather risk
  
  return {
    optimal,
    alternative: alternatives,
    trafficFactor,
    weatherRisk
  };
};

export const generateStrategyScenarios = (
  track: Track,
  tyreRec: TyreRecommendation,
  totalLaps: number
): StrategyScenario[] => {
  const baseTime = calculateBaseRaceTime(track, totalLaps);
  
  const scenarios: StrategyScenario[] = [
    // Conservative one-stop
    {
      name: 'Una sosta conservativa',
      strategy: `${tyreRec.primary} → ${tyreRec.secondary}`,
      estimatedTime: formatTime(baseTime + 15),
      position: 8,
      risk: 'Basso',
      probability: 85,
      fuelSavings: 5,
      tyreLife: 95
    },
    
    // Aggressive two-stop
    {
      name: 'Due soste aggressive',
      strategy: `Soft → ${tyreRec.primary} → ${tyreRec.secondary}`,
      estimatedTime: formatTime(baseTime - 8),
      position: 5,
      risk: 'Alto',
      probability: 65,
      fuelSavings: -10,
      tyreLife: 75
    },
    
    // Balanced strategy
    {
      name: 'Strategia bilanciata',
      strategy: `${tyreRec.primary} → Hard`,
      estimatedTime: formatTime(baseTime + 2),
      position: 6,
      risk: 'Medio',
      probability: 78,
      fuelSavings: 0,
      tyreLife: 85
    },
    
    // Weather hedge
    {
      name: 'Copertura meteo',
      strategy: `${tyreRec.primary} → Intermediate (se pioggia)`,
      estimatedTime: formatTime(baseTime + 20),
      position: 4,
      risk: 'Medio',
      probability: 45,
      fuelSavings: -5,
      tyreLife: 70
    }
  ];
  
  return scenarios;
};

const calculateBaseRaceTime = (track: Track, laps: number): number => {
  // Simulate race time in seconds
  const avgLapTime = 70 + (track.length * 15); // Rough calculation
  return avgLapTime * laps;
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${Math.floor(ms/100)}`;
};

export const generatePitStopAnalysis = (totalLaps: number) => {
  const pitStops = [];
  const basePitTime = 24.0;
  
  for (let i = 0; i < 5; i++) {
    const lap = Math.floor(totalLaps * (0.3 + (i * 0.1)));
    const variation = (Math.random() - 0.5) * 4; // +/- 2 seconds variation
    const time = basePitTime + variation;
    
    pitStops.push({
      lap,
      time: Number(time.toFixed(1)),
      position: Math.floor(Math.random() * 10) + 5,
      tyres: `${['Medium', 'Hard', 'Soft'][Math.floor(Math.random() * 3)]} → ${['Medium', 'Hard'][Math.floor(Math.random() * 2)]}`,
      efficiency: time < 24 ? 'Ottimo' : time < 25 ? 'Buono' : 'Lento'
    });
  }
  
  return pitStops.sort((a, b) => a.lap - b.lap);
};