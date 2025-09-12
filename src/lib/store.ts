import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, UserProfile, NotificationState } from '@/types'

// Auth Store
interface AuthState {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, profile: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// App State Store
interface AppState {
  // UI State
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Current Data
  currentSnapshot: any | null
  currentCalculation: any | null
  
  // Loading States
  syncInProgress: boolean
  calculationInProgress: boolean
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setCurrentSnapshot: (snapshot: any) => void
  setCurrentCalculation: (calculation: any) => void
  setSyncInProgress: (inProgress: boolean) => void
  setCalculationInProgress: (inProgress: boolean) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // UI State
      sidebarOpen: false,
      theme: 'system',
      
      // Current Data
      currentSnapshot: null,
      currentCalculation: null,
      
      // Loading States
      syncInProgress: false,
      calculationInProgress: false,
      
      // Actions
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
      setCurrentSnapshot: (currentSnapshot) => set({ currentSnapshot }),
      setCurrentCalculation: (currentCalculation) => set({ currentCalculation }),
      setSyncInProgress: (syncInProgress) => set({ syncInProgress }),
      setCalculationInProgress: (calculationInProgress) => set({ calculationInProgress }),
      reset: () => set({
        currentSnapshot: null,
        currentCalculation: null,
        syncInProgress: false,
        calculationInProgress: false,
      }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Notifications Store
interface NotificationStore {
  notifications: NotificationState[]
  addNotification: (notification: Omit<NotificationState, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification = { ...notification, id }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))
    
    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      }, notification.duration || 5000)
    }
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
  clearNotifications: () => set({ notifications: [] }),
}))

// Credits Store
interface CreditsState {
  balance: number
  trialActive: boolean
  trialExpiresAt: string | null
  lastTransactionId: string | null
  
  setBalance: (balance: number) => void
  setTrialStatus: (active: boolean, expiresAt?: string) => void
  setLastTransaction: (transactionId: string) => void
  deductCredits: (amount: number) => void
  addCredits: (amount: number) => void
}

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set) => ({
      balance: 0,
      trialActive: false,
      trialExpiresAt: null,
      lastTransactionId: null,
      
      setBalance: (balance) => set({ balance }),
      setTrialStatus: (trialActive, trialExpiresAt) => set({ 
        trialActive, 
        trialExpiresAt: trialExpiresAt || null 
      }),
      setLastTransaction: (lastTransactionId) => set({ lastTransactionId }),
      deductCredits: (amount) => set((state) => ({ 
        balance: Math.max(0, state.balance - amount) 
      })),
      addCredits: (amount) => set((state) => ({ 
        balance: state.balance + amount 
      })),
    }),
    {
      name: 'credits-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Setup Preferences Store
interface SetupPreferences {
  // Calculation preferences
  defaultFuelBuffer: number
  defaultRiskLevel: 'conservative' | 'balanced' | 'aggressive'
  autoSaveCalculations: boolean
  
  // Display preferences
  showAdvancedOptions: boolean
  preferredUnits: 'metric' | 'imperial'
  showConfidenceIndicators: boolean
  
  // Notification preferences
  notifyOnCalculationComplete: boolean
  notifyOnSyncComplete: boolean
  notifyOnLowCredits: boolean
  
  // Actions
  updatePreferences: (preferences: Partial<SetupPreferences>) => void
  resetToDefaults: () => void
}

const defaultPreferences = {
  defaultFuelBuffer: 2.0,
  defaultRiskLevel: 'balanced' as const,
  autoSaveCalculations: true,
  showAdvancedOptions: false,
  preferredUnits: 'metric' as const,
  showConfidenceIndicators: true,
  notifyOnCalculationComplete: true,
  notifyOnSyncComplete: true,
  notifyOnLowCredits: true,
}

export const usePreferencesStore = create<SetupPreferences>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      
      updatePreferences: (preferences) => set((state) => ({ ...state, ...preferences })),
      resetToDefaults: () => set(defaultPreferences),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Utility hooks for common store combinations
export const useAuth = () => {
  const { user, profile, isAuthenticated, isLoading } = useAuthStore()
  const { balance, trialActive } = useCreditsStore()
  
  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    hasCredits: balance > 0 || trialActive,
    creditsBalance: balance,
    trialActive,
  }
}

export const useAppStatus = () => {
  const { syncInProgress, calculationInProgress } = useAppStore()
  const { notifications } = useNotificationStore()
  
  return {
    isBusy: syncInProgress || calculationInProgress,
    syncInProgress,
    calculationInProgress,
    hasNotifications: notifications.length > 0,
    notificationCount: notifications.length,
  }
}