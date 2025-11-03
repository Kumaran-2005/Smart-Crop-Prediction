// Simple mapping of crop name -> image URL (Unsplash source). Uses Unsplash featured queries as fallback.
export const cropImages = {
  // Rice: map to a rice paddy / field photo (was previously an incorrect image)
  Rice: 'https://eos.com/wp-content/uploads/2023/04/rice-field.jpg',
  Wheat: 'https://cdn.mos.cms.futurecdn.net/v2/t%3A0%2Cl%3A344%2Ccw%3A1084%2Cch%3A1084%2Cq%3A80%2Cw%3A1084/wbFZ3LmpwKuDAZeFZmyGuf.jpg',
  Maize: 'https://cdn.britannica.com/36/167236-050-BF90337E/Ears-corn.jpg',
  Sugarcane: 'https://st.depositphotos.com/1397202/1955/i/450/depositphotos_19558177-Close-up-of-sugarcane-plant.jpg',
  Cotton: 'https://media.sciencephoto.com/c0/36/29/70/c0362970-800px-wm.jpg',
  Soyabean: 'https://www.aces.edu/wp-content/uploads/2022/05/Figure-illustrative.jpg',
  Potato: 'https://farmerspromise.com/wp-content/uploads/2025/04/ARHxg4INQ1O7939St0AdBQ-1024x682.jpg',
  Tomato: 'https://cdn11.bigcommerce.com/s-vdirtb6go5/images/stencil/1280x1280/products/1028/721/8__20769.1650496307.jpg?c=1',
  Onion: 'https://sowrightseeds.com/cdn/shop/articles/onions-growing-field-1674679616284_96515d9a-5440-4b53-a1a7-d979cea39da6.jpg?v=1738096830',
  Garlic: 'https://www.simplyseed.co.uk/user/blog-images/Hand%20holding%20Garlic%20Bulbs.webp',
  Carrot: 'https://diy.sndimg.com/content/dam/images/diy/fullset/2018/5/3/0/shutterstock_97404485_Iakov-Filimonov_harvested-carrots.jpg.rend.hgtvcom.1280.1280.85.suffix/1525379049839.webp',
  Cabage: 'https://solvi.ag/blog/static/9b5e311fc7fd7ef12efe46a406436cbf/d0b9c/cabbage_yield_cover.jpg',
};

export const defaultCropImage = 'https://via.placeholder.com/160?text=Crop';
