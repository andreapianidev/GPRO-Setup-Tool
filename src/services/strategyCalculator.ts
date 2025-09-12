// GPRO Strategy Calculator - Real fuel, pit stop, and tyre calculations
import type { 
  DriverData, 
  CarData, 
  TrackData, 
  WeatherCondition,
  WeatherData,
  GPROSnapshot 
} from '@/types'

// Strategy recommendation result
export interface StrategyResult {
  // Fuel strategy
  fuelStrategy: {
    qualifyingFuel: number // Liters needed for qualifying
    raceFuel: number // Liters needed for race
    totalFuel: number // Total fuel capacity needed
    safetyBuffer: number // Extra fuel for safety (liters)
  }
  
  // Pit stop strategy
  pitStrategy: {
    recommendedStops: number // 0, 1, 2, or 3 stops
    pitWindows: PitWindow[] // When to pit
    totalPitTime: number // Total time lost in pits (seconds)
  }
  
  // Tyre strategy  
  tyreStrategy: {
    qualifyingCompound: 1 | 2 | 3 | 4 | 5
    raceCompound: 1 | 2 | 3 | 4 | 5
    expectedWear: number // % wear at end of stint
    tyreDegradation: number // Lap time increase per lap (seconds)
  }
  
  // Overall strategy confidence and notes
  confidence: number // 0-100
  notes: string[]
  estimatedRaceTime: string // Total race time estimate
}

interface PitWindow {
  lap: number
  reason: string
  compoundChange?: 1 | 2 | 3 | 4 | 5
}

class StrategyCalculatorService {
  
  // Main strategy calculation
  calculateRaceStrategy(snapshot: GPROSnapshot): StrategyResult {
    const { driver_data, car_data, track_data, weather_data } = snapshot
    
    if (!driver_data || !car_data || !track_data || !weather_data) {
      throw new Error('Dati insufficienti per calcolare la strategia')
    }

    // Calculate fuel strategy
    const fuelStrategy = this.calculateFuelStrategy(
      driver_data, car_data, track_data, weather_data.race
    )

    // Calculate pit strategy
    const pitStrategy = this.calculatePitStrategy(
      driver_data, car_data, track_data, weather_data.race
    )

    // Calculate tyre strategy
    const tyreStrategy = this.calculateTyreStrategy(
      driver_data, car_data, track_data, weather_data
    )

    // Calculate overall confidence
    const confidence = this.calculateStrategyConfidence(
      driver_data, car_data, track_data, weather_data
    )

    // Generate strategy notes
    const notes = this.generateStrategyNotes(
      driver_data, car_data, track_data, weather_data, pitStrategy
    )

    // Estimate total race time
    const estimatedRaceTime = this.estimateRaceTime(
      driver_data, car_data, track_data, pitStrategy.recommendedStops
    )

    return {
      fuelStrategy,
      pitStrategy,
      tyreStrategy,
      confidence,
      notes,
      estimatedRaceTime
    }
  }

  // Fuel consumption calculation
  private calculateFuelStrategy(
    driver: DriverData,
    _car: CarData,
    track: TrackData,
    weather: WeatherCondition
  ) {
    // Base fuel consumption per lap (liters)
    const baseFuelPerLap = (track.fuel_consumption / 100) * 2.5
    
    // Driver efficiency factor (better drivers use less fuel)
    const driverEfficiency = 1 - ((driver.technical_insight - 50) / 300)
    
    // Engine efficiency (higher engine modes use more fuel)
    const engineFactor = 1.0 // Will be adjusted based on setup
    
    // Weather factor (rain increases consumption)
    const weatherFactor = weather.rain_probability > 50 ? 1.15 : 1.0
    
    // Track factor (longer tracks, more laps = different consumption pattern)
    const trackFactor = Math.max(0.8, Math.min(1.2, track.length / 4.5))
    
    // Calculate fuel per lap
    const fuelPerLap = baseFuelPerLap * driverEfficiency * engineFactor * weatherFactor * trackFactor
    
    // Qualifying fuel (5 laps + out/in laps)
    const qualifyingFuel = Math.ceil(fuelPerLap * 7)
    
    // Race fuel (full race distance + safety margin)
    const raceFuelBase = Math.ceil(fuelPerLap * track.laps)
    const safetyBuffer = Math.ceil(raceFuelBase * 0.08) // 8% safety margin
    const raceFuel = raceFuelBase + safetyBuffer
    
    // Total fuel capacity needed
    const totalFuel = Math.max(qualifyingFuel, raceFuel)

    return {
      qualifyingFuel,
      raceFuel,
      totalFuel,
      safetyBuffer
    }
  }

