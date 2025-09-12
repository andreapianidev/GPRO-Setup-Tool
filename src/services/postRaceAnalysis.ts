// Post-Race Analysis Service - Compare predictions vs actual results
import type { SetupResult } from './setupCalculator'
import type { StrategyResult } from './strategyCalculator'
import { gproApiService } from './gproApi'

// Real race result data structure
export interface RaceResult {
  // Basic results
  position: number
  lapTime: string // Best lap time
  totalTime: string // Total race time
  pointsScored: number
  
  // Strategy execution  
  actualPitStops: number
  pitStopLaps: number[] // Which laps pits occurred
  fuelUsed: number // Total fuel consumed
  
  // Tyre data
  tyreWear: {
    front_left: number
    front_right: number
    rear_left: number
    rear_right: number
  }
  
  // Race incidents
  incidents: number
  penalties: string[]
  
  // Weather during race
  actualWeather: {
    temperature: number
    rain_occurred: boolean
    conditions_changed: boolean
  }
}

// Analysis comparison result
export interface PostRaceAnalysis {
  // Setup analysis
  setupAnalysis: {
    predictedLapTime: string
    actualBestLap: string
    timeDifference: number // seconds (negative = faster than predicted)
    accuracy: 'excellent' | 'good' | 'fair' | 'poor'
    setupEffectiveness: number // 0-100 score
  }
  
  // Strategy analysis
  strategyAnalysis: {
    predictedStops: number
    actualStops: number
    strategyDeviation: string // Description of what changed
    fuelEfficiency: {
      predicted: number
      actual: number
      difference: number
      accuracy: 'excellent' | 'good' | 'fair' | 'poor'
    }
    pitTiming: {
      predictedLaps: number[]
      actualLaps: number[]
      timingAccuracy: 'excellent' | 'good' | 'fair' | 'poor'
    }
  }
  
  // Overall performance
  overallPerformance: {
    raceScore: number // 0-100 based on expectations vs reality
    improvements: string[] // What could be improved
    strengths: string[] // What worked well
    lessons: string[] // Key takeaways for next race
  }
  
  // Data quality
  analysisReliability: number // 0-100, how reliable this analysis is
  dataCompleteness: number // 0-100, how complete the input data was
}

class PostRaceAnalysisService {
  
  // Main analysis function - compare predictions vs reality
  async analyzeRacePerformance(
    token: string,
    predictedSetup: SetupResult,
    predictedStrategy: StrategyResult
  ): Promise<PostRaceAnalysis> {
    
    // Fetch actual race results from GPRO
    const raceResult = await gproApiService.getPostRaceResults(token)
    if (!raceResult) {
      throw new Error('Impossibile recuperare i risultati della gara da GPRO')
    }

    // Analyze setup effectiveness
    const setupAnalysis = this.analyzeSetupPerformance(predictedSetup, raceResult)
    
    // Analyze strategy execution
    const strategyAnalysis = this.analyzeStrategyExecution(predictedStrategy, raceResult)
    
    // Calculate overall performance metrics
    const overallPerformance = this.calculateOverallPerformance(
      predictedSetup, 
      predictedStrategy, 
      raceResult,
      setupAnalysis,
      strategyAnalysis
    )
    
    // Determine analysis reliability
    const analysisReliability = this.calculateAnalysisReliability(raceResult)
    const dataCompleteness = this.calculateDataCompleteness(raceResult)

    return {
      setupAnalysis,
      strategyAnalysis, 
      overallPerformance,
      analysisReliability,
      dataCompleteness
    }
  }

  // Analyze how well the setup performed vs predictions
  private analyzeSetupPerformance(
    predicted: SetupResult,
    actual: RaceResult
  ) {
    // Convert lap times to seconds for comparison
    const predictedSeconds = this.lapTimeToSeconds(predicted.expectedLapTime)
    const actualSeconds = this.lapTimeToSeconds(actual.lapTime)
    
    const timeDifference = actualSeconds - predictedSeconds
    const percentageDiff = Math.abs(timeDifference / predictedSeconds * 100)
    
    // Determine accuracy level
    let accuracy: 'excellent' | 'good' | 'fair' | 'poor'
    if (percentageDiff <= 1) accuracy = 'excellent'
    else if (percentageDiff <= 2.5) accuracy = 'good' 
    else if (percentageDiff <= 5) accuracy = 'fair'
    else accuracy = 'poor'
    
    // Calculate setup effectiveness score
    let setupEffectiveness = 100
    setupEffectiveness -= Math.min(50, percentageDiff * 5) // Penalty for lap time difference
    setupEffectiveness -= Math.max(0, (actual.incidents * 10)) // Penalty for incidents
    setupEffectiveness = Math.max(0, setupEffectiveness)

    return {
      predictedLapTime: predicted.expectedLapTime,
      actualBestLap: actual.lapTime,
      timeDifference,
      accuracy,
      setupEffectiveness: Math.round(setupEffectiveness)
    }
  }

