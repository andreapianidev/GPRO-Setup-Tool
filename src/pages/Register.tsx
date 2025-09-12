// GPRO Setup Tool - Register Page

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gproToken: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Il nome utente è obbligatorio';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Il nome utente deve essere di almeno 3 caratteri';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un\'email valida';
    }

    if (!formData.password) {
      newErrors.password = 'La password è obbligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La password deve essere di almeno 6 caratteri';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non coincidono';
    }

    if (!formData.gproToken.trim()) {
      newErrors.gproToken = 'Il token GPRO è obbligatorio';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Devi accettare i termini di servizio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, automatically log in after registration
      await login('demo@gpro.net', 'demo123');
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Errore durante la registrazione. Riprova.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-slate-600';
    }
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'Debole';
      case 2:
        return 'Media';
      case 3:
        return 'Forte';
      case 4:
        return 'Molto forte';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
            Crea il tuo Account
          </h2>
          <p className="text-slate-400">
            Unisciti alla community di piloti professionali
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-600/50">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
              <span className="text-red-400 text-sm">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Nome Utente
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    errors.username ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-red-500'
                  }`}
                  placeholder="scegli un nome utente"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-red-500'
                  }`}
                  placeholder="inserisci la tua email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* GPRO Token Field */}
            <div>
              <label htmlFor="gproToken" className="block text-sm font-medium text-slate-300 mb-2">
                Token GPRO
              </label>
              <input
                id="gproToken"
                name="gproToken"
                type="text"
                required
                value={formData.gproToken}
                onChange={(e) => handleInputChange('gproToken', e.target.value)}
                className={`block w-full px-3 py-3 border rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  errors.gproToken ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-red-500'
                }`}
                placeholder="inserisci il tuo token GPRO"
              />
              {errors.gproToken && (
                <p className="mt-1 text-sm text-red-400">{errors.gproToken}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Trova il tuo token nelle impostazioni del tuo account GPRO
              </p>
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-red-500'
                  }`}
                  placeholder="crea una password sicura"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          getPasswordStrengthColor(passwordStrength(formData.password))
                        }`}
                        style={{ width: `${(passwordStrength(formData.password) / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {getPasswordStrengthText(passwordStrength(formData.password))}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Conferma Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-red-500'
                  }`}
                  placeholder="conferma la password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className={`h-4 w-4 text-red-600 focus:ring-red-500 border-slate-600 rounded bg-slate-700 ${
                    errors.acceptTerms ? 'border-red-500' : ''
                  }`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="text-slate-300">
                  Accetto i{' '}
                  <Link to="/terms" className="text-red-400 hover:text-red-300">
                    Termini di Servizio
                  </Link>{' '}
                  e la{' '}
                  <Link to="/privacy" className="text-red-400 hover:text-red-300">
                    Privacy Policy
                  </Link>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-red-400">{errors.acceptTerms}</p>
                )}
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
                  Registrazione in corso...
                </div>
              ) : (
                'Crea Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-slate-400">Hai già un account? </span>
            <Link
              to="/login"
              className="font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              Accedi qui
            </Link>
          </div>
        </div>

        {/* Demo Info */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="text-green-400 font-medium">Modalità Demo</h3>
          </div>
          <p className="text-sm text-green-300">
            Questa è una demo. La registrazione ti porterà automaticamente alla dashboard demo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;