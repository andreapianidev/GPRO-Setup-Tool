import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format numbers with proper decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}

/**
 * Format time in MM:SS.mmm format
 */
export function formatLapTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60
  return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Format dates in a readable format
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(dateObj)
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Generate random ID
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, length + 2)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Calculate setup confidence based on data quality
 */
export function calculateConfidence(
  driverData: any,
  carData: any,
  trackData: any,
  weatherData: any
): number {
  let confidence = 0
  
  // Driver data quality (25%)
  if (driverData?.overall && driverData?.experience) confidence += 0.25
  
  // Car data quality (25%)
  if (carData && Object.keys(carData).length > 5) confidence += 0.25
  
  // Track data quality (25%)
  if (trackData?.power_importance && trackData?.handling_importance) confidence += 0.25
  
  // Weather data quality (25%)
  if (weatherData?.forecast_accuracy && weatherData.forecast_accuracy > 0.7) confidence += 0.25
  
  return Math.min(confidence, 1)
}

/**
 * Get tyre compound color
 */
export function getTyreColor(compound: string): string {
  const colors = {
    soft: 'text-tyre-soft',
    medium: 'text-tyre-medium',
    hard: 'text-tyre-hard',
    intermediate: 'text-tyre-intermediate',
    wet: 'text-tyre-wet',
  }
  return colors[compound as keyof typeof colors] || 'text-gray-500'
}

/**
 * Get performance color based on value
 */
export function getPerformanceColor(performance: string): string {
  const colors = {
    excellent: 'text-performance-excellent',
    good: 'text-performance-good',
    average: 'text-performance-average',
    poor: 'text-performance-poor',
  }
  return colors[performance as keyof typeof colors] || 'text-gray-500'
}

/**
 * Convert setup values to display format
 */
export function formatSetupValue(value: number, type: 'wing' | 'engine' | 'gear' | 'other'): string {
  switch (type) {
    case 'wing':
      return `${value}°`
    case 'engine':
      return `${value}%`
    case 'gear':
      return `${value}`
    default:
      return `${value}`
  }
}

/**
 * Calculate fuel consumption per lap
 */
export function calculateFuelPerLap(
  trackLength: number,
  fuelConsumption: number,
  engineMode: number
): number {
  const baseFuel = (trackLength / 1000) * fuelConsumption
  const engineMultiplier = 1 + (engineMode - 50) / 100
  return baseFuel * engineMultiplier
}

/**
 * Estimate lap time based on setup and conditions
 */
export function estimateLapTime(
  baseTime: number,
  setup: any,
  weather: any
): number {
  let adjustedTime = baseTime
  
  // Weather adjustments
  if (weather?.conditions === 'rain') {
    adjustedTime *= 1.1 // 10% slower in rain
  } else if (weather?.conditions === 'heavy_rain') {
    adjustedTime *= 1.2 // 20% slower in heavy rain
  }
  
  // Setup adjustments (simplified)
  const wingBalance = (setup?.front_wing + setup?.rear_wing) / 2
  if (wingBalance > 70) {
    adjustedTime *= 0.98 // Better handling, slightly faster
  } else if (wingBalance < 30) {
    adjustedTime *= 1.02 // Less downforce, slightly slower on twisty tracks
  }
  
  return adjustedTime
}