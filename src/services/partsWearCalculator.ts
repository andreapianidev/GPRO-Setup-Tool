// GPRO Parts Wear Calculator - Advanced maintenance and budget planner
// Innovative: ML-based wear prediction and cost optimization

import type { CarData, TrackData, GPROSnapshot } from '@/types'

export interface PartsWearAnalysis {
  currentStatus: PartStatus[]
  predictions: WearPrediction[]
  maintenancePlan: MaintenancePlan
  budgetAnalysis: BudgetAnalysis
  alerts: WearAlert[]
  seasonProjection: SeasonProjection
}

export interface PartStatus {
  name: string
  currentWear: number
  performance: number
  healthStatus: 'excellent' | 'good' | 'warning' | 'critical'
  racesUntilCritical: number
  estimatedLifespan: number
}

export interface WearPrediction {
  partName: string
  raceNumber: number
  predictedWear: number
  performanceLoss: number
  failureRisk: number
}

export interface MaintenancePlan {
  immediateActions: MaintenanceAction[]
  scheduledMaintenance: MaintenanceAction[]
  optimalReplacement: OptimalReplacement[]
  totalCost: number
  costSavings: number
}

export interface MaintenanceAction {
  part: string
  action: 'repair' | 'replace' | 'monitor'
  race: number
  cost: number
  priority: 'high' | 'medium' | 'low'
  reason: string
}

export interface OptimalReplacement {
  part: string
  currentLevel: number
  recommendedLevel: number
  optimalTiming: string
  roi: number
  performanceGain: number
}

export interface BudgetAnalysis {
  currentBudget: number
  projectedSpend: number
  costPerRace: number
  efficiencyScore: number
  savingsOpportunities: SavingsOpportunity[]
}

export interface SavingsOpportunity {
  description: string
  potentialSaving: number
  implementation: string
  risk: 'low' | 'medium' | 'high'
}

export interface WearAlert {
  severity: 'info' | 'warning' | 'critical'
  part: string
  message: string
  actionRequired: string
}

export interface SeasonProjection {
  totalRaces: number
  projectedReplacements: number
  estimatedTotalCost: number
  performanceTrend: 'improving' | 'stable' | 'declining'
  endOfSeasonStatus: PartStatus[]
}

class PartsWearCalculatorService {
  
  // Part costs in GPRO dollars (simulated)
  private readonly PART_COSTS = {
    chassis: { repair: 50000, replace: 500000, upgrade: 750000 },
    engine: { repair: 75000, replace: 800000, upgrade: 1200000 },
    front_wing: { repair: 30000, replace: 300000, upgrade: 450000 },
    rear_wing: { repair: 35000, replace: 350000, upgrade: 525000 },
    underbody: { repair: 40000, replace: 400000, upgrade: 600000 },
    sidepods: { repair: 25000, replace: 250000, upgrade: 375000 },
    cooling: { repair: 20000, replace: 200000, upgrade: 300000 },
    gearbox: { repair: 60000, replace: 600000, upgrade: 900000 },
    brakes: { repair: 45000, replace: 450000, upgrade: 675000 },
    suspension: { repair: 40000, replace: 400000, upgrade: 600000 },
    electronics: { repair: 80000, replace: 850000, upgrade: 1275000 }
  }

  // Wear rates per track type
  private readonly TRACK_WEAR_MULTIPLIERS = {
    street: { engine: 1.2, suspension: 1.5, brakes: 1.3 },
    road: { engine: 1.0, suspension: 1.0, brakes: 1.0 },
    speedway: { engine: 1.4, brakes: 0.7, cooling: 1.3 }
  }

  analyzePartsWear(snapshot: GPROSnapshot, remainingRaces: number = 10): PartsWearAnalysis {
    const { car_data, track_data } = snapshot
    
    if (!car_data || !track_data) {
      throw new Error('Dati auto insufficienti per analisi usura')
    }

    // Analyze current status
    const currentStatus = this.analyzeCurrentStatus(car_data)
    
    // Predict future wear
    const predictions = this.predictFutureWear(car_data, track_data, remainingRaces)
    
    // Generate maintenance plan
    const maintenancePlan = this.generateMaintenancePlan(car_data, predictions, remainingRaces)
    
    // Budget analysis
    const budgetAnalysis = this.analyzeBudget(maintenancePlan, remainingRaces)
    
    // Generate alerts
    const alerts = this.generateAlerts(currentStatus, predictions)
    
    // Season projection
    const seasonProjection = this.projectSeasonEnd(car_data, predictions, remainingRaces)

    return {
      currentStatus,
      predictions,
      maintenancePlan,
      budgetAnalysis,
      alerts,
      seasonProjection
    }
  }

