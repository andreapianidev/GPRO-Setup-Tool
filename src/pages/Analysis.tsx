// GPRO Setup Tool - Post-Race Analysis Page

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Radio,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Clock,
  Flag,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Fuel
} from 'lucide-react';
import { mockRaceWeekend } from '../services/mockData';

type AnalysisTab = 'delta' | 'radio' | 'telemetry' | 'summary';

const Analysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('delta');
  const [selectedLap, setSelectedLap] = useState(25);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [radioTime] = useState(0);
  const [comparisonDriver, setComparisonDriver] = useState('teammate');

  const raceWeekend = mockRaceWeekend;
  const raceResult = raceWeekend.results[0];

  const tabs = [
    {
      id: 'delta' as AnalysisTab,
      name: 'Delta Analysis',
      icon: BarChart3,
      description: 'Confronto prestazioni'
    },
    {
      id: 'radio' as AnalysisTab,
      name: 'Box Radio Replay',
      icon: Radio,
      description: 'Comunicazioni di gara'
    },
    {
      id: 'telemetry' as AnalysisTab,
      name: 'Telemetria',
      icon: Zap,
      description: 'Dati tecnici dettagliati'
    },
    {
      id: 'summary' as AnalysisTab,
      name: 'Riassunto Gara',
      icon: Trophy,
      description: 'Panoramica generale'
    }
  ];

  const getDeltaData = () => {
    const baseLapTime = 87.5; // seconds
    return Array.from({ length: 65 }, (_, i) => {
      const lap = i + 1;
      const variation = Math.sin(lap * 0.1) * 2 + Math.random() * 1.5 - 0.75;
      const myTime = baseLapTime + variation;
      const compTime = baseLapTime + variation + (Math.random() * 1 - 0.5);
      
      return {
        lap,
        myTime: myTime.toFixed(3),
        comparisonTime: compTime.toFixed(3),
        delta: (myTime - compTime).toFixed(3),
        sector1: (myTime * 0.35).toFixed(3),
        sector2: (myTime * 0.4).toFixed(3),
        sector3: (myTime * 0.25).toFixed(3),
        position: Math.max(1, Math.min(20, Math.floor(8 + Math.sin(lap * 0.15) * 3))),
        tyres: lap < 25 ? 'Medium' : lap < 45 ? 'Hard' : 'Medium',
        fuel: Math.max(0, 180 - (lap * 2.8)).toFixed(1)
      };
    });
  };

  const getRadioMessages = () => {
    return [
      {
        lap: 1,
        time: '14:02:15',
        from: 'Engineer',
        message: 'Radio check, tutto OK. Temperatura gomme ottimale.',
        type: 'info'
      },
      {
        lap: 8,
        time: '14:09:32',
        from: 'Driver',
        message: 'Sottosterzo in curva 3, posso spingere di più?',
        type: 'feedback'
      },
      {
        lap: 12,
        time: '14:13:45',
        from: 'Engineer',
        message: 'Copia, prova ad aumentare il bilanciamento anteriore di 2 click.',
        type: 'instruction'
      },
      {
        lap: 18,
        time: '14:19:20',
        from: 'Driver',
        message: 'Molto meglio! Le gomme stanno degradando, quando entriamo?',
        type: 'feedback'
      },
      {
        lap: 22,
        time: '14:23:10',
        from: 'Engineer',
        message: 'Pit window aperta. Prossimo giro, prossimo giro. Conferma.',
        type: 'critical'
      },
      {
        lap: 23,
        time: '14:24:35',
        from: 'Driver',
        message: 'Confermato, entro ai box.',
        type: 'critical'
      },
      {
        lap: 24,
        time: '14:25:50',
        from: 'Engineer',
        message: 'Pit stop perfetto! 23.8 secondi. P6, P6!',
        type: 'success'
      },
      {
        lap: 35,
        time: '14:35:15',
        from: 'Driver',
        message: 'Macchina davanti molto lenta, posso sorpassare?',
        type: 'feedback'
      },
      {
        lap: 36,
        time: '14:36:20',
        from: 'Engineer',
        message: 'Negativo, risparmia carburante. Gap 0.8 secondi.',
        type: 'instruction'
      },
      {
        lap: 45,
        time: '14:44:30',
        from: 'Engineer',
        message: 'Ultimi 20 giri, mantieni il ritmo. P7 è il nostro obiettivo.',
        type: 'info'
      },
      {
        lap: 58,
        time: '14:55:45',
        from: 'Driver',
        message: 'Gomme finite, sto perdendo aderenza!',
        type: 'warning'
      },
      {
        lap: 60,
        time: '14:57:30',
        from: 'Engineer',
        message: 'Copia, gestisci. Solo 5 giri, ce la facciamo!',
        type: 'instruction'
      },
      {
        lap: 65,
        time: '15:02:15',
        from: 'Engineer',
        message: 'BANDIERA A SCACCHI! P7! Ottimo lavoro oggi!',
        type: 'success'
      }
    ];
  };

  const getTelemetryData = () => {
    return {
      topSpeed: 312,
      avgSpeed: 195,
      maxG: 4.2,
      brakingPoints: [
        { corner: 'T1', distance: 120, gForce: 3.8, speed: '310→95' },
        { corner: 'T3', distance: 85, gForce: 3.2, speed: '280→110' },
        { corner: 'T6', distance: 95, gForce: 3.5, speed: '295→85' },
        { corner: 'T11', distance: 110, gForce: 4.0, speed: '305→75' }
      ],
      fuelConsumption: {
        total: 182.5,
        avgPerLap: 2.81,
        efficiency: 92
      },
      tyreTemps: {
        front: { left: 98, right: 102 },
        rear: { left: 95, right: 97 }
      }
    };
  };

  const renderDeltaAnalysis = () => {
    const deltaData = getDeltaData();
    const selectedLapData = deltaData[selectedLap - 1];
    
    return (
      <div className="space-y-6">
        {/* Lap Selector */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h3 className="text-lg font-semibold text-white mb-4 md:mb-0">
              Delta Analysis - Giro {selectedLap}
            </h3>
            
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Confronta con:
                </label>
                <select
                  value={comparisonDriver}
                  onChange={(e) => setComparisonDriver(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="teammate">Compagno di squadra</option>
                  <option value="leader">Leader gara</option>
                  <option value="pole">Tempo pole</option>
                  <option value="fastest">Giro più veloce</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Giro:
                </label>
                <input
                  type="range"
                  min="1"
                  max="65"
                  value={selectedLap}
                  onChange={(e) => setSelectedLap(Number(e.target.value))}
                  className="w-32"
                />
              </div>
            </div>
          </div>
          
          {selectedLapData && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-sm text-slate-400">Tempo Giro</div>
                <div className="text-white font-bold">{selectedLapData.myTime}s</div>
              </div>
              
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-sm text-slate-400">Delta</div>
                <div className={`font-bold ${
                  parseFloat(selectedLapData.delta) < 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {parseFloat(selectedLapData.delta) > 0 ? '+' : ''}{selectedLapData.delta}s
                </div>
              </div>
              
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-sm text-slate-400">Posizione</div>
                <div className="text-white font-bold">P{selectedLapData.position}</div>
              </div>
              
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-sm text-slate-400">Gomme</div>
                <div className="text-white font-bold">{selectedLapData.tyres}</div>
              </div>
              
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-sm text-slate-400">Carburante</div>
                <div className="text-white font-bold">{selectedLapData.fuel}L</div>
              </div>
              
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="text-sm text-slate-400">Settore 1</div>
                <div className="text-white font-bold">{selectedLapData.sector1}s</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Delta Chart */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-white mb-4">Andamento Delta per Giro</h4>
          
          <div className="h-64 bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
            <div className="flex items-end justify-between h-full min-w-full">
              {deltaData.filter((_, i) => i % 5 === 0).map((data, index) => {
                const delta = parseFloat(data.delta);
                const height = Math.abs(delta) * 20 + 10;
                const isPositive = delta > 0;
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-3 rounded-t ${
                        isPositive ? 'bg-red-500' : 'bg-green-500'
                      } ${!isPositive ? 'order-2' : ''}`}
                      style={{ height: `${height}px` }}
                    />
                    <div className="text-xs text-slate-400 mt-1">
                      {data.lap}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2" />
              <span className="text-sm text-slate-300">Più veloce</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2" />
              <span className="text-sm text-slate-300">Più lento</span>
            </div>
          </div>
        </div>
        
        {/* Sector Analysis */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-white mb-4">Analisi Settori - Giro {selectedLap}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Settore 1', 'Settore 2', 'Settore 3'].map((sector, index) => {
              const sectorTime = selectedLapData ? 
                [selectedLapData.sector1, selectedLapData.sector2, selectedLapData.sector3][index] : '0.000';
              const delta = (Math.random() - 0.5) * 0.5;
              
              return (
                <div key={sector} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">{sector}</span>
                    <span className={`text-sm font-bold ${
                      delta < 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {delta > 0 ? '+' : ''}{delta.toFixed(3)}s
                    </span>
                  </div>
                  
                  <div className="text-white text-xl font-bold">{sectorTime}s</div>
                  
                  <div className="mt-2 flex items-center">
                    {delta < 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                    )}
                    <span className="text-xs text-slate-400">
                      {delta < 0 ? 'Miglioramento' : 'Peggioramento'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderBoxRadio = () => {
    const radioMessages = getRadioMessages();
    
    return (
      <div className="space-y-6">
        {/* Radio Player */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Radio className="w-5 h-5 mr-2 text-blue-400" />
              Box Radio Replay
            </h3>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="75"
                className="w-20"
              />
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-300">Gara Completa - 1:32:45</div>
              <div className="text-slate-400 text-sm">
                {Math.floor(radioTime / 60)}:{(radioTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(radioTime / 5565) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <SkipBack className="w-5 h-5 text-white" />
              </button>
              
              <button 
                onClick={() => setIsRadioPlaying(!isRadioPlaying)}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {isRadioPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
              
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <SkipForward className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Radio Messages */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-white mb-4">Comunicazioni di Gara</h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {radioMessages.map((message, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                message.type === 'critical' ? 'bg-red-600/10 border-red-500' :
                message.type === 'success' ? 'bg-green-600/10 border-green-500' :
                message.type === 'warning' ? 'bg-yellow-600/10 border-yellow-500' :
                message.type === 'instruction' ? 'bg-blue-600/10 border-blue-500' :
                'bg-slate-700/30 border-slate-500'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      message.from === 'Driver' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {message.from}
                    </span>
                    
                    <span className="text-slate-400 text-sm flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Giro {message.lap} - {message.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {message.type === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                    {message.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {message.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  </div>
                </div>
                
                <div className="text-white">{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTelemetry = () => {
    const telemetry = getTelemetryData();
    
    return (
      <div className="space-y-6">
        {/* Speed & G-Force */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Velocità</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Velocità massima:</span>
                <span className="text-white font-bold">{telemetry.topSpeed} km/h</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Velocità media:</span>
                <span className="text-white font-bold">{telemetry.avgSpeed} km/h</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">G-Force massima:</span>
                <span className="text-white font-bold">{telemetry.maxG}G</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Fuel className="w-5 h-5 mr-2 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Carburante</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Consumo totale:</span>
                <span className="text-white font-bold">{telemetry.fuelConsumption.total}L</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Media per giro:</span>
                <span className="text-white font-bold">{telemetry.fuelConsumption.avgPerLap}L</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Efficienza:</span>
                <span className="text-green-400 font-bold">{telemetry.fuelConsumption.efficiency}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 mr-2 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Temperature Gomme</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-slate-400 text-sm mb-1">Anteriori</div>
                <div className="text-white font-bold">
                  {telemetry.tyreTemps.front.left}° | {telemetry.tyreTemps.front.right}°
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-slate-400 text-sm mb-1">Posteriori</div>
                <div className="text-white font-bold">
                  {telemetry.tyreTemps.rear.left}° | {telemetry.tyreTemps.rear.right}°
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Braking Points */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Flag className="w-5 h-5 mr-2 text-purple-400" />
            Punti di Frenata
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Curva</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Distanza</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">G-Force</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Velocità</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Valutazione</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.brakingPoints.map((point, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white font-medium">{point.corner}</td>
                    <td className="py-3 px-4 text-white">{point.distance}m</td>
                    <td className="py-3 px-4 text-white">{point.gForce}G</td>
                    <td className="py-3 px-4 text-white">{point.speed}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        point.gForce > 3.8 ? 'bg-green-600/20 text-green-400' :
                        point.gForce > 3.5 ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {point.gForce > 3.8 ? 'Ottimo' : point.gForce > 3.5 ? 'Buono' : 'Da migliorare'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    return (
      <div className="space-y-6">
        {/* Race Result */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Risultato Gara
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">P{raceResult.position}</div>
              <div className="text-slate-400">Posizione Finale</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{raceResult.totalTime}</div>
              <div className="text-slate-400">Tempo Totale</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+{raceResult.points}</div>
              <div className="text-slate-400">Punti Guadagnati</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{raceResult.fastestLap}</div>
              <div className="text-slate-400">Giro Più Veloce</div>
            </div>
          </div>
        </div>
        
        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h4 className="text-md font-semibold text-white mb-4">Punti di Forza</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span className="text-slate-300">Strategia pit stop ottimale</span>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span className="text-slate-300">Gestione carburante efficiente</span>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span className="text-slate-300">Settore 2 competitivo</span>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span className="text-slate-300">Sorpassi puliti</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h4 className="text-md font-semibold text-white mb-4">Aree di Miglioramento</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-slate-300">Qualifica da migliorare</span>
              </div>
              
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-slate-300">Settore 3 perdente</span>
              </div>
              
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-slate-300">Degradazione gomme alta</span>
              </div>
              
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400" />
                <span className="text-slate-300">Setup bilanciamento</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next Race Recommendations */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-white mb-4">Raccomandazioni per la Prossima Gara</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-white font-medium mb-3">Setup</h5>
              <ul className="space-y-2 text-slate-300">
                <li>• Aumentare carico aerodinamico posteriore</li>
                <li>• Ridurre pressione gomme anteriori</li>
                <li>• Ottimizzare rapporti cambio per T3</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-medium mb-3">Strategia</h5>
              <ul className="space-y-2 text-slate-300">
                <li>• Qualifica con meno carburante</li>
                <li>• Pit stop più aggressivo</li>
                <li>• Focus su settore 3 nelle prove</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'delta':
        return renderDeltaAnalysis();
      case 'radio':
        return renderBoxRadio();
      case 'telemetry':
        return renderTelemetry();
      case 'summary':
        return renderSummary();
      default:
        return renderDeltaAnalysis();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:pl-64">
      <div className="p-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Post-Race Analysis
          </h1>
          <p className="text-slate-400">
            Analisi dettagliata delle prestazioni di gara - {raceWeekend.track.name}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-red-600 border-white/30 shadow-lg'
                      : 'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    activeTab === tab.id ? 'text-white' : 'text-slate-400'
                  }`} />
                  <div className={`text-sm font-medium ${
                    activeTab === tab.id ? 'text-white' : 'text-slate-300'
                  }`}>
                    {tab.name}
                  </div>
                  <div className={`text-xs mt-1 ${
                    activeTab === tab.id ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {tab.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Analysis;