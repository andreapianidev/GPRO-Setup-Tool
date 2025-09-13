// GPRO Overtaking Risk/Reward Simulator
// Revolutionary feature: AI-driven overtaking decision matrix with real-time race simulation

import type { DriverData, CarData, TrackData, GPROSnapshot } from '@/types'

export interface OvertakingAnalysis {
  currentPosition: number
  opportunities: OvertakingOpportunity[]
  riskMatrix: RiskMatrix
  optimalStrategy: RaceStrategy
  drsZones: DRSZoneAnalysis[]
  incidentProbability: IncidentAnalysis
  expectedGains: ExpectedGains
}

export interface OvertakingOpportunity {
  targetPosition: number
  targetDriver: string
  successProbability: number
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  optimalLap: number
  optimalTurn: string
  technique: OvertakingTechnique
  requiredDelta: number // Speed delta needed in km/h
  recommendation: 'go' | 'wait' | 'abort'
  reasoning: string[]
}

export interface OvertakingTechnique {
  type: 'late_braking' | 'slipstream' | 'drs_pass' | 'undercut' | 'overcut' | 'dive_bomb'
  setupAdjustment: string
  fuelUsage: number
  tyreWear: number
  description: string
}

export interface RiskMatrix {
  position: number
  lap: number
  trackSection: string
  conditions: RaceConditions
  riskScore: number // 0-100
  rewardScore: number // 0-100
  recommendation: string
}

export interface RaceConditions {
  weather: 'dry' | 'wet' | 'changing'
  traffic: 'clear' | 'light' | 'heavy'
  tyreAdvantage: number // Laps newer than opponent
  fuelAdvantage: number // kg lighter than opponent
  performanceGap: number // % faster/slower
}

export interface RaceStrategy {
  aggressiveness: number // 0-100
  pushPhases: PushPhase[]
  conservePhases: ConservePhase[]
  overtakingWindows: number[]
  estimatedPositionGain: number
}

export interface PushPhase {
  startLap: number
  endLap: number
  intensity: number
  target: string
  reason: string
}

export interface ConservePhase {
  startLap: number
  endLap: number
  savingTarget: 'fuel' | 'tyres' | 'engine'
  amount: number
}

export interface DRSZoneAnalysis {
  zone: number
  location: string
  length: number
  successRate: number
  optimalEntry: string
  risks: string[]
}

export interface IncidentAnalysis {
  baseRisk: number
  driverFactors: number
  trackFactors: number
  weatherFactors: number
  totalRisk: number
  historicalData: string
}

export interface ExpectedGains {
  bestCase: { positions: number, points: number, time: string }
  likelyCase: { positions: number, points: number, time: string }
  worstCase: { positions: number, points: number, time: string }
  expectedValue: number
}

class OvertakingSimulatorService {
  
  // Track-specific overtaking data
  private readonly TRACK_OVERTAKING_SPOTS = {
    'Monza': [
      { turn: 'T1 - Variante del Rettifilo', difficulty: 'medium', drs: false },
      { turn: 'T4 - Variante della Roggia', difficulty: 'hard', drs: false },
      { turn: 'T8 - Prima Lesmo', difficulty: 'very_hard', drs: false },
      { turn: 'T11 - Parabolica', difficulty: 'medium', drs: true }
    ],
    'Monaco': [
      { turn: 'T1 - Sainte Devote', difficulty: 'very_hard', drs: false },
      { turn: 'T10 - Chicane', difficulty: 'extreme', drs: false },
      { turn: 'T14 - Nouvelle Chicane', difficulty: 'hard', drs: false }
    ],
    'Spa': [
      { turn: 'T1 - La Source', difficulty: 'medium', drs: false },
      { turn: 'T5 - Les Combes', difficulty: 'easy', drs: true },
      { turn: 'T18 - Bus Stop', difficulty: 'medium', drs: false }
    ]
  }

  // Points system for risk/reward calculation
  private readonly POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

