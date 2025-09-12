import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode } from 'react'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error.status)) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

interface ReactQueryProviderProps {
  children: ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

export { queryClient }

// Query keys factory
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },
  
  // GPRO Data
  gpro: {
    all: ['gpro'] as const,
    snapshots: () => [...queryKeys.gpro.all, 'snapshots'] as const,
    snapshot: (id: string) => [...queryKeys.gpro.snapshots(), id] as const,
    sync: ['gpro', 'sync'] as const,
  },
  
  // Calculations
  calculations: {
    all: ['calculations'] as const,
    list: (filters?: any) => [...queryKeys.calculations.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.calculations.all, 'detail', id] as const,
    history: (userId: string) => [...queryKeys.calculations.all, 'history', userId] as const,
  },
  
  // Strategy
  strategy: {
    all: ['strategy'] as const,
    results: (calculationId: string) => [...queryKeys.strategy.all, 'results', calculationId] as const,
    scenarios: (calculationId: string) => [...queryKeys.strategy.all, 'scenarios', calculationId] as const,
  },
  
  // Credits
  credits: {
    all: ['credits'] as const,
    balance: ['credits', 'balance'] as const,
    transactions: (userId: string) => [...queryKeys.credits.all, 'transactions', userId] as const,
  },
  
  // Analysis
  analysis: {
    all: ['analysis'] as const,
    race: (calculationId: string) => [...queryKeys.analysis.all, 'race', calculationId] as const,
    performance: (userId: string) => [...queryKeys.analysis.all, 'performance', userId] as const,
  },
  
  // External APIs
  external: {
    weather: (track: string, date: string) => ['external', 'weather', track, date] as const,
    trackData: (trackId: string) => ['external', 'track', trackId] as const,
  },
} as const

// Utility functions for cache management
export const cacheUtils = {
  // Invalidate all queries for a specific key pattern
  invalidateQueries: (queryKey: readonly unknown[]) => {
    return queryClient.invalidateQueries({ queryKey })
  },
  
  // Remove specific query from cache
  removeQueries: (queryKey: readonly unknown[]) => {
    return queryClient.removeQueries({ queryKey })
  },
  
  // Set query data manually
  setQueryData: <T,>(queryKey: readonly unknown[], data: T) => {
    return queryClient.setQueryData(queryKey, data)
  },
  
  // Get query data from cache
  getQueryData: <T,>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData<T>(queryKey)
  },
  
  // Prefetch query
  prefetchQuery: (queryKey: readonly unknown[], queryFn: () => Promise<any>) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
    })
  },
  
  // Clear all cache
  clear: () => {
    return queryClient.clear()
  },
}