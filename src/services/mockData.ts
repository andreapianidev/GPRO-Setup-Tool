// GPRO Setup Tool - Mock Data Service

import {
  GPROProfile,
  Driver,
  Car,
  Track,
  TyreCompound,
  SessionResult,
  RaceWeekend,
  StrategyRecommendation,
  FuelCalculation,
  PitStrategy,
  DeltaAnalysis,
  BoxRadioMessage,
  UserPreferences,
  KPICard,
  QuickAction
} from '../types/gpro';

// Mock GPRO Profile
export const mockProfile: GPROProfile = {
  id: 'user-123',
  username: 'RacingPro 2025',
  email: 'demo@gpro.net',
  token: 'gpro_demo_token_12345',
  isActive: true,
  subscription: 'trial',
  creditsRemaining: 15,
  joinedAt: '2024-01-15'
};

// Mock Driver
export const mockDriver: Driver = {
  id: 'driver-456',
  name: 'Marco Veloce',
  overall: 85,
  concentration: 88,
  talent: 82,
  aggressiveness: 75,
  experience: 90,
  techInsight: 85,
  stamina: 87,
  charisma: 78,
  motivation: 92
};

// Mock Car
export const mockCar: Car = {
  id: 'car-789',
  power: 78,
  handling: 82,
  acceleration: 80,
  wear: {
    chassis: 95,
    engine: 88,
    frontWing: 92,
    rearWing: 90,
    underbody: 85,
    sidepods: 87,
    cooling: 93,
    gearbox: 89,
    brakes: 91,
    suspension: 86,
    electronics: 94
  }
};

// Mock Tracks
export const mockTracks: Track[] = [
  {
    id: 'monaco',
    name: 'Monaco',
    country: 'Monaco',
    length: 3.337,
    laps: 78,
    corners: 19,
    difficulty: 'Very Hard',
    characteristics: {
      power: 30,
      handling: 90,
      acceleration: 80
    },
    weather: [
      { type: 'Sunny', temperature: 24, humidity: 65, windSpeed: 8, probability: 70 },
      { type: 'Cloudy', temperature: 22, humidity: 75, windSpeed: 12, probability: 30 }
    ]
  },
  {
    id: 'monza',
    name: 'Monza',
    country: 'Italy',
    length: 5.793,
    laps: 53,
    corners: 11,
    difficulty: 'Medium',
    characteristics: {
      power: 95,
      handling: 40,
      acceleration: 85
    },
    weather: [
      { type: 'Sunny', temperature: 26, humidity: 60, windSpeed: 5, probability: 80 },
      { type: 'Light Rain', temperature: 18, humidity: 85, windSpeed: 15, probability: 20 }
    ]
  }
];

// Mock Tyre Compounds
export const mockTyreCompounds: TyreCompound[] = [
  {
    type: 'Soft',
    grip: 95,
    durability: 60,
    optimalTemp: 85,
    performance: { dry: 95, wet: 30 }
  },
  {
    type: 'Medium',
    grip: 85,
    durability: 80,
    optimalTemp: 80,
    performance: { dry: 85, wet: 40 }
  },
  {
    type: 'Hard',
    grip: 75,
    durability: 95,
    optimalTemp: 75,
    performance: { dry: 75, wet: 50 }
  },
  {
    type: 'Intermediate',
    grip: 70,
    durability: 70,
    optimalTemp: 60,
    performance: { dry: 50, wet: 85 }
  },
  {
    type: 'Wet',
    grip: 60,
    durability: 75,
    optimalTemp: 50,
    performance: { dry: 30, wet: 95 }
  }
];

// Mock Race Weekend
export const mockRaceWeekend: RaceWeekend = {
  id: '1',
  track: mockTracks[0],
  date: '2024-03-10',
  status: 'upcoming',
  countdown: {
    days: 3,
    hours: 12,
    minutes: 45
  },
  results: [
    {
      session: 'Q1',
      position: 8,
      lapTime: '1:12.456',
      gap: '+0.234',
      confidence: 'High',
      setup: {
        frontWing: 7,
        rearWing: 8,
        engine: 6,
        brakes: 7,
        gear: 5,
        suspension: 6,
        tyres: mockTyreCompounds[1]
      },
      conditions: {
        type: 'Sunny',
        temperature: 24,
        humidity: 60,
        windSpeed: 12,
        probability: 90
      }
    },
    {
      session: 'Race',
      position: 6,
      lapTime: '1:13.123',
      gap: '+12.567',
      confidence: 'Medium',
      setup: {
        frontWing: 6,
        rearWing: 7,
        engine: 8,
        brakes: 6,
        gear: 7,
        suspension: 5,
        tyres: mockTyreCompounds[0]
      },
      conditions: {
        type: 'Sunny',
        temperature: 26,
        humidity: 55,
        windSpeed: 8,
        probability: 95
      }
    }
  ]
};

// Mock Strategy Recommendations
export const mockStrategyRecommendations: StrategyRecommendation[] = [
  {
    type: 'fuel',
    title: 'Fuel Safety Coach',
    description: 'Ottimizza il carico carburante per massimizzare le prestazioni',
    confidence: 92,
    impact: 'High',
    recommendation: 'Riduci di 2L il carico iniziale per migliorare i tempi sul giro'
  },
  {
    type: 'tyre',
    title: 'Tyre Strategy',
    description: 'Strategia gomme ottimale per le condizioni previste',
    confidence: 88,
    impact: 'Medium',
    recommendation: 'Inizia con Medium, cambia su Soft al giro 35'
  },
  {
    type: 'pit',
    title: 'Pit Window',
    description: 'Finestra ottimale per il pit stop',
    confidence: 85,
    impact: 'High',
    recommendation: 'Pit stop tra giro 32-38 per evitare traffico'
  }
];

