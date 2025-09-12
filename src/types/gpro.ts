// GPRO Setup Tool - Type Definitions

export interface GPROProfile {
  id: string;
  username: string;
  name?: string;
  email: string;
  token: string;
  isActive: boolean;
  subscription: 'trial' | 'premium' | 'expired';
  creditsRemaining: number;
  credits?: number;
  joinedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  overall: number;
  concentration: number;
  talent: number;
  aggressiveness: number;
  experience: number;
  techInsight: number;
  stamina: number;
  charisma: number;
  motivation: number;
}

export interface Car {
  id: string;
  power: number;
  handling: number;
  acceleration: number;
  wear: {
    chassis: number;
    engine: number;
    frontWing: number;
    rearWing: number;
    underbody: number;
    sidepods: number;
    cooling: number;
    gearbox: number;
    brakes: number;
    suspension: number;
    electronics: number;
  };
}

export interface Track {
  id: string;
  name: string;
  country: string;
  length: number; // in km
  laps: number;
  corners: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  characteristics: {
    power: number;
    handling: number;
    acceleration: number;
  };
  weather: WeatherCondition[];
}

export interface WeatherCondition {
  type: 'Sunny' | 'Cloudy' | 'Light Rain' | 'Heavy Rain';
  temperature: number; // Celsius
  humidity: number; // percentage
  windSpeed: number; // km/h
  probability: number; // percentage
}

export interface TyreCompound {
  type: 'Soft' | 'Medium' | 'Hard' | 'Intermediate' | 'Wet';
  grip: number;
  durability: number;
  optimalTemp: number;
  performance: {
    dry: number;
    wet: number;
  };
}

export interface SetupConfiguration {
  frontWing: number;
  rearWing: number;
  engine: number;
  brakes: number;
  gear: number;
  suspension: number;
  tyres: TyreCompound;
}

export interface SessionResult {
  session: 'Q1' | 'Q2' | 'Race';
  position: number;
  lapTime: string;
  gap: string;
  confidence: 'Low' | 'Medium' | 'High';
  setup: SetupConfiguration;
  conditions: WeatherCondition;
  totalTime?: string;
  points?: number;
  fastestLap?: string;
}

export interface RaceWeekend {
  id: string;
  track: Track;
  date: string;
  raceDate?: string;
  status: 'upcoming' | 'practice' | 'qualifying' | 'race' | 'completed';
  results: SessionResult[];
  countdown: {
    days: number;
    hours: number;
    minutes: number;
  };
}

export interface StrategyRecommendation {
  type: 'fuel' | 'tyre' | 'pit' | 'weather';
  title: string;
  description: string;
  confidence: number;
  impact: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface FuelCalculation {
  totalFuelNeeded: number;
  fuelPerLap: number;
  safetyMargin: number;
  recommendedLoad: number;
  weightPenalty: number;
}

export interface PitStrategy {
  optimalLap: number;
  tyreChange: TyreCompound;
  fuelLoad: number;
  estimatedTime: number;
  alternativeStrategies: {
    lap: number;
    tyre: TyreCompound;
    advantage: string;
  }[];
}

export interface DeltaAnalysis {
  sector1: number;
  sector2: number;
  sector3: number;
  overall: number;
  comparison: 'faster' | 'slower' | 'equal';
}

export interface BoxRadioMessage {
  lap: number;
  time: string;
  message: string;
  type: 'info' | 'strategy' | 'warning' | 'celebration';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'racing';
  language: 'en' | 'it' | 'es' | 'fr' | 'de';
  notifications: {
    raceReminders: boolean;
    setupAlerts: boolean;
    strategyUpdates: boolean;
  };
  units: {
    temperature: 'celsius' | 'fahrenheit';
    speed: 'kmh' | 'mph';
    fuel: 'liters' | 'gallons';
  };
}

export interface KPICard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: 'red' | 'blue' | 'green' | 'yellow';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  enabled: boolean;
}