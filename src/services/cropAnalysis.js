import { cropDatabase } from '../data/crops.js';

export const analyzeCropSuitability = (cropName, soilType, temperature, pH, season) => {
  const crop = cropDatabase[cropName];
  if (!crop) {
    return {
      suitable: false,
      score: 0,
      message: 'Crop not found in database'
    };
  }
  let score = crop.score;
  let penalties = [];
  // Check soil type compatibility
  if (!crop.soilTypes.includes(soilType)) {
    score -= 30;
    penalties.push(`Soil type '${soilType}' is not optimal for ${cropName}`);
  }
  // Check temperature range
  if (temperature < crop.optimalTemp.min || temperature > crop.optimalTemp.max) {
    score -= 20;
    penalties.push(`Temperature ${temperature}°C is outside optimal range (${crop.optimalTemp.min}-${crop.optimalTemp.max}°C)`);
  }
  // Check pH range only if pH is provided
  if (pH !== null && pH !== undefined && !isNaN(pH)) {
    if (pH < crop.optimalPH.min || pH > crop.optimalPH.max) {
      score -= 15;
      penalties.push(`pH ${pH} is outside optimal range (${crop.optimalPH.min}-${crop.optimalPH.max})`);
    }
  }
  // Check season compatibility
  if (season && !crop.season.includes(season) && !crop.season.includes('Year Round')) {
    score -= 10;
    penalties.push(`Season '${season}' is not optimal for ${cropName}`);
  }
  const suitable = score >= 60;
  return {
    suitable,
    score: Math.max(0, score),
    penalties,
    message: suitable 
      ? `${cropName} is suitable for the given conditions` 
      : `${cropName} is not suitable for the given conditions`
  };
};

export const getSuitableCrops = (soilType, temperature, pH, season) => {
  const suitableCrops = [];

  Object.entries(cropDatabase).forEach(([cropName, cropData]) => {
    const analysis = analyzeCropSuitability(cropName, soilType, temperature, pH, season);
    
    if (analysis.suitable) {
      suitableCrops.push({
        name: cropName,
        score: analysis.score,
        ...cropData
      });
    }
  });

  return suitableCrops.sort((a, b) => b.score - a.score);
};