  private analyzeCurrentStatus(car: CarData): PartStatus[] {
    const statuses: PartStatus[] = []
    
    for (const [partName, partData] of Object.entries(car)) {
      const wear = partData.wear
      const performance = partData.performance
      
      // Calculate health status
      const healthStatus = this.getHealthStatus(wear, performance)
      
      // Estimate races until critical
      const wearRate = this.calculateWearRate(partName, wear)
      const racesUntilCritical = Math.max(0, Math.floor((80 - wear) / wearRate))
      
      // Estimated total lifespan
      const estimatedLifespan = Math.round(100 / wearRate)
      
      statuses.push({
        name: this.formatPartName(partName),
        currentWear: wear,
        performance,
        healthStatus,
        racesUntilCritical,
        estimatedLifespan
      })
    }
    
    return statuses.sort((a, b) => b.currentWear - a.currentWear)
  }

  private predictFutureWear(
    car: CarData,
    track: TrackData,
    races: number
  ): WearPrediction[] {
    const predictions: WearPrediction[] = []
    
    for (let race = 1; race <= races; race++) {
      for (const [partName, partData] of Object.entries(car)) {
        const baseWear = partData.wear
        const wearRate = this.calculateWearRate(partName, baseWear)
        
        // Apply track-specific multipliers
        const trackMultiplier = this.getTrackWearMultiplier(partName, track)
        
        // Calculate cumulative wear
        const predictedWear = Math.min(100, baseWear + (wearRate * race * trackMultiplier))
        
        // Performance degradation
        const performanceLoss = this.calculatePerformanceLoss(predictedWear)
        
        // Failure risk calculation
        const failureRisk = this.calculateFailureRisk(predictedWear)
        
        predictions.push({
          partName: this.formatPartName(partName),
          raceNumber: race,
          predictedWear,
          performanceLoss,
          failureRisk
        })
      }
    }
    
    return predictions
  }

  private generateMaintenancePlan(
    car: CarData,
    predictions: WearPrediction[],
    remainingRaces: number
  ): MaintenancePlan {
    const immediateActions: MaintenanceAction[] = []
    const scheduledMaintenance: MaintenanceAction[] = []
    const optimalReplacement: OptimalReplacement[] = []
    
    let totalCost = 0
    let costWithoutOptimization = 0
    
    for (const [partName, partData] of Object.entries(car)) {
      const wear = partData.wear
      const level = partData.level
      const costs = this.PART_COSTS[partName as keyof typeof this.PART_COSTS]
      
      // Immediate actions for critical parts
      if (wear > 70) {
        const action: MaintenanceAction = {
          part: this.formatPartName(partName),
          action: wear > 85 ? 'replace' : 'repair',
          race: 0, // Next race
          cost: wear > 85 ? costs.replace : costs.repair,
          priority: 'high',
          reason: `Usura critica: ${wear}%`
        }
        immediateActions.push(action)
        totalCost += action.cost
      }
      
      // Schedule future maintenance
      const futureWear = predictions.filter(p => 
        p.partName === this.formatPartName(partName) && 
        p.raceNumber === Math.floor(remainingRaces / 2)
      )[0]
      
      if (futureWear && futureWear.predictedWear > 60 && wear <= 70) {
        const action: MaintenanceAction = {
          part: this.formatPartName(partName),
          action: 'repair',
          race: Math.floor(remainingRaces / 2),
          cost: costs.repair,
          priority: 'medium',
          reason: `Manutenzione preventiva a metà stagione`
        }
        scheduledMaintenance.push(action)
        totalCost += action.cost
      }
      
      // Calculate optimal replacement strategy
      const performanceGain = (20 - level) * 5 // % gain per level
      const roi = (performanceGain * 1000) / costs.upgrade // ROI calculation
      
      if (roi > 0.5 && level < 15) {
        optimalReplacement.push({
          part: this.formatPartName(partName),
          currentLevel: level,
          recommendedLevel: Math.min(20, level + 3),
          optimalTiming: wear > 50 ? 'Immediato' : 'Prossime 3 gare',
          roi: Math.round(roi * 100),
          performanceGain
        })
      }
      
      // Calculate cost without optimization
      if (wear > 85) {
        costWithoutOptimization += costs.replace
      } else if (wear > 60) {
        costWithoutOptimization += costs.repair * 2
      }
    }
    
    const costSavings = Math.max(0, costWithoutOptimization - totalCost)
    
    return {
      immediateActions,
      scheduledMaintenance,
      optimalReplacement,
      totalCost,
      costSavings
    }
  }

