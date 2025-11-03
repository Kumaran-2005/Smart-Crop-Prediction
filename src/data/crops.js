export const cropDatabase = {
  "Rice": {
    soilTypes: ["Clay", "Loam", "Sandy Loam"],
    optimalTemp: { min: 20, max: 35 },
    optimalPH: { min: 5.5, max: 7.0 },
    waterRequirement: "High",
    season: ["Monsoon", "Winter"],
    score: 95
  },
  "Wheat": {
    soilTypes: ["Loam", "Clay Loam", "Sandy Loam"],
    optimalTemp: { min: 15, max: 25 },
    optimalPH: { min: 6.0, max: 7.5 },
    waterRequirement: "Moderate",
    season: ["Winter"],
    score: 90
  },
  "Maize": {
    soilTypes: ["Loam", "Sandy Loam", "Clay Loam"],
    optimalTemp: { min: 21, max: 27 },
    optimalPH: { min: 5.8, max: 7.0 },
    waterRequirement: "Moderate",
    season: ["Monsoon"],
    score: 88
  },
  "Sugarcane": {
    soilTypes: ["Clay Loam", "Loam", "Sandy Clay"],
    optimalTemp: { min: 20, max: 30 },
    optimalPH: { min: 6.0, max: 8.0 },
    waterRequirement: "High",
    season: ["Year Round"],
    score: 85
  },
  "Cotton": {
    soilTypes: ["Clay", "Clay Loam", "Sandy Loam"],
    optimalTemp: { min: 21, max: 30 },
    optimalPH: { min: 5.8, max: 8.0 },
    waterRequirement: "Moderate",
    season: ["Monsoon"],
    score: 82
  },
  "Soybean": {
    soilTypes: ["Clay Loam", "Sandy Loam", "Loam"],
    optimalTemp: { min: 20, max: 30 },
    optimalPH: { min: 6.0, max: 7.0 },
    waterRequirement: "Moderate",
    season: ["Monsoon"],
    score: 80
  },
  "Potato": {
    soilTypes: ["Sandy Loam", "Loam", "Clay Loam"],
    optimalTemp: { min: 15, max: 25 },
    optimalPH: { min: 5.2, max: 6.4 },
    waterRequirement: "Moderate",
    season: ["Winter"],
    score: 85
  },
  "Tomato": {
    soilTypes: ["Sandy Loam", "Loam", "Clay Loam"],
    optimalTemp: { min: 20, max: 30 },
    optimalPH: { min: 6.0, max: 7.0 },
    waterRequirement: "Moderate",
    season: ["Year Round"],
    score: 78
  },
  "Onion": {
    soilTypes: ["Sandy Loam", "Loam", "Clay Loam"],
    optimalTemp: { min: 13, max: 24 },
    optimalPH: { min: 6.0, max: 7.5 },
    waterRequirement: "Low",
    season: ["Winter"],
    score: 75
  },
  "Garlic": {
    soilTypes: ["Sandy Loam", "Loam"],
    optimalTemp: { min: 12, max: 20 },
    optimalPH: { min: 6.0, max: 7.0 },
    waterRequirement: "Low",
    season: ["Winter"],
    score: 72
  },
  "Carrot": {
    soilTypes: ["Sandy Loam", "Loam"],
    optimalTemp: { min: 16, max: 20 },
    optimalPH: { min: 5.5, max: 6.5 },
    waterRequirement: "Moderate",
    season: ["Winter"],
    score: 70
  },
  "Cabbage": {
    soilTypes: ["Clay Loam", "Sandy Loam", "Loam"],
    optimalTemp: { min: 15, max: 20 },
    optimalPH: { min: 6.0, max: 6.8 },
    waterRequirement: "Moderate",
    season: ["Winter"],
    score: 73
  }
};

export const soilTypes = [
  "Sandy",
  "Clay",
  "Loam",
  "Sandy Loam", 
  "Clay Loam",
  "Sandy Clay",
  "Silt",
  "Silt Loam",
  "Silt Clay"
];

export const seasons = [
  "Monsoon",
  "Winter", 
  "Summer"
];
