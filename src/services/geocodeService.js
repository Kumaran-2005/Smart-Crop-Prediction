// Geocoding service using OpenStreetMap Nominatim
// Returns { lat, lon } for a given city name
const _geoCache = new Map();

export async function geocodeCity(city) {
  const q = String(city || '').trim().toLowerCase();
  if (_geoCache.has(q)) return _geoCache.get(q);

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const response = await fetch(url, {
    headers: {
      // Friendly UA per Nominatim usage policy
      'User-Agent': 'SmartCropPredictor/1.0 (for demo use)'
    }
  });
  if (!response.ok) throw new Error('Failed to geocode city');
  const data = await response.json();
  if (!data.length) throw new Error('City not found');
  const coords = { lat: data[0].lat, lon: data[0].lon };
  _geoCache.set(q, coords);
  return coords;
}
