// GPRO Setup Calculator - Excel Formula Port
// This implements the core setup calculation formulas from Excel spreadsheets

import type { 
  DriverData, 
  CarData, 
  TrackData, 
  WeatherCondition,
  WeatherData,
  GPROSnapshot 
} from '@/types'

// Setup configuration for Q1, Q2, and Race
export interface SetupConfiguration {
  // Aerodynamics (0-1000)
  front_wing: number
  rear_wing: number
  
  // Engine (0-1000)  
  engine: number
  
  // Brakes (0-1000)
  brakes: number
  
  // Gear (0-1000)
  gear: number
  
  // Suspension (0-1000)
  suspension: number
  
  // Risk level (Very Low=1, Low=2, Normal=3, High=4, Very High=5)
  risk: 1 | 2 | 3 | 4 | 5
  
  // Compound (Extra Soft=1, Soft=2, Medium=3, Hard=4, Extra Hard=5)
  tyre_compound: 1 | 2 | 3 | 4 | 5
  
  // Focus (Qualification=1, Race=2)
  focus: 1 | 2
}

export interface SetupResult {
  qualifying: SetupConfiguration
  race: SetupConfiguration
  confidence: number // 0-100, how confident we are in this setup
  expectedLapTime: string // e.g., "1:21.234"
  notes: string[]
}

class SetupCalculatorService {
  // Base setup calculation - ported from Excel formulas
  calculateOptimalSetup(snapshot: GPROSnapshot): SetupResult {
    const { driver_data, car_data, track_data, weather_data } = snapshot
    
    if (!driver_data || !car_data || !track_data || !weather_data) {
      throw new Error('Dati insufficienti per il calcolo del setup')
    }

    // Qualifying setup calculation
    const qualifying = this.calculateQualifyingSetup(
      driver_data,
      car_data, 
      track_data,
      weather_data.qualifying
    )

    // Race setup calculation  
    const race = this.calculateRaceSetup(
      driver_data,
      car_data,
      track_data, 
      weather_data.race
    )

    // Calculate confidence based on data quality and track familiarity
    const confidence = this.calculateConfidence(driver_data, car_data, track_data)

    // Estimate lap time
    const expectedLapTime = this.estimateLapTime(driver_data, car_data, track_data, race)

    // Generate setup notes
    const notes = this.generateSetupNotes(driver_data, car_data, track_data, weather_data)

    return {
      qualifying,
      race,
      confidence,
      expectedLapTime,
      notes
    }
  }

  // Qualifying setup - optimized for single lap performance
  private calculateQualifyingSetup(
    driver: DriverData,
    _car: CarData, 
    track: TrackData,
    weather: WeatherCondition
  ): SetupConfiguration {
    
    // Base calculations from Excel formulas
    const powerWeight = track.power_importance / 100
    const handlingWeight = track.handling_importance / 100
    const accelWeight = track.acceleration_importance / 100
    
    // These factors could be used for future enhancements
    // const skillFactor = (driver.overall + driver.technical_insight) / 200
    // const carPerf = this.getAverageCarPerformance(car)
    // const weatherFactor = weather.temperature < 20 ? 0.95 : 1.05
    
    // Wing settings based on track characteristics
    const baseDownforce = track.downforce_importance
    const front_wing = Math.min(1000, Math.max(0, 
      baseDownforce * 8 + (handlingWeight * 200) - (powerWeight * 150)
    ))
    
    const rear_wing = Math.min(1000, Math.max(0,
      baseDownforce * 10 + (handlingWeight * 150) - (powerWeight * 100)
    ))
    
    // Engine setting - higher for power tracks
    const engine = Math.min(1000, Math.max(200,
      500 + (powerWeight * 400) + (accelWeight * 200)
    ))
    
    // Brake setting based on track characteristics
    const brakes = Math.min(1000, Math.max(100,
      300 + (track.overtaking_difficulty * 4) + (handlingWeight * 300)
    ))
    
    // Gear setting - shorter for acceleration tracks
    const gear = Math.min(1000, Math.max(200,
      600 - (accelWeight * 200) + (powerWeight * 150)
    ))
    
    // Suspension - stiffer for handling tracks
    const suspension = Math.min(1000, Math.max(100,
      400 + (handlingWeight * 400) + (track.grip_level * 2)
    ))

    // Risk level - higher for qualifying
    const risk: 1 | 2 | 3 | 4 | 5 = driver.aggressiveness > 70 ? 4 : 
                                   driver.aggressiveness > 50 ? 3 : 2

    // Tyre compound - softer for qualifying
    const tyre_compound: 1 | 2 | 3 | 4 | 5 = weather.temperature > 25 ? 2 : 1

    return {
      front_wing: Math.round(front_wing),
      rear_wing: Math.round(rear_wing), 
      engine: Math.round(engine),
      brakes: Math.round(brakes),
      gear: Math.round(gear),
      suspension: Math.round(suspension),
      risk,
      tyre_compound,
      focus: 1 // Qualification focus
    }
  }

