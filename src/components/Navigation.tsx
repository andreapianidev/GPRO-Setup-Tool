// GPRO Setup Tool - Navigation Component

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Home,
  Calculator,
  BarChart3,
  Timer,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Fuel,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Panoramica generale'
    },
    {
      name: 'Calculator',
      href: '/calculator',
      icon: Calculator,
      description: 'Calcola setup ottimale'
    },
    {
      name: 'Strategy Advisor',
      href: '/strategy',
      icon: BarChart3,
      description: 'Consigli strategici'
    },
    {
      name: 'Post-Race Analysis',
      href: '/analysis',
      icon: Timer,
      description: 'Analisi post-gara'
    },
    {
      name: 'Fuel Coach',
      href: '/fuel',
      icon: Fuel,
      description: 'Gestione carburante'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Don't show navigation on landing and auth pages
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-slate-800/95 lg:backdrop-blur-sm lg:border-r lg:border-slate-600/50 lg:z-30">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-slate-600/50">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-white">
              GPRO <span className="text-red-500">Setup Tool</span>
            </h1>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${
                    isActive(item.href) ? 'text-red-100' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-slate-600/50">
          <div className="flex items-center px-3 py-2 mb-2">
            <div className="bg-slate-700 p-2 rounded-lg">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-slate-400">Pilota GPRO</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Link
              to="/profile"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/profile')
                  ? 'bg-red-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Settings className="mr-3 h-4 w-4" />
              Impostazioni
            </Link>
            
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-600/50 px-4 py-3 z-30 h-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-bold text-white">
                  GPRO <span className="text-red-500">Setup</span>
                </h1>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            
            <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-slate-800 border-l border-slate-600/50 shadow-xl overflow-y-auto">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-600/50">
                <div className="flex items-center">
                  <div className="bg-slate-700 p-2 rounded-lg">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.username}</p>
                    <p className="text-xs text-slate-400">Pilota GPRO</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <div className="px-4 py-6 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs ${
                          isActive(item.href) ? 'text-red-100' : 'text-slate-500 group-hover:text-slate-400'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-slate-600/50">
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive('/profile')
                        ? 'bg-red-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Impostazioni
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-600/50 px-4 py-2 z-40">
        <div className="flex justify-around">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-red-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">
                  {item.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;