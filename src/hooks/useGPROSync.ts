// One-Click GPRO Data Sync Hook
import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { gproApiService } from '@/services/gproApi'
import { useAuthStore } from '@/lib/store'
import { queryKeys } from '@/lib/react-query'
import type { GPROSnapshot } from '@/types'

interface SyncState {
  isLoading: boolean
  progress: number
  currentStep: string
  error: string | null
  lastSync: Date | null
}

export function useGPROSync() {
  const queryClient = useQueryClient()
  const { profile } = useAuthStore()
  const [syncState, setSyncState] = useState<SyncState>({
    isLoading: false,
    progress: 0,
    currentStep: '',
    error: null,
    lastSync: null
  })

  const updateSyncState = useCallback((updates: Partial<SyncState>) => {
    setSyncState(prev => ({ ...prev, ...updates }))
  }, [])

  // Main sync mutation
  const syncMutation = useMutation({
    mutationFn: async (): Promise<GPROSnapshot> => {
      if (!profile?.gpro_token_encrypted) {
        throw new Error('GPRO token non configurato. Vai al profilo per configurarlo.')
      }

      updateSyncState({
        isLoading: true,
        progress: 10,
        currentStep: 'Validazione token GPRO...',
        error: null
      })

      // Validate token first
      const isValidToken = await gproApiService.validateToken(profile.gpro_token_encrypted)
      if (!isValidToken) {
        throw new Error('Token GPRO non valido. Controlla la configurazione nel profilo.')
      }

      updateSyncState({
        progress: 25,
        currentStep: 'Recupero dati pilota...'
      })

      // Sync all data
      const snapshot = await gproApiService.syncPreRaceData(profile.gpro_token_encrypted)
      if (!snapshot) {
        throw new Error('Errore nel recupero dei dati GPRO. Riprova più tardi.')
      }

      updateSyncState({
        progress: 75,
        currentStep: 'Elaborazione dati...'
      })

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500))

      updateSyncState({
        progress: 100,
        currentStep: 'Sincronizzazione completata!'
      })

      return snapshot
    },
    onSuccess: (snapshot) => {
      // Update React Query cache
      queryClient.setQueryData(queryKeys.gpro.snapshot('current'), snapshot)
      queryClient.invalidateQueries({ queryKey: queryKeys.gpro.all })

      updateSyncState({
        isLoading: false,
        lastSync: new Date(),
        error: null,
        currentStep: 'Dati aggiornati con successo!'
      })

      // Save sync timestamp to profile
      if (profile) {
        // This would normally update the backend
        console.log('Last sync updated:', snapshot.created_at)
      }
    },
    onError: (error: Error) => {
      updateSyncState({
        isLoading: false,
        error: error.message,
        currentStep: 'Errore durante la sincronizzazione'
      })
    }
  })

  // Quick validation check without full sync
  const validateTokenMutation = useMutation({
    mutationFn: async (): Promise<boolean> => {
      if (!profile?.gpro_token_encrypted) {
        throw new Error('Token GPRO non configurato')
      }

      return await gproApiService.validateToken(profile.gpro_token_encrypted)
    }
  })

  // One-click sync function
  const syncData = useCallback(() => {
    syncMutation.mutate()
  }, [syncMutation])

  // Validate token function
  const validateToken = useCallback(() => {
    return validateTokenMutation.mutateAsync()
  }, [validateTokenMutation])

  // Reset sync state
  const resetSyncState = useCallback(() => {
    setSyncState({
      isLoading: false,
      progress: 0,
      currentStep: '',
      error: null,
      lastSync: null
    })
  }, [])

  return {
    // State
    syncState,
    isLoading: syncMutation.isPending,
    error: syncMutation.error?.message || syncState.error,
    
    // Actions
    syncData,
    validateToken,
    resetSyncState,
    
    // Computed
    canSync: !!profile?.gpro_token_encrypted,
    hasValidToken: validateTokenMutation.data === true
  }
}

// Sync progress steps for UI feedback
export const SYNC_STEPS = [
  { id: 1, name: 'Validazione token', progress: 10 },
  { id: 2, name: 'Dati pilota', progress: 25 },
  { id: 3, name: 'Dati auto', progress: 40 },
  { id: 4, name: 'Dati pista', progress: 55 },
  { id: 5, name: 'Meteo', progress: 70 },
  { id: 6, name: 'Elaborazione', progress: 90 },
  { id: 7, name: 'Completato', progress: 100 }
] as const