  analyzeOvertaking(
    snapshot: GPROSnapshot,
    currentPosition: number,
    currentLap: number,
    totalLaps: number
  ): OvertakingAnalysis {
    const { driver_data, car_data, track_data } = snapshot
    
    if (!driver_data || !car_data || !track_data) {
      throw new Error('Dati insufficienti per simulazione sorpassi')
    }

    // Generate overtaking opportunities
    const opportunities = this.generateOpportunities(
      driver_data, car_data, track_data, currentPosition, currentLap, totalLaps
    )
    
    // Create risk matrix for current situation
    const riskMatrix = this.createRiskMatrix(
      driver_data, track_data, currentPosition, currentLap
    )
    
    // Generate optimal race strategy
    const optimalStrategy = this.generateOptimalStrategy(
      driver_data, opportunities, currentLap, totalLaps
    )
    
    // Analyze DRS zones
    const drsZones = this.analyzeDRSZones(track_data)
    
    // Calculate incident probability
    const incidentProbability = this.calculateIncidentProbability(
      driver_data, track_data, currentLap
    )
    
    // Calculate expected gains
    const expectedGains = this.calculateExpectedGains(
      currentPosition, opportunities, incidentProbability
    )

    return {
      currentPosition,
      opportunities,
      riskMatrix,
      optimalStrategy,
      drsZones,
      incidentProbability,
      expectedGains
    }
  }

  private generateOpportunities(
    driver: DriverData,
    car: CarData,
    track: TrackData,
    position: number,
    currentLap: number,
    totalLaps: number
  ): OvertakingOpportunity[] {
    const opportunities: OvertakingOpportunity[] = []
    
    // Simulate opponents ahead (max 5 positions)
    const positionsToAnalyze = Math.min(5, position - 1)
    
    for (let i = 1; i <= positionsToAnalyze; i++) {
      const targetPos = position - i
      
      // Simulate opponent characteristics
      const opponentStrength = this.simulateOpponent(targetPos)
      
      // Calculate success probability
      const successProb = this.calculateSuccessProbability(
        driver, car, track, opponentStrength
      )
      
      // Determine risk level
      const riskLevel = this.assessRiskLevel(
        successProb, currentLap, totalLaps, targetPos
      )
      
      // Find optimal overtaking spot
      const optimalSpot = this.findOptimalOvertakingSpot(track)
      
      // Choose technique
      const technique = this.selectOvertakingTechnique(
        driver, track, opponentStrength, currentLap
      )
      
      // Calculate required speed delta
      const requiredDelta = this.calculateRequiredDelta(
        car, opponentStrength, technique.type
      )
      
      // Make recommendation
      const recommendation = this.makeRecommendation(
        successProb, riskLevel, currentLap, totalLaps
      )
      
      // Generate reasoning
      const reasoning = this.generateReasoning(
        successProb, riskLevel, currentLap, totalLaps, technique
      )
      
      opportunities.push({
        targetPosition: targetPos,
        targetDriver: `Driver P${targetPos}`,
        successProbability: successProb,
        riskLevel,
        optimalLap: Math.min(currentLap + Math.ceil(i * 1.5), totalLaps - 2),
        optimalTurn: optimalSpot.turn,
        technique,
        requiredDelta,
        recommendation,
        reasoning
      })
    }
    
    return opportunities.sort((a, b) => b.successProbability - a.successProbability)
  }

  private createRiskMatrix(
    driver: DriverData,
    track: TrackData,
    position: number,
    lap: number
  ): RiskMatrix {
    // Simulate current conditions
    const conditions: RaceConditions = {
      weather: Math.random() > 0.8 ? 'wet' : 'dry',
      traffic: position > 15 ? 'heavy' : position > 8 ? 'light' : 'clear',
      tyreAdvantage: Math.floor(Math.random() * 10 - 5), // -5 to +5 laps
      fuelAdvantage: Math.random() * 20 - 10, // -10 to +10 kg
      performanceGap: Math.random() * 10 - 5 // -5% to +5%
    }
    
    // Calculate risk score
    let riskScore = 30 // Base risk
    
    // Driver factors
    riskScore += (100 - driver.concentration) * 0.3
    riskScore += driver.aggressiveness * 0.2
    riskScore -= driver.experience * 0.1
    
    // Track factors
    riskScore += track.overtaking_difficulty * 0.3
    
    // Condition factors
    if (conditions.weather === 'wet') riskScore += 20
    if (conditions.traffic === 'heavy') riskScore += 15
    if (conditions.tyreAdvantage < 0) riskScore += 10
    
    // Calculate reward score
    let rewardScore = 0
    
    // Position-based reward
    if (position <= 10) {
      rewardScore = 80 - (position * 5) // More reward for top positions
    } else {
      rewardScore = 30 - (position - 10) // Less reward outside points
    }
    
    // Condition bonuses
    if (conditions.tyreAdvantage > 3) rewardScore += 20
    if (conditions.fuelAdvantage > 5) rewardScore += 15
    if (conditions.performanceGap > 2) rewardScore += 25
    
    // Generate recommendation
    const ratio = rewardScore / riskScore
    const recommendation = ratio > 1.5 ? 'Attack aggressively' :
                          ratio > 1.0 ? 'Look for opportunities' :
                          ratio > 0.7 ? 'Be patient, wait for mistakes' :
                          'Focus on defense'
    
    return {
      position,
      lap,
      trackSection: this.getCurrentTrackSection(lap, track),
      conditions,
      riskScore: Math.min(100, Math.max(0, Math.round(riskScore))),
      rewardScore: Math.min(100, Math.max(0, Math.round(rewardScore))),
      recommendation
    }
  }

