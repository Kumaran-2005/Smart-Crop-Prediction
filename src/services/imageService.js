// Image service: tries Unsplash first, then Pexels as a fallback.
// Caller should cache results (we also check localStorage in the modal)

export async function getUnsplashImage(query) {
  try {
    const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!key) return null;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    const resp = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
    if (!resp.ok) return null;
    const data = await resp.json();
    const result = data?.results?.[0];
    return result?.urls?.regular || null;
  } catch (err) {
    console.error('Unsplash error', err);
    return null;
  }
}

export async function fetchPexelsImageForCrop(cropName) {
  if (!cropName) return null;
  const query = `${cropName} plant field`;
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

  const key = import.meta.env.VITE_PEXELS_API_KEY;
  if (!key) return null; // no key -> skip

  try {
    const resp = await fetch(url, { headers: { Authorization: key } });
    if (!resp.ok) return null;
    const data = await resp.json();
    const photo = data?.photos?.[0];
    return photo?.src?.landscape || null;
  } catch (err) {
    console.error('Pexels error', err);
    return null;
  }
}

// Pixabay fallback (requires VITE_PIXABAY_API_KEY in .env)
export async function getPixabayImage(query) {
  try {
    const key = import.meta.env.VITE_PIXABAY_API_KEY;
    if (!key) return null;
    const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3&safesearch=true`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    const hit = data?.hits?.[0];
    return hit?.largeImageURL || hit?.webformatURL || null;
  } catch (err) {
    console.error('Pixabay error', err);
    return null;
  }
}

// Wikimedia Commons fallback (no API key required)
export async function getWikimediaImage(query) {
  try {
    const q = encodeURIComponent(query + ' crop field');
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrsearch=${q}&gsrlimit=1&iiprop=url&origin=*`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    const img = page?.imageinfo?.[0];
    return img?.url || null;
  } catch (err) {
    console.error('Wikimedia error', err);
    return null;
  }
}

export async function getCropImage(query) {
  if (!query) return null;
  // Try multiple query variants in order of preference to get relevant images
  const variants = [
    `${query} field`,
    `${query} plantation`,
    `${query} farm`,
    query
  ];

  for (const v of variants) {
    let img = await getUnsplashImage(v);
    if (img) return img;
  }

  // Fallback to Pexels with same variants
  for (const v of variants) {
    let img = await fetchPexelsImageForCrop(v);
    if (img) return img;
  }

  // Then try Pixabay
  for (const v of variants) {
    let img = await getPixabayImage(v);
    if (img) return img;
  }

  // Finally try Wikimedia Commons
  for (const v of variants) {
    let img = await getWikimediaImage(v);
    if (img) return img;
  }

  return null;
}
