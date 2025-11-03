// Custom crop video links
const cropVideoLinks = {
  Rice: 'https://youtu.be/J_mMS3EkHok',
  Wheat: 'https://youtu.be/AonJkhqCRwk',
  Maize: 'https://youtu.be/1C4qzKOHks4',
  Sugarcane: 'https://youtu.be/FmtSjRuSDhQ',
  Cotton: 'https://youtu.be/lCidlr_pbI4',
  Soybean: 'https://youtu.be/MvX9J0Z-DAc',
  Potato: 'https://youtu.be/IWYQFYk6ZgQ',
  Tomato: 'https://youtu.be/eySTo2GgvoY',
  Onion: 'https://youtu.be/ht9NOqX5YJw',
  Garlic: 'https://youtu.be/o4XT6dDvoy8',
  Carrot: 'https://youtu.be/mcW9bQd8YuY',
  Cabbage: 'https://youtu.be/z8Oy-vhEzyM',
};

// Returns custom video link for crop if available, else null
export function getCustomCropVideoLink(cropName) {
  // Case-insensitive match
  const key = Object.keys(cropVideoLinks).find(
    k => k.toLowerCase() === cropName.toLowerCase()
  );
  return key ? cropVideoLinks[key] : null;
}
// Simple YouTube helper: searches for one top video for a crop
// Uses YouTube Data API v3 (requires VITE_YOUTUBE_API_KEY in .env)

export async function fetchTopYouTubeVideoForCrop(cropName) {
  if (!cropName) return null;
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) return null;

  // Try several focused queries that aim to return a full planting/how-to guide
  const queries = [
    `how to plant ${cropName}`,
    `${cropName} planting guide`,
    `${cropName} cultivation guide`,
    `${cropName} farming tutorial`,
    `${cropName} planting tutorial`
  ];

  // Prefer longer, comprehensive videos for 'full guide'
  const commonParams = '&type=video&part=snippet&maxResults=1&videoDuration=long&order=viewCount';

  try {
    for (const q of queries) {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}${commonParams}&q=${encodeURIComponent(q)}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        // try next query
        continue;
      }
      const data = await resp.json();
      const item = data?.items?.[0];
      if (!item) continue;

      const videoId = item.id?.videoId || (item.id && item.id);
      const { title, channelTitle, thumbnails } = item.snippet || {};
      return {
        videoId,
        title,
        channelTitle,
        thumbnail: thumbnails?.medium?.url || thumbnails?.default?.url || null,
        watchUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
        embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
        query: q
      };
    }
  } catch (err) {
    console.error('YouTube fetch error', err);
  }

  return null;
}
