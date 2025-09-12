// GPRO Setup Tool - Login Page

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login failed:', error);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@gpro.net');
    setPassword('demo123');
    
    try {
      await login('demo@gpro.net', 'demo123');
      navigate('/dashboard');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center mb-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-xl">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-white">
              GPRO <span className="text-red-500">Setup Tool</span>
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Bentornato!
          </h2>
          <p className="text-slate-400">
            Accedi al tuo account per continuare
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-600/50">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="inserisci la tua email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="inserisci la tua password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-600 rounded bg-slate-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Ricordami
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  Password dimenticata?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accesso in corso...
                </div>
              ) : (
                'Accedi'
              )}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">oppure</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="mt-4 w-full flex justify-center py-3 px-4 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 bg-slate-700/50 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Prova la Demo
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-slate-400">Non hai un account? </span>
            <Link
              to="/register"
              className="font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              Registrati qui
            </Link>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-2">Credenziali Demo:</h3>
          <div className="text-sm text-blue-300 space-y-1">
            <div>Email: <code className="bg-slate-700 px-2 py-1 rounded">demo@gpro.net</code></div>
            <div>Password: <code className="bg-slate-700 px-2 py-1 rounded">demo123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;