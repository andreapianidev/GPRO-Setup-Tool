// GPRO Setup Tool - Landing Page

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Zap, 
  Target, 
  BarChart3, 
  Shield, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { useDemoLogin } from '../hooks/useAuth';

const Landing: React.FC = () => {
  const { loginAsDemo } = useDemoLogin();

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Setup Calculator',
      description: 'Calcola il setup ottimale per ogni circuito con algoritmi avanzati basati sui dati GPRO.',
      color: 'text-red-600'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Strategy Advisor',
      description: 'Consigli strategici in tempo reale per carburante, gomme e pit stop.',
      color: 'text-blue-600'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Post-Race Analysis',
      description: 'Analisi dettagliata delle performance con delta timing e Box Radio Replay.',
      color: 'text-green-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Fuel Safety Coach',
      description: 'Ottimizza il carico carburante per massimizzare le prestazioni senza rischi.',
      color: 'text-yellow-600'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Real-time Updates',
      description: 'Aggiornamenti in tempo reale su meteo, condizioni pista e strategie avversarie.',
      color: 'text-purple-600'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Performance Tracking',
      description: 'Monitora i tuoi progressi e confronta le performance con altri piloti.',
      color: 'text-indigo-600'
    }
  ];

  const benefits = [
    'Setup ottimizzati per ogni circuito',
    'Strategie vincenti basate sui dati',
    'Analisi post-gara dettagliate',
    'Consigli in tempo reale durante la gara',
    'Interfaccia intuitiva e mobile-friendly',
    'Integrazione completa con GPRO'
  ];

  const handleDemoLogin = async () => {
    try {
      await loginAsDemo();
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-xl">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="ml-4 text-4xl font-bold text-white">
                GPRO <span className="text-red-500">Setup Tool</span>
              </h1>
            </div>

            {/* Hero Title */}
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Domina la
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                Pista Virtuale
              </span>
            </h2>

            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Il tool definitivo per ottimizzare setup, strategie e performance in GPRO. 
              Trasforma i dati in vittorie con l'intelligenza artificiale.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleDemoLogin}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center group"
              >
                Prova la Demo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link
                to="/register"
                className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Registrati Gratis
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 text-slate-400">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-500 mr-1" />
                <span>1000+ Piloti Attivi</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-5 h-5 text-red-500 mr-1" />
                <span>500+ Vittorie</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Funzionalità Avanzate
            </h3>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Tutto quello che serve per dominare in GPRO, in un'unica piattaforma intelligente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-700/70 transition-all duration-300 transform hover:scale-105 border border-slate-600/50"
              >
                <div className={`${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Perché Scegliere
                <span className="block text-red-500">GPRO Setup Tool?</span>
              </h3>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Non è solo un tool, è il tuo co-pilota digitale. Basato su anni di dati GPRO 
                e algoritmi di machine learning per darti il vantaggio competitivo che cerchi.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Mock Dashboard Preview */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-600">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">Dashboard Preview</h4>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Prossima Gara</span>
                      <span className="text-red-400 font-semibold">Monaco GP</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">P8</div>
                      <div className="text-slate-400 text-sm">Posizione Media</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">94%</div>
                      <div className="text-slate-400 text-sm">Affidabilità</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-center">
                    <span className="text-white font-semibold">Calcola Setup Ottimale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto a Dominare la Griglia?
          </h3>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Unisciti a centinaia di piloti che hanno già migliorato le loro performance con GPRO Setup Tool.
            Inizia la tua prova gratuita oggi stesso.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDemoLogin}
              className="bg-white text-red-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Inizia Demo Gratuita
            </button>
            
            <Link
              to="/pricing"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Vedi Prezzi
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-red-500 mr-2" />
              <span className="text-2xl font-bold text-white">GPRO Setup Tool</span>
            </div>
            <p className="text-slate-400 mb-4">
              Il tool definitivo per piloti GPRO professionali
            </p>
            <div className="flex justify-center space-x-6 text-slate-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Termini di Servizio
              </Link>
              <Link to="/support" className="hover:text-white transition-colors">
                Supporto
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;