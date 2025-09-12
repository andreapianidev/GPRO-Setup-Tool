// GPRO Setup Tool - Dashboard Page

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Calendar,
  MapPin,
  Settings,
  Calculator,
  BarChart3,
  DollarSign,
  ArrowRight,
  Cloud,
  RefreshCw,
  Download
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGPROSync } from '../hooks/useGPROSync';
import { mockRaceWeekend } from '../services/mockData';
import type { RaceWeekend } from '../types/gpro';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { syncData, syncState, canSync } = useGPROSync();
  const [currentRaceWeekend, setCurrentRaceWeekend] = useState<RaceWeekend | null>(null);
  const [timeToRace, setTimeToRace] = useState<string>('');

  useEffect(() => {
    // Load current race weekend
    setCurrentRaceWeekend(mockRaceWeekend);

    // Update countdown timer
    const updateCountdown = () => {
      if (currentRaceWeekend) {
        const now = new Date();
        const raceTime = new Date(currentRaceWeekend.raceDate || new Date());
        const timeDiff = raceTime.getTime() - now.getTime();

        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeToRace(`${days}g ${hours}h ${minutes}m`);
        } else {
          setTimeToRace('Gara in corso!');
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentRaceWeekend]);



  if (!currentRaceWeekend) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-white mb-1">
              Benvenuto, <span className="text-red-400">{user?.username}</span>
            </h1>
            <p className="text-slate-400">Dashboard Pilota - Panoramica generale</p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Impostazioni
          </Link>
        </div>
      </div>

      {/* Race Weekend Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 rounded-xl p-6 border border-red-500/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-red-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">
                  {currentRaceWeekend.track.name}
                </h2>
              </div>
              <p className="text-slate-300">
                {currentRaceWeekend.track.country} • {currentRaceWeekend.track.length}km • {currentRaceWeekend.track.laps} giri
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-5 h-5 text-blue-400 mr-2" />
                </div>
                <p className="text-sm text-slate-400">Tempo alla gara</p>
                <p className="text-xl font-bold text-white">{timeToRace}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="w-5 h-5 text-green-400 mr-2" />
                </div>
                <p className="text-sm text-slate-400">Data gara</p>
                <p className="text-lg font-semibold text-white">
                  {new Date(currentRaceWeekend.raceDate || new Date()).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Data Section */}
      <div className="mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-white mb-1">
                Sincronizzazione Dati GPRO
              </h3>
              <p className="text-slate-400 text-sm">
                {syncState.lastSync 
                  ? `Ultimo aggiornamento: ${syncState.lastSync.toLocaleTimeString('it-IT')}` 
                  : 'Importa automaticamente i tuoi dati da GPRO'}
              </p>
              {syncState.error && (
                <p className="text-red-400 text-sm mt-1">⚠️ {syncState.error}</p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {syncState.isLoading && (
                <div className="text-blue-400 text-sm">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                    {syncState.currentStep} ({syncState.progress}%)
                  </div>
                </div>
              )}
              <button
                onClick={syncData}
                disabled={!canSync || syncState.isLoading}
                className={`inline-flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                  canSync && !syncState.isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                {syncState.isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {syncState.isLoading ? 'Sincronizzazione...' : 'Sync Dati GPRO'}
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          {syncState.isLoading && (
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${syncState.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action - Calculate Setup */}
      <div className="mb-8">
        <Link
          to="/calculator"
          className="block bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Calcola Setup Ottimale
                </h3>
                <p className="text-red-100">
                  Ottieni il setup perfetto per {currentRaceWeekend.track.name}
                </p>
              </div>
            </div>
            <div className="text-white">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Performance KPI */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Performance</h3>
          <p className="text-2xl font-bold text-green-400">87.3%</p>
          <p className="text-sm text-slate-400">vs media stagione</p>
        </div>

        {/* Consistency KPI */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
              +5%
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Consistenza</h3>
          <p className="text-2xl font-bold text-blue-400">92.1%</p>
          <p className="text-sm text-slate-400">precisione setup</p>
        </div>

          {/* Credits KPI */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">
              +2.3M
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Crediti</h3>
          <p className="text-2xl font-bold text-yellow-400">15.7M</p>
          <p className="text-sm text-slate-400">disponibili</p>
        </div>

        {/* Trophies KPI */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
              +3
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Trofei</h3>
          <p className="text-2xl font-bold text-purple-400">47</p>
          <p className="text-sm text-slate-400">questa stagione</p>
        </div>
      </div>

      {/* Weather and Track Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weather Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Cloud className="w-5 h-5 mr-2 text-blue-400" />
              Meteo Attuale
            </h3>
            <span className="text-xs text-slate-400">Live</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Temperatura</span>
              <span className="text-white font-semibold">22°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Umidità</span>
              <span className="text-white font-semibold">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Vento</span>
              <span className="text-white font-semibold">12 km/h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Condizioni</span>
              <span className="text-green-400 font-semibold">Sereno</span>
            </div>
          </div>
        </div>

        {/* Track Info Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-400" />
              Circuito Attuale
            </h3>
            <span className="text-xs text-slate-400">Info</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Nome</span>
              <span className="text-white font-semibold">Monza</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Lunghezza</span>
              <span className="text-white font-semibold">5.793 km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Giri</span>
              <span className="text-white font-semibold">53</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">DRS Zone</span>
              <span className="text-blue-400 font-semibold">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Setup Calculator */}
        <Link
          to="/setup-calculator"
          className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Setup Calculator</h3>
          <p className="text-slate-400 text-sm">Calcola il setup ottimale per il prossimo weekend di gara</p>
        </Link>

        {/* Race Analysis */}
        <Link
          to="/race-analysis"
          className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-400 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Analisi Gara</h3>
          <p className="text-slate-400 text-sm">Analizza le performance delle ultime gare</p>
        </Link>

        {/* Strategy Planner */}
        <Link
          to="/strategy"
          className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/20 p-3 rounded-lg group-hover:bg-purple-500/30 transition-colors">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Strategia</h3>
          <p className="text-slate-400 text-sm">Pianifica la strategia per il prossimo GP</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;