  // Race setup - optimized for tyre life and consistency
  private calculateRaceSetup(
    driver: DriverData,
    car: CarData,
    track: TrackData, 
    weather: WeatherCondition
  ): SetupConfiguration {
    
    // Start with qualifying setup then adjust for race
    const baseSetup = this.calculateQualifyingSetup(driver, car, track, weather)
    
    // Race adjustments - more conservative
    const raceAdjustments = {
      front_wing: Math.max(0, baseSetup.front_wing - 50), // Less front downforce
      rear_wing: Math.min(1000, baseSetup.rear_wing + 30), // More rear stability
      engine: Math.max(100, baseSetup.engine - 100), // Lower engine mode
      brakes: Math.max(50, baseSetup.brakes - 50), // Less brake pressure
      gear: baseSetup.gear, // Keep gear setting
      suspension: Math.max(50, baseSetup.suspension - 30), // Softer suspension
      risk: Math.max(1, baseSetup.risk - 1) as 1 | 2 | 3 | 4 | 5, // Lower risk
      tyre_compound: Math.min(5, baseSetup.tyre_compound + 1) as 1 | 2 | 3 | 4 | 5, // Harder compound
      focus: 2 as 1 | 2 // Race focus
    }

    // Additional race-specific adjustments
    if (track.tyre_wear > 70) {
      // High tyre wear tracks - go even more conservative
      raceAdjustments.tyre_compound = Math.min(5, raceAdjustments.tyre_compound + 1) as 1 | 2 | 3 | 4 | 5
      raceAdjustments.risk = Math.max(1, raceAdjustments.risk - 1) as 1 | 2 | 3 | 4 | 5
    }

    if (track.fuel_consumption > 80) {
      // High fuel consumption - reduce engine
      raceAdjustments.engine = Math.max(50, raceAdjustments.engine - 50)
    }

    return raceAdjustments
  }

  // Calculate setup confidence based on various factors
  private calculateConfidence(
    driver: DriverData,
    car: CarData, 
    track: TrackData
  ): number {
    let confidence = 70 // Base confidence
    
    // Driver experience factor
    confidence += (driver.experience - 50) * 0.3
    
    // Technical insight factor
    confidence += (driver.technical_insight - 50) * 0.2
    
    // Car condition factor
    const avgWear = this.getAverageCarWear(car)
    confidence -= avgWear * 0.2
    
    // Track difficulty factor
    if (track.overtaking_difficulty > 70) {
      confidence -= 10 // Harder to predict on difficult tracks
    }
    
    return Math.max(30, Math.min(95, Math.round(confidence)))
  }