  // Pit stop strategy calculation
  private calculatePitStrategy(
    driver: DriverData,
    _car: CarData,
    track: TrackData,
    weather: WeatherCondition
  ) {
    // Base pit stop time (includes drive through pit lane)
    const basePitTime = 25 // seconds
    
    // Track-specific pit lane length adjustment
    const pitTimeAdjustment = track.length > 5 ? 2 : 0
    const pitTime = basePitTime + pitTimeAdjustment
    
    // Tyre wear rate (how quickly tyres degrade)
    const baseWearRate = track.tyre_wear / 100
    
    // Driver smoothness (smoother drivers wear tyres less)
    const driverWearFactor = 1 - ((driver.concentration - 50) / 200)
    
    // Weather wear factor
    const weatherWearFactor = weather.temperature > 30 ? 1.2 : 
                             weather.temperature < 15 ? 0.8 : 1.0
    
    const tyreWearPerLap = baseWearRate * driverWearFactor * weatherWearFactor
    
    // Calculate optimal stint length
    const maxStintLength = Math.floor(80 / (tyreWearPerLap * 100)) // Laps before 80% wear
    
    // Determine number of stops
    let recommendedStops: number
    let pitWindows: PitWindow[] = []
    
    if (track.laps <= maxStintLength) {
      // No pit stops needed - can go full distance
      recommendedStops = 0
    } else if (track.laps <= maxStintLength * 1.8) {
      // One pit stop strategy
      recommendedStops = 1
      const pitLap = Math.round(track.laps * 0.6) // Pit at 60% distance
      pitWindows.push({
        lap: pitLap,
        reason: 'Cambio gomme per degradazione',
        compoundChange: this.getOptimalRaceCompound(track, weather)
      })
    } else {
      // Two pit stop strategy
      recommendedStops = 2
      const firstPit = Math.round(track.laps * 0.4)
      const secondPit = Math.round(track.laps * 0.7)
      
      pitWindows.push({
        lap: firstPit,
        reason: 'Primo stop - strategia gomme',
        compoundChange: this.getOptimalRaceCompound(track, weather)
      })
      
      pitWindows.push({
        lap: secondPit, 
        reason: 'Secondo stop - gomme fresche per finale',
        compoundChange: Math.max(1, this.getOptimalRaceCompound(track, weather) - 1) as 1 | 2 | 3 | 4 | 5
      })
    }
    
    // Weather-based adjustments
    if (weather.rain_probability > 40) {
      // High rain chance - add weather stop
      pitWindows.push({
        lap: Math.round(track.laps * 0.3),
        reason: 'Possibile cambio per pioggia'
      })
      recommendedStops += 1
    }
    
    const totalPitTime = recommendedStops * pitTime

    return {
      recommendedStops,
      pitWindows,
      totalPitTime
    }
  }

  // Tyre compound strategy
  private calculateTyreStrategy(
    driver: DriverData,
    _car: CarData,
    track: TrackData,
    weather: WeatherData
  ) {
    // Qualifying compound (softer for better lap times)
    const qualifyingCompound = this.getOptimalQualifyingCompound(track, weather.qualifying)
    
    // Race compound (harder for durability)  
    const raceCompound = this.getOptimalRaceCompound(track, weather.race)
    
    // Expected wear calculation
    const baseWear = track.tyre_wear
    const driverFactor = (driver.concentration + driver.technical_insight) / 200
    const expectedWear = Math.max(10, baseWear - (driverFactor * 20))
    
    // Tyre degradation per lap (seconds lost per lap due to wear)
    const tyreDegradation = (track.tyre_wear / 100) * 0.05 // ~0.05s per lap on high wear tracks

    return {
      qualifyingCompound,
      raceCompound,
      expectedWear,
      tyreDegradation
    }
  }

  // Get optimal qualifying compound based on conditions
  private getOptimalQualifyingCompound(_track: TrackData, weather: WeatherCondition): 1 | 2 | 3 | 4 | 5 {
    if (weather.rain_probability > 50) return 4 // Hard in wet conditions
    if (weather.temperature > 35) return 3 // Medium in very hot
    if (weather.temperature > 25) return 2 // Soft in normal hot
    return 1 // Extra soft in cool conditions
  }

  // Get optimal race compound
  private getOptimalRaceCompound(track: TrackData, weather: WeatherCondition): 1 | 2 | 3 | 4 | 5 {
    let compound = 3 // Start with medium as base
    
    // Adjust for track characteristics
    if (track.tyre_wear > 75) compound += 1 // Harder for high wear
    if (track.tyre_wear < 40) compound -= 1 // Softer for low wear
    
    // Adjust for weather
    if (weather.temperature > 30) compound += 1 // Harder in hot weather
    if (weather.temperature < 15) compound -= 1 // Softer in cold
    
    // Clamp to valid range
    return Math.max(1, Math.min(5, compound)) as 1 | 2 | 3 | 4 | 5
  }

