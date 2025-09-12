// User Types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  trial_active: boolean
  trial_expires_at: string
  credits_balance: number
}

export interface UserProfile {
  id: string
  user_id: string
  gpro_token_encrypted: string | null
  gpro_username: string | null
  preferences: Record<string, any>
  last_sync_at: string | null
  created_at: string
  updated_at: string
}

// GPRO Data Types
export interface GPROSnapshot {
  id: string
  user_id: string
  manager_data: ManagerData | null
  driver_data: DriverData | null
  car_data: CarData | null
  track_data: TrackData | null
  weather_data: WeatherData | null
  race_history: RaceHistory | null
  created_at: string
}

export interface ManagerData {
  name: string
  level: number
  experience: number
  reputation: number
}

export interface DriverData {
  name: string
  overall: number
  concentration: number
  talent: number
  aggressiveness: number
  experience: number
  technical_insight: number
  stamina: number
  charisma: number
  motivation: number
  weight: number
  age: number
}

export interface CarData {
  chassis: CarPart
  engine: CarPart
  front_wing: CarPart
  rear_wing: CarPart
  underbody: CarPart
  sidepods: CarPart
  cooling: CarPart
  gearbox: CarPart
  brakes: CarPart
  suspension: CarPart
  electronics: CarPart
}

export interface CarPart {
  level: number
  wear: number
  performance: number
}

export interface TrackData {
  name: string
  country: string
  length: number
  laps: number
  power_importance: number
  handling_importance: number
  acceleration_importance: number
  overtaking_difficulty: number
  fuel_consumption: number
  tyre_wear: number
  grip_level: number
  downforce_importance: number
}

export interface WeatherData {
  qualifying: WeatherCondition
  race: WeatherCondition
  forecast_accuracy: number
}

export interface WeatherCondition {
  temperature: number
  humidity: number
  rain_probability: number
  wind_speed: number
  conditions: 'sunny' | 'cloudy' | 'overcast' | 'light_rain' | 'heavy_rain'
}

export interface RaceHistory {
  last_races: RaceResult[]
  average_position: number
  best_position: number
  worst_position: number
}

export interface RaceResult {
  track: string
  position: number
  points: number
  fastest_lap: boolean
  dnf: boolean
  reason?: string
}

// Setup Types
export interface SetupCalculation {
  id: string
  user_id: string
  snapshot_id: string
  q1_setup: Setup | null
  q2_setup: Setup | null
  race_setup: Setup | null
  confidence_level: number | null
  created_at: string
}

export interface Setup {
  front_wing: number
  rear_wing: number
  engine: number
  brakes: number
  gear: number
  suspension: number
  tyres: TyreCompound
  fuel: number
}

export type TyreCompound = 'soft' | 'medium' | 'hard' | 'intermediate' | 'wet'

// Strategy Types
export interface StrategyResult {
  id: string
  calculation_id: string
  fuel_strategy: FuelStrategy | null
  tyre_strategy: TyreStrategy | null
  pit_analysis: PitAnalysis | null
  scenarios: Scenario[] | null
  crossover_data: CrossoverData | null
  created_at: string
}

export interface FuelStrategy {
  optimal_fuel: number
  safety_buffer: number
  extra_fuel_cost: number
  stint_fuel: number[]
  total_fuel_needed: number
}

export interface TyreStrategy {
  recommended_compound: TyreCompound
  estimated_wear: number
  pit_stops: number
  stint_lengths: number[]
  compound_performance: Record<TyreCompound, number>
}

export interface PitAnalysis {
  pit_loss_time: number
  fuel_per_second: number
  optimal_pit_window: number[]
  pit_strategy_comparison: PitStrategyOption[]
}

export interface PitStrategyOption {
  stops: number
  total_time: number
  risk_level: 'low' | 'medium' | 'high'
  description: string
}

export interface Scenario {
  name: string
  description: string
  estimated_time: number
  weather_robustness: number
  risk_assessment: 'low' | 'medium' | 'high'
  pros: string[]
  cons: string[]
}

export interface CrossoverData {
  rain_crossover_lap: number
  dry_crossover_lap: number
  time_delta: number
  confidence: number
  weather_threshold: number
}

// Credit Types
export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  transaction_type: 'trial' | 'purchase' | 'calculation' | 'refund'
  description: string | null
  created_at: string
}

// Analysis Types
export interface RaceAnalysis {
  id: string
  user_id: string
  calculation_id: string
  predicted_data: PredictedData | null
  actual_results: ActualResults | null
  delta_analysis: DeltaAnalysis | null
  box_radio_report: BoxRadioReport | null
  race_date: string | null
  created_at: string
}

export interface PredictedData {
  position: number
  lap_time: number
  fuel_consumption: number
  tyre_wear: number
  pit_stops: number
}

export interface ActualResults {
  position: number
  lap_time: number
  fuel_consumption: number
  tyre_wear: number
  pit_stops: number
  dnf: boolean
  reason?: string
}

export interface DeltaAnalysis {
  position_delta: number
  time_delta: number
  fuel_delta: number
  strategy_accuracy: number
  overall_performance: 'excellent' | 'good' | 'average' | 'poor'
}

export interface BoxRadioReport {
  messages: BoxRadioMessage[]
  summary: string
  recommendations: string[]
  lessons_learned: string[]
}

export interface BoxRadioMessage {
  lap: number
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  impact: 'low' | 'medium' | 'high'
}

// API Response Types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterForm {
  email: string
  password: string
  confirm_password: string
  terms_accepted: boolean
}

export interface TokenSetupForm {
  gpro_token: string
}

export interface ProfileUpdateForm {
  gpro_token?: string
  preferences?: Record<string, any>
}

// UI State Types
export interface LoadingState {
  isLoading: boolean
  message?: string
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}