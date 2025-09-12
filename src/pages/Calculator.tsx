// GPRO Setup Tool - Setup Calculator Page

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calculator as CalculatorIcon,
  Zap,
  TrendingUp,
  Target,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Trophy,
  Timer,
  Fuel,
  Wrench
} from 'lucide-react';
import { mockRaceWeekend } from '../services/mockData';
import type { SetupConfiguration, RaceWeekend } from '../types/gpro';

interface CalculationResult {
  session: 'Q1' | 'Q2' | 'Race';
  lapTime: string;
  position: number;
  confidence: number;
  improvements: string[];
  risks: string[];
}

const Calculator: React.FC = () => {
  const [currentRaceWeekend, setCurrentRaceWeekend] = useState<RaceWeekend | null>(null);
  const [setup, setSetup] = useState<SetupConfiguration | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [selectedSession, setSelectedSession] = useState<'Q1' | 'Q2' | 'Race'>('Race');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setCurrentRaceWeekend(mockRaceWeekend);
    
    // Load optimal setup for current track
    if (mockRaceWeekend.results.length > 0) {
      setSetup(mockRaceWeekend.results[0].setup);
    }
  }, []);

  const calculateSetup = async () => {
    setIsCalculating(true);
    
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock results
    const mockResults: CalculationResult[] = [
      {
        session: 'Q1',
        lapTime: '1:23.456',
        position: 12,
        confidence: 87,
        improvements: ['Aerodinamica ottimizzata per velocità massima', 'Bilanciamento migliorato in curva'],
        risks: ['Possibile sottosterzo in condizioni di vento forte']
      },
      {
        session: 'Q2',
        lapTime: '1:22.891',
        position: 8,
        confidence: 92,
        improvements: ['Setup più aggressivo per qualifica', 'Pressioni gomme ottimizzate'],
        risks: ['Maggiore usura gomme', 'Sensibilità alle condizioni meteo']
      },
      {
        session: 'Race',
        lapTime: '1:24.123',
        position: 6,
        confidence: 95,
        improvements: ['Bilanciamento perfetto per stint lunghi', 'Gestione carburante ottimale'],
        risks: ['Prestazioni ridotte con gomme usurate']
      }
    ];
    
    setResults(mockResults);
    setIsCalculating(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400 bg-green-500/20';
    if (confidence >= 75) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 90) return 'Molto Alta';
    if (confidence >= 75) return 'Alta';
    if (confidence >= 60) return 'Media';
    return 'Bassa';
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-yellow-400';
    if (position <= 8) return 'text-green-400';
    if (position <= 15) return 'text-blue-400';
    return 'text-slate-400';
  };

  if (!currentRaceWeekend || !setup) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                  <CalculatorIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-white">Setup Calculator</h1>
                  <p className="text-sm text-slate-400">{currentRaceWeekend.track.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Crediti:</span>
              <span className="text-yellow-400 font-semibold">3/5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Setup Overview */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Setup Attuale</h2>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-sm text-slate-300">
                  {showAdvanced ? 'Nascondi' : 'Mostra'} Avanzate
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Aero Settings */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Aerodinamica
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ala Anteriore</span>
                    <span className="text-white font-medium">{setup.frontWing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ala Posteriore</span>
                    <span className="text-white font-medium">{setup.rearWing}</span>
                  </div>
                </div>
              </div>

              {/* Suspension Settings */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Sospensioni
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Anteriori</span>
                    <span className="text-white font-medium">{setup.suspension}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Posteriori</span>
                    <span className="text-white font-medium">{setup.suspension}</span>
                  </div>
                </div>
              </div>

              {/* Gearbox Settings */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Cambio
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rapporti</span>
                    <span className="text-white font-medium">{setup.gear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Differenziale</span>
                    <span className="text-white font-medium">{setup.gear}</span>
                  </div>
                </div>
              </div>

              {/* Brakes Settings */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Freni
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bilanciamento</span>
                    <span className="text-white font-medium">{setup.brakes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pressione</span>
                    <span className="text-white font-medium">{setup.brakes}</span>
                  </div>
                </div>
              </div>
            </div>

            {showAdvanced && (
              <div className="mt-6 pt-6 border-t border-slate-600/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                      Gomme
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pressione Ant.</span>
                        <span className="text-white font-medium">2.3 bar</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pressione Post.</span>
                        <span className="text-white font-medium">2.1 bar</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                      Carburante
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stint 1</span>
                        <span className="text-white font-medium">45L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stint 2</span>
                        <span className="text-white font-medium">42L</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                      Strategia
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pit Stop</span>
                        <span className="text-white font-medium">Giro 28</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gomme</span>
                        <span className="text-white font-medium">Medium → Soft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculate Button */}
        {results.length === 0 && (
          <div className="mb-8 text-center">
            <button
              onClick={calculateSetup}
              disabled={isCalculating}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Calcolo in corso...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-3" />
                  Calcola Setup Ottimale
                </>
              )}
            </button>
            
            {isCalculating && (
              <div className="mt-4 text-slate-400 text-sm">
                Analizzando condizioni meteo, caratteristiche del circuito e performance della vettura...
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            {/* Session Selector */}
            <div className="flex justify-center">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-600/50">
                <div className="flex space-x-2">
                  {(['Q1', 'Q2', 'Race'] as const).map((session) => (
                    <button
                      key={session}
                      onClick={() => setSelectedSession(session)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedSession === session
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      {session}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Session Results */}
            {(() => {
              const result = results.find(r => r.session === selectedSession);
              if (!result) return null;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Performance Metrics */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Main Results Card */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">
                          Risultati {result.session}
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getConfidenceColor(result.confidence)
                        }`}>
                          Confidenza: {getConfidenceText(result.confidence)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Lap Time */}
                        <div className="text-center">
                          <div className="bg-blue-500/20 p-4 rounded-lg mb-3">
                            <Timer className="w-8 h-8 text-blue-400 mx-auto" />
                          </div>
                          <p className="text-sm text-slate-400 mb-1">Tempo sul Giro</p>
                          <p className="text-2xl font-bold text-white">{result.lapTime}</p>
                        </div>
                        
                        {/* Position */}
                        <div className="text-center">
                          <div className="bg-yellow-500/20 p-4 rounded-lg mb-3">
                            <Trophy className="w-8 h-8 text-yellow-400 mx-auto" />
                          </div>
                          <p className="text-sm text-slate-400 mb-1">Posizione Stimata</p>
                          <p className={`text-2xl font-bold ${getPositionColor(result.position)}`}>
                            P{result.position}
                          </p>
                        </div>
                        
                        {/* Confidence */}
                        <div className="text-center">
                          <div className="bg-green-500/20 p-4 rounded-lg mb-3">
                            <Target className="w-8 h-8 text-green-400 mx-auto" />
                          </div>
                          <p className="text-sm text-slate-400 mb-1">Livello Confidenza</p>
                          <p className="text-2xl font-bold text-green-400">{result.confidence}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Improvements */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                      <div className="flex items-center mb-4">
                        <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                        <h3 className="text-lg font-semibold text-white">Miglioramenti</h3>
                      </div>
                      <div className="space-y-3">
                        {result.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-300">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Risks */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                        <h3 className="text-lg font-semibold text-white">Rischi</h3>
                      </div>
                      <div className="space-y-3">
                        {result.risks.map((risk, index) => (
                          <div key={index} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                            <p className="text-slate-300 text-sm">{risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                      <h3 className="text-lg font-semibold text-white mb-4">Azioni Rapide</h3>
                      <div className="space-y-3">
                        <Link
                          to="/strategy"
                          className="flex items-center p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                        >
                          <BarChart3 className="w-5 h-5 text-blue-400 mr-3" />
                          <span className="text-slate-300">Analizza Strategia</span>
                        </Link>
                        
                        <Link
                          to="/fuel"
                          className="flex items-center p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                        >
                          <Fuel className="w-5 h-5 text-yellow-400 mr-3" />
                          <span className="text-slate-300">Calcola Carburante</span>
                        </Link>
                        
                        <button className="flex items-center p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors w-full">
                          <Wrench className="w-5 h-5 text-green-400 mr-3" />
                          <span className="text-slate-300">Modifica Setup</span>
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Info className="w-5 h-5 text-blue-400 mr-2" />
                        <h4 className="text-blue-400 font-medium">Nota</h4>
                      </div>
                      <p className="text-sm text-blue-300">
                        I risultati sono basati su simulazioni avanzate e dati storici. 
                        Le condizioni reali possono variare.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;