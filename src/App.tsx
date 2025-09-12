// GPRO Setup Tool - Main Application Component

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Strategy from './pages/Strategy';
import Analysis from './pages/Analysis';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// App Layout Component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      {/* Main content with proper spacing for desktop sidebar and mobile bottom nav */}
      <main className="transition-all duration-300 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-6">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/calculator" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Calculator />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/strategy" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Strategy />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analysis" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Analysis />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route - redirect to landing or dashboard */}
            <Route 
              path="*" 
              element={
                <Navigate to="/" replace />
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;