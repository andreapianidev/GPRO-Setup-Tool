# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GPRO Setup Tool - A Progressive Web Application for Grand Prix Racing Online that provides setup calculations, strategy planning, and race analysis. Currently in MVP phase with simulated calculations and Excel file generation capabilities.

## Essential Commands

```bash
# Development
npm run dev          # Start Vite dev server on port 3000
npm run build        # TypeScript compile + Vite production build
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run check        # TypeScript type checking (no emit)
```

## Architecture Overview

### Frontend Stack
- **React 18** with TypeScript for UI components
- **Vite** for bundling, development server, and PWA features
- **TailwindCSS** with extensive custom racing-themed design system
- **React Router DOM** for SPA routing with protected/public route patterns
- **Zustand** for global client state management with persistence
- **Supabase** for authentication and database operations

### Backend & Services
- **Supabase** for database, authentication, and real-time features
- **Express API** in `/api` directory for Excel generation and additional backend logic
- **ExcelJS** for dynamic Excel file generation with motorsport styling
- **PWA Service Worker** with caching strategies for GPRO API and Supabase

### Key Architectural Patterns

1. **Route-based Organization**: Pages in `/src/pages/` map to routes with protected/public patterns
2. **Component Architecture**: 
   - Reusable UI components in `/src/components/`
   - Page-specific components co-located with pages
   - Custom hooks in `/src/hooks/` for business logic
3. **Type-Safe Domain Models**: Comprehensive TypeScript types in `/src/types/gpro.ts` covering GPRO entities
4. **Path Aliases**: All imports use `@/` prefix mapping to `/src/`
5. **Authentication Flow**: Context-based auth with automatic redirects and session persistence
6. **State Management**: Multiple Zustand stores with localStorage persistence

### State Management Strategy
- **Auth State**: `useAuthStore` with user/profile data and persistence
- **App State**: `useAppStore` for UI state, current data, and loading indicators  
- **Credits System**: `useCreditsStore` for trial/premium user credit tracking
- **Preferences**: `usePreferencesStore` for user settings and calculation preferences
- **Notifications**: `useNotificationStore` for toast notifications with auto-removal

### Database Schema (Supabase)
- **users**: User accounts with trial/credits management
- **user_profiles**: GPRO integration with encrypted token storage
- **gpro_snapshots**: Cached GPRO data (driver, car, track, weather)
- **setup_calculations**: Q1/Q2/Race setup results with confidence levels
- **strategy_results**: Fuel, tyre, and pit stop analysis
- **race_analyses**: Post-race comparison of predicted vs actual results
- **credit_transactions**: Full audit trail of credit usage

### Excel Generation System
Located in `/api/excel/generate-setup.ts` - creates motorsport-themed Excel files with:
- **5 worksheets**: Input, Setup, Strategy, Simulations, Post-Race Report
- **Custom styling**: Racing color palette, freeze panes, alternating rows
- **Simulated data**: Currently generates demo data for MVP validation
- **Performance optimized**: < 500KB files, < 2s generation time

### Custom Tailwind Theme
Extensive theme customization in `tailwind.config.js`:
- **GPRO brand colors** (gpro.50 through gpro.950)
- **Racing semantics** (racing.red, racing.yellow, racing.checkered)
- **Setup status colors** (setup.optimal, setup.warning, setup.danger)
- **Weather/tyre compound colors** with semantic meanings
- **Custom animations** for race-themed interactions
- **Extended spacing, shadows, and border radius**

### Environment Configuration
Required environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- Additional GPRO/weather API keys (for future integration)

### Development Workflow
1. **Package Manager**: Uses npm (not pnpm as README suggests)
2. **Import Conventions**: Always use `@/` path aliases for src imports
3. **Type Safety**: All GPRO domain types defined in `/src/types/gpro.ts`
4. **Component Patterns**: Follow existing component structure and naming
5. **Service Layer**: API integration logic in `/src/services/`
6. **Mock Data**: Development uses `/src/services/mockData.ts` for simulated GPRO data

### Core Features & Current State
1. **Authentication**: Complete Supabase auth with protected routes
2. **Dashboard**: KPI cards, quick actions, race weekend countdown
3. **Setup Calculator**: Currently generates simulated optimal setups
4. **Strategy Planning**: Fuel calculations and pit stop optimization (simulated)  
5. **Analysis Tools**: Post-race comparison functionality (simulated)
6. **Excel Export**: Full Excel generation with professional motorsport styling
7. **Credits System**: Trial user limitations with transaction tracking

### Build Configuration
- **Vite config** includes manual chunking for optimal loading
- **PWA setup** with service worker and offline caching
- **TypeScript** strict mode with comprehensive path mapping
- **Development server** on port 3000 with hot reload