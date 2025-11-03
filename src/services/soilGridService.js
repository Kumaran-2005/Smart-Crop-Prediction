// SoilGrids API service
// Docs: https://soilgrids.org/

// simple in-memory cache keyed by rounded lat,lon
const _soilCache = new Map();

export async function fetchSoilData(lat, lon) {
  // Cache key with small rounding to reduce duplicates
  const key = `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}`;
  if (_soilCache.has(key)) {
    return _soilCache.get(key);
  }

  // Query only the pH property to reduce payload, when supported
  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=phh2o`;

  // Add a timeout so UI isn't stuck if API is slow
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  let data = null;
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error('Failed to fetch soil data');
    }
    data = await response.json();
  } catch (e) {
    clearTimeout(timeout);
    // Return minimal structure on failure; caller can fall back to city defaults
    const fallback = { ph: null, raw: null };
    _soilCache.set(key, fallback);
    return fallback;
  }

  // Helper: recursively find the first numeric value in an object
  const findNumeric = (obj) => {
    if (obj == null) return null;
    if (typeof obj === 'number' && Number.isFinite(obj)) return obj;
    if (typeof obj === 'string' && !isNaN(parseFloat(obj))) return parseFloat(obj);
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const v = findNumeric(item);
        if (v != null) return v;
      }
    }
    if (typeof obj === 'object') {
      for (const k of Object.keys(obj)) {
        const v = findNumeric(obj[k]);
        if (v != null) return v;
      }
    }
    return null;
  };

  // Try to find a pH-related property in the response
  let ph = null;
  const props = data.properties || data;

  // Preferred: SoilGrids returns a `layers` array under properties. Find a layer with name like PH or PH_H2O
  if (props.layers && Array.isArray(props.layers)) {
    const phLayer = props.layers.find(l => /ph(_|\b)/i.test(l.name || '')) || props.layers.find(l => /ph/i.test(JSON.stringify(l)));
    if (phLayer && Array.isArray(phLayer.depths) && phLayer.depths.length > 0) {
      // For accuracy, compute a depth-weighted average across depths where values exist.
      const samples = [];

      const getValueFromDepth = (depthObj) => {
        if (!depthObj || !depthObj.values) return null;
        // Common structure: values.M.sl1 (or sl2...)
        const v = depthObj.values;
        const m = v.M || v.mean || v;
        if (m && typeof m === 'object') {
          const candidates = ['sl1', 'sl2', 'sl3', 'sl4', 'mean', 'value'];
          for (const c of candidates) {
            if (m[c] != null && !isNaN(parseFloat(m[c]))) return parseFloat(m[c]);
          }
          // fallback to any numeric inside m
          return findNumeric(m);
        }
        // If values is a raw number or string
        return findNumeric(v);
      };

      for (const d of phLayer.depths) {
        const top = d.range?.top_depth ?? (d.range && d.range.top_depth) ?? null;
        const bottom = d.range?.bottom_depth ?? (d.range && d.range.bottom_depth) ?? null;
        const thickness = (typeof top === 'number' && typeof bottom === 'number') ? Math.max(0, bottom - top) : 1;
        const val = getValueFromDepth(d);
        if (val != null && !isNaN(val)) {
          samples.push({ val: Number(val), weight: thickness || 1 });
        }
      }

      if (samples.length > 0) {
        const totalW = samples.reduce((s, x) => s + x.weight, 0);
        const weighted = samples.reduce((s, x) => s + x.val * x.weight, 0) / totalW;
        ph = Number(weighted.toFixed(2));
      }
    }
  }

  // As a final fallback, search all properties for any numeric value that might represent pH
  if (ph == null) {
    ph = findNumeric(props);
  }

  const result = { ph: ph, raw: data };
  _soilCache.set(key, result);
  return result;
}
