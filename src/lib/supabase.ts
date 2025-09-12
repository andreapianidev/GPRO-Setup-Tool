import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          trial_active: boolean
          trial_expires_at: string
          credits_balance: number
        }
        Insert: {
          id: string
          email: string
          trial_active?: boolean
          trial_expires_at?: string
          credits_balance?: number
        }
        Update: {
          email?: string
          trial_active?: boolean
          trial_expires_at?: string
          credits_balance?: number
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          gpro_token_encrypted: string | null
          gpro_username: string | null
          preferences: Record<string, any>
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          gpro_token_encrypted?: string | null
          gpro_username?: string | null
          preferences?: Record<string, any>
          last_sync_at?: string | null
        }
        Update: {
          gpro_token_encrypted?: string | null
          gpro_username?: string | null
          preferences?: Record<string, any>
          last_sync_at?: string | null
        }
      }
      gpro_snapshots: {
        Row: {
          id: string
          user_id: string
          manager_data: Record<string, any> | null
          driver_data: Record<string, any> | null
          car_data: Record<string, any> | null
          track_data: Record<string, any> | null
          weather_data: Record<string, any> | null
          race_history: Record<string, any> | null
          created_at: string
        }
        Insert: {
          user_id: string
          manager_data?: Record<string, any> | null
          driver_data?: Record<string, any> | null
          car_data?: Record<string, any> | null
          track_data?: Record<string, any> | null
          weather_data?: Record<string, any> | null
          race_history?: Record<string, any> | null
        }
        Update: {
          manager_data?: Record<string, any> | null
          driver_data?: Record<string, any> | null
          car_data?: Record<string, any> | null
          track_data?: Record<string, any> | null
          weather_data?: Record<string, any> | null
          race_history?: Record<string, any> | null
        }
      }
      setup_calculations: {
        Row: {
          id: string
          user_id: string
          snapshot_id: string
          q1_setup: Record<string, any> | null
          q2_setup: Record<string, any> | null
          race_setup: Record<string, any> | null
          confidence_level: number | null
          created_at: string
        }
        Insert: {
          user_id: string
          snapshot_id: string
          q1_setup?: Record<string, any> | null
          q2_setup?: Record<string, any> | null
          race_setup?: Record<string, any> | null
          confidence_level?: number | null
        }
        Update: {
          q1_setup?: Record<string, any> | null
          q2_setup?: Record<string, any> | null
          race_setup?: Record<string, any> | null
          confidence_level?: number | null
        }
      }
      strategy_results: {
        Row: {
          id: string
          calculation_id: string
          fuel_strategy: Record<string, any> | null
          tyre_strategy: Record<string, any> | null
          pit_analysis: Record<string, any> | null
          scenarios: Record<string, any> | null
          crossover_data: Record<string, any> | null
          created_at: string
        }
        Insert: {
          calculation_id: string
          fuel_strategy?: Record<string, any> | null
          tyre_strategy?: Record<string, any> | null
          pit_analysis?: Record<string, any> | null
          scenarios?: Record<string, any> | null
          crossover_data?: Record<string, any> | null
        }
        Update: {
          fuel_strategy?: Record<string, any> | null
          tyre_strategy?: Record<string, any> | null
          pit_analysis?: Record<string, any> | null
          scenarios?: Record<string, any> | null
          crossover_data?: Record<string, any> | null
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          transaction_type: 'trial' | 'purchase' | 'calculation' | 'refund'
          description: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          amount: number
          transaction_type: 'trial' | 'purchase' | 'calculation' | 'refund'
          description?: string | null
        }
        Update: {
          amount?: number
          transaction_type?: 'trial' | 'purchase' | 'calculation' | 'refund'
          description?: string | null
        }
      }
      race_analyses: {
        Row: {
          id: string
          user_id: string
          calculation_id: string
          predicted_data: Record<string, any> | null
          actual_results: Record<string, any> | null
          delta_analysis: Record<string, any> | null
          box_radio_report: Record<string, any> | null
          race_date: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          calculation_id: string
          predicted_data?: Record<string, any> | null
          actual_results?: Record<string, any> | null
          delta_analysis?: Record<string, any> | null
          box_radio_report?: Record<string, any> | null
          race_date?: string | null
        }
        Update: {
          predicted_data?: Record<string, any> | null
          actual_results?: Record<string, any> | null
          delta_analysis?: Record<string, any> | null
          box_radio_report?: Record<string, any> | null
          race_date?: string | null
        }
      }
    }
  }
}