// Utility function for handling quantity changes
export const handleQuantityChange = (currentQuantity, stock, setQuantity) => (value) => {
  const newQuantity = Math.max(1, Math.min(stock, currentQuantity + value));
  setQuantity(newQuantity);
};

// Utility function for getting price based on storage
export const getPriceForStorage = (storage, basePrice) => {
  const storagePrices = {
    '128GB': basePrice,
    '256GB': basePrice + 100,
    '512GB': basePrice + 300,
    '1TB': basePrice + 500,
    '2TB': basePrice + 800
  };
  return storagePrices[storage] || basePrice;
};

// Utility function for getting image based on color
export const getImageForColor = (color) => {
  const colorMap = {
    'White Titanium': '/AppleProducts/IPHONE 16 PRO WHITE.png',
    'Black Titanium': '/AppleProducts/IPHONE 16 PRO BLACK.png',
    'Natural Titanium': '/AppleProducts/IPHONE 16 PRO NATURAL.png',
    'Desert Titanium': '/AppleProducts/IPHONE 16 PRO DESERT.png',
    'White': '/AppleProducts/IPHONE 16 WHITE.png',
    'Ultramarine': '/AppleProducts/IPHONE 16 ULTRAMARINE.png',
    'Teal': '/AppleProducts/IPHONE 16 TEAL.png',
    'Black': '/AppleProducts/IPHONE 16 BLACK.png',
    'Silver': '/AppleProducts/ipad_pro_13_m4_wifi_silver_pdp_image_position_1b__en-me.png',
    'Space Black': '/AppleProducts/ipad_pro_13_m4_wifi_spaceblack_pdp_image_position_1b__en-me.png',
    'Space Gray': '/AppleProducts/MACBOOK PRO M3 SPACE GRAY.png',
    'Jet Black': '/AppleProducts/APPLE WATCH SERIES 10 BLACK.png',
    'Rose Gold': '/AppleProducts/APPLE WATCH SERIES 10 ROSE GOLD.png',
    'Silver': '/AppleProducts/APPLE WATCH SERIES 10 SILVER.png'
  };
  return colorMap[color];
}; 