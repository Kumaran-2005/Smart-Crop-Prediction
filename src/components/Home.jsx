import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, CloudSun, MapPin, FileText, Lock, Download, History, Sprout, Database, UserCheck, BarChart3, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

const heroBg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
const dashboardImg = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80';
const cropsImg = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';

const Predict = () => (
  <div className="bg-[#f8faf5] min-h-screen w-full flex flex-col items-center">
    {/* Hero Section */}
    <div className="relative w-full flex flex-col items-center justify-center min-h-[420px] bg-gradient-to-b from-green-100/80 to-transparent">
      <img src={heroBg} alt="Field" className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none select-none" />
      <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 max-w-3xl text-center">
        <span className="inline-block px-4 py-1 mb-3 rounded-full bg-green-200/80 text-green-800 font-semibold text-xs tracking-wider shadow">🌱 AI-Powered Farming Intelligence</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
          <span className="text-green-700">Smart Crop</span> <span className="text-black">Recommendations</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">Harness the power of AI and real-time weather data to make intelligent crop selection decisions. Maximize your yield with precision agriculture insights.</p>
        <div className="flex justify-center mb-6">
          <Link to="/login" className="px-6 py-3 bg-white border border-green-600 text-green-700 font-semibold rounded-md shadow hover:bg-green-50 transition-colors text-lg">Sign up to get started</Link>
        </div>
        <div className="flex gap-8 justify-center mt-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-green-700">50K+</span>
            <span className="text-gray-600 text-sm">Farmers Served</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-green-700">95%</span>
            <span className="text-gray-600 text-sm">Accuracy Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-green-700">200+</span>
            <span className="text-gray-600 text-sm">Crop Varieties</span>
          </div>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <section className="w-full max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">Intelligent Features for Modern Farming</h2>
      <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">Our comprehensive platform combines AI, weather data, and agricultural expertise to provide actionable insights for optimal crop selection.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <CloudSun className="h-8 w-8 text-blue-400 mb-2" />
          <span className="font-semibold text-lg mb-1">Real-time Weather Integration</span>
          <span className="text-gray-600 text-sm">Live weather data from OpenWeatherMap API including temperature, humidity, and rainfall patterns.</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
          <span className="font-semibold text-lg mb-1">AI-Powered Predictions</span>
          <span className="text-gray-600 text-sm">Advanced ML model trained on agricultural data for precise crop recommendations.</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <Database className="h-8 w-8 text-emerald-500 mb-2" />
          <span className="font-semibold text-lg mb-1">Comprehensive Crop Database</span>
          <span className="text-gray-600 text-sm">Detailed information on growing seasons, soil requirements, pest management, and fertilizer recommendations.</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <UserCheck className="h-8 w-8 text-orange-400 mb-2" />
          <span className="font-semibold text-lg mb-1">User Authentication</span>
          <span className="text-gray-600 text-sm">Secure Google authentication with personalized dashboards and prediction history tracking.</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <Sprout className="h-8 w-8 text-green-600 mb-2" />
          <span className="font-semibold text-lg mb-1">Smart Soil Analysis</span>
          <span className="text-gray-600 text-sm">Intelligent soil type detection and pH estimation with static database fallbacks for missing data.</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
          <FileText className="h-8 w-8 text-indigo-500 mb-2" />
          <span className="font-semibold text-lg mb-1">Detailed Reports</span>
          <span className="text-gray-600 text-sm">Generate and download comprehensive PDF reports with crop insights, predictions, and recommendations.</span>
        </div>
      </div>
    </section>

    {/* How it Works Section */}
    <section className="w-full max-w-5xl mx-auto py-12 px-4 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How SmartCrop Works</h2>
        <p className="text-gray-700 mb-6">Simple, intelligent, and effective. Get crop recommendations in just a few steps.</p>
        <ol className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-bold">1</span>
            <div>
              <span className="font-semibold">Input Your Location & Soil Data</span>
              <div className="text-gray-600 text-sm">Enter your city name and soil type. Optionally provide pH, PPM, temperature, and season data for enhanced accuracy.</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-bold">2</span>
            <div>
              <span className="font-semibold">Real-time Weather Analysis</span>
              <div className="text-gray-600 text-sm">Our system fetches current weather conditions and forecasts using OpenWeatherMap API to factor into recommendations.</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-bold">3</span>
            <div>
              <span className="font-semibold">AI-Powered Prediction</span>
              <div className="text-gray-600 text-sm">Advanced machine learning algorithms analyze all data points to recommend the most suitable crops for your conditions.</div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-700 font-bold">4</span>
            <div>
              <span className="font-semibold">Comprehensive Results</span>
              <div className="text-gray-600 text-sm">Receive detailed crop information including growing seasons, care instructions, pest management, and downloadable reports.</div>
            </div>
          </li>
        </ol>
      </div>
      <div className="flex-1 flex justify-center">
        <img src={dashboardImg} alt="Dashboard preview" className="rounded-xl shadow-lg w-full max-w-md object-cover" />
      </div>
    </section>

    {/* Why Choose Section */}
    <section className="w-full max-w-5xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1">
        <img src={cropsImg} alt="Crops" className="rounded-xl shadow-lg w-full max-w-lg object-cover" />
      </div>
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Choose SmartCrop?</h2>
        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div>
              <span className="font-semibold">Increase Yield by 30%</span>
              <div className="text-gray-600 text-sm">Data-driven crop selection leads to significantly higher agricultural productivity.</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
            <div>
              <span className="font-semibold">Reduce Risk & Costs</span>
              <div className="text-gray-600 text-sm">Minimize crop failure and optimize resource allocation with intelligent recommendations.</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <CloudSun className="h-6 w-6 text-yellow-500" />
            <div>
              <span className="font-semibold">Weather-Aware Planning</span>
              <div className="text-gray-600 text-sm">Real-time weather integration ensures your crops are suited to current and forecasted conditions.</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <div>
              <span className="font-semibold">Expert Knowledge Access</span>
              <div className="text-gray-600 text-sm">Comprehensive agricultural database with expert recommendations and best practices.</div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    {/* Final CTA Section */}
    <section className="w-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 py-12 flex flex-col items-center mt-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to Transform Your Farming?</h2>
      <p className="text-white text-lg mb-6 text-center max-w-2xl">Join thousands of farmers who are already using SmartCrop to make intelligent crop decisions and maximize their agricultural success.</p>
  <Link to="/login" className="px-8 py-3 bg-white text-green-700 font-semibold rounded-md shadow hover:bg-green-50 transition-colors text-lg">Sign up to get started</Link>
    </section>

    {/* Footer */}
    <footer className="w-full py-6 flex flex-col items-center bg-white border-t mt-8">
      <Leaf className="h-7 w-7 text-green-600 mb-1" />
      <span className="text-gray-700 font-semibold">SmartCrop</span>
      <span className="text-gray-500 text-sm">Intelligent crop recommendations powered by AI and real-time data</span>
    </footer>
  </div>
);

export default Predict;
