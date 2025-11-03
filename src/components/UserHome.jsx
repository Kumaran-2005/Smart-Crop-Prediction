import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { TrendingUp, CheckCircle, Calendar, MapPin, BarChart3, CloudSun, Star, User, FileText, MessageCircle } from 'lucide-react';

// Mock data for demonstration; replace with real data as needed
const mockStats = {
  totalPredictions: 8,
  thisMonth: 'Active farming season',
  successRate: 90.0,
  regions: 7,
};
const mockRecentPredictions = [
  { crop: 'Cotton', location: 'vellore', daysAgo: 3, recommended: true, rate: 90 },
  { crop: 'Cotton', location: 'ranipet', daysAgo: 3, recommended: true, rate: 95 },
  { crop: 'Black Gram', location: 'Mumbai', daysAgo: 4, recommended: true, rate: 85 },
  { crop: 'Cotton', location: 'vellore', daysAgo: 4, recommended: true, rate: 85 },
];
const mockTrends = [
  { crop: 'Cotton', percent: 38 },
  { crop: 'Rice', percent: 13 },
  { crop: 'Tomato', percent: 13 },
  { crop: 'Groundnut', percent: 13 },
];

const UserHome = () => {
  const { currentUser } = useAuth();

  // Extract name from email (before @) and capitalize first letter
  const getDisplayName = (email) => {
    if (!email) return 'User';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Real-time greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 20) return 'Good Evening';
    return 'Good Night';
  };

  // Weather mock
  const weather = { temp: 33, humidity: 92, desc: 'Some clouds' };

  return (
    <div className="min-h-screen bg-[#f7fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col min-h-screen p-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="bg-green-600 rounded-full p-2"><User className="text-white w-6 h-6" /></span>
          <span className="font-bold text-lg text-green-700">SmartCrop</span>
        </div>
        <nav className="flex flex-col gap-4 mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-700 font-medium hover:text-green-700"><BarChart3 className="w-5 h-5" /> Dashboard</Link>
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 font-medium hover:text-green-700"><FileText className="w-5 h-5" /> Crop Prediction</Link>
        </nav>
        <div className="mb-6">
          <div className="bg-green-50 rounded-lg p-4 mb-3">
            <div className="text-xs text-gray-500">Success Rate</div>
            <div className="text-xl font-bold text-green-700">90.0%</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-xs text-gray-500">Regions Covered</div>
            <div className="text-xl font-bold text-purple-700">7+</div>
          </div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 flex flex-col items-center mt-auto">
          <div className="font-semibold text-green-700 mb-1">Agricultural Expert</div>
          <div className="text-xs text-gray-600 mb-2">Smart farming solutions</div>
          <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Contact</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{getGreeting()}, {getDisplayName(currentUser?.email)}!</h1>
            <div className="text-gray-600">Welcome to SmartCrop - your AI powered agricultural intelligence platform.</div>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700">+ New Prediction</Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow flex flex-col gap-1">
            <div className="text-xs text-gray-500">Total Predictions</div>
            <div className="text-2xl font-bold">{mockStats.totalPredictions}</div>
            <div className="text-green-600 text-xs">+23% vs last month</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow flex flex-col gap-1">
            <div className="text-xs text-gray-500">This Month</div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-gray-500 text-xs">{mockStats.thisMonth}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow flex flex-col gap-1">
            <div className="text-xs text-gray-500">Success Rate</div>
            <div className="text-2xl font-bold text-green-700">{mockStats.successRate}%</div>
            <div className="text-gray-500 text-xs">AI accuracy improving</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow flex flex-col gap-1">
            <div className="text-xs text-gray-500">Regions Covered</div>
            <div className="text-2xl font-bold text-purple-700">{mockStats.regions}</div>
            <div className="text-gray-500 text-xs">Growing coverage</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Predictions */}
          <div className="bg-white rounded-lg shadow p-4 col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">Recent Predictions</div>
            </div>
            <ul className="divide-y">
              {mockRecentPredictions.map((pred, idx) => (
                <li key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600 w-5 h-5" />
                    <span className="font-medium">{pred.crop}</span>
                    <span className="text-gray-500 text-xs flex items-center gap-1"><MapPin className="w-4 h-4" /> {pred.location}</span>
                    <span className="text-gray-400 text-xs">{pred.daysAgo} days ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pred.recommended && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Recommended</span>}
                    <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold"><Star className="w-4 h-4" /> {pred.rate}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Weather Insights */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
            <div className="font-semibold text-lg mb-2">Weather Insights</div>
            <div className="text-gray-500 text-sm mb-2">{weather.desc}</div>
            <div className="flex gap-6 mb-2">
              <div className="flex flex-col items-center">
                <span className="text-red-600 text-2xl font-bold">{weather.temp}&deg;C</span>
                <span className="text-xs text-gray-500">Temperature</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-blue-600 text-2xl font-bold">{weather.humidity}%</span>
                <span className="text-xs text-gray-500">Humidity</span>
              </div>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-3 text-xs text-orange-800">
              <span className="font-semibold">Farming Advisory:</span> Given the warm temperature of 33°C and high humidity at 92%, it's advisable to irrigate crops early in the morning to prevent water stress, while also monitoring for fungal diseases due to the moisture. Consider applying a fungicide if signs of disease appear on sensitive plants.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Popular Crop Trends */}
          <div className="bg-white rounded-lg shadow p-4 col-span-2">
            <div className="font-semibold text-lg mb-2">Popular Crop Trends</div>
            <ul className="space-y-2">
              {mockTrends.map((trend, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <span className="w-24 font-medium">{trend.crop}</span>
                  <div className="flex-1 bg-gray-100 rounded h-3">
                    <div className="bg-green-600 h-3 rounded" style={{ width: `${trend.percent}%` }}></div>
                  </div>
                  <span className="w-10 text-right text-gray-600 text-sm">{trend.percent}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions & Tips */}
          <div className="flex flex-col gap-6">
            <div className="bg-green-50 rounded-lg shadow p-4 flex flex-col gap-3">
              <div className="font-semibold text-lg mb-2">Quick Actions</div>
              <Link to="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 text-center">Start New Analysis</Link>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-4">
              <div className="font-semibold text-lg mb-2 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-yellow-500" /> Today's Tip</div>
              <div className="text-gray-700 text-sm">Implement crop rotation on your farm: it helps improve soil health, reduces pests and diseases, and enhances biodiversity. Start by alternating crops in different seasons to keep your soil productive and resilient!</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserHome;
