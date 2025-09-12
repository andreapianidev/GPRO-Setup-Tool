import { Link } from 'react-router-dom'
import { Calculator, Zap, TrendingUp, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gpro-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gpro-900">GPRO Setup Tool</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gpro-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gpro-600 hover:bg-gpro-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Your
              <span className="text-gpro-600 block">GPRO Strategy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced setup calculator and strategy tool for Grand Prix Racing Online.
              Optimize your car setup, fuel strategy, and race analysis with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gpro-600 hover:bg-gpro-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="border border-gpro-600 text-gpro-600 hover:bg-gpro-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need to Win
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools designed specifically for GPRO managers
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gpro-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-gpro-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Setup Calculator</h3>
                <p className="text-gray-600">
                  AI-powered setup optimization based on track conditions, weather, and car data
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gpro-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gpro-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Strategy Engine</h3>
                <p className="text-gray-600">
                  Advanced fuel and tire strategy calculations with multiple scenario analysis
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gpro-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-gpro-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Race Analysis</h3>
                <p className="text-gray-600">
                  Post-race performance analysis with actionable insights for improvement
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gpro-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gpro-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Fast</h3>
                <p className="text-gray-600">
                  Enterprise-grade security with lightning-fast calculations and data sync
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gpro-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Dominate the Track?
            </h2>
            <p className="text-xl text-gpro-100 mb-8">
              Join thousands of GPRO managers who trust our tools for race-winning strategies
            </p>
            <Link
              to="/register"
              className="bg-white text-gpro-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">GPRO Setup Tool</h3>
            <p className="text-gray-400 mb-4">
              Advanced setup calculator and strategy tool for Grand Prix Racing Online
            </p>
            <p className="text-sm text-gray-500">
              © 2024 GPRO Setup Tool. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}