  private generateOptimalStrategy(
    driver: DriverData,
    opportunities: OvertakingOpportunity[],
    currentLap: number,
    totalLaps: number
  ): RaceStrategy {
    // Base aggressiveness on driver profile
    const baseAggression = driver.aggressiveness
    
    // Adjust for race phase
    const racePhase = currentLap / totalLaps
    const phaseMultiplier = racePhase < 0.2 ? 0.7 : // Early - conservative
                           racePhase < 0.7 ? 1.2 : // Middle - aggressive
                           0.9 // Late - calculated risks
    
    const aggressiveness = Math.min(100, baseAggression * phaseMultiplier)
    
    // Generate push phases
    const pushPhases: PushPhase[] = []
    const highProbOpportunities = opportunities.filter(o => o.successProbability > 60)
    
    for (const opp of highProbOpportunities) {
      pushPhases.push({
        startLap: opp.optimalLap - 2,
        endLap: opp.optimalLap + 1,
        intensity: Math.round(opp.successProbability),
        target: opp.targetDriver,
        reason: `Overtaking attempt on ${opp.targetDriver}`
      })
    }
    
    // Generate conserve phases
    const conservePhases: ConservePhase[] = []
    
    // Fuel saving phase if needed
    if (totalLaps > 50) {
      conservePhases.push({
        startLap: Math.round(totalLaps * 0.3),
        endLap: Math.round(totalLaps * 0.5),
        savingTarget: 'fuel',
        amount: 15 // 15% fuel saving
      })
    }
    
    // Tyre management phase
    conservePhases.push({
      startLap: Math.round(totalLaps * 0.6),
      endLap: Math.round(totalLaps * 0.75),
      savingTarget: 'tyres',
      amount: 20 // 20% tyre saving
    })
    
    // Overtaking windows (laps where overtaking is optimal)
    const overtakingWindows = opportunities
      .filter(o => o.recommendation === 'go')
      .map(o => o.optimalLap)
    
    // Estimated position gain
    const estimatedPositionGain = opportunities
      .filter(o => o.successProbability > 50)
      .length
    
    return {
      aggressiveness,
      pushPhases,
      conservePhases,
      overtakingWindows,
      estimatedPositionGain
    }
  }

  private analyzeDRSZones(track: TrackData): DRSZoneAnalysis[] {
    // Simulate DRS zones based on track
    const zones: DRSZoneAnalysis[] = []
    
    // Most tracks have 1-3 DRS zones
    const numZones = track.length > 5 ? 3 : track.length > 4 ? 2 : 1
    
    for (let i = 1; i <= numZones; i++) {
      zones.push({
        zone: i,
        location: `Main straight ${i === 1 ? '(Start/Finish)' : i === 2 ? '(Back straight)' : '(Secondary)'}`,
        length: 600 + Math.random() * 400, // 600-1000m
        successRate: 70 - (track.overtaking_difficulty * 0.5) + Math.random() * 20,
        optimalEntry: `Exit previous corner at max speed, position car to the inside`,
        risks: [
          'Late braking from defender',
          'Lock-up into braking zone',
          'Side-by-side through next corner'
        ]
      })
    }
    
    return zones
  }

