import { useCallback } from 'react';


interface UseAnalyticsReturn {
  track: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (page: string) => void;
  trackSetupChange: (setupData: Record<string, any>) => void;
  trackPerformance: (performanceData: Record<string, any>) => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const track = useCallback((event: string, properties?: Record<string, any>) => {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { event, properties });
    }
    
    // Here you would integrate with your analytics service
    // e.g., Google Analytics, Mixpanel, etc.
  }, []);

  const trackPageView = useCallback((page: string) => {
    track('page_view', { page });
  }, [track]);

  const trackSetupChange = useCallback((setupData: Record<string, any>) => {
    track('setup_change', setupData);
  }, [track]);

  const trackPerformance = useCallback((performanceData: Record<string, any>) => {
    track('performance_data', performanceData);
  }, [track]);

  return {
    track,
    trackPageView,
    trackSetupChange,
    trackPerformance,
  };
};

export default useAnalytics;