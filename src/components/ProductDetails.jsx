import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Animated Rating Stars Component
const RatingStars = ({ rating, reviews }) => (
  <motion.div 
    className="flex items-center gap-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className={i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-500'}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ 
            opacity: 1, 
            rotate: 0,
            scale: i < Math.floor(rating) ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            delay: 0.5 + (i * 0.1),
            duration: 0.5,
            repeat: i < Math.floor(rating) ? Infinity : 0,
            repeatType: "reverse",
            repeatDelay: 2
          }}
        >
          ★
        </motion.span>
      ))}
    </div>
    <span className="text-gray-400">({reviews} reviews)</span>
  </motion.div>
);

// Animated Tab Content Component
const TabContent = ({ activeTab, product }) => (
  <AnimatePresence mode="wait">
    {activeTab === 'details' && (
      <motion.div
        key="details"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            className="bg-black/50 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="text-lime-500 font-semibold mb-2">Category</h3>
            <p className="text-white">{product.category}</p>
          </motion.div>
          <motion.div 
            className="bg-black/50 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="text-lime-500 font-semibold mb-2">Stock</h3>
            <p className="text-white">{product.stock} units</p>
          </motion.div>
        </div>
        {product.certifications && (
          <motion.div 
            className="bg-black/50 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lime-500 font-semibold mb-2">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert, index) => (
                <motion.span
                  key={cert}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="bg-lime-500/10 text-lime-500 px-2 py-1 rounded text-sm"
                >
                  {cert}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    )}

    {activeTab === 'nutrition' && (
      <motion.div
        key="nutrition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        {Object.entries(product.nutrition).map(([key, value], index) => (
          <motion.div
            key={key}
            className="bg-black/50 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lime-500 font-semibold mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            <p className="text-white text-lg font-bold">{value}</p>
          </motion.div>
        ))}
      </motion.div>
    )}

    {activeTab === 'benefits' && (
      <motion.div
        key="benefits"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {(product.benefits || [
          'Enhances Muscle Growth',
          'Improves Recovery Time',
          'Increases Strength',
          'Supports Lean Mass'
        ]).map((benefit, index) => (
          <motion.div
            key={benefit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 10 }}
            className="flex items-center gap-3 bg-black/50 p-4 rounded-lg group"
          >
            <motion.svg
              className="w-6 h-6 text-lime-500 flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 360] }}
              transition={{ delay: index * 0.1 + 0.3 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </motion.svg>
            <span className="text-white group-hover:text-lime-500 transition-colors">{benefit}</span>
          </motion.div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isImageHovered, setIsImageHovered] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    
    // Get product from navigation state
    if (location.state && location.state.product) {
      setProduct(location.state.product);
      setSelectedColor(location.state.product.colors?.[0] || '');
      setSelectedStorage(location.state.product.storage?.[0] || '');
      setLoading(false);
    } else {
      setError('Product not found');
      setLoading(false);
    }
  }, [location.state]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (product && newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      ...product,
      color: selectedColor,
      storage: selectedStorage,
      quantity,
      price: product.storagePrices?.[selectedStorage] || product.price
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div
          className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6"
          />
        </motion.div>

        {/* Product Info */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-emerald-600 text-lg font-semibold mt-2">${product.price}</p>
            <p className="text-gray-600 mt-4">{product.description}</p>
          </motion.div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="mt-2 flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedColor === color
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Storage Selection */}
          {product.storage && product.storage.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-medium text-gray-900">Storage</h3>
              <div className="mt-2 flex gap-2">
                {product.storage.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedStorage === storage
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quantity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </motion.div>

          {/* Add to Cart Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleAddToCart}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Add to Cart
          </motion.button>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-4">
              {['details', 'benefits'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === tab
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <TabContent activeTab={activeTab} product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 