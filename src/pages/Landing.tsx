// GPRO Setup Tool - Landing Page (public demo)

import React from 'react';
import {
  Trophy,
  Zap,
  Target,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
  Info,
  UserCog,
} from 'lucide-react';
import { useDemoLogin } from '../hooks/useAuth';
import { WhatsAppButton } from '../components/DemoNotice';

const Landing: React.FC = () => {
  const { loginAsDemo } = useDemoLogin();

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Setup Calculator',
      description: 'Q1, Q2 and race setup for every track, calculated on your driver, car and the weather forecast.',
      color: 'text-red-600'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Strategy Advisor',
      description: 'Fuel load, tyre choice and pit stop plan, with alternative scenarios compared side by side.',
      color: 'text-blue-600'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Post-Race Analysis',
      description: 'Compare what was predicted with what happened in the race, lap by lap.',
      color: 'text-green-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Fuel Safety Coach',
      description: 'Carry the fuel you need and no more, without the risk of running dry.',
      color: 'text-yellow-600'
    },
    {
      icon: <UserCog className="w-8 h-8" />,
      title: 'Personalized for you',
      description: 'Every manager gets an own instance, tuned on their team, with features adapted to how they play.',
      color: 'text-purple-600'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Excel export',
      description: 'Setup, strategy and race report in a ready-made spreadsheet you can keep and edit.',
      color: 'text-indigo-600'
    }
  ];

  const personalized = [
    'Setup calculated on your own driver, car and tracks',
    'Fuel and tyre strategy for each race',
    'Interface fully in English',
    'Features adapted to what you need',
    'Your own private instance, hosted and maintained by me',
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
      {/* Demo notice */}
      <div className="bg-yellow-500/15 border-b border-yellow-500/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-start sm:items-center gap-2 text-sm text-yellow-100">
          <Info className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span>
            <strong>This is a demo.</strong> It runs on sample data, so the numbers are not real calculations,
            and some screens are still in Italian. The real tool is personalized for each GPRO manager.
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
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
              Your setup,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                calculated for your team
              </span>
            </h2>

            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Setup, fuel and tyre strategy for Grand Prix Racing Online.
              Try the demo to see how it works, then get the version built around your driver and car.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <button
                onClick={handleDemoLogin}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center group"
              >
                Open the demo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <WhatsAppButton className="px-8 py-4 text-lg" />
            </div>
            <p className="text-slate-400 text-sm">No sign-up needed, the demo opens straight away.</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What the tool does
            </h3>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need for a race weekend in GPRO, in one place.
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

      {/* Demo vs personalized */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-600">
              <h3 className="text-2xl font-bold text-white mb-4">The demo</h3>
              <p className="text-slate-300 leading-relaxed">
                A sample team with sample data. It shows the screens and the workflow: dashboard,
                setup calculator, strategy advisor and post-race analysis. The numbers are placeholders,
                not calculations on a real team, and part of the interface is still in Italian.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-green-600/60">
              <h3 className="text-2xl font-bold text-white mb-4">
                Your <span className="text-green-500">personalized version</span>
              </h3>
              <div className="space-y-3 mb-6">
                {personalized.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-300 text-lg">{item}</span>
                  </div>
                ))}
              </div>
              <WhatsAppButton className="px-6 py-3 w-full" label="Ask for info on WhatsApp" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Want it on your own team?
          </h3>
          <p className="text-xl text-red-100 mb-8 leading-relaxed">
            Write to me on WhatsApp with your questions. I will tell you how the personalized
            version works, what it costs and how long it takes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDemoLogin}
              className="bg-white text-red-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Open the demo
            </button>

            <WhatsAppButton className="px-8 py-4 text-lg" label="Write on WhatsApp" />
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
              Unofficial tool, not affiliated with Grand Prix Racing Online.
            </p>
            <p className="text-slate-500 text-sm">
              © 2026 GPRO Setup Tool · Andrea Piani · NIE Z2331796-S · Tijarafe, Santa Cruz de Tenerife · Islas Canarias
              {' · '}
              <a href="https://www.andreapiani.com" className="hover:text-white transition-colors">andreapiani.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
