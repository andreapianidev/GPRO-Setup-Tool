import { useState } from 'react'
import { 
  Trophy, 
  Wrench, 
  TrendingUp, 
  AlertTriangle,
  Zap,
  DollarSign,
  BarChart3,
  Target,
  Clock,
  Shield
} from 'lucide-react'
import { qualifyingSimulator } from '@/services/qualifyingSimulator'
import { partsWearCalculator } from '@/services/partsWearCalculator'
import { overtakingSimulator } from '@/services/overtakingSimulator'
import type { GPROSnapshot } from '@/types'

export default function AdvancedTools() {
  const [activeTab, setActiveTab] = useState<'qualifying' | 'parts' | 'overtaking'>('qualifying')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  
  // Mock snapshot for demo
  const mockSnapshot: GPROSnapshot = {
    id: 'demo',
    user_id: 'demo-user',
    manager_data: null,
    driver_data: {
      name: 'Demo Driver',
      overall: 82,
      concentration: 88,
      talent: 75,
      aggressiveness: 70,
      experience: 85,
      technical_insight: 78,
      stamina: 90,
      charisma: 72,
      motivation: 85,
      weight: 70,
      age: 28
    },
    car_data: {
      chassis: { level: 16, wear: 35, performance: 85 },
      engine: { level: 18, wear: 42, performance: 88 },
      front_wing: { level: 14, wear: 28, performance: 82 },
      rear_wing: { level: 15, wear: 30, performance: 84 },
      underbody: { level: 17, wear: 25, performance: 90 },
      sidepods: { level: 13, wear: 38, performance: 78 },
      cooling: { level: 12, wear: 45, performance: 75 },
      gearbox: { level: 19, wear: 20, performance: 92 },
      brakes: { level: 16, wear: 55, performance: 80 },
      suspension: { level: 15, wear: 48, performance: 82 },
      electronics: { level: 20, wear: 15, performance: 95 }
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

  const runQualifyingSimulation = async () => {
    setLoading(true)
    try {
      const result = qualifyingSimulator.simulateQualifying(mockSnapshot)
      setResults(result)
    } catch (error) {
      console.error('Qualifying simulation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const runPartsAnalysis = async () => {
    setLoading(true)
    try {
      const result = partsWearCalculator.analyzePartsWear(mockSnapshot, 10)
      setResults(result)
    } catch (error) {
      console.error('Parts analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const runOvertakingAnalysis = async () => {
    setLoading(true)
    try {
      const result = overtakingSimulator.analyzeOvertaking(mockSnapshot, 8, 25, 53)
      setResults(result)
    } catch (error) {
      console.error('Overtaking analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gpro-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 Advanced Racing Tools
          </h1>
          <p className="text-gray-300">
            Funzionalità innovative esclusive per dominare in GPRO
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gpro-900/50 backdrop-blur-sm rounded-xl p-1 flex gap-2">
            <button
              onClick={() => setActiveTab('qualifying')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'qualifying'
                  ? 'bg-gradient-to-r from-racing-red to-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gpro-700/50'
              }`}
            >
              <Trophy className="inline-block mr-2 h-5 w-5" />
              Qualifying Simulator
            </button>
            <button
              onClick={() => setActiveTab('parts')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'parts'
                  ? 'bg-gradient-to-r from-racing-red to-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gpro-700/50'
              }`}
            >
              <Wrench className="inline-block mr-2 h-5 w-5" />
              Parts Wear Analysis
            </button>
            <button
              onClick={() => setActiveTab('overtaking')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'overtaking'
                  ? 'bg-gradient-to-r from-racing-red to-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gpro-700/50'
              }`}
            >
              <Zap className="inline-block mr-2 h-5 w-5" />
              Overtaking Risk/Reward
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tool Description Card */}
          <div className="lg:col-span-1">
            <div className="bg-gpro-900/50 backdrop-blur-sm rounded-xl p-6 border border-gpro-700">
              {activeTab === 'qualifying' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Trophy className="mr-2 text-racing-yellow" />
                    Qualifying Predictor
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Simula la tua qualifica con precisione AI-powered. Prevedi la posizione in griglia,
                    analizza i competitor e ottimizza la strategia Q1/Q2.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-400">
                      <Target className="mr-2 h-4 w-4 text-racing-red" />
                      Predizione posizione griglia
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="mr-2 h-4 w-4 text-racing-red" />
                      Tempi ottimali Q1/Q2
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <BarChart3 className="mr-2 h-4 w-4 text-racing-red" />
                      Analisi competitor threats
                    </div>
                  </div>
                  <button
                    onClick={runQualifyingSimulation}
                    disabled={loading}
                    className="mt-6 w-full bg-gradient-to-r from-racing-red to-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:from-racing-red/90 hover:to-orange-500/90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Simulazione...' : 'Avvia Simulazione'}
                  </button>
                </>
              )}

              {activeTab === 'parts' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Wrench className="mr-2 text-racing-yellow" />
                    Parts Management
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Analisi avanzata usura parti con ML prediction. Ottimizza budget,
                    pianifica sostituzioni e massimizza performance/costo.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-400">
                      <DollarSign className="mr-2 h-4 w-4 text-racing-red" />
                      Budget optimization
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <AlertTriangle className="mr-2 h-4 w-4 text-racing-red" />
                      Failure risk prediction
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <TrendingUp className="mr-2 h-4 w-4 text-racing-red" />
                      ROI analysis per upgrade
                    </div>
                  </div>
                  <button
                    onClick={runPartsAnalysis}
                    disabled={loading}
                    className="mt-6 w-full bg-gradient-to-r from-racing-red to-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:from-racing-red/90 hover:to-orange-500/90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Analisi...' : 'Analizza Usura'}
                  </button>
                </>
              )}

              {activeTab === 'overtaking' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Zap className="mr-2 text-racing-yellow" />
                    Overtaking Matrix
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Rivoluzionaria matrice risk/reward per decisioni di sorpasso.
                    Calcola probabilità successo, incident risk e expected gains.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-400">
                      <Shield className="mr-2 h-4 w-4 text-racing-red" />
                      Risk assessment matrix
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Target className="mr-2 h-4 w-4 text-racing-red" />
                      Success probability AI
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <TrendingUp className="mr-2 h-4 w-4 text-racing-red" />
                      Expected value calculation
                    </div>
                  </div>
                  <button
                    onClick={runOvertakingAnalysis}
                    disabled={loading}
                    className="mt-6 w-full bg-gradient-to-r from-racing-red to-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:from-racing-red/90 hover:to-orange-500/90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Calcolo...' : 'Analizza Overtaking'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2">
            <div className="bg-gpro-900/50 backdrop-blur-sm rounded-xl p-6 border border-gpro-700 min-h-[500px]">
              {!results ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏎️</div>
                    <p className="text-gray-400">
                      Seleziona un tool e avvia la simulazione per vedere i risultati
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Qualifying Results */}
                  {activeTab === 'qualifying' && results.predictedPosition && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Predicted Grid</div>
                          <div className="text-3xl font-bold text-white">
                            P{results.predictedPosition}
                          </div>
                          {results.gridPenalty > 0 && (
                            <div className="text-sm text-racing-red">
                              +{results.gridPenalty} penalty
                            </div>
                          )}
                        </div>
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Confidence</div>
                          <div className="text-3xl font-bold text-white">
                            {results.confidence}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-2">Q1 Time</div>
                          <div className="text-xl font-mono text-white">{results.q1Time}</div>
                        </div>
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-2">Q2 Time</div>
                          <div className="text-xl font-mono text-white">{results.q2Time}</div>
                        </div>
                      </div>

                      <div className="bg-gpro-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3">Top Competitors</h3>
                        <div className="space-y-2">
                          {results.competitors?.slice(0, 3).map((comp: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-gray-300">P{comp.position}</span>
                              <span className="font-mono text-sm">{comp.expectedTime}</span>
                              <span className={`text-sm px-2 py-1 rounded ${
                                comp.threat_level === 'high' ? 'bg-red-500/20 text-red-400' :
                                comp.threat_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {comp.threat_level} threat
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {results.riskFactors?.length > 0 && (
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <h3 className="text-lg font-bold text-white mb-3">Risk Factors</h3>
                          <div className="space-y-1">
                            {results.riskFactors.map((risk: string, idx: number) => (
                              <div key={idx} className="text-sm text-gray-300">{risk}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Parts Wear Results */}
                  {activeTab === 'parts' && results.currentStatus && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Total Cost</div>
                          <div className="text-2xl font-bold text-white">
                            €{(results.maintenancePlan?.totalCost || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Efficiency</div>
                          <div className="text-2xl font-bold text-white">
                            {results.budgetAnalysis?.efficiencyScore || 0}/100
                          </div>
                        </div>
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Savings</div>
                          <div className="text-2xl font-bold text-green-400">
                            €{(results.maintenancePlan?.costSavings || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gpro-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-3">Critical Parts</h3>
                        <div className="space-y-2">
                          {results.currentStatus?.filter((p: any) => p.healthStatus === 'critical' || p.healthStatus === 'warning').map((part: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-gray-300">{part.name}</span>
                              <div className="flex items-center gap-4">
                                <div className="text-sm">
                                  <span className="text-gray-400">Wear: </span>
                                  <span className={part.currentWear > 70 ? 'text-red-400' : 'text-yellow-400'}>
                                    {part.currentWear}%
                                  </span>
                                </div>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  part.healthStatus === 'critical' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {part.healthStatus}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {results.alerts && results.alerts.length > 0 && (
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <h3 className="text-lg font-bold text-white mb-3">Alerts</h3>
                          <div className="space-y-2">
                            {results.alerts.slice(0, 5).map((alert: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className={
                                  alert.severity === 'critical' ? 'text-red-400' :
                                  alert.severity === 'warning' ? 'text-yellow-400' :
                                  'text-blue-400'
                                }>●</span>
                                <div className="flex-1">
                                  <div className="text-sm text-gray-300">{alert.message}</div>
                                  <div className="text-xs text-gray-500">{alert.actionRequired}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Overtaking Results */}
                  {activeTab === 'overtaking' && results.riskMatrix && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Risk Score</div>
                          <div className="text-3xl font-bold text-white">
                            {results.riskMatrix.riskScore}/100
                          </div>
                        </div>
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Reward Score</div>
                          <div className="text-3xl font-bold text-white">
                            {results.riskMatrix.rewardScore}/100
                          </div>
                        </div>
                      </div>

                      <div className="bg-gpro-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-white mb-2">Strategy Recommendation</h3>
                        <p className="text-racing-yellow text-lg">{results.riskMatrix.recommendation}</p>
                      </div>

                      {results.opportunities && results.opportunities.length > 0 && (
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <h3 className="text-lg font-bold text-white mb-3">Overtaking Opportunities</h3>
                          <div className="space-y-3">
                            {results.opportunities.slice(0, 3).map((opp: any, idx: number) => (
                              <div key={idx} className="border-l-4 border-racing-red pl-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <span className="text-white font-medium">{opp.targetDriver}</span>
                                    <span className="ml-2 text-sm text-gray-400">Lap {opp.optimalLap}</span>
                                  </div>
                                  <span className={`text-sm px-2 py-1 rounded ${
                                    opp.recommendation === 'go' ? 'bg-green-500/20 text-green-400' :
                                    opp.recommendation === 'wait' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {opp.recommendation.toUpperCase()}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-400">Success: </span>
                                    <span className="text-white">{opp.successProbability}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Risk: </span>
                                    <span className={
                                      opp.riskLevel === 'very_high' || opp.riskLevel === 'high' ? 'text-red-400' :
                                      opp.riskLevel === 'medium' ? 'text-yellow-400' :
                                      'text-green-400'
                                    }>{opp.riskLevel}</span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {opp.technique.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.expectedGains && (
                        <div className="bg-gpro-800/50 rounded-lg p-4">
                          <h3 className="text-lg font-bold text-white mb-3">Expected Outcomes</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-400 mb-1">Best Case</div>
                              <div className="text-green-400 font-bold">
                                +{results.expectedGains.bestCase.positions} pos
                              </div>
                              <div className="text-xs text-gray-500">
                                {results.expectedGains.bestCase.points} pts
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-400 mb-1">Likely</div>
                              <div className="text-yellow-400 font-bold">
                                +{results.expectedGains.likelyCase.positions} pos
                              </div>
                              <div className="text-xs text-gray-500">
                                {results.expectedGains.likelyCase.points} pts
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-400 mb-1">Worst Case</div>
                              <div className="text-red-400 font-bold">
                                -{results.expectedGains.worstCase.positions} pos
                              </div>
                              <div className="text-xs text-gray-500">
                                {results.expectedGains.worstCase.points} pts
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}