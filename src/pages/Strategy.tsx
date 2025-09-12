// GPRO Setup Tool - Strategy Advisor Page

import React, { useState } from 'react';
import {
  Fuel,
  Gauge,
  BarChart3,
  GitCompare,
  CloudRain,
  Timer,
  Target,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { mockRaceWeekend } from '../services/mockData';
import { WeatherCondition } from '../types/gpro';
import { 
  calculateAdvancedFuel, 
  getAdvancedTyreRecommendation,
  generateStrategyScenarios,
  generatePitStopAnalysis
} from '../utils/strategyCalculations';

type StrategyModule = 'fuel' | 'tyre' | 'pit' | 'scenario' | 'crossover';

const Strategy: React.FC = () => {
  const [activeModule, setActiveModule] = useState<StrategyModule>('fuel');
  const [fuelLaps, setFuelLaps] = useState(65);
  const [pitWindow, setPitWindow] = useState({ start: 25, end: 35 });
  const [weatherScenario, setWeatherScenario] = useState<WeatherCondition['type']>('Sunny');
  const [currentRaceWeekend] = useState(mockRaceWeekend);

  const track = currentRaceWeekend.track;

  const modules = [
    {
      id: 'fuel' as StrategyModule,
      name: 'Fuel Safety Coach',
      icon: Fuel,
      description: 'Calcoli carburante ottimali',
      color: 'bg-blue-600'
    },
    {
      id: 'tyre' as StrategyModule,
      name: 'Tyre & Pit Advisor',
      icon: Gauge,
      description: 'Consigli gomme e pit stop',
      color: 'bg-green-600'
    },
    {
      id: 'pit' as StrategyModule,
      name: 'Pit Loss Visualizer',
      icon: BarChart3,
      description: 'Visualizza perdite pit stop',
      color: 'bg-purple-600'
    },
    {
      id: 'scenario' as StrategyModule,
      name: 'Scenario Compare',
      icon: GitCompare,
      description: 'Confronta strategie A/B/C',
      color: 'bg-orange-600'
    },
    {
      id: 'crossover' as StrategyModule,
      name: 'Crossover Radar',
      icon: CloudRain,
      description: 'Analisi condizioni pioggia',
      color: 'bg-indigo-600'
    }
  ];

  const calculateFuelConsumption = () => {
    return calculateAdvancedFuel(track, fuelLaps, 85, 80);
  };

  const getTyreRecommendation = () => {
    return getAdvancedTyreRecommendation(track, 85, 80);
  };

  const getPitStopData = () => {
    return generatePitStopAnalysis(track.laps);
  };

  const getScenarioComparison = () => {
    const tyre = getTyreRecommendation();
    const scenarios = generateStrategyScenarios(track, tyre, track.laps);
    
    return {
      scenarioA: scenarios[0],
      scenarioB: scenarios[1], 
      scenarioC: scenarios[2]
    };
  };

  const renderFuelCoach = () => {
    const fuel = calculateFuelConsumption();
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Fuel className="w-5 h-5 mr-2 text-blue-400" />
            Calcolo Carburante
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Numero di giri
              </label>
              <input
                type="number"
                value={fuelLaps}
                onChange={(e) => setFuelLaps(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="100"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-300">Consumo per giro:</span>
                <span className="text-white font-semibold">{fuel.perLap} L</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                <span className="text-slate-300">Carburante totale:</span>
                <span className="text-blue-400 font-semibold">{fuel.total} L</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-600/20 rounded-lg border border-green-500/30">
                <span className="text-slate-300">Con margine sicurezza:</span>
                <span className="text-green-400 font-semibold">{fuel.safety} L</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-300">Efficienza:</span>
                <span className={`font-semibold ${
                  fuel.efficiency === 'optimal' ? 'text-green-400' :
                  fuel.efficiency === 'good' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {fuel.efficiency === 'optimal' ? 'Ottimale' : 
                   fuel.efficiency === 'good' ? 'Buona' : 'Scarsa'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center">
            <Info className="w-4 h-4 mr-2 text-blue-400" />
            Raccomandazione
          </h4>
          
          <div className="mb-4 p-3 bg-blue-600/10 rounded-lg border border-blue-500/20">
            <p className="text-slate-300 text-sm">{fuel.recommendation}</p>
          </div>
          
          <h5 className="text-md font-semibold text-white mb-3">Fattori che influenzano il consumo</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="text-sm text-slate-400">Circuito</div>
              <div className="text-white font-medium">{track.name}</div>
              <div className="text-xs text-slate-500">Moltiplicatore: {1.0}x</div>
            </div>
            
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="text-sm text-slate-400">Meteo</div>
              <div className="text-white font-medium">{track.weather[0]?.type || 'Sunny'}</div>
              <div className="text-xs text-slate-500">
                {(track.weather[0]?.type === 'Light Rain' || track.weather[0]?.type === 'Heavy Rain') ? '+15% consumo' : 'Normale'}
              </div>
            </div>
            
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="text-sm text-slate-400">Temperatura</div>
              <div className="text-white font-medium">{track.weather[0]?.temperature || 25}°C</div>
              <div className="text-xs text-slate-500">Influenza degradazione</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTyreAdvisor = () => {
    const recommendation = getTyreRecommendation();
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-green-400" />
            Raccomandazioni Gomme
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-600/20 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 font-semibold">Gomma Primaria</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-white text-xl font-bold">{recommendation.primary}</div>
                <div className="text-sm text-slate-400">{recommendation.reason}</div>
                <div className="text-xs text-green-400 mt-1">Confidenza: {recommendation.confidence}%</div>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 font-semibold">Gomma Secondaria</span>
                  <Info className="w-5 h-5 text-slate-400" />
                </div>
                <div className="text-white text-xl font-bold">{recommendation.secondary}</div>
                <div className="text-sm text-slate-400">Opzione alternativa</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Condizioni Attuali</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-400">Temperatura pista:</span>
                  <span className="text-white">{(track.weather[0]?.temperature || 25) + 15}°C</span>
                </div>
                
                <div className="flex justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-400">Umidità:</span>
                  <span className="text-white">{track.weather[0]?.humidity || 60}%</span>
                </div>
                
                <div className="flex justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-400">Vento:</span>
                  <span className="text-white">{track.weather[0]?.windSpeed || 10} km/h</span>
                </div>
                
                <div className="flex justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-400">Grip pista:</span>
                  <span className="text-white">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-white mb-4">Finestra Pit Stop Ottimale</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Giro inizio finestra
              </label>
              <input
                type="number"
                value={pitWindow.start}
                onChange={(e) => setPitWindow({...pitWindow, start: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                max="70"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Giro fine finestra
              </label>
              <input
                type="number"
                value={pitWindow.end}
                onChange={(e) => setPitWindow({...pitWindow, end: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                max="70"
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-600/10 rounded-lg border border-green-500/20">
            <div className="text-green-400 font-medium">Finestra ottimale: Giri {pitWindow.start}-{pitWindow.end}</div>
            <div className="text-sm text-slate-400 mt-1">
              Basata su degradazione gomme e traffico previsto
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPitVisualizer = () => {
    const pitData = getPitStopData();
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
            Analisi Perdite Pit Stop
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Giro</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Tempo Pit</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Posizione</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Cambio Gomme</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Perdita</th>
                </tr>
              </thead>
              <tbody>
                {pitData.map((pit, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white font-medium">{pit.lap}</td>
                    <td className="py-3 px-4 text-white">{pit.time}s</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        pit.position <= 5 ? 'bg-green-600/20 text-green-400' :
                        pit.position <= 10 ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        P{pit.position}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{pit.tyres}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        pit.efficiency === 'Ottimo' ? 'text-green-400' :
                        pit.efficiency === 'Buono' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {pit.efficiency || (pit.time < 24 ? 'Ottimo' : pit.time < 25 ? 'Buono' : 'Lento')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Timer className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-slate-300 font-medium">Tempo Medio</span>
            </div>
            <div className="text-2xl font-bold text-white">24.7s</div>
            <div className="text-sm text-slate-400">Pit stop medio</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              <span className="text-slate-300 font-medium">Migliore</span>
            </div>
            <div className="text-2xl font-bold text-green-400">23.8s</div>
            <div className="text-sm text-slate-400">Giro 25</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              <span className="text-slate-300 font-medium">Peggiore</span>
            </div>
            <div className="text-2xl font-bold text-red-400">26.0s</div>
            <div className="text-sm text-slate-400">Giro 40</div>
          </div>
        </div>
      </div>
    );
  };

  const renderScenarioCompare = () => {
    const scenarios = getScenarioComparison();
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <GitCompare className="w-5 h-5 mr-2 text-orange-400" />
            Confronto Strategie A/B/C
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(scenarios).map(([key, scenario], index) => (
              <div key={key} className={`p-4 rounded-lg border-2 ${
                index === 1 ? 'bg-green-600/10 border-green-500/30' :
                'bg-slate-700/30 border-slate-600/30'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">{scenario.name}</h4>
                  {index === 1 && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-medium">
                      MIGLIORE
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-400">Strategia</div>
                    <div className="text-white font-medium">{scenario.strategy}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-400">Tempo Stimato</div>
                    <div className="text-white font-bold text-lg">{scenario.estimatedTime}</div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-slate-400">Posizione</div>
                      <div className={`font-bold ${
                        scenario.position <= 3 ? 'text-green-400' :
                        scenario.position <= 6 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        P{scenario.position}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-slate-400">Rischio</div>
                      <div className={`font-medium ${
                        scenario.risk === 'Basso' ? 'text-green-400' :
                        scenario.risk === 'Medio' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {scenario.risk}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-white mb-4">Analisi Dettagliata</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-white font-medium mb-3">Vantaggi Scenario B</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Tempo gara più veloce
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Migliore posizione finale
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Flessibilità strategica
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-3">Considerazioni</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-slate-300">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                  Doppio pit stop rischioso
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                  Dipende dal traffico
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                  Condizioni meteo variabili
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCrossoverRadar = () => {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CloudRain className="w-5 h-5 mr-2 text-indigo-400" />
            Crossover Radar - Condizioni Pioggia
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Scenario Meteo
                </label>
                <select
                  value={weatherScenario}
                  onChange={(e) => setWeatherScenario(e.target.value as WeatherCondition['type'])}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Sunny">Asciutto</option>
                  <option value="Cloudy">Nuvoloso</option>
                  <option value="Light Rain">Pioggia Leggera</option>
                  <option value="Heavy Rain">Pioggia Intensa</option>
                </select>
              </div>
              
              <div className="p-4 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                <h4 className="text-white font-medium mb-2">Raccomandazione Crossover</h4>
                
                {weatherScenario === 'Sunny' && (
                  <div className="text-slate-300">
                    <div className="font-medium text-green-400">Mantieni gomme slick</div>
                    <div className="text-sm mt-1">Condizioni ottimali per Medium/Hard</div>
                  </div>
                )}
                
                {weatherScenario === 'Cloudy' && (
                  <div className="text-slate-300">
                    <div className="font-medium text-yellow-400">Monitora condizioni</div>
                    <div className="text-sm mt-1">Resta su slick ma preparati al cambio</div>
                  </div>
                )}
                
                {weatherScenario === 'Light Rain' && (
                  <div className="text-slate-300">
                    <div className="font-medium text-yellow-400">Considera Intermediate</div>
                    <div className="text-sm mt-1">Crossover al 40% di probabilità pioggia</div>
                  </div>
                )}
                
                {weatherScenario === 'Heavy Rain' && (
                  <div className="text-slate-300">
                    <div className="font-medium text-red-400">Gomme da pioggia obbligatorie</div>
                    <div className="text-sm mt-1">Wet tyres necessarie per sicurezza</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-medium">Timing Crossover</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Slick → Intermediate:</span>
                  <span className="text-white font-medium">30% pioggia</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Intermediate → Wet:</span>
                  <span className="text-white font-medium">70% pioggia</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Wet → Intermediate:</span>
                  <span className="text-white font-medium">40% pioggia</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Intermediate → Slick:</span>
                  <span className="text-white font-medium">15% pioggia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-white mb-4">Previsioni Meteo Gara</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { time: 'Giri 1-15', rain: 10, temp: 22 },
              { time: 'Giri 16-30', rain: 25, temp: 20 },
              { time: 'Giri 31-45', rain: 60, temp: 18 },
              { time: 'Giri 46-65', rain: 35, temp: 19 }
            ].map((forecast, index) => (
              <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">{forecast.time}</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{forecast.rain}%</div>
                    <div className="text-xs text-slate-500">Pioggia</div>
                  </div>
                  <div>
                    <div className="text-white font-medium">{forecast.temp}°C</div>
                    <div className="text-xs text-slate-500">Temp</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'fuel':
        return renderFuelCoach();
      case 'tyre':
        return renderTyreAdvisor();
      case 'pit':
        return renderPitVisualizer();
      case 'scenario':
        return renderScenarioCompare();
      case 'crossover':
        return renderCrossoverRadar();
      default:
        return renderFuelCoach();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:pl-64">
      <div className="p-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Strategy Advisor
          </h1>
          <p className="text-slate-400">
            Strumenti avanzati per ottimizzare la tua strategia di gara
          </p>
        </div>

        {/* Module Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    activeModule === module.id
                      ? `${module.color} border-white/30 shadow-lg`
                      : 'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    activeModule === module.id ? 'text-white' : 'text-slate-400'
                  }`} />
                  <div className={`text-sm font-medium ${
                    activeModule === module.id ? 'text-white' : 'text-slate-300'
                  }`}>
                    {module.name}
                  </div>
                  <div className={`text-xs mt-1 ${
                    activeModule === module.id ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {module.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module Content */}
        <div className="mb-8">
          {renderModuleContent()}
        </div>
      </div>
    </div>
  );
};

export default Strategy;