  // Analyze strategy execution vs plan
  private analyzeStrategyExecution(
    predicted: StrategyResult,
    actual: RaceResult
  ) {
    const predictedStops = predicted.pitStrategy.recommendedStops
    const actualStops = actual.actualPitStops
    
    // Strategy deviation analysis
    let strategyDeviation = ''
    if (actualStops === predictedStops) {
      strategyDeviation = 'Strategia eseguita come pianificato'
    } else if (actualStops > predictedStops) {
      strategyDeviation = `Soste extra: ${actualStops - predictedStops} pit stop aggiuntivi`
    } else {
      strategyDeviation = `Meno soste: ${predictedStops - actualStops} pit stop in meno del previsto`
    }
    
    // Fuel efficiency analysis
    const predictedFuel = predicted.fuelStrategy.raceFuel
    const actualFuel = actual.fuelUsed
    const fuelDifference = actualFuel - predictedFuel
    const fuelPercentDiff = Math.abs(fuelDifference / predictedFuel * 100)
    
    let fuelAccuracy: 'excellent' | 'good' | 'fair' | 'poor'
    if (fuelPercentDiff <= 5) fuelAccuracy = 'excellent'
    else if (fuelPercentDiff <= 10) fuelAccuracy = 'good'
    else if (fuelPercentDiff <= 20) fuelAccuracy = 'fair' 
    else fuelAccuracy = 'poor'
    
    // Pit timing analysis
    const predictedLaps = predicted.pitStrategy.pitWindows.map(w => w.lap)
    const actualLaps = actual.pitStopLaps
    
    let timingAccuracy: 'excellent' | 'good' | 'fair' | 'poor'
    if (predictedLaps.length === 0 && actualLaps.length === 0) {
      timingAccuracy = 'excellent' // Both no stops
    } else if (predictedLaps.length === 0 || actualLaps.length === 0) {
      timingAccuracy = 'poor' // One had stops, other didn't
    } else {
      // Calculate average lap difference
      const avgDifference = this.calculateAverageLapDifference(predictedLaps, actualLaps)
      if (avgDifference <= 2) timingAccuracy = 'excellent'
      else if (avgDifference <= 5) timingAccuracy = 'good'
      else if (avgDifference <= 10) timingAccuracy = 'fair'
      else timingAccuracy = 'poor'
    }

    return {
      predictedStops,
      actualStops,
      strategyDeviation,
      fuelEfficiency: {
        predicted: predictedFuel,
        actual: actualFuel,
        difference: fuelDifference,
        accuracy: fuelAccuracy
      },
      pitTiming: {
        predictedLaps,
        actualLaps,
        timingAccuracy
      }
    }
  }

  // Calculate overall race performance score
  private calculateOverallPerformance(
    _predictedSetup: SetupResult,
    _predictedStrategy: StrategyResult,
    actual: RaceResult,
    setupAnalysis: any,
    strategyAnalysis: any
  ) {
    // Base score calculation
    let raceScore = 50 // Start at average
    
    // Setup contribution (40% of score)
    raceScore += setupAnalysis.setupEffectiveness * 0.4
    
    // Strategy contribution (30% of score)  
    const strategyScore = this.calculateStrategyScore(strategyAnalysis)
    raceScore += strategyScore * 0.3
    
    // Race execution (30% of score)
    const executionScore = Math.max(0, 100 - (actual.incidents * 20))
    raceScore += executionScore * 0.3
    
    raceScore = Math.max(0, Math.min(100, raceScore))

    // Generate improvements, strengths, and lessons
    const improvements = this.generateImprovements(setupAnalysis, strategyAnalysis, actual)
    const strengths = this.generateStrengths(setupAnalysis, strategyAnalysis, actual)
    const lessons = this.generateLessons(setupAnalysis, strategyAnalysis, actual)

    return {
      raceScore: Math.round(raceScore),
      improvements,
      strengths, 
      lessons
    }
  }

  // Helper: Calculate strategy execution score
  private calculateStrategyScore(strategyAnalysis: any): number {
    let score = 70 // Base strategy score
    
    // Fuel efficiency score
    if (strategyAnalysis.fuelEfficiency.accuracy === 'excellent') score += 15
    else if (strategyAnalysis.fuelEfficiency.accuracy === 'good') score += 10
    else if (strategyAnalysis.fuelEfficiency.accuracy === 'fair') score += 5
    else score -= 10
    
    // Pit timing score
    if (strategyAnalysis.pitTiming.timingAccuracy === 'excellent') score += 15
    else if (strategyAnalysis.pitTiming.timingAccuracy === 'good') score += 10
    else if (strategyAnalysis.pitTiming.timingAccuracy === 'fair') score += 5
    else score -= 10
    
    return Math.max(0, Math.min(100, score))
  }

