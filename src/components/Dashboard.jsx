import { generateCropReport } from '../services/pdfService';
import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Droplets, Calendar, Search, AlertCircle, CheckCircle, TrendingUp, Wheat, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getWeatherByLocation } from '../services/weatherService';
import { analyzeCropSuitability, getSuitableCrops } from '../services/cropAnalysis';
import { fetchSoilData } from '../services/soilGridService';
import { geocodeCity } from '../services/geocodeService';
import { getCityDefaultPh } from '../data/cityPh';
import { cropDatabase, soilTypes, seasons } from '../data/crops';
import { fertilizerDatabase } from '../data/fertilizers';
// Removed recent predictions list; Firestore subscription not needed here
import CropDetailModal from './CropDetailModal';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    location: '',
    soilType: '',
    crop: '',
    temperature: '',
    pH: '',
    season: '',
    useManualWeather: false
  });
  
  const [weatherData, setWeatherData] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [soilLoading, setSoilLoading] = useState(false);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [suitableCrops, setSuitableCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Removed: userPredictions list and Firestore subscription
  const [pHTouched, setPHTouched] = useState(false);
  const [lastAutoPhInfo, setLastAutoPhInfo] = useState(null);

  const { recordPrediction, currentUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'pH') setPHTouched(true);
    if (name === 'location') {
      // New location typed — allow auto-fill on next fetch
      setPHTouched(false);
      setLastAutoPhInfo(null);
    }
  };

  const fetchWeather = async () => {
    if (!formData.location) return;
    
    setLoading(true);
    setError('');
    
    try {
      const weather = await getWeatherByLocation(formData.location);
      setWeatherData(weather);
      setFormData(prev => ({
        ...prev,
        temperature: weather.temperature.toFixed(1)
      }));
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const handleSoilFetch = async () => {
    setSoilLoading(true);
    setError('');
    try {
      let latitude = null;
      let longitude = null;
      // Prefer geocoding when a city name is provided (so searches by different cities don't reuse old lat/lon)
      if (formData.location) {
        const geo = await geocodeCity(formData.location);
        latitude = geo.lat;
        longitude = geo.lon;
        setLat(latitude);
        setLon(longitude);
      } else if (lat && lon) {
        // Fall back to manual lat/lon inputs only when no city is provided
        latitude = lat;
        longitude = lon;
      }
      if (!latitude || !longitude) {
        setError('Please provide a city name or latitude/longitude.');
        setSoilLoading(false);
        return;
      }

      // Immediately suggest a city-based pH while SoilGrids loads (perceived performance boost)
      if (!pHTouched) {
        const immediateCityPh = getCityDefaultPh(formData.location || `${parseFloat(latitude)},${parseFloat(longitude)}`);
        if (immediateCityPh != null && !isNaN(immediateCityPh)) {
          setFormData(prev => ({ ...prev, pH: Number(immediateCityPh).toFixed(2) }));
          setLastAutoPhInfo({ ph: Number(immediateCityPh).toFixed(2), lat: parseFloat(latitude), lon: parseFloat(longitude), location: formData.location || `${parseFloat(latitude)},${parseFloat(longitude)}` });
        }
      }

  // Fetch soil data from SoilGrids (may be cached/fast)
  const soilRes = await fetchSoilData(parseFloat(latitude), parseFloat(longitude));
      setSoilData(soilRes.raw || soilRes);

      // Auto-fill pH using a city-aware helper unless the user manually edited pH
      if (!pHTouched) {
        const cityOrCoords = formData.location || (latitude && longitude ? `${parseFloat(latitude)},${parseFloat(longitude)}` : '');
        const suggestedPh = getCityDefaultPh(cityOrCoords, soilRes && soilRes.ph != null ? soilRes.ph : null);
        if (suggestedPh != null && !isNaN(suggestedPh)) {
          setFormData(prev => ({ ...prev, pH: Number(suggestedPh).toFixed(2) }));
          setLastAutoPhInfo({ ph: Number(suggestedPh).toFixed(2), lat: parseFloat(latitude), lon: parseFloat(longitude), location: formData.location || `${parseFloat(latitude)},${parseFloat(longitude)}` });
        }
      }
    } catch (err) {
      console.error('Soil fetch error', err);
      setError('Failed to fetch soil data');
    }
    setSoilLoading(false);
  };

  const handleAnalysis = async () => {
    if (!formData.crop || !formData.soilType) {
      setError('Please select crop and soil type');
      return;
    }


    let temperature = parseFloat(formData.temperature);
    let pH = formData.pH === '' ? null : parseFloat(formData.pH);
    // Ensure pH is within the app's allowed agricultural bounds [5.5, 8.5]
    if (pH !== null && !isNaN(pH)) {
      pH = Math.max(5.5, Math.min(8.5, pH));
    }

    if (isNaN(temperature)) {
      setError('Please provide a valid temperature value');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Analyze selected crop
      const cropAnalysis = analyzeCropSuitability(
        formData.crop,
        formData.soilType,
        temperature,
        pH,
        formData.season
      );

      setAnalysis(cropAnalysis);

      // Get suitable crops for the conditions
      const suitable = getSuitableCrops(
        formData.soilType,
        temperature,
        pH,
        formData.season
      );

      setSuitableCrops(suitable);

      // Record this prediction with details for history
      await recordPrediction({
        crop: formData.crop,
        soilType: formData.soilType,
        temperature,
        pH,
        season: formData.season,
        result: cropAnalysis.message
      });
    } catch (err) {
      setError('');
    }

    setLoading(false);
  };

  // Firestore subscription for recent predictions removed per request

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-600">
            <Leaf className="w-6 h-6 text-white" />
          </span>
          Crop Suitability Analysis
        </h1>
        <p className="text-gray-600">Enter your location and crop details to get intelligent predictions</p>
      </motion.div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SoilGrids API Inputs */}
          <div className="space-y-2 md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Fetch Soil Data (SoilGrids API)</label>
            <div className="flex gap-2 flex-wrap">
              <input
                type="number"
                placeholder="Latitude"
                value={lat}
                onChange={e => setLat(e.target.value)}
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                step="any"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={lon}
                onChange={e => setLon(e.target.value)}
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                step="any"
              />
              <button
                type="button"
                onClick={handleSoilFetch}
                disabled={soilLoading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {soilLoading ? 'Fetching...' : 'Fetch Soil Data'}
              </button>
              <span className="text-xs text-gray-500">(Leave lat/lon empty to use city name)</span>
            </div>
            {/* Soil data is fetched and stored in state but raw JSON is not displayed to users */}
          </div>
          {/* Location Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter city name"
              />
            </div>
            <button
              onClick={fetchWeather}
              disabled={loading || !formData.location}
              className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Fetch Weather
            </button>
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Soil Type
            </label>
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select soil type</option>
              {soilTypes.map(soil => (
                <option key={soil} value={soil}>{soil}</option>
              ))}
            </select>
          </div>

          {/* Crop Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Crop
            </label>
            <select
              name="crop"
              value={formData.crop}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select crop</option>
              {Object.keys(cropDatabase).map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Season
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select season</option>
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Temperature (°C)
            </label>
            <div className="relative">
              <Thermometer className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="25"
                step="0.1"
              />
            </div>
          </div>

          {/* pH */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              pH Level
            </label>
            <div className="relative">
              <Droplets className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="number"
                name="pH"
                value={formData.pH}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="6.5"
                step="0.1"
                  min="0"
                  max="10"
              />
              </div>
              {lastAutoPhInfo && (
                <div className="text-xs text-gray-500 mt-1">Auto-filled pH {lastAutoPhInfo.ph} for {lastAutoPhInfo.location} (lat: {lastAutoPhInfo.lat}, lon: {lastAutoPhInfo.lon})</div>
              )}
          </div>
        </div>

        {/* Weather Display */}
        {weatherData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h3 className="font-medium text-blue-900 mb-2">Current Weather in {weatherData.location}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Temperature:</span>
                <p className="font-medium">{weatherData.temperature}°C</p>
              </div>
              <div>
                <span className="text-blue-600">Humidity:</span>
                <p className="font-medium">{weatherData.humidity}%</p>
              </div>
              <div>
                <span className="text-blue-600">Weather:</span>
                <p className="font-medium">{weatherData.weather}</p>
              </div>
              <div>
                <span className="text-blue-600">Description:</span>
                <p className="font-medium">{weatherData.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Analyze Button */}
        <div className="mt-6">
          <button
            onClick={handleAnalysis}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>{loading ? 'Analyzing...' : 'Analyze Crop Suitability'}</span>
          </button>
        </div>
      </motion.div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Crop Analysis */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              {analysis.suitable ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
              <h3 className="text-lg font-semibold">
                {formData.crop} Analysis
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Suitability Score:</span>
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className={`font-bold ${analysis.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>{analysis.score}/100</span>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  onClick={() => generateCropReport({
                    crop: formData.crop,
                    soilType: formData.soilType,
                    temperature: formData.temperature,
                    pH: formData.pH,
                    season: formData.season,
                    analysis,
                    suitableCrops
                  })}
                >
                  <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Download PDF
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    analysis.score >= 60 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(analysis.score, 5)}%` }}
                ></div>
              </div>
              <p className={`text-sm ${analysis.suitable ? 'text-green-700' : 'text-red-700'}`}>{analysis.message}</p>
              {analysis.penalties && analysis.penalties.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Issues Identified:</h4>
                  <ul className="text-sm space-y-1">
                    {analysis.penalties.map((penalty, index) => (
                      <li key={index} className="text-red-600 flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{penalty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* Suitable Crops & Fertilizer Recommendations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Wheat className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold">Recommended Crops & Fertilizers</h3>
            </div>
            {suitableCrops.length > 0 ? (
              <div className="space-y-6">
                {suitableCrops.slice(0, 6).map((crop, index) => {
                  const ferts = fertilizerDatabase.filter(f => f.crop === crop.name).slice(0, 3);
                  return (
                    <motion.div
                      key={crop.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-green-900">{crop.name}</h4>
                          <p className="text-sm text-green-700">
                            Water: {crop.waterRequirement} | Season: {crop.season.join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{crop.score}</div>
                          <div className="text-xs text-green-500">Score</div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button onClick={() => setSelectedCrop(crop.name)} className="px-3 py-1 bg-white border border-green-600 text-green-700 rounded-md text-sm hover:bg-green-50">View Details</button>
                      </div>
                      {/* Fertilizer Recommendations */}
                      {ferts.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-semibold text-gray-700 mb-1">Fertilizer Recommendations:</div>
                          <ul className="text-sm space-y-1">
                            {ferts.map(fert => (
                              <li key={fert.name} className="flex flex-col md:flex-row md:items-center md:space-x-2">
                                <span className="font-medium text-green-800">{fert.name}</span>
                                <span className="text-gray-600">₹{fert.price}/kg</span>
                                <span className="text-gray-500">({fert.use})</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No suitable crops found for the given conditions.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Recent predictions sections removed as requested */}

      {selectedCrop && (
        <CropDetailModal crop={selectedCrop} soilType={formData.soilType} pH={formData.pH} onClose={() => setSelectedCrop(null)} />
      )}
    </div>
  );
};

export default Dashboard;