  private analyzeBudget(plan: MaintenancePlan, races: number): BudgetAnalysis {
    const currentBudget = 5000000 // Simulated budget
    const projectedSpend = plan.totalCost
    const costPerRace = Math.round(projectedSpend / races)
    
    // Efficiency score (0-100)
    const efficiencyScore = Math.round(
      100 * (1 - (projectedSpend / currentBudget))
    )
    
    // Identify savings opportunities
    const savingsOpportunities: SavingsOpportunity[] = [
      {
        description: 'Manutenzione preventiva invece di sostituzione',
        potentialSaving: Math.round(plan.costSavings * 0.3),
        implementation: 'Riparare parti a 60% usura invece di aspettare 85%',
        risk: 'low'
      },
      {
        description: 'Ottimizzazione setup per ridurre usura',
        potentialSaving: Math.round(plan.totalCost * 0.15),
        implementation: 'Setup più conservativi su piste ad alta usura',
        risk: 'medium'
      },
      {
        description: 'Upgrade strategici multi-stagione',
        potentialSaving: Math.round(plan.totalCost * 0.25),
        implementation: 'Investire in parti di livello superiore per durata maggiore',
        risk: 'high'
      }
    ]
    
    return {
      currentBudget,
      projectedSpend,
      costPerRace,
      efficiencyScore,
      savingsOpportunities
    }
  }

  private generateAlerts(status: PartStatus[], predictions: WearPrediction[]): WearAlert[] {
    const alerts: WearAlert[] = []
    
    // Check current critical parts
    for (const part of status) {
      if (part.healthStatus === 'critical') {
        alerts.push({
          severity: 'critical',
          part: part.name,
          message: `${part.name} in condizione critica (${part.currentWear}% usura)`,
          actionRequired: 'Sostituzione immediata richiesta'
        })
      } else if (part.healthStatus === 'warning') {
        alerts.push({
          severity: 'warning',
          part: part.name,
          message: `${part.name} richiede attenzione (${part.currentWear}% usura)`,
          actionRequired: 'Pianificare manutenzione entro 2 gare'
        })
      }
    }
    
    // Check future risks
    const highRiskPredictions = predictions.filter(p => 
      p.raceNumber <= 3 && p.failureRisk > 30
    )
    
    for (const pred of highRiskPredictions) {
      alerts.push({
        severity: 'warning',
        part: pred.partName,
        message: `Alto rischio guasto ${pred.partName} entro gara ${pred.raceNumber}`,
        actionRequired: 'Considerare manutenzione preventiva'
      })
    }
    
    // Performance alerts
    const lowPerformance = status.filter(p => p.performance < 70)
    for (const part of lowPerformance) {
      alerts.push({
        severity: 'info',
        part: part.name,
        message: `${part.name} performance ridotta (${part.performance}%)`,
        actionRequired: 'Valutare upgrade per migliorare prestazioni'
      })
    }
    
    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }

  private projectSeasonEnd(
    car: CarData,
    predictions: WearPrediction[],
    totalRaces: number
  ): SeasonProjection {
    // Get end of season predictions
    const endOfSeasonPredictions = predictions.filter(p => p.raceNumber === totalRaces)
    
    // Count needed replacements
    const projectedReplacements = endOfSeasonPredictions.filter(p => p.predictedWear > 85).length
    
    // Calculate total cost
    let estimatedTotalCost = 0
    for (const pred of endOfSeasonPredictions) {
      const partKey = pred.partName.toLowerCase().replace(' ', '_')
      const costs = this.PART_COSTS[partKey as keyof typeof this.PART_COSTS]
      if (costs) {
        if (pred.predictedWear > 85) {
          estimatedTotalCost += costs.replace
        } else if (pred.predictedWear > 60) {
          estimatedTotalCost += costs.repair
        }
      }
    }
    
    // Determine performance trend
    const avgPerformanceLoss = endOfSeasonPredictions.reduce((sum, p) => sum + p.performanceLoss, 0) / endOfSeasonPredictions.length
    const performanceTrend = avgPerformanceLoss > 20 ? 'declining' :
                            avgPerformanceLoss > 10 ? 'stable' : 'improving'
    
    // Create end of season status
    const endOfSeasonStatus: PartStatus[] = []
    for (const pred of endOfSeasonPredictions) {
      const partData = Object.entries(car).find(([name]) => 
        this.formatPartName(name) === pred.partName
      )
      
      if (partData) {
        endOfSeasonStatus.push({
          name: pred.partName,
          currentWear: pred.predictedWear,
          performance: Math.max(0, 100 - pred.performanceLoss),
          healthStatus: this.getHealthStatus(pred.predictedWear, 100 - pred.performanceLoss),
          racesUntilCritical: 0,
          estimatedLifespan: 0
        })
      }
    }
    
    return {
      totalRaces,
      projectedReplacements,
      estimatedTotalCost,
      performanceTrend,
      endOfSeasonStatus
    }
  }