// Mock Fuel Calculation
export const mockFuelCalculation: FuelCalculation = {
  totalFuelNeeded: 95.5,
  fuelPerLap: 1.22,
  safetyMargin: 3.2,
  recommendedLoad: 98.7,
  weightPenalty: 0.035
};

// Mock Pit Strategy
export const mockPitStrategy: PitStrategy = {
  optimalLap: 35,
  tyreChange: mockTyreCompounds[0],
  fuelLoad: 45.2,
  estimatedTime: 23.8,
  alternativeStrategies: [
    {
      lap: 28,
      tyre: mockTyreCompounds[1],
      advantage: 'Track position advantage'
    },
    {
      lap: 42,
      tyre: mockTyreCompounds[0],
      advantage: 'Fresh tyres for final stint'
    }
  ]
};

// Mock Delta Analysis
export const mockDeltaAnalysis: DeltaAnalysis = {
  sector1: -0.234,
  sector2: +0.156,
  sector3: -0.089,
  overall: -0.167,
  comparison: 'faster'
};

// Mock Box Radio Messages
export const mockBoxRadioMessages: BoxRadioMessage[] = [
  {
    lap: 1,
    time: '14:32:15',
    message: 'Radio check, tutto OK?',
    type: 'info'
  },
  {
    lap: 15,
    time: '14:47:23',
    message: 'Tempi buoni, mantieni il ritmo',
    type: 'info'
  },
  {
    lap: 28,
    time: '15:02:45',
    message: 'Prepara pit stop, box questo giro',
    type: 'strategy'
  },
  {
    lap: 45,
    time: '15:18:12',
    message: 'Attenzione, pioggia in arrivo settore 2',
    type: 'warning'
  },
  {
    lap: 78,
    time: '15:45:30',
    message: 'Fantastico! P6, ottimo risultato!',
    type: 'celebration'
  }
];

// Mock User Preferences
export const mockUserPreferences: UserPreferences = {
  theme: 'racing',
  language: 'it',
  notifications: {
    raceReminders: true,
    setupAlerts: true,
    strategyUpdates: false
  },
  units: {
    temperature: 'celsius',
    speed: 'kmh',
    fuel: 'liters'
  }
};

// Mock KPI Cards
export const mockKPICards: KPICard[] = [
  {
    id: 'avg-position',
    title: 'Posizione Media',
    value: 8.2,
    change: -1.3,
    trend: 'up',
    icon: 'trophy',
    color: 'green'
  },
  {
    id: 'points',
    title: 'Punti Totali',
    value: 156,
    change: +12,
    trend: 'up',
    icon: 'star',
    color: 'blue'
  },
  {
    id: 'best-lap',
    title: 'Miglior Giro',
    value: '1:12.345',
    change: -0.234,
    trend: 'up',
    icon: 'clock',
    color: 'red'
  },
  {
    id: 'reliability',
    title: 'Affidabilità',
    value: '94%',
    change: +2.1,
    trend: 'up',
    icon: 'shield',
    color: 'green'
  }
];

// Mock Quick Actions
export const mockQuickActions: QuickAction[] = [
  {
    id: 'setup-calculator',
    title: 'Calcola Setup',
    description: 'Ottimizza il setup per la prossima gara',
    icon: 'settings',
    route: '/setup-calculator',
    enabled: true
  },
  {
    id: 'strategy-advisor',
    title: 'Strategia Gara',
    description: 'Consigli per la strategia ottimale',
    icon: 'brain',
    route: '/strategy',
    enabled: true
  },
  {
    id: 'weather-forecast',
    title: 'Meteo',
    description: 'Previsioni meteo per il weekend',
    icon: 'cloud',
    route: '/weather',
    enabled: false
  },
  {
    id: 'post-race',
    title: 'Analisi Post-Gara',
    description: 'Rivedi le performance della gara',
    icon: 'chart',
    route: '/post-race',
    enabled: true
  }
];

// Mock API Functions
export const mockAPI = {
  // Authentication
  login: async (email: string, password: string): Promise<GPROProfile> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    if (email === 'demo@gpro.net' && password === 'demo123') {
      return mockProfile;
    }
    throw new Error('Credenziali non valide');
  },

  // Profile
  getProfile: async (): Promise<GPROProfile> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProfile;
  },

  // Race Weekend
  getCurrentRaceWeekend: async (): Promise<RaceWeekend> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockRaceWeekend;
  },

  // Strategy
  getStrategyRecommendations: async (): Promise<StrategyRecommendation[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return mockStrategyRecommendations;
  },

  // Setup Calculator
  calculateOptimalSetup: async (): Promise<SessionResult[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockRaceWeekend.results;
  },

  // Post Race Analysis
  getPostRaceAnalysis: async (): Promise<{ delta: DeltaAnalysis; radio: BoxRadioMessage[] }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      delta: mockDeltaAnalysis,
      radio: mockBoxRadioMessages
    };
  }
};