// Fertilizer data for crops
// Each entry: { crop, name, price, use }
export const fertilizerDatabase = [
  // Example for Rice
  { crop: 'Rice', name: 'Urea', price: 20, use: 'Nitrogen source for vegetative growth' },
  { crop: 'Rice', name: 'DAP', price: 35, use: 'Phosphorus for root development' },
  { crop: 'Rice', name: 'MOP', price: 30, use: 'Potassium for grain filling' },
  // Example for Wheat
  { crop: 'Wheat', name: 'Urea', price: 22, use: 'Nitrogen for tillering and growth' },
  { crop: 'Wheat', name: 'SSP', price: 28, use: 'Phosphorus for root and shoot' },
  { crop: 'Wheat', name: 'MOP', price: 32, use: 'Potassium for disease resistance' },
  // Example for Maize
  { crop: 'Maize', name: 'Urea', price: 21, use: 'Nitrogen for leaf development' },
  { crop: 'Maize', name: 'DAP', price: 36, use: 'Phosphorus for early growth' },
  { crop: 'Maize', name: 'Potash', price: 29, use: 'Potassium for cob formation' },
  // Add more crops and fertilizers as needed
];