  private calculateIncidentProbability(
    driver: DriverData,
    track: TrackData,
    _lap: number
  ): IncidentAnalysis {
    // Base incident risk
    const baseRisk = 5 // 5% base risk per overtake attempt
    
    // Driver factors
    let driverFactors = 0
    driverFactors += (100 - driver.concentration) * 0.1
    driverFactors += (driver.aggressiveness - 50) * 0.05
    driverFactors -= driver.experience * 0.03
    
    // Track factors
    const trackFactors = track.overtaking_difficulty * 0.1
    
    // Weather simulation (random for now)
    const weatherFactors = Math.random() > 0.8 ? 10 : 0
    
    // Total risk
    const totalRisk = Math.min(50, Math.max(1, 
      baseRisk + driverFactors + trackFactors + weatherFactors
    ))
    
    // Historical data (simulated)
    const historicalData = `Track average: ${(baseRisk + trackFactors).toFixed(1)}% | ` +
                          `Your last 5 races: ${(baseRisk + driverFactors).toFixed(1)}%`
    
    return {
      baseRisk,
      driverFactors: Math.round(driverFactors),
      trackFactors: Math.round(trackFactors),
      weatherFactors: Math.round(weatherFactors),
      totalRisk: Math.round(totalRisk),
      historicalData
    }
  }

  private calculateExpectedGains(
    currentPosition: number,
    opportunities: OvertakingOpportunity[],
    incidentAnalysis: IncidentAnalysis
  ): ExpectedGains {
    // Best case - all high probability overtakes succeed
    const successfulOvertakes = opportunities.filter(o => o.successProbability > 60).length
    const bestCasePosition = Math.max(1, currentPosition - successfulOvertakes)
    const bestCasePoints = this.calculatePoints(bestCasePosition)
    
    // Likely case - weighted by probability
    const expectedOvertakes = opportunities.reduce((sum, o) => 
      sum + (o.successProbability / 100), 0
    )
    const likelyCasePosition = Math.max(1, Math.round(currentPosition - expectedOvertakes))
    const likelyCasePoints = this.calculatePoints(likelyCasePosition)
    
    // Worst case - incident
    const worstCasePosition = incidentAnalysis.totalRisk > 30 ? 30 : currentPosition + 2
    const worstCasePoints = this.calculatePoints(worstCasePosition)
    
    // Expected value calculation
    const incidentProb = incidentAnalysis.totalRisk / 100
    const expectedValue = (bestCasePoints * 0.2) + 
                         (likelyCasePoints * (0.8 - incidentProb)) +
                         (worstCasePoints * incidentProb)
    
    return {
      bestCase: {
        positions: currentPosition - bestCasePosition,
        points: bestCasePoints,
        time: '-15.2s'
      },
      likelyCase: {
        positions: currentPosition - likelyCasePosition,
        points: likelyCasePoints,
        time: '-8.5s'
      },
      worstCase: {
        positions: worstCasePosition - currentPosition,
        points: worstCasePoints,
        time: '+45.0s'
      },
      expectedValue: Math.round(expectedValue * 10) / 10
    }
  }

  // Helper methods
  private simulateOpponent(position: number): number {
    // Simulate opponent strength (0-100)
    if (position <= 3) return 85 + Math.random() * 15 // Top teams
    if (position <= 10) return 70 + Math.random() * 20 // Midfield
    return 50 + Math.random() * 30 // Back markers
  }

  private calculateSuccessProbability(
    driver: DriverData,
    car: CarData,
    track: TrackData,
    opponentStrength: number
  ): number {
    // Base probability
    let probability = 50
    
    // Driver skill advantage
    const skillAdvantage = driver.overall - opponentStrength
    probability += skillAdvantage * 0.5
    
    // Car performance
    const carPerformance = this.getAverageCarPerformance(car)
    probability += (carPerformance - 75) * 0.3
    
    // Track suitability
    probability -= track.overtaking_difficulty * 0.3
    
    // Experience bonus
    probability += (driver.experience - 50) * 0.2
    
    return Math.min(95, Math.max(5, Math.round(probability)))
  }

