import { cropDatabase } from '../data/crops.js';
import { fertilizerDatabase } from '../data/fertilizers.js';

// Approximate crop durations (days) for estimating harvest
const defaultDurations = {
  Rice: 120,
  Wheat: 120,
  Maize: 90,
  Sugarcane: 365,
  Cotton: 150,
  Soybean: 110,
  Potato: 120,
  Tomato: 100,
  Onion: 120,
  Garlic: 150,
  Carrot: 90,
  Cabbage: 90
};

// Simple cultivation plan templates per crop (high level)
const basePlans = {
  default: [
    { stage: 'Land Preparation', durationDays: 7, details: 'Plough and level the field; incorporate organic matter if needed.' },
    { stage: 'Sowing/Planting', durationDays: 3, details: 'Sow seeds at recommended spacing or transplant seedlings as required.' },
    { stage: 'Growing & Maintenance', durationDays: 60, details: 'Irrigation, weeding, fertilizer application, pest monitoring.' },
    { stage: 'Harvesting', durationDays: 7, details: 'Harvest at maturity; handling and drying as needed.' }
  ]
};

export function generateCultivationPlan(cropName, plantingDate = new Date(), soilType = null, pH = null) {
  const cropInfo = cropDatabase[cropName] || {};
  const duration = defaultDurations[cropName] || 100;

  // Build a simple stage list from templates and scale growing duration
  const stages = (basePlans[cropName] || basePlans.default).map(s => ({ ...s }));

  // Adjust growing duration to match total duration
  const nonGrowing = stages.filter(s => s.stage !== 'Growing & Maintenance').reduce((s, x) => s + (x.durationDays || 0), 0);
  const growingDays = Math.max(10, duration - nonGrowing);
  const growingStage = stages.find(s => s.stage === 'Growing & Maintenance');
  if (growingStage) {
    growingStage.durationDays = growingDays;
    growingStage.details = `${growingStage.details} (Adjusted for ${cropName}: ${growingDays} days)`;
  }

  // Estimate harvest date
  const start = new Date(plantingDate);
  const estimatedHarvest = new Date(start.getTime());
  estimatedHarvest.setDate(estimatedHarvest.getDate() + duration);

  // Recommendations for pH adjustments (very simple heuristics)
  const soilNotes = [];
  if (pH != null && !isNaN(pH)) {
    if (pH < (cropInfo.optimalPH?.min ?? 6)) {
      soilNotes.push('Soil is acidic vs crop optimum — consider liming if local advisories agree.');
    } else if (pH > (cropInfo.optimalPH?.max ?? 7.5)) {
      soilNotes.push('Soil is alkaline vs crop optimum — consider sulfur or acidifying amendments as advised.');
    } else {
      soilNotes.push('Soil pH is within the typical optimal range.');
    }
  }

  return {
    cropName,
    durationDays: duration,
    estimatedHarvestDate: estimatedHarvest.toISOString(),
    stages,
    soilNotes
  };
}

export function recommendFertilizers(cropName, soilType = null) {
  // Filter by crop
  const options = fertilizerDatabase.filter(f => f.crop === cropName);

  // If none found, return empty array
  if (!options.length) return [];

  // Sort by price ascending (cheapest first) as proxy for availability
  const sorted = options.slice().sort((a, b) => (a.price || 0) - (b.price || 0));

  // Pick top 2 recommendations
  const picks = sorted.slice(0, 2).map(f => ({
    name: f.name,
    price: f.price,
    use: f.use
  }));

  return picks;
}
