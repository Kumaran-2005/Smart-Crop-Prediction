import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByLocation = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric'
      }
    });

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      weather: response.data.weather[0].main,
      description: response.data.weather[0].description,
      location: response.data.name,
      country: response.data.sys.country
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error('Failed to fetch weather data. Please check the location name.');
  }
};

export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  // Map months to the same season names used in src/data/crops.js
  // (Monsoon, Winter, Summer / Year Round handled elsewhere)
  if (month >= 6 && month <= 10) {
    return 'Monsoon';
  } else if (month >= 11 || month <= 3) {
    return 'Winter';
  } else {
    return 'Summer';
  }
};
