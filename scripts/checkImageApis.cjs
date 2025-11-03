const fs = require('fs');
const https = require('https');

function parseEnvFile(path) {
  try {
    const content = fs.readFileSync(path, 'utf8');
    const res = {};
    content.split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^#\n\r"]*)"?\s*$/);
      if (m) res[m[1]] = m[2].trim();
    });
    return res;
  } catch (e) {
    return {};
  }
}

function httpsGetJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    opts.headers = headers;
    https.get(opts, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ statusCode: res.statusCode, json });
        } catch (e) {
          resolve({ statusCode: res.statusCode, text: body });
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  console.log('Reading .env.example to get API keys (will not print keys)');
  const env = parseEnvFile('./.env.example');
  const unsplashKey = env.VITE_UNSPLASH_ACCESS_KEY;
  const pexelsKey = env.VITE_PEXELS_API_KEY;

  // Unsplash
  if (unsplashKey) {
    try {
      console.log('Testing Unsplash...');
      const q = encodeURIComponent('cotton field');
      const url = `https://api.unsplash.com/search/photos?query=${q}&per_page=1&orientation=landscape`;
      const r = await httpsGetJson(url, { Authorization: `Client-ID ${unsplashKey}` });
      if (r.statusCode >= 200 && r.statusCode < 300 && r.json && Array.isArray(r.json.results) && r.json.results.length) {
        console.log('Unsplash: OK — image URL returned');
        console.log(' Unsplash image example:', r.json.results[0].urls && r.json.results[0].urls.regular ? r.json.results[0].urls.regular : '(no url field)');
      } else {
        console.log('Unsplash: FAILED — status', r.statusCode);
        if (r.json) console.log(' Response keys:', Object.keys(r.json));
        if (r.text) console.log(' Response text:', r.text.slice(0, 300));
      }
    } catch (e) {
      console.error('Unsplash: ERROR', e.message);
    }
  } else {
    console.log('Unsplash: API key not found in .env.example');
  }

  // Pexels
  if (pexelsKey) {
    try {
      console.log('\nTesting Pexels...');
      const q = encodeURIComponent('cotton field');
      const url = `https://api.pexels.com/v1/search?query=${q}&per_page=1&orientation=landscape`;
      const r = await httpsGetJson(url, { Authorization: pexelsKey });
      if (r.statusCode >= 200 && r.statusCode < 300 && r.json && Array.isArray(r.json.photos) && r.json.photos.length) {
        console.log('Pexels: OK — image URL returned');
        console.log(' Pexels image example:', r.json.photos[0].src && r.json.photos[0].src.landscape ? r.json.photos[0].src.landscape : '(no url field)');
      } else {
        console.log('Pexels: FAILED — status', r.statusCode);
        if (r.json) console.log(' Response keys:', Object.keys(r.json));
        if (r.text) console.log(' Response text:', r.text.slice(0, 300));
      }
    } catch (e) {
      console.error('Pexels: ERROR', e.message);
    }
  } else {
    console.log('Pexels: API key not found in .env.example');
  }

  console.log('\nDone.');
})();