  // Estimate lap time based on setup and conditions
  private estimateLapTime(
    driver: DriverData,
    car: CarData,
    track: TrackData,
    setup: SetupConfiguration
  ): string {
    // Base lap time calculation (simplified)
    const trackBaseLap = 60 + (track.length * 12) // Rough estimate
    
    // Driver skill factor
    const driverFactor = 1 - ((driver.overall - 50) / 200)
    
    // Car performance factor  
    const carFactor = 1 - ((this.getAverageCarPerformance(car) - 50) / 300)
    
    // Setup efficiency (how well setup matches track)
    const setupEfficiency = this.calculateSetupEfficiency(setup, track)
    
    const lapTime = trackBaseLap * driverFactor * carFactor * setupEfficiency
    
    // Convert to MM:SS.mmm format
    const minutes = Math.floor(lapTime / 60)
    const seconds = lapTime % 60
    
    return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`
  }

  // Generate helpful notes about the setup
  private generateSetupNotes(
    driver: DriverData,
    car: CarData,
    track: TrackData,
    weather: WeatherData
  ): string[] {
    const notes: string[] = []
    
    // Track-specific notes
    if (track.power_importance > 80) {
      notes.push('🏁 Pista ad alta velocità: setup ottimizzato per potenza massima')
    }
    
    if (track.handling_importance > 80) {
      notes.push('🏎️ Pista tecnica: focus su handling e downforce')
    }
    
    if (track.tyre_wear > 70) {
      notes.push('🛞 Alto consumo gomme: setup conservativo raccomandato')
    }
    
    if (track.fuel_consumption > 80) {
      notes.push('⛽ Alto consumo carburante: motore ridotto per gara')
    }
    
    // Weather notes
    if (weather.race.rain_probability > 30) {
      notes.push('🌧️ Rischio pioggia: considera gomme intermedie')
    }
    
    if (weather.race.temperature > 30) {
      notes.push('🌡️ Temperatura alta: attenzione al surriscaldamento gomme')
    }
    
    // Car condition notes
    const avgWear = this.getAverageCarWear(car)
    if (avgWear > 50) {
      notes.push('🔧 Auto usurata: prestazioni ridotte, setup più conservativo')
    }
    
    // Driver notes
    if (driver.technical_insight < 60) {
      notes.push('📚 Insight tecnico basso: risultati meno precisi')
    }
    
    if (driver.aggressiveness > 80) {
      notes.push('⚡ Stile aggressivo: rischio più alto ma potenziale reward maggiore')
    }

    return notes
  }

  // Helper methods
  private getAverageCarPerformance(car: CarData): number {
    const parts = Object.values(car)
    return parts.reduce((sum, part) => sum + part.performance, 0) / parts.length
  }

  private getAverageCarWear(car: CarData): number {
    const parts = Object.values(car) 
    return parts.reduce((sum, part) => sum + part.wear, 0) / parts.length
  }

  private calculateSetupEfficiency(setup: SetupConfiguration, _track: TrackData): number {
    // Simplified efficiency calculation
    let efficiency = 1.0
    
    // Wing balance check
    const wingBalance = setup.rear_wing - setup.front_wing
    if (Math.abs(wingBalance) > 200) {
      efficiency *= 0.98 // Unbalanced wings
    }
    
    // Engine vs downforce balance
    if (setup.engine > 800 && (setup.front_wing + setup.rear_wing) > 1500) {
      efficiency *= 0.96 // High engine with high downforce = drag
    }
    
    return efficiency
  }
}

// Export singleton instance
export const setupCalculator = new SetupCalculatorService()

// Setup copy format for clipboard
export function formatSetupForClipboard(setup: SetupConfiguration): string {
  return `GPRO Setup:
━━━━━━━━━━━━━━
Alettone anteriore: ${setup.front_wing}
Alettone posteriore: ${setup.rear_wing}
Motore: ${setup.engine}
Freni: ${setup.brakes}
Cambio: ${setup.gear}
Sospensioni: ${setup.suspension}
Rischio: ${['', 'Molto Basso', 'Basso', 'Normale', 'Alto', 'Molto Alto'][setup.risk]}
Mescola: ${['', 'Extra Soft', 'Soft', 'Medium', 'Hard', 'Extra Hard'][setup.tyre_compound]}
Focus: ${setup.focus === 1 ? 'Qualifica' : 'Gara'}
━━━━━━━━━━━━━━
Generato con GPRO Setup Tool`
}