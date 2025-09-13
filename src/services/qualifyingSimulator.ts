// GPRO Qualifying Simulator - Advanced Grid Position Predictor
// Innovative feature: AI-powered qualifying simulation with traffic analysis

import type { 
  DriverData, 
  CarData, 
  TrackData, 
  WeatherCondition,
  GPROSnapshot 
} from '@/types'

export interface QualifyingResult {
  predictedPosition: number
  q1Time: string
  q2Time: string
  gridPenalty: number
  confidence: number
  riskFactors: string[]
  strategy: QualifyingStrategy
  competitors: CompetitorAnalysis[]
}

export interface QualifyingStrategy {
  q1: {
    fuelLoad: number
    tyreCompound: number
    pushLevel: number
    optimalLapWindow: string
  }
  q2: {
    fuelLoad: number
    tyreCompound: number
    pushLevel: number
    optimalLapWindow: string
  }
  trackEvolution: number // % improvement from Q1 to Q2
  trafficRisk: 'low' | 'medium' | 'high'
}

export interface CompetitorAnalysis {
  position: number
  expectedTime: string
  threat_level: 'low' | 'medium' | 'high'
  weakness: string
}

class QualifyingSimulatorService {
  
  // Main qualifying simulation with AI predictions
  simulateQualifying(snapshot: GPROSnapshot): QualifyingResult {
    const { driver_data, car_data, track_data, weather_data } = snapshot
    
    if (!driver_data || !car_data || !track_data || !weather_data) {
      throw new Error('Dati insufficienti per simulare la qualifica')
    }

    // Calculate base lap times
    const q1Time = this.calculateQ1Time(driver_data, car_data, track_data, weather_data.qualifying)
    const q2Time = this.calculateQ2Time(driver_data, car_data, track_data, weather_data.qualifying, q1Time)
    
    // Predict grid position based on competition
    const predictedPosition = this.predictGridPosition(q2Time, track_data, driver_data)
    
    // Generate optimal strategy
    const strategy = this.generateQualifyingStrategy(driver_data, car_data, track_data, weather_data.qualifying)
    
    // Analyze competitors
    const competitors = this.analyzeCompetitors(driver_data, track_data, q2Time)
    
    // Calculate confidence and risks
    const confidence = this.calculateConfidence(driver_data, car_data, weather_data.qualifying)
    const riskFactors = this.identifyRiskFactors(driver_data, car_data, track_data, weather_data.qualifying)
    
    // Check for grid penalties
    const gridPenalty = this.calculateGridPenalty(car_data)

    return {
      predictedPosition,
      q1Time,
      q2Time,
      gridPenalty,
      confidence,
      riskFactors,
      strategy,
      competitors
    }
  }

  private calculateQ1Time(
    driver: DriverData,
    car: CarData,
    track: TrackData,
    weather: WeatherCondition
  ): string {
    // Base time calculation
    const baseTime = this.getTrackBaseTime(track)
    
    // Driver skill factor (concentration crucial for qualifying)
    const driverFactor = 1 - ((driver.concentration * 1.5 + driver.overall) / 400)
    
    // Car performance impact
    const carFactor = this.calculateCarPerformanceFactor(car)
    
    // Weather impact
    const weatherFactor = this.calculateWeatherImpact(weather)
    
    // Fresh track penalty (Q1 has less rubber)
    const trackEvolutionPenalty = 1.005 // 0.5% slower
    
    const q1Seconds = baseTime * driverFactor * carFactor * weatherFactor * trackEvolutionPenalty
    
    return this.formatLapTime(q1Seconds)
  }

  private calculateQ2Time(
    driver: DriverData,
    _car: CarData,
    _track: TrackData,
    weather: WeatherCondition,
    q1Time: string
  ): string {
    // Parse Q1 time
    const q1Seconds = this.parseLapTime(q1Time)
    
    // Track evolution benefit (more rubber)
    const trackEvolution = 0.994 // 0.6% faster
    
    // Driver improvement (learns track)
    const driverImprovement = 1 - (driver.technical_insight / 1000)
    
    // Pressure factor (Q2 more pressure)
    const pressureFactor = driver.concentration > 80 ? 0.998 : 1.002
    
    // Temperature change impact
    const tempDelta = Math.abs(weather.temperature - 25) * 0.0001
    
    const q2Seconds = q1Seconds * trackEvolution * driverImprovement * pressureFactor * (1 + tempDelta)
    
    return this.formatLapTime(q2Seconds)
  }

