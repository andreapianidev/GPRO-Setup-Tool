// GPRO Setup Tool - Profile Settings Page

import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Globe,
  Shield,
  CreditCard,
  Download,
  Upload,
  Save,
  Edit3,
  Camera,
  Mail,
  MapPin,
  Calendar,
  Trophy,
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockProfile } from '../services/mockData';

type SettingsTab = 'profile' | 'preferences' | 'notifications' | 'privacy' | 'billing' | 'data';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || 'Mario',
    lastName: user?.name?.split(' ')[1] || 'Rossi',
    email: user?.email || 'mario.rossi@email.com',
    phone: '+39 123 456 7890',
    country: 'Italia',
    city: 'Milano',
    birthDate: '1990-05-15',
    bio: 'Pilota GPRO appassionato con 5 anni di esperienza. Specializzato in strategie aggressive e gestione gomme.',
    avatar: '/api/placeholder/120/120'
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    language: 'it',
    timezone: 'Europe/Rome',
    theme: 'dark',
    units: 'metric',
    defaultView: 'dashboard',
    autoCalculate: true,
    showAdvanced: true,
    soundEffects: true,
    animations: true,
    compactMode: false
  });
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    raceReminders: true,
    setupAlerts: true,
    weatherUpdates: true,
    strategyTips: false,
    emailDigest: true,
    pushNotifications: true,
    smsAlerts: false,
    weeklyReport: true
  });
  
  // Privacy state (unused but kept for future development)
  // const [privacy] = useState({
  //   profileVisibility: 'public',
  //   shareStatistics: true,
  //   allowAnalytics: true,
  //   dataCollection: 'essential',
  //   thirdPartySharing: false,
  //   marketingEmails: false
  // });

  const tabs = [
    {
      id: 'profile' as SettingsTab,
      name: 'Profilo',
      icon: User,
      description: 'Informazioni personali'
    },
    {
      id: 'preferences' as SettingsTab,
      name: 'Preferenze',
      icon: Settings,
      description: 'Impostazioni app'
    },
    {
      id: 'notifications' as SettingsTab,
      name: 'Notifiche',
      icon: Bell,
      description: 'Avvisi e comunicazioni'
    },
    {
      id: 'privacy' as SettingsTab,
      name: 'Privacy',
      icon: Shield,
      description: 'Sicurezza e privacy'
    },
    {
      id: 'billing' as SettingsTab,
      name: 'Abbonamento',
      icon: CreditCard,
      description: 'Piano e pagamenti'
    },
    {
      id: 'data' as SettingsTab,
      name: 'Dati',
      icon: Download,
      description: 'Import/Export'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const renderProfileTab = () => {
    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="relative mb-4 md:mb-0">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Annulla' : 'Modifica'}
                </button>
              </div>
              
              <p className="text-slate-400 mb-4">{profileData.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-slate-300">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  {profileData.email}
                </div>
                
                <div className="flex items-center text-slate-300">
                  <MapPin className="w-4 h-4 mr-2 text-green-400" />
                  {profileData.city}, {profileData.country}
                </div>
                
                <div className="flex items-center text-slate-300">
                  <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                  Membro dal 2019
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Form */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Informazioni Personali</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cognome
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Telefono
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Paese
              </label>
              <select
                value={profileData.country}
                onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="Italia">Italia</option>
                <option value="Francia">Francia</option>
                <option value="Germania">Germania</option>
                <option value="Spagna">Spagna</option>
                <option value="Regno Unito">Regno Unito</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Città
              </label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Biografia
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
              placeholder="Racconta qualcosa di te e della tua esperienza in GPRO..."
            />
          </div>
          
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 rounded-lg transition-colors"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
              </button>
            </div>
          )}
        </div>
        
        {/* Statistics */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Statistiche Profilo</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">127</div>
              <div className="text-sm text-slate-400">Gare Completate</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">23</div>
              <div className="text-sm text-slate-400">Podi Ottenuti</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">8.7</div>
              <div className="text-sm text-slate-400">Rating Medio</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">342</div>
              <div className="text-sm text-slate-400">Setup Creati</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPreferencesTab = () => {
    return (
      <div className="space-y-6">
        {/* General Preferences */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-400" />
            Preferenze Generali
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Lingua
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="it">Italiano</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fuso Orario
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Europe/Rome">Europa/Roma (GMT+1)</option>
                <option value="Europe/London">Europa/Londra (GMT+0)</option>
                <option value="Europe/Paris">Europa/Parigi (GMT+1)</option>
                <option value="America/New_York">America/New York (GMT-5)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tema
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="dark">Scuro</option>
                <option value="light">Chiaro</option>
                <option value="auto">Automatico</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Unità di Misura
              </label>
              <select
                value={preferences.units}
                onChange={(e) => setPreferences({...preferences, units: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="metric">Metriche (km/h, °C)</option>
                <option value="imperial">Imperiali (mph, °F)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* App Behavior */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-green-400" />
            Comportamento App
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Calcolo Automatico</div>
                <div className="text-sm text-slate-400">Calcola automaticamente i setup quando cambiano i parametri</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoCalculate}
                  onChange={(e) => setPreferences({...preferences, autoCalculate: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Mostra Opzioni Avanzate</div>
                <div className="text-sm text-slate-400">Visualizza impostazioni avanzate nei calcolatori</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.showAdvanced}
                  onChange={(e) => setPreferences({...preferences, showAdvanced: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Effetti Sonori</div>
                <div className="text-sm text-slate-400">Riproduci suoni per azioni e notifiche</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.soundEffects}
                  onChange={(e) => setPreferences({...preferences, soundEffects: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Animazioni</div>
                <div className="text-sm text-slate-400">Abilita transizioni e animazioni nell'interfaccia</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.animations}
                  onChange={(e) => setPreferences({...preferences, animations: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Modalità Compatta</div>
                <div className="text-sm text-slate-400">Riduci spaziature e dimensioni per più contenuto</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.compactMode}
                  onChange={(e) => setPreferences({...preferences, compactMode: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationsTab = () => {
    return (
      <div className="space-y-6">
        {/* Race Notifications */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-yellow-400" />
            Notifiche Gara
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Promemoria Gare</div>
                <div className="text-sm text-slate-400">Ricevi notifiche prima dell'inizio delle gare</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.raceReminders}
                  onChange={(e) => setNotifications({...notifications, raceReminders: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Avvisi Setup</div>
                <div className="text-sm text-slate-400">Notifiche quando è necessario aggiornare il setup</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.setupAlerts}
                  onChange={(e) => setNotifications({...notifications, setupAlerts: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Aggiornamenti Meteo</div>
                <div className="text-sm text-slate-400">Avvisi per cambiamenti meteorologici importanti</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.weatherUpdates}
                  onChange={(e) => setNotifications({...notifications, weatherUpdates: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Consigli Strategia</div>
                <div className="text-sm text-slate-400">Suggerimenti personalizzati per migliorare le prestazioni</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.strategyTips}
                  onChange={(e) => setNotifications({...notifications, strategyTips: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Communication Channels */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-400" />
            Canali di Comunicazione
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Email Digest</div>
                <div className="text-sm text-slate-400">Riassunto settimanale via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailDigest}
                  onChange={(e) => setNotifications({...notifications, emailDigest: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Notifiche Push</div>
                <div className="text-sm text-slate-400">Notifiche istantanee sul dispositivo</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">SMS Alerts</div>
                <div className="text-sm text-slate-400">Avvisi critici via SMS</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.smsAlerts}
                  onChange={(e) => setNotifications({...notifications, smsAlerts: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBillingTab = () => {
    const profile = mockProfile;
    
    return (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-400" />
            Piano Attuale
          </h3>
          
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-white">GPRO Pro Trial</h4>
                <p className="text-blue-300">Accesso completo a tutte le funzionalità</p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-white">€0</div>
                <div className="text-sm text-slate-400">per 14 giorni</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-slate-300">
                Crediti rimanenti: <span className="font-bold text-white">{profile.credits}</span>
              </div>
              
              <div className="text-sm text-slate-300">
                Scade il: <span className="font-bold text-white">15 Marzo 2024</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '65%'}} />
            </div>
            
            <div className="text-xs text-slate-400 text-center">
              9 giorni rimanenti nel periodo di prova
            </div>
          </div>
        </div>
        
        {/* Available Plans */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Piani Disponibili</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold text-white mb-2">Basic</h4>
                <div className="text-3xl font-bold text-white mb-1">€9.99</div>
                <div className="text-sm text-slate-400">al mese</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Setup Calculator
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Fuel Coach
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  100 crediti/mese
                </li>
                <li className="flex items-center text-sm text-slate-400">
                  <AlertTriangle className="w-4 h-4 mr-2 text-slate-500" />
                  Analisi base
                </li>
              </ul>
              
              <button className="w-full py-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-white font-medium">
                Seleziona Basic
              </button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-blue-600/20 to-purple-600/20 rounded-lg p-6 border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Più Popolare
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold text-white mb-2">Pro</h4>
                <div className="text-3xl font-bold text-white mb-1">€19.99</div>
                <div className="text-sm text-slate-400">al mese</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Tutte le funzionalità Basic
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Strategy Advisor completo
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Post-Race Analysis
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  500 crediti/mese
                </li>
              </ul>
              
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium">
                Upgrade a Pro
              </button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold text-white mb-2">Enterprise</h4>
                <div className="text-3xl font-bold text-white mb-1">€49.99</div>
                <div className="text-sm text-slate-400">al mese</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Tutte le funzionalità Pro
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  API Access
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Crediti illimitati
                </li>
                <li className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Supporto prioritario
                </li>
              </ul>
              
              <button className="w-full py-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-white font-medium">
                Contatta Vendite
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDataTab = () => {
    return (
      <div className="space-y-6">
        {/* Export Data */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-400" />
            Esporta Dati
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Setup Configurations</h4>
              <p className="text-sm text-slate-400 mb-4">
                Esporta tutti i tuoi setup salvati in formato JSON
              </p>
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white">
                <Download className="w-4 h-4 mr-2" />
                Esporta Setup
              </button>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Race History</h4>
              <p className="text-sm text-slate-400 mb-4">
                Scarica la cronologia completa delle tue gare
              </p>
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white">
                <Download className="w-4 h-4 mr-2" />
                Esporta Cronologia
              </button>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Performance Analytics</h4>
              <p className="text-sm text-slate-400 mb-4">
                Dati analitici e statistiche delle prestazioni
              </p>
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white">
                <Download className="w-4 h-4 mr-2" />
                Esporta Analytics
              </button>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Complete Backup</h4>
              <p className="text-sm text-slate-400 mb-4">
                Backup completo di tutti i tuoi dati
              </p>
              <button className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white">
                <Download className="w-4 h-4 mr-2" />
                Backup Completo
              </button>
            </div>
          </div>
        </div>
        
        {/* Import Data */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-green-400" />
            Importa Dati
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-slate-400" />
                <h4 className="text-white font-medium mb-2">Importa Setup</h4>
                <p className="text-sm text-slate-400 mb-4">
                  Carica file JSON con configurazioni setup
                </p>
                <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-white">
                  Seleziona File
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-slate-400" />
                <h4 className="text-white font-medium mb-2">Ripristina Backup</h4>
                <p className="text-sm text-slate-400 mb-4">
                  Ripristina da un backup completo precedente
                </p>
                <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors text-white">
                  Seleziona Backup
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Management */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Gestione Dati</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
              <div>
                <div className="text-white font-medium">Cancella Cache</div>
                <div className="text-sm text-yellow-300">Rimuovi dati temporanei e cache dell'applicazione</div>
              </div>
              <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors text-white">
                Cancella Cache
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
              <div>
                <div className="text-white font-medium">Elimina Account</div>
                <div className="text-sm text-red-300">Elimina permanentemente il tuo account e tutti i dati</div>
              </div>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white">
                Elimina Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderNotificationsTab(); // Simplified for demo
      case 'billing':
        return renderBillingTab();
      case 'data':
        return renderDataTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:pl-64">
      <div className="p-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Impostazioni Profilo
          </h1>
          <p className="text-slate-400">
            Gestisci il tuo account e personalizza l'esperienza GPRO Setup Tool
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 border-white/30 shadow-lg'
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

export default Profile;