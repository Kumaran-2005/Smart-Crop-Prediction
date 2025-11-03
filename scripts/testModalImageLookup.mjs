import { cropImages, defaultCropImage } from '../src/data/cropImages.js';
import { getCropImage } from '../src/services/imageService.js';

function getMappingImage(cropName) {
  if (!cropName) return null;
  const key = Object.keys(cropImages).find(k => k.toLowerCase() === String(cropName).toLowerCase());
  return key ? cropImages[key] : null;
}

async function test(crop) {
  const mapping = getMappingImage(crop);
  console.log(`Crop: ${crop} -> mapping: ${mapping ? 'FOUND' : 'none'}`);
  const cachedKey = `cropImage:${String(crop).toLowerCase()}`;
  console.log(`Cache key would be: ${cachedKey}`);
  const api = await getCropImage(crop).catch(e => { console.error('api err', e); return null; });
  console.log(` API image: ${api ? 'FOUND' : 'none'}`);
  console.log('---');
}

(async () => {
  await test('Tomato');
  await test('tomato');
  await test('TOMATO');
  await test('Cotton');
  await test('cotton');
})();
