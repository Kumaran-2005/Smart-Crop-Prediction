import React from 'react';
import { generateCultivationPlan, recommendFertilizers } from '../services/cultivationPlan';
import { cropDatabase } from '../data/crops';
import { cropImages, defaultCropImage } from '../data/cropImages';
import { getCropImage } from '../services/imageService';
import { fetchTopYouTubeVideoForCrop, getCustomCropVideoLink } from '../services/youtubeService';
import { useEffect, useState } from 'react';

const CropDetailModal = ({ crop, soilType, pH, onClose }) => {
  if (!crop) return null;

  const plantingDate = new Date();
  const plan = generateCultivationPlan(crop, plantingDate, soilType, pH);
  const ferts = recommendFertilizers(crop, soilType);

  // Helper to do a case-insensitive lookup into the static mapping
  const getMappingImage = (cropName) => {
    if (!cropName) return null;
    const key = Object.keys(cropImages).find(k => k.toLowerCase() === String(cropName).toLowerCase());
    return key ? cropImages[key] : null;
  };

  const [imageUrl, setImageUrl] = useState(getMappingImage(crop) || null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageSource, setImageSource] = useState(null); // 'cache' | 'api' | 'mapping' | 'default'
  const [videoInfo, setVideoInfo] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    let mounted = true;
    const cacheKey = `cropImage:${String(crop).toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.debug(`CropDetailModal: using cached image for ${crop} -> ${cached}`);
      setImageUrl(cached);
      setImageSource('cache');
      return;
    }

    setLoadingImage(true);
    getCropImage(crop).then(url => {
      if (!mounted) return;
      if (url) {
        console.debug(`CropDetailModal: API returned image for ${crop} -> ${url}`);
        setImageUrl(url);
        setImageSource('api');
        try { localStorage.setItem(cacheKey, url); } catch(e) {}
      } else {
        const mapped = getMappingImage(crop) || defaultCropImage;
        console.debug(`CropDetailModal: using mapping/default for ${crop} -> ${mapped}`);
        setImageUrl(mapped);
        setImageSource(mapped === defaultCropImage ? 'default' : 'mapping');
      }
    }).catch((err) => {
      console.debug('CropDetailModal: image fetch error', err && err.message);
      if (mounted) {
        const mapped = getMappingImage(crop) || defaultCropImage;
        setImageUrl(mapped);
        setImageSource(mapped === defaultCropImage ? 'default' : 'mapping');
      }
    }).finally(() => { if (mounted) setLoadingImage(false); });

    return () => { mounted = false; };
  }, [crop]);

  // Fetch top YouTube tutorial for this crop (cached in localStorage)
  useEffect(() => {
    let mounted = true;
    const cacheKey = `cropVideo:${String(crop).toLowerCase()}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setVideoInfo(parsed);
      } catch (e) {
        // ignore
      }
      return;
    }


    const load = async () => {
      setLoadingVideo(true);
      try {
        // Check for custom video link first
        const customLink = getCustomCropVideoLink(crop);
        if (customLink) {
          const v = {
            embedUrl: customLink.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/'),
            watchUrl: customLink,
            title: `How to cultivate ${crop}`,
            channelTitle: 'Recommended',
          };
          setVideoInfo(v);
          try { localStorage.setItem(cacheKey, JSON.stringify(v)); } catch (e) {}
          return;
        }
        // Otherwise, fetch from YouTube API
        const v = await fetchTopYouTubeVideoForCrop(crop);
        if (!mounted) return;
        if (v) {
          setVideoInfo(v);
          try { localStorage.setItem(cacheKey, JSON.stringify(v)); } catch (e) {}
        }
      } catch (err) {
        console.debug('CropDetailModal: youtube fetch error', err && err.message);
      } finally {
        if (mounted) setLoadingVideo(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, [crop]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 overflow-auto max-h-[85vh]">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden">
              {loadingImage ? (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">Loading...</div>
              ) : (
                <div className="relative w-full h-full">
                  <img alt={`${crop}`} src={imageUrl || defaultCropImage} className="w-full h-full object-cover rounded" />
                  {imageSource && (
                    <div className="absolute left-1 top-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">{imageSource}</div>
                  )}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{crop}</h2>
              <div className="text-sm text-gray-600">{crop} — Detailed cultivation guide and recommendations</div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">Close</button>
            <button onClick={onClose} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Done</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <div className="flex gap-3 mb-3">
                <div className="bg-green-50 rounded p-3 flex-1">
                  <div className="text-xs text-gray-500">Optimal Temp</div>
                  <div className="font-bold">
                    {cropDatabase[crop]?.optimalTemp ? `${cropDatabase[crop].optimalTemp.min}°C - ${cropDatabase[crop].optimalTemp.max}°C` : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Temperature range suitable for this crop</div>
                </div>
              <div className="bg-green-50 rounded p-3 w-32 text-center">
                <div className="text-xs text-gray-500">pH</div>
                <div className="font-bold">{pH != null ? pH : 'N/A'}</div>
              </div>
              <div className="bg-green-50 rounded p-3 w-36 text-center">
                <div className="text-xs text-gray-500">Water Req.</div>
                <div className="font-bold">{cropDatabase[crop]?.waterRequirement || 'N/A'}</div>
                <div className="text-sm text-gray-600">Water requirement</div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Cultivation Timeline</h3>
              <div className="space-y-3">
                {plan.stages.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">{idx+1}</div>
                    <div>
                      <div className="font-medium">{s.stage} <span className="text-xs text-gray-500">— {s.durationDays} days</span></div>
                      <div className="text-sm text-gray-600">{s.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Estimated Harvest</h3>
              <div className="text-sm text-gray-700">{new Date(plan.estimatedHarvestDate).toLocaleDateString()} — <span className="text-gray-500">{plan.durationDays} days from planting</span></div>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <div className="text-sm text-gray-500">Fertilizer Recommendations</div>
              {ferts.length ? (
                <table className="w-full mt-2 text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500">
                      <th>Name</th>
                      <th className="text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ferts.map((f, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2">{f.name}<div className="text-xs text-gray-500">{f.use}</div></td>
                        <td className="py-2 text-right">₹{f.price}/kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No fertilizer data available.</p>
              )}
            </div>
              <div className="space-y-4">
                {videoInfo ? (
                  <div className="bg-white rounded shadow-sm overflow-hidden">
                    <div className="text-sm font-medium p-3 border-b">Video: How to cultivate {crop}</div>
                    <div className="p-3">
                      <div className="w-full h-48 md:h-40 bg-black">
                        <iframe
                          title={`video-${crop}`}
                          src={videoInfo.embedUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      <div className="mt-2 text-sm">
                        <a href={videoInfo.watchUrl} target="_blank" rel="noreferrer" className="text-green-700 font-medium">{videoInfo.title}</a>
                        <div className="text-xs text-gray-500">{videoInfo.channelTitle}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 rounded p-3">
                    <div className="font-semibold text-sm mb-1">Soil Notes</div>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {plan.soilNotes.map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </div>
                )}
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CropDetailModal;