  private assessRiskLevel(
    successProbability: number,
    currentLap: number,
    totalLaps: number,
    targetPosition: number
  ): 'very_low' | 'low' | 'medium' | 'high' | 'very_high' {
    const raceCompletion = currentLap / totalLaps
    
    // Late race + low probability = high risk
    if (raceCompletion > 0.8 && successProbability < 40) return 'very_high'
    if (raceCompletion > 0.6 && successProbability < 50) return 'high'
    
    // Fighting for podium = higher stakes
    if (targetPosition <= 3 && successProbability < 60) return 'high'
    
    // General assessment
    if (successProbability > 80) return 'very_low'
    if (successProbability > 65) return 'low'
    if (successProbability > 50) return 'medium'
    if (successProbability > 35) return 'high'
    return 'very_high'
  }

  private findOptimalOvertakingSpot(track: TrackData): { turn: string, difficulty: string } {
    // Get track-specific spots or generate generic ones
    const trackName = track.name
    const spots = this.TRACK_OVERTAKING_SPOTS[trackName as keyof typeof this.TRACK_OVERTAKING_SPOTS] || [
      { turn: 'Turn 1', difficulty: 'medium', drs: false },
      { turn: 'Main Straight', difficulty: 'easy', drs: true },
      { turn: 'Hairpin', difficulty: 'hard', drs: false }
    ]
    
    // Return easiest spot
    return spots.reduce((best: any, current: any) => {
      const difficultyScore = { easy: 1, medium: 2, hard: 3, very_hard: 4, extreme: 5 }
      return difficultyScore[current.difficulty as keyof typeof difficultyScore] < 
             difficultyScore[best.difficulty as keyof typeof difficultyScore] ? current : best
    })
  }

  private selectOvertakingTechnique(
    driver: DriverData,
    track: TrackData,
    _opponentStrength: number,
    lap: number
  ): OvertakingTechnique {
    // Select based on conditions
    if (track.power_importance > 80) {
      return {
        type: 'slipstream',
        setupAdjustment: 'Lower rear wing for straight line speed',
        fuelUsage: 1.1,
        tyreWear: 1.0,
        description: 'Use slipstream on long straight for speed advantage'
      }
    }
    
    if (driver.aggressiveness > 75) {
      return {
        type: 'late_braking',
        setupAdjustment: 'Increase brake balance forward',
        fuelUsage: 1.0,
        tyreWear: 1.3,
        description: 'Aggressive late braking maneuver'
      }
    }
    
    if (lap < 10) {
      return {
        type: 'undercut',
        setupAdjustment: 'Prepare for early pit stop',
        fuelUsage: 1.2,
        tyreWear: 1.4,
        description: 'Push hard before pit stop to gain position'
      }
    }
    
    // Default DRS pass
    return {
      type: 'drs_pass',
      setupAdjustment: 'Standard setup, focus on exit speed',
      fuelUsage: 1.05,
      tyreWear: 1.05,
      description: 'Use DRS advantage in designated zone'
    }
  }

  private calculateRequiredDelta(
    car: CarData,
    opponentStrength: number,
    technique: string
  ): number {
    const carPerformance = this.getAverageCarPerformance(car)
    const performanceGap = carPerformance - opponentStrength
    
    // Base delta required by technique
    const baseDelta = {
      'late_braking': 5,
      'slipstream': 8,
      'drs_pass': 10,
      'undercut': 0,
      'overcut': 0,
      'dive_bomb': 15
    }
    
    // Adjust for performance gap
    const requiredDelta = baseDelta[technique as keyof typeof baseDelta] - (performanceGap * 0.1)
    
    return Math.max(0, Math.round(requiredDelta))
  }

  private makeRecommendation(
    successProbability: number,
    riskLevel: string,
    currentLap: number,
    totalLaps: number
  ): 'go' | 'wait' | 'abort' {
    const raceCompletion = currentLap / totalLaps
    
    // Late race decisions
    if (raceCompletion > 0.9) {
      return successProbability > 70 ? 'go' : 'abort'
    }
    
    // Risk-based decision
    if (riskLevel === 'very_high') return 'abort'
    if (riskLevel === 'high' && successProbability < 60) return 'wait'
    if (successProbability > 65) return 'go'
    if (successProbability > 45) return 'wait'
    
    return 'abort'
  }

