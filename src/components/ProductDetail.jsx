import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

// Add CartNotification component
const CartNotification = ({ isVisible, product, color, storage, quantity }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-4 flex items-center gap-4 border border-emerald-100"
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
          >
            <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.colorImages?.[color] || product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <div className="text-sm text-gray-600">
                <span className="mr-2">{color}</span>
                <span>{storage}</span>
              </div>
              <div className="text-emerald-600 font-medium">
                ${(product.storagePrices?.[storage] || product.price) * quantity}
              </div>
            </div>
            <motion.div
              className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProductDetail = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedStorage, setSelectedStorage] = useState(product.storage?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentProduct, setCurrentProduct] = useState(product);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Get the correct image based on selected color
  const currentImage = currentProduct.colorImages?.[selectedColor] || currentProduct.image;

  // Get the price based on selected storage
  const currentPrice = currentProduct.storagePrices?.[selectedStorage] || currentProduct.price;

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x: x * 20, y: y * -20 });
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (newQty > currentProduct.stock) return currentProduct.stock;
      return newQty;
    });
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...currentProduct,
      color: selectedColor,
      storage: selectedStorage,
      quantity,
      price: currentPrice,
      totalPrice: currentPrice * quantity,
      image: currentProduct.colorImages?.[selectedColor] || currentProduct.image
    };

    addToCart(cartItem);
    setShowCartNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <motion.button
        onClick={onClose}
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <motion.div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
              style={{
                transform: isHovered ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)` : 'none',
                transition: 'transform 0.2s ease-out'
              }}
              className="relative aspect-square bg-white rounded-2xl overflow-hidden group shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedColor}
                  src={currentImage}
                  alt={`${currentProduct.name} in ${selectedColor}`}
                  className={`w-full h-full object-contain p-8 transition-transform duration-300 ${
                    isImageZoomed ? 'scale-150' : 'group-hover:scale-110'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                />
              </AnimatePresence>
            </motion.div>

            {/* Color Options */}
            {currentProduct.colors && currentProduct.colors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Choose your color</h3>
                <div className="flex flex-wrap gap-4">
                  {currentProduct.colors.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative px-4 py-2 rounded-lg text-center transition-all ${
                        selectedColor === color
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {color}
                      {selectedColor === color && (
                        <motion.div
                          className="absolute -inset-1 bg-emerald-600/20 rounded-lg blur-sm"
                          layoutId="colorSelection"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-900"
              >
                {currentProduct.name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-lg text-gray-600"
              >
                {currentProduct.description}
              </motion.p>
            </div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-baseline gap-2"
            >
              <motion.span
                key={currentPrice}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-emerald-600"
              >
                ${currentPrice}
              </motion.span>
              <span className="text-sm text-gray-500">({currentProduct.stock} in stock)</span>
            </motion.div>

            {/* Storage Options */}
            {currentProduct.storage && currentProduct.storage.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900">Choose your storage</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentProduct.storage.map((storage) => (
                    <motion.button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`relative p-4 rounded-xl text-center transition-all ${
                        selectedStorage === storage
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {storage}
                      {currentProduct.storagePrices?.[storage] && (
                        <div className="text-sm mt-1">
                          +${currentProduct.storagePrices[storage] - currentProduct.price}
                        </div>
                      )}
                      {selectedStorage === storage && (
                        <motion.div
                          className="absolute -inset-1 bg-emerald-600/20 rounded-xl blur-sm"
                          layoutId="storageSelection"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </motion.button>
                  <motion.span
                    key={quantity}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-12 text-center text-xl font-medium"
                  >
                    {quantity}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-4 px-6 rounded-xl bg-emerald-600 text-white text-lg font-semibold hover:bg-emerald-700 transition-colors relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative">Add to Cart - ${(currentPrice * quantity).toFixed(2)}</span>
            </motion.button>

            {/* Product Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12"
            >
              <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                  {['overview', 'specs', 'features'].map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-emerald-600 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </motion.button>
                  ))}
                </nav>
              </div>

              <div className="py-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="prose prose-lg max-w-none"
                    >
                      <p className="text-gray-600">{currentProduct.description}</p>
                    </motion.div>
                  )}

                  {activeTab === 'specs' && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {currentProduct.specs && Object.entries(currentProduct.specs).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between py-3 border-b border-gray-100"
                        >
                          <span className="text-gray-600">{key}</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {currentProduct.features && currentProduct.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <motion.svg
                            className="w-6 h-6 text-emerald-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 0, 360]
                            }}
                            transition={{
                              duration: 1,
                              delay: index * 0.1,
                              ease: "easeInOut"
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </motion.svg>
                          <span className="text-gray-700">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Add CartNotification component */}
      <CartNotification
        isVisible={showCartNotification}
        product={currentProduct}
        color={selectedColor}
        storage={selectedStorage}
        quantity={quantity}
      />
    </div>
  );
};

export default ProductDetail; 