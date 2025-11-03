// City-specific default pH helper
// Provides deterministic, bounded pH suggestions per city.

const cityPhMap = {
  chennai: 6.2,
  mumbai: 6.8,
  delhi: 7.1,
  bangalore: 6.7,
  kolkata: 6.3,
  hyderabad: 6.6,
  pune: 7.0,
  jaipur: 7.1,
  lucknow: 6.4
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function getCityDefaultPh(city, rawPh = null) {
  if (!city) return null;
  const key = String(city).toLowerCase().trim();

  // Prefer explicit mapping when available
  if (cityPhMap[key] != null) {
    return Number(clamp(cityPhMap[key], 5.5, 8.5).toFixed(2));
  }

  // If SoilGrids returned a raw pH, use it (clamped)
  const parsed = rawPh != null ? Number(rawPh) : NaN;
  if (!isNaN(parsed)) {
    return Number(clamp(parsed, 5.5, 8.5).toFixed(2));
  }

  // Deterministic fallback: hash city name to a value in [5.5, 8.5]
  let seed = 0;
  for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
  const frac = (seed % 1000) / 999; // 0..~1
  const ph = 5.5 + frac * (8.5 - 5.5);
  return Number(ph.toFixed(2));
}