  // Generate improvement suggestions
  private generateImprovements(setupAnalysis: any, strategyAnalysis: any, actual: RaceResult): string[] {
    const improvements: string[] = []
    
    if (setupAnalysis.accuracy === 'poor') {
      improvements.push('Rivedere calcoli setup - grande differenza tra tempi previsti e reali')
    }
    
    if (setupAnalysis.timeDifference > 2) {
      improvements.push('Setup troppo ottimistico - considerare impostazioni più conservative')
    }
    
    if (strategyAnalysis.fuelEfficiency.difference > 10) {
      improvements.push('Migliorare previsioni consumo carburante')
    }
    
    if (strategyAnalysis.pitTiming.timingAccuracy === 'poor') {
      improvements.push('Ottimizzare timing pit stop - finestre non rispettate')
    }
    
    if (actual.incidents > 0) {
      improvements.push('Ridurre rischi - troppi incidenti durante la gara')
    }
    
    if (actual.tyreWear.front_left > 90 || actual.tyreWear.front_right > 90) {
      improvements.push('Gestione gomme anteriori - usura eccessiva')
    }

    return improvements
  }

  // Generate strengths
  private generateStrengths(setupAnalysis: any, strategyAnalysis: any, actual: RaceResult): string[] {
    const strengths: string[] = []
    
    if (setupAnalysis.accuracy === 'excellent') {
      strengths.push('Setup prediction eccellente - tempi molto vicini alle previsioni')
    }
    
    if (strategyAnalysis.fuelEfficiency.accuracy === 'excellent') {
      strengths.push('Calcoli carburante perfetti - consumo come previsto')
    }
    
    if (strategyAnalysis.pitTiming.timingAccuracy === 'excellent') {
      strengths.push('Timing pit stop ottimale - eseguiti come pianificato')
    }
    
    if (actual.incidents === 0) {
      strengths.push('Gara pulita - nessun incidente')
    }
    
    if (setupAnalysis.timeDifference < -0.5) {
      strengths.push('Setup migliore delle aspettative - tempi più veloci del previsto')
    }

    return strengths
  }

  // Generate lessons learned
  private generateLessons(setupAnalysis: any, strategyAnalysis: any, actual: RaceResult): string[] {
    const lessons: string[] = []
    
    if (Math.abs(setupAnalysis.timeDifference) > 1) {
      lessons.push('I calcoli setup necessitano calibrazione per questa tipologia di pista')
    }
    
    if (strategyAnalysis.actualStops !== strategyAnalysis.predictedStops) {
      lessons.push('Fattori imprevisti hanno influenzato la strategia - considerare più scenari')
    }
    
    if (actual.actualWeather.conditions_changed) {
      lessons.push('Condizioni meteo cambiate - migliorare monitoraggio tempo reale')
    }
    
    const maxTyreWear = Math.max(
      actual.tyreWear.front_left,
      actual.tyreWear.front_right, 
      actual.tyreWear.rear_left,
      actual.tyreWear.rear_right
    )
    
    if (maxTyreWear < 50) {
      lessons.push('Gomme poco sfruttate - potenziale per strategia più aggressiva')
    } else if (maxTyreWear > 85) {
      lessons.push('Gomme al limite - necessaria gestione più conservativa')
    }

    return lessons
  }

  // Helper functions
  private lapTimeToSeconds(lapTime: string): number {
    const parts = lapTime.split(':')
    return parseInt(parts[0]) * 60 + parseFloat(parts[1])
  }

  private calculateAverageLapDifference(predicted: number[], actual: number[]): number {
    if (predicted.length === 0 && actual.length === 0) return 0
    if (predicted.length === 0 || actual.length === 0) return 999
    
    let totalDifference = 0
    const maxLength = Math.max(predicted.length, actual.length)
    
    for (let i = 0; i < maxLength; i++) {
      const predLap = predicted[i] || 0
      const actLap = actual[i] || 0
      totalDifference += Math.abs(predLap - actLap)
    }
    
    return totalDifference / maxLength
  }

  private calculateAnalysisReliability(result: RaceResult): number {
    let reliability = 100
    
    // Reduce reliability for missing data
    if (!result.fuelUsed) reliability -= 20
    if (!result.tyreWear.front_left) reliability -= 15
    if (!result.pitStopLaps.length && result.actualPitStops > 0) reliability -= 25
    
    return Math.max(30, reliability)
  }

  private calculateDataCompleteness(result: RaceResult): number {
    let completeness = 0
    const totalFields = 10
    
    if (result.position) completeness++
    if (result.lapTime) completeness++
    if (result.totalTime) completeness++
    if (result.actualPitStops !== undefined) completeness++
    if (result.fuelUsed) completeness++
    if (result.tyreWear.front_left) completeness++
    if (result.incidents !== undefined) completeness++
    if (result.actualWeather.temperature) completeness++
    if (result.pitStopLaps?.length) completeness++
    if (result.pointsScored !== undefined) completeness++
    
    return Math.round((completeness / totalFields) * 100)
  }
}

// Export singleton instance
export const postRaceAnalysis = new PostRaceAnalysisService()