  // Calculate strategy confidence
  private calculateStrategyConfidence(
    driver: DriverData,
    _car: CarData,
    track: TrackData,
    weather: WeatherData
  ): number {
    let confidence = 75 // Base confidence
    
    // Driver experience adds confidence
    confidence += (driver.experience - 50) * 0.2
    
    // Technical insight helps with strategy
    confidence += (driver.technical_insight - 50) * 0.15
    
    // Weather uncertainty reduces confidence
    if (weather.race.rain_probability > 30) {
      confidence -= weather.race.rain_probability * 0.3
    }
    
    // Track difficulty factor
    if (track.overtaking_difficulty > 70) {
      confidence -= 10 // Harder to predict on difficult tracks
    }
    
    // Forecast accuracy
    confidence = confidence * (weather.forecast_accuracy / 100)
    
    return Math.max(30, Math.min(95, Math.round(confidence)))
  }

  // Generate helpful strategy notes
  private generateStrategyNotes(
    driver: DriverData,
    _car: CarData,
    track: TrackData,
    weather: WeatherData,
    pitStrategy: { recommendedStops: number; pitWindows: PitWindow[] }
  ): string[] {
    const notes: string[] = []
    
    // Pit stop strategy notes
    if (pitStrategy.recommendedStops === 0) {
      notes.push('🏁 Strategia no-stop: vai fino alla fine con le stesse gomme')
    } else if (pitStrategy.recommendedStops === 1) {
      notes.push('🛑 Strategia 1 stop: ottima per la maggior parte delle gare')
    } else {
      notes.push('🛑🛑 Strategia multi-stop: più rischiosa ma può pagare')
    }
    
    // Weather notes
    if (weather.race.rain_probability > 50) {
      notes.push('🌧️ Alta probabilità pioggia: tieni gomme intermedie pronte')
    } else if (weather.race.rain_probability > 20) {
      notes.push('⛅ Possibile pioggia: monitora il meteo durante la gara')
    }
    
    // Temperature notes
    if (weather.race.temperature > 32) {
      notes.push('🌡️ Temperatura molto alta: rischio surriscaldamento gomme')
    } else if (weather.race.temperature < 12) {
      notes.push('❄️ Temperatura bassa: gomme più morbide per grip')
    }
    
    // Track-specific notes
    if (track.tyre_wear > 75) {
      notes.push('🛞 Alto consumo gomme: priorità alla gestione pneumatici')
    }
    
    if (track.fuel_consumption > 80) {
      notes.push('⛽ Alto consumo carburante: gestisci il motore con attenzione')
    }
    
    if (track.overtaking_difficulty < 30) {
      notes.push('🏎️ Sorpassi facili: puoi permetterti strategia aggressiva')
    } else if (track.overtaking_difficulty > 70) {
      notes.push('🚧 Sorpassi difficili: posizione cruciale, evita rischi')
    }
    
    // Driver-specific notes
    if (driver.aggressiveness > 75) {
      notes.push('⚡ Stile aggressivo: attenzione al consumo gomme')
    }
    
    if (driver.concentration < 60) {
      notes.push('🧠 Concentrazione bassa: evita strategie complesse')
    }

    return notes
  }

  // Estimate total race time
  private estimateRaceTime(
    driver: DriverData,
    car: CarData,
    track: TrackData,
    pitStops: number
  ): string {
    // Base lap time estimate
    const baseLapTime = 60 + (track.length * 13) // Rough seconds per lap
    
    // Driver skill factor
    const driverFactor = 1 - ((driver.overall - 50) / 300)
    
    // Car performance factor
    const carPerformance = this.getAverageCarPerformance(car)
    const carFactor = 1 - ((carPerformance - 50) / 400)
    
    // Calculate average lap time
    const avgLapTime = baseLapTime * driverFactor * carFactor
    
    // Total race time
    const racingTime = avgLapTime * track.laps
    const pitTime = pitStops * 25 // seconds
    const totalSeconds = racingTime + pitTime
    
    // Convert to HH:MM:SS format
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Helper: get average car performance
  private getAverageCarPerformance(car: CarData): number {
    const parts = Object.values(car)
    return parts.reduce((sum, part) => sum + part.performance, 0) / parts.length
  }
}

// Export singleton instance
export const strategyCalculator = new StrategyCalculatorService()

// Compound names for display
export const COMPOUND_NAMES = {
  1: 'Extra Soft',
  2: 'Soft', 
  3: 'Medium',
  4: 'Hard',
  5: 'Extra Hard'
} as const

// Strategy summary for clipboard
export function formatStrategyForClipboard(strategy: StrategyResult): string {
  const fuelText = `Carburante: Q${strategy.fuelStrategy.qualifyingFuel}L / R${strategy.fuelStrategy.raceFuel}L`
  const pitText = `Pit Stop: ${strategy.pitStrategy.recommendedStops} soste`
  const tyreText = `Gomme: Q=${COMPOUND_NAMES[strategy.tyreStrategy.qualifyingCompound]} / R=${COMPOUND_NAMES[strategy.tyreStrategy.raceCompound]}`
  
  return `GPRO Strategia:
━━━━━━━━━━━━━━
${fuelText}
${pitText}
${tyreText}
Tempo stimato: ${strategy.estimatedRaceTime}
Confidenza: ${strategy.confidence}%
━━━━━━━━━━━━━━
Generato con GPRO Setup Tool`
}