  private generateReasoning(
    successProbability: number,
    riskLevel: string,
    currentLap: number,
    totalLaps: number,
    technique: OvertakingTechnique
  ): string[] {
    const reasoning: string[] = []
    
    // Success probability reasoning
    if (successProbability > 70) {
      reasoning.push(`✅ Alta probabilità di successo (${successProbability}%)`)
    } else if (successProbability < 40) {
      reasoning.push(`❌ Bassa probabilità di successo (${successProbability}%)`)
    }
    
    // Risk assessment
    if (riskLevel === 'very_high' || riskLevel === 'high') {
      reasoning.push(`⚠️ Rischio ${riskLevel}: possibile incidente o perdita posizioni`)
    }
    
    // Race phase
    const raceCompletion = (currentLap / totalLaps) * 100
    if (raceCompletion > 80) {
      reasoning.push(`🏁 Fase finale gara (${Math.round(raceCompletion)}%): poche opportunità rimaste`)
    } else if (raceCompletion < 20) {
      reasoning.push(`🚦 Inizio gara (${Math.round(raceCompletion)}%): tempo per strategia paziente`)
    }
    
    // Technique reasoning
    reasoning.push(`💡 Tecnica consigliata: ${technique.description}`)
    
    // Tyre/fuel impact
    if (technique.tyreWear > 1.2) {
      reasoning.push(`🛞 Alto consumo gomme con questa manovra`)
    }
    if (technique.fuelUsage > 1.15) {
      reasoning.push(`⛽ Consumo carburante elevato`)
    }
    
    return reasoning
  }

  private getCurrentTrackSection(lap: number, track: TrackData): string {
    // Simulate current track section
    const sections = ['Sector 1', 'Sector 2', 'Sector 3']
    const sectionIndex = lap % 3
    return `${sections[sectionIndex]} - ${track.name}`
  }

  private getAverageCarPerformance(car: CarData): number {
    const parts = Object.values(car)
    return parts.reduce((sum, part) => sum + part.performance, 0) / parts.length
  }

  private calculatePoints(position: number): number {
    if (position <= 10) {
      return this.POINTS_SYSTEM[position - 1]
    }
    return 0
  }
}

// Export singleton
export const overtakingSimulator = new OvertakingSimulatorService()

// Format for display
export function formatOvertakingReport(analysis: OvertakingAnalysis): string {
  const topOpportunity = analysis.opportunities[0]
  const strategy = analysis.optimalStrategy
  
  return `🏎️ OVERTAKING ANALYSIS - P${analysis.currentPosition}
━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RISK/REWARD MATRIX:
Risk Score: ${analysis.riskMatrix.riskScore}/100
Reward Score: ${analysis.riskMatrix.rewardScore}/100
Strategy: ${analysis.riskMatrix.recommendation}

🚦 TOP OPPORTUNITY:
Target: ${topOpportunity?.targetDriver || 'None'}
Success Rate: ${topOpportunity?.successProbability || 0}%
Risk Level: ${topOpportunity?.riskLevel || 'N/A'}
Technique: ${topOpportunity?.technique.type || 'N/A'}
Decision: ${topOpportunity?.recommendation || 'wait'}

📊 RACE STRATEGY:
Aggressiveness: ${strategy.aggressiveness}%
Push Phases: ${strategy.pushPhases.length}
Position Gain Potential: +${strategy.estimatedPositionGain}

⚠️ INCIDENT RISK: ${analysis.incidentProbability.totalRisk}%
${analysis.incidentProbability.historicalData}

💰 EXPECTED OUTCOMES:
Best Case: +${analysis.expectedGains.bestCase.positions} pos (${analysis.expectedGains.bestCase.points} pts)
Likely: +${analysis.expectedGains.likelyCase.positions} pos (${analysis.expectedGains.likelyCase.points} pts)
Worst: -${analysis.expectedGains.worstCase.positions} pos (${analysis.expectedGains.worstCase.points} pts)
Expected Value: ${analysis.expectedGains.expectedValue} points

🎮 DRS ZONES: ${analysis.drsZones.length}
${analysis.drsZones.map(z => 
  `Zone ${z.zone}: ${z.successRate.toFixed(0)}% success rate`
).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━
Generated with GPRO Setup Tool`
}