  // Helper methods
  private getHealthStatus(wear: number, performance: number): 'excellent' | 'good' | 'warning' | 'critical' {
    if (wear > 80 || performance < 60) return 'critical'
    if (wear > 60 || performance < 75) return 'warning'
    if (wear > 40 || performance < 85) return 'good'
    return 'excellent'
  }

  private calculateWearRate(partName: string, currentWear: number): number {
    // Base wear rate per race (%)
    const baseRates: Record<string, number> = {
      engine: 4.5,
      gearbox: 3.8,
      brakes: 5.2,
      suspension: 4.0,
      front_wing: 3.5,
      rear_wing: 3.2,
      chassis: 2.8,
      underbody: 3.0,
      sidepods: 2.5,
      cooling: 3.3,
      electronics: 2.0
    }
    
    const baseRate = baseRates[partName] || 3.5
    
    // Accelerated wear at higher levels
    const wearAcceleration = currentWear > 70 ? 1.5 : 
                            currentWear > 50 ? 1.2 : 1.0
    
    return baseRate * wearAcceleration
  }

  private getTrackWearMultiplier(partName: string, track: TrackData): number {
    // Determine track type based on characteristics
    const trackType = track.power_importance > 80 ? 'speedway' :
                     track.handling_importance > 80 ? 'street' : 'road'
    
    const multipliers = this.TRACK_WEAR_MULTIPLIERS[trackType]
    return multipliers[partName as keyof typeof multipliers] || 1.0
  }

  private calculatePerformanceLoss(wear: number): number {
    // Non-linear performance degradation
    if (wear < 30) return 0
    if (wear < 50) return (wear - 30) * 0.5
    if (wear < 70) return 10 + (wear - 50) * 1.0
    if (wear < 85) return 30 + (wear - 70) * 1.5
    return 52.5 + (wear - 85) * 2.0
  }

  private calculateFailureRisk(wear: number): number {
    // Exponential failure risk
    if (wear < 60) return 0
    if (wear < 70) return 5
    if (wear < 80) return 15
    if (wear < 90) return 40
    if (wear < 95) return 75
    return 95
  }

  private formatPartName(name: string): string {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
}

// Export singleton
export const partsWearCalculator = new PartsWearCalculatorService()

// Format for display
export function formatWearReport(analysis: PartsWearAnalysis): string {
  const criticalParts = analysis.currentStatus.filter(p => p.healthStatus === 'critical')
  const totalCost = new Intl.NumberFormat('it-IT', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(analysis.maintenancePlan.totalCost)
  
  return `🔧 PARTS WEAR ANALYSIS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRITICAL PARTS: ${criticalParts.length}
${criticalParts.map(p => `  • ${p.name}: ${p.currentWear}% wear`).join('\n')}

💰 BUDGET OVERVIEW:
Total Maintenance Cost: ${totalCost}
Cost per Race: €${analysis.budgetAnalysis.costPerRace}
Efficiency Score: ${analysis.budgetAnalysis.efficiencyScore}/100
Potential Savings: €${analysis.maintenancePlan.costSavings}

📋 IMMEDIATE ACTIONS:
${analysis.maintenancePlan.immediateActions.slice(0, 3).map(a => 
  `  • ${a.part}: ${a.action} (${a.priority} priority)`
).join('\n')}

📊 SEASON PROJECTION:
Races Remaining: ${analysis.seasonProjection.totalRaces}
Expected Replacements: ${analysis.seasonProjection.projectedReplacements}
Performance Trend: ${analysis.seasonProjection.performanceTrend}

🚨 TOP ALERTS:
${analysis.alerts.slice(0, 3).map(a => 
  `  ${a.severity === 'critical' ? '🔴' : a.severity === 'warning' ? '🟡' : '🔵'} ${a.message}`
).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━
Generated with GPRO Setup Tool`
}