  private predictGridPosition(lapTime: string, track: TrackData, _driver: DriverData): number {
    const seconds = this.parseLapTime(lapTime)
    const trackBaseTime = this.getTrackBaseTime(track)
    
    // Calculate performance percentile
    // const _performanceRatio = seconds / trackBaseTime
    
    // Elite drivers simulation
    const eliteTime = trackBaseTime * 0.97  // Top teams 3% faster
    const midFieldTime = trackBaseTime * 0.995 // Midfield 0.5% slower
    const backMarkerTime = trackBaseTime * 1.02 // Back markers 2% slower
    
    // Position estimation based on performance bands
    if (seconds <= eliteTime) {
      // Top 6 positions
      const spread = (seconds - eliteTime + 0.5) / 0.5
      return Math.max(1, Math.round(1 + spread * 5))
    } else if (seconds <= midFieldTime) {
      // Positions 7-20
      const spread = (seconds - eliteTime) / (midFieldTime - eliteTime)
      return Math.round(7 + spread * 13)
    } else {
      // Positions 21-30
      const spread = Math.min(1, (seconds - midFieldTime) / (backMarkerTime - midFieldTime))
      return Math.round(21 + spread * 9)
    }
  }

  private generateQualifyingStrategy(
    driver: DriverData,
    _car: CarData,
    track: TrackData,
    weather: WeatherCondition
  ): QualifyingStrategy {
    // Q1 Strategy - Conservative to ensure Q2
    const q1Strategy = {
      fuelLoad: 15, // Minimal fuel for 5 laps
      tyreCompound: weather.temperature > 28 ? 2 : 1, // Soft or Extra Soft
      pushLevel: 85, // Conservative push to save car
      optimalLapWindow: 'Laps 3-4 (track evolution)'
    }
    
    // Q2 Strategy - Maximum attack
    const q2Strategy = {
      fuelLoad: 12, // Even less fuel for weight saving
      tyreCompound: 1, // Always softest for Q2
      pushLevel: 100, // Maximum push
      optimalLapWindow: 'Last 2 minutes (maximum track grip)'
    }
    
    // Track evolution calculation
    const trackEvolution = track.grip_level > 70 ? 1.2 : 0.8 // % improvement
    
    // Traffic risk assessment
    const trafficRisk = this.assessTrafficRisk(track, driver)

    return {
      q1: q1Strategy,
      q2: q2Strategy,
      trackEvolution,
      trafficRisk
    }
  }

  private analyzeCompetitors(_driver: DriverData, _track: TrackData, yourTime: string): CompetitorAnalysis[] {
    const competitors: CompetitorAnalysis[] = []
    const yourSeconds = this.parseLapTime(yourTime)
    
    // Simulate top 10 competitors
    for (let i = 1; i <= 10; i++) {
      const variance = (Math.random() - 0.5) * 2 // -1 to +1 second
      const competitorTime = yourSeconds + variance
      
      const threat = variance < -0.5 ? 'high' : 
                     variance < 0.2 ? 'medium' : 'low'
      
      const weaknesses = [
        'Weak in sector 1 chicane',
        'Loses time in high-speed corners',
        'Poor traction out of slow corners',
        'Struggles with brake balance',
        'Inconsistent lap times',
        'Poor tire management',
        'Weak qualifying pace',
        'Makes mistakes under pressure'
      ]
      
      competitors.push({
        position: i,
        expectedTime: this.formatLapTime(competitorTime),
        threat_level: threat,
        weakness: weaknesses[Math.floor(Math.random() * weaknesses.length)]
      })
    }
    
    return competitors.sort((a, b) => 
      this.parseLapTime(a.expectedTime) - this.parseLapTime(b.expectedTime)
    )
  }

  private calculateConfidence(
    driver: DriverData,
    car: CarData,
    weather: WeatherCondition
  ): number {
    let confidence = 70
    
    // Driver factors
    confidence += (driver.concentration - 50) * 0.4
    confidence += (driver.experience - 50) * 0.2
    
    // Car reliability
    const avgWear = this.getAverageWear(car)
    confidence -= avgWear * 0.3
    
    // Weather stability
    if (weather.rain_probability > 20) {
      confidence -= weather.rain_probability * 0.2
    }
    
    return Math.max(40, Math.min(95, Math.round(confidence)))
  }

  private identifyRiskFactors(
    driver: DriverData,
    car: CarData,
    track: TrackData,
    weather: WeatherCondition
  ): string[] {
    const risks: string[] = []
    
    // Driver risks
    if (driver.concentration < 70) {
      risks.push('⚠️ Bassa concentrazione: rischio errori in Q2')
    }
    if (driver.aggressiveness > 85) {
      risks.push('🔥 Stile molto aggressivo: rischio track limits')
    }
    
    // Car risks
    const engineWear = car.engine.wear
    if (engineWear > 50) {
      risks.push('🔧 Motore usurato: possibile perdita di potenza')
    }
    
    // Weather risks
    if (weather.rain_probability > 15) {
      risks.push(`🌧️ ${weather.rain_probability}% probabilità pioggia durante qualifica`)
    }
    if (weather.wind_speed > 20) {
      risks.push('💨 Vento forte: difficoltà in curve veloci')
    }
    
    // Track risks
    if (track.overtaking_difficulty > 80) {
      risks.push('🚧 Pista stretta: alto rischio traffico in qualifica')
    }
    
    return risks
  }

  private calculateGridPenalty(car: CarData): number {
    let penalty = 0
    
    // Engine change penalty
    if (car.engine.wear > 90) {
      penalty += 10 // Simulate engine change penalty
    }
    
    // Gearbox penalty
    if (car.gearbox.wear > 85) {
      penalty += 5
    }
    
    return penalty
  }

  private assessTrafficRisk(track: TrackData, driver: DriverData): 'low' | 'medium' | 'high' {
    const trackLength = track.length
    const driverAwareness = driver.concentration + driver.experience
    
    if (trackLength < 4 && driverAwareness < 140) return 'high'
    if (trackLength < 5 && driverAwareness < 160) return 'medium'
    return 'low'
  }

  // Helper methods
  private getTrackBaseTime(track: TrackData): number {
    // Formula based on track length and characteristics
    const lengthFactor = track.length * 18 // ~18 seconds per km
    const speedFactor = (200 - track.power_importance) / 100
    return 60 + lengthFactor * (1 + speedFactor * 0.1)
  }

  private calculateCarPerformanceFactor(car: CarData): number {
    const parts = Object.values(car)
    const avgPerformance = parts.reduce((sum, part) => sum + part.performance, 0) / parts.length
    return 1 - ((avgPerformance - 50) / 500)
  }

  private calculateWeatherImpact(weather: WeatherCondition): number {
    let impact = 1.0
    
    // Temperature impact
    const idealTemp = 22
    const tempDelta = Math.abs(weather.temperature - idealTemp)
    impact += tempDelta * 0.001
    
    // Wind impact
    impact += weather.wind_speed * 0.0001
    
    // Rain threat
    if (weather.rain_probability > 30) {
      impact += 0.005 // Drivers more cautious
    }
    
    return impact
  }

  private getAverageWear(car: CarData): number {
    const parts = Object.values(car)
    return parts.reduce((sum, part) => sum + part.wear, 0) / parts.length
  }

  private formatLapTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toFixed(3).padStart(6, '0')}`
  }

  private parseLapTime(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number)
    return minutes * 60 + seconds
  }
}

// Export singleton
export const qualifyingSimulator = new QualifyingSimulatorService()

// Format for clipboard/display
export function formatQualifyingReport(result: QualifyingResult): string {
  const penaltyText = result.gridPenalty > 0 ? ` (+ ${result.gridPenalty} penalty)` : ''
  
  return `🏁 QUALIFYING SIMULATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━
📊 PREDICTED GRID: P${result.predictedPosition}${penaltyText}
⏱️ Q1 Time: ${result.q1Time}
⏱️ Q2 Time: ${result.q2Time}
🎯 Confidence: ${result.confidence}%

📋 OPTIMAL STRATEGY:
Q1: Fuel ${result.strategy.q1.fuelLoad}L | Push ${result.strategy.q1.pushLevel}%
Q2: Fuel ${result.strategy.q2.fuelLoad}L | Push ${result.strategy.q2.pushLevel}%
Track Evolution: +${result.strategy.trackEvolution}%
Traffic Risk: ${result.strategy.trafficRisk}

⚠️ RISK FACTORS:
${result.riskFactors.join('\n')}

🏎️ TOP THREATS:
${result.competitors.slice(0, 3).map(c => 
  `P${c.position}: ${c.expectedTime} (${c.threat_level} threat)`
).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━
Generated with GPRO Setup Tool`
}