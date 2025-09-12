// GPRO API Service - Real GPRO Integration
import type { GPROSnapshot, DriverData, CarData, TrackData, WeatherData } from '@/types'

const GPRO_BASE_URL = import.meta.env.VITE_GPRO_API_BASE_URL || 'https://api.gpro.net'

interface GPROApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// GPRO API endpoints
const ENDPOINTS = {
  DRIVER: '/driver',
  CAR: '/car', 
  TRACK: '/track/current',
  WEATHER: '/weather/current',
  MANAGER: '/manager',
  RACE_RESULTS: '/race/results'
} as const

class GPROApiService {
  private async makeRequest<T>(
    endpoint: string, 
    token: string,
    options: RequestInit = {}
  ): Promise<GPROApiResponse<T>> {
    try {
      const response = await fetch(`${GPRO_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('GPRO API Error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown API error'
      }
    }
  }

  // Test GPRO token validity
  async validateToken(token: string): Promise<boolean> {
    const response = await this.makeRequest('/ping', token)
    return response.success
  }

  // Sync all pre-race data in one call
  async syncPreRaceData(_token: string): Promise<GPROSnapshot | null> {
    try {
      // Fetch all data in parallel
      const [driverRes, carRes, trackRes, weatherRes, managerRes] = await Promise.all([
        this.makeRequest<DriverData>(ENDPOINTS.DRIVER, _token),
        this.makeRequest<CarData>(ENDPOINTS.CAR, _token),
        this.makeRequest<TrackData>(ENDPOINTS.TRACK, _token),
        this.makeRequest<WeatherData>(ENDPOINTS.WEATHER, _token),
        this.makeRequest<any>(ENDPOINTS.MANAGER, _token)
      ])

      // Check if all requests succeeded
      if (!driverRes.success || !carRes.success || !trackRes.success || !weatherRes.success || !managerRes.success) {
        console.error('One or more GPRO API calls failed')
        return null
      }

      // Create snapshot
      const snapshot: GPROSnapshot = {
        id: crypto.randomUUID(),
        user_id: '', // Will be set by calling code
        manager_data: managerRes.data || null,
        driver_data: driverRes.data || null,
        car_data: carRes.data || null,
        track_data: trackRes.data || null,
        weather_data: weatherRes.data || null,
        race_history: null, // Not needed for pre-race
        created_at: new Date().toISOString()
      }

      return snapshot
    } catch (error) {
      console.error('Error syncing GPRO data:', error)
      return null
    }
  }

  // Get specific driver data
  async getDriverData(token: string): Promise<DriverData | null> {
    const response = await this.makeRequest<DriverData>(ENDPOINTS.DRIVER, token)
    return response.success ? response.data || null : null
  }

  // Get car parts and wear data  
  async getCarData(token: string): Promise<CarData | null> {
    const response = await this.makeRequest<CarData>(ENDPOINTS.CAR, token)
    return response.success ? response.data || null : null
  }

  // Get current track information
  async getTrackData(token: string): Promise<TrackData | null> {
    const response = await this.makeRequest<TrackData>(ENDPOINTS.TRACK, token)
    return response.success ? response.data || null : null
  }

  // Get weather forecast for qualifying and race
  async getWeatherData(token: string): Promise<WeatherData | null> {
    const response = await this.makeRequest<WeatherData>(ENDPOINTS.WEATHER, token)
    return response.success ? response.data || null : null
  }

  // Import post-race results for analysis
  async getPostRaceResults(token: string): Promise<any> {
    const response = await this.makeRequest(ENDPOINTS.RACE_RESULTS, token)
    return response.success ? response.data : null
  }
}

// Export singleton instance
export const gproApi = new GPROApiService()

// Mock implementation for development (when GPRO API is not available)
export class MockGPROApiService {
  async validateToken(_token: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return _token.length > 10 // Simple validation
  }

  async syncPreRaceData(_token: string): Promise<GPROSnapshot | null> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Return mock data similar to real API structure
    return {
      id: crypto.randomUUID(),
      user_id: '',
      manager_data: {
        name: 'Test Manager',
        level: 15,
        experience: 85,
        reputation: 72
      },
      driver_data: {
        name: 'Test Driver',
        overall: 78,
        concentration: 85,
        talent: 72,
        aggressiveness: 65,
        experience: 90,
        technical_insight: 75,
        stamina: 88,
        charisma: 70,
        motivation: 82,
        weight: 68,
        age: 28
      },
      car_data: {
        chassis: { level: 15, wear: 25, performance: 85 },
        engine: { level: 18, wear: 15, performance: 92 },
        front_wing: { level: 12, wear: 35, performance: 78 },
        rear_wing: { level: 14, wear: 20, performance: 88 },
        underbody: { level: 16, wear: 10, performance: 95 },
        sidepods: { level: 13, wear: 30, performance: 82 },
        cooling: { level: 11, wear: 40, performance: 75 },
        gearbox: { level: 17, wear: 5, performance: 98 },
        brakes: { level: 15, wear: 25, performance: 85 },
        suspension: { level: 14, wear: 20, performance: 88 },
        electronics: { level: 19, wear: 0, performance: 100 }
      },
      track_data: {
        name: 'Monza',
        country: 'Italy',
        length: 5.793,
        laps: 53,
        power_importance: 95,
        handling_importance: 60,
        acceleration_importance: 85,
        overtaking_difficulty: 30,
        fuel_consumption: 85,
        tyre_wear: 40,
        grip_level: 75,
        downforce_importance: 25
      },
      weather_data: {
        qualifying: {
          temperature: 24,
          humidity: 65,
          rain_probability: 10,
          wind_speed: 8,
          conditions: 'sunny'
        },
        race: {
          temperature: 26,
          humidity: 60,
          rain_probability: 15,
          wind_speed: 12,
          conditions: 'sunny'
        },
        forecast_accuracy: 85
      },
      race_history: null,
      created_at: new Date().toISOString()
    }
  }

  async getDriverData(token: string): Promise<DriverData | null> {
    const snapshot = await this.syncPreRaceData(token)
    return snapshot?.driver_data || null
  }

  async getCarData(token: string): Promise<CarData | null> {
    const snapshot = await this.syncPreRaceData(token)
    return snapshot?.car_data || null
  }

  async getTrackData(token: string): Promise<TrackData | null> {
    const snapshot = await this.syncPreRaceData(token)
    return snapshot?.track_data || null
  }

  async getWeatherData(token: string): Promise<WeatherData | null> {
    const snapshot = await this.syncPreRaceData(token)
    return snapshot?.weather_data || null
  }

  async getPostRaceResults(_token: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      position: 8,
      lapTime: '1:21.234',
      totalTime: '1:14:32.567',
      pitStops: 2,
      fuelUsed: 108.5,
      tyreWear: {
        front_left: 85,
        front_right: 82,
        rear_left: 78,
        rear_right: 80
      },
      incidents: 0,
      points: 4
    }
  }
}

// Use mock in development, real API in production
export const gproApiService = import.meta.env.DEV 
  ? new MockGPROApiService()
  : new GPROApiService()