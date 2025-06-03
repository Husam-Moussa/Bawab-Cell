import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Loader from './Loader';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

// Add new Particle component
const Particle = ({ delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -100],
        x: [0, Math.random() * 100 - 50]
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute w-2 h-2 bg-lime-500/20 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    />
  );
};

// Update the FloatingIcon component
const FloatingIcon = ({ children, delay }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-20, 20, -20] }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    >
      {children}
    </motion.div>
  );
};

// Add new FilterButton component
const FilterButton = ({ isOpen, onClick }) => (
  <motion.button
    onClick={onClick}
    className="bg-emerald-600 text-white rounded-lg p-3 hover:bg-emerald-500 transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    </motion.div>
  </motion.button>
);

// Update SearchBar component to restore previous design
const SearchBar = ({
  value,
  onChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  isFiltersOpen,
  onToggleFilters,
  products
}) => {
  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-7xl mx-auto mb-12"
    >
      <div className="flex gap-4 items-start">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-emerald-200 rounded-xl px-6 py-4 text-emerald-600 placeholder-gray-400 focus:outline-none focus:border-emerald-500 pr-12"
          />
          <motion.div 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-emerald-600 rounded-lg p-1 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
        </div>

        {/* Filter Toggle Button */}
        <FilterButton isOpen={isFiltersOpen} onClick={onToggleFilters} />
      </div>

      {/* Animated Filters Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 mt-4 bg-emerald-50 backdrop-blur border border-emerald-200 rounded-xl p-6 overflow-hidden z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-emerald-800 font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => onCategoryChange(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        selectedCategory === category
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-emerald-800 font-semibold mb-4">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Top Rated' }
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        sortBy === option.value
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Add these new components after the existing imports
const StockIndicator = ({ stock }) => {
  const stockLevel = stock < 10 ? 'low' : stock < 20 ? 'medium' : 'high';
  const width = stock < 10 ? '30%' : stock < 20 ? '60%' : '90%';
  
  return (
    <motion.div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className={`absolute h-full rounded-full ${
          stockLevel === 'low' ? 'bg-red-500' :
          stockLevel === 'medium' ? 'bg-yellow-500' :
          'bg-green-500'
        }`}
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </motion.div>
  );
};

const SaleBadge = ({ discount }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    className="absolute top-0 right-0 z-10 m-2"
  >
    <motion.div
      className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {discount}% OFF
    </motion.div>
  </motion.div>
);

const NutritionInfo = ({ nutrition }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute inset-0 bg-black/90 p-4 flex flex-col justify-center items-center text-white"
  >
    <h4 className="text-lime-500 font-bold mb-2">Nutrition Facts</h4>
    <div className="grid grid-cols-2 gap-2 w-full">
      {Object.entries(nutrition).map(([key, value]) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <div className="text-gray-400 text-xs">{key.replace('_', ' ')}</div>
          <div className="text-lime-500 font-bold">{value}</div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const ProductBenefits = ({ benefits }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute inset-0 bg-black/90 p-4 flex flex-col justify-center items-center text-white"
  >
    <h4 className="text-lime-500 font-bold mb-4">Key Benefits</h4>
    <div className="space-y-2">
      {benefits.map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2"
        >
          <motion.svg
            className="w-4 h-4 text-lime-500 flex-shrink-0"
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
          <span className="text-sm">{benefit}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const TrainingTypeIndicator = ({ types }) => (
  <motion.div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
    {types.map((type, index) => (
      <motion.div
        key={type}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-black/70 backdrop-blur px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
      >
        {type === 'Strength' && (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
        {type === 'Muscle Gain' && (
          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        )}
        {type === 'Endurance' && (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
        {type === 'Recovery' && (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
        <span className="text-white">{type}</span>
      </motion.div>
    ))}
  </motion.div>
);

const FlavorSelector = ({ flavors, selectedFlavor, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent"
  >
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {flavors.map((flavor, index) => (
        <motion.button
          key={flavor}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(flavor);
          }}
          className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium transition-all ${
            selectedFlavor === flavor
              ? 'bg-lime-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {flavor}
        </motion.button>
      ))}
    </div>
  </motion.div>
);

const AchievementBadge = ({ achievement }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    className="absolute top-2 right-2 z-10"
  >
    <motion.div
      className="relative"
      animate={{
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {achievement === 'Best Seller' && '🏆'}
          {achievement === 'New' && '🆕'}
          {achievement === 'Premium' && '⭐'}
          {achievement === 'Limited' && '⚡'}
        </motion.div>
      </div>
      <motion.div
        className="absolute -inset-1 bg-yellow-400/20 rounded-full blur-sm"
        animate={{
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.div>
  </motion.div>
);

const ProductIcons = ({ category, rating, stock }) => {
  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'mass gainer':
        return (
          <motion.div
            className="bg-purple-500/20 p-2 rounded-full"
            whileHover={{ scale: 1.2 }}
          >
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </motion.div>
        );
      case 'whey protein':
        return (
          <motion.div
            className="bg-blue-500/20 p-2 rounded-full"
            whileHover={{ scale: 1.2 }}
          >
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>
        );
      case 'creatine':
        return (
          <motion.div
            className="bg-red-500/20 p-2 rounded-full"
            whileHover={{ scale: 1.2 }}
          >
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
        );
      default:
        return (
          <motion.div
            className="bg-lime-500/20 p-2 rounded-full"
            whileHover={{ scale: 1.2 }}
          >
            <svg className="w-4 h-4 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        );
    }
  };

  const getStockIcon = () => {
    if (stock < 10) {
      return (
        <motion.div
          className="bg-red-500/20 p-2 rounded-full"
          whileHover={{ scale: 1.2 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>
      );
    }
    return (
      <motion.div
        className="bg-green-500/20 p-2 rounded-full"
        whileHover={{ scale: 1.2 }}
      >
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    );
  };

  const getRatingIcon = () => (
    <motion.div
      className="bg-yellow-500/20 p-2 rounded-full"
      whileHover={{ scale: 1.2 }}
    >
      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </motion.div>
  );

  return (
    <motion.div 
      className="absolute top-2 left-2 flex gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {getCategoryIcon()}
      {getStockIcon()}
      {rating >= 4.8 && getRatingIcon()}
    </motion.div>
  );
};

// Update the ProductCard component
const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [addToCartClicked, setAddToCartClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`, { 
      state: { 
        product: {
          ...product,
          colors: product.colors || [],
          storage: product.storage || [],
          storagePrices: product.storagePrices || {},
          benefits: product.features || [
            'High Performance',
            'Premium Quality',
            'Latest Technology',
            'Long Battery Life'
          ]
        }
      } 
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAddToCartClicked(true);
    onAddToCart({ 
      ...product, 
      flavor: selectedFlavor, 
      size: selectedSize 
    });
    // Ripple effect
    const button = e.currentTarget;
    const circle = document.createElement('div');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);
    setTimeout(() => setAddToCartClicked(false), 1000);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/300x300?text=Product+Image";
  };

  return (
    <div
      className="relative bg-gray-50 rounded-lg overflow-hidden cursor-pointer transform-gpu w-full min-h-[380px] shadow transition duration-200 group hover:shadow-xl hover:scale-[1.03]"
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Icons - Only visible on large screens */}
      <div className="hidden lg:block">
        <ProductIcons 
          category={product.category}
          stock={product.stock}
        />
      </div>
      {/* Achievement Badge - Only visible on large screens */}
      {product.achievement && (
        <div className="hidden lg:block">
          <AchievementBadge achievement={product.achievement} />
        </div>
      )}
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          onError={handleImageError}
        />
      </div>
      {/* Animated Features (desktop only, above info section) */}
      <div className="hidden lg:block">
        <AnimatePresence>
          {isHovered && Array.isArray(product.features) && product.features.length > 0 && (
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="absolute left-0 right-0 top-0 z-20 flex flex-col items-center pt-4"
            >
              {product.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  className="text-emerald-700 bg-white/80 rounded px-3 py-1 mb-1 text-sm font-medium shadow"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      {/* Product Info */}
      <div className="p-0">
        <div className="bg-white rounded-b-lg px-4 pt-4 pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-emerald-600 text-xs font-medium">
              {product.category}
            </span>
          </div>
          <h3 className="text-sm font-bold text-black line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs line-clamp-2">
            {product.description}
          </p>
          {/* Price above Add to Cart */}
          <div className="text-green-600 font-bold text-lg mb-2">${product.price}</div>
        </div>
        {/* Add to Cart Button */}
        <button
          onClick={e => { e.stopPropagation(); handleAddToCart(e); }}
          className="w-full bg-emerald-600 text-white py-2 rounded-b-lg text-sm font-semibold flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200 group-hover:bg-emerald-700 group-hover:scale-[1.03]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const QuickViewModal = ({ product, onClose, onAddToCart }) => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-xl max-w-4xl w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column - Image and Basic Info */}
          <div className="relative">
            <div className="aspect-square">
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </div>
            <ProductIcons
              category={product.category}
              rating={product.rating}
              stock={product.stock}
            />
          </div>

          {/* Right Column - Details */}
          <div className="p-6 space-y-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-lime-500">${product.price}</span>
              </div>
              <p className="text-gray-400">{product.description}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800">
              <div className="flex gap-4">
                {['details', 'nutrition', 'benefits'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 font-semibold transition-colors ${
                      selectedTab === tab
                        ? 'text-lime-500 border-b-2 border-lime-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {selectedTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/50 p-4 rounded-lg">
                        <h3 className="text-lime-500 font-semibold mb-2">Category</h3>
                        <p className="text-white">{product.category}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg">
                        <h3 className="text-lime-500 font-semibold mb-2">Stock</h3>
                        <p className="text-white">{product.stock} units</p>
                      </div>
                    </div>
                    {product.tags && (
                      <div>
                        <h3 className="text-lime-500 font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-black/50 px-3 py-1 rounded-full text-sm text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {selectedTab === 'nutrition' && (
                  <motion.div
                    key="nutrition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {Object.entries(product.nutrition).map(([key, value]) => (
                      <div key={key} className="bg-black/50 p-4 rounded-lg">
                        <h3 className="text-lime-500 font-semibold mb-2">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </h3>
                        <p className="text-white text-lg font-bold">{value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {selectedTab === 'benefits' && (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {(product.benefits || [
                      'Enhances Mobile Experience',
                      'Long Battery Life',
                      'High-Resolution Display',
                      'Fast Performance'
                    ]).map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 bg-black/50 p-4 rounded-lg"
                      >
                        <svg className="w-6 h-6 text-lime-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">{benefit}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {product.flavors && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Flavor</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <motion.button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          selectedFlavor === flavor
                            ? 'bg-lime-500 text-black'
                            : 'bg-black/50 text-gray-300 hover:text-lime-500 border border-lime-500/20'
                        }`}
                      >
                        {flavor}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          selectedSize === size
                            ? 'bg-lime-500 text-black'
                            : 'bg-black/50 text-gray-300 hover:text-lime-500 border border-lime-500/20'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={() => {
                onAddToCart({ ...product, flavor: selectedFlavor, size: selectedSize });
                onClose();
              }}
              className="w-full bg-lime-500 text-black py-4 rounded-lg font-semibold text-lg hover:bg-lime-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add to Cart - ${product.price}
              {selectedSize && <span className="text-sm ml-2">/ {selectedSize}</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add Toast component
const Toast = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            className="bg-lime-500 text-black px-6 py-3 rounded-xl shadow-xl flex items-center gap-3"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">{message}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add AnimatedBackground component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, #34d39922 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, #34d39922 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, #34d39922 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, #34d39922 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Animated Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #84cc1620 1px, transparent 1px),
            linear-gradient(to bottom, #84cc1620 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Orbs */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle at center, #84cc1610 0%, transparent 70%)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Animated Lines */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px w-48 bg-gradient-to-r from-transparent via-lime-500/20 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [-200, window.innerWidth + 200],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Glowing Points */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`point-${i}`}
          className="absolute w-1 h-1 bg-lime-500/50 rounded-full shadow-lg shadow-lime-500/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/50" />
    </div>
  );
};

const Shop = () => {
  // Group all useState hooks together
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Update import path for product data
  const localProducts = [
    {
      id: 1,
      name: 'iPhone 16 Pro',
      description: 'Latest iPhone with advanced features and titanium design',
      price: 999.99,
      category: 'Phones',
      image: '/AppleProducts/IPHONE 16 PRO BLACK.png',
      stock: 50,
      features: ['5G', 'A18 Bionic', 'Pro Camera System'],
      colors: ['Black', 'Titanium', 'Desert'],
      colorImages: {
        'Black': '/AppleProducts/IPHONE 16 PRO BLACK.png',
        'Titanium': '/AppleProducts/IPHONE 16 PRO TITANIUM.png',
        'Desert': '/AppleProducts/IPHONE 16 PRO DESSERT.png'
      },
      storage: ['128GB', '256GB', '512GB', '1TB'],
      storagePrices: {
        '128GB': 999.99,
        '256GB': 1099.99,
        '512GB': 1299.99,
        '1TB': 1499.99
      },
      specs: {
        'Display': '6.7-inch Super Retina XDR display with ProMotion',
        'Chip': 'A18 Pro chip with Neural Engine',
        'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
        'Battery': 'Up to 29 hours video playback',
        'Water Resistance': 'IP68 rated',
        'Operating System': 'iOS 18',
        'Dimensions': '160.7 x 77.6 x 7.85 mm',
        'Weight': '221g'
      }
    },
    {
      id: 2,
      name: 'iPhone 16',
      description: 'Latest iPhone with advanced features',
      price: 899.99,
      category: 'Phones',
      image: '/AppleProducts/IPHONE 16 WHITE.png',
      stock: 45,
      features: ['5G', 'A18 Bionic', 'Pro Camera System'],
      colors: ['White', 'Teal', 'Ultramarine'],
      colorImages: {
        'White': '/AppleProducts/IPHONE 16 WHITE.png',
        'Teal': '/AppleProducts/IPHONE 16 TEAL.png',
        'Ultramarine': '/AppleProducts/IPHONE 16 ULTRAMARINE.png'
      },
      storage: ['128GB', '256GB', '512GB'],
      storagePrices: {
        '128GB': 899.99,
        '256GB': 999.99,
        '512GB': 1199.99
      },
      specs: {
        'Display': '6.1-inch Super Retina XDR display',
        'Chip': 'A18 Bionic chip with Neural Engine',
        'Camera': '48MP Main + 12MP Ultra Wide',
        'Battery': 'Up to 26 hours video playback',
        'Water Resistance': 'IP68 rated',
        'Operating System': 'iOS 18',
        'Dimensions': '147.6 x 71.6 x 7.85 mm',
        'Weight': '173g'
      }
    },
    {
      id: 3,
      name: 'MacBook Air M3',
      description: 'Powerful and lightweight laptop',
      price: 1299.99,
      category: 'Laptops',
      image: '/AppleProducts/macbook_air_15_in_m3_space_gray_pdp_image_position_1__en-ae_2.png',
      stock: 30,
      features: ['M3 Chip', 'Retina Display', 'All-day Battery Life'],
      colors: ['Space Gray', 'Silver', 'Starlight'],
      colorImages: {
        'Space Gray': '/AppleProducts/macbook_air_15_in_m3_space_gray_pdp_image_position_1__en-ae_2.png',
        'Silver': '/AppleProducts/macbook_air_15_in_m3_silver_pdp_image_position_1__en-ae_2.png',
        'Starlight': '/AppleProducts/macbook_air_15_in_m3_starlight_pdp_image_position_1__en-ae_2.png'
      },
      storage: ['256GB', '512GB', '1TB', '2TB'],
      storagePrices: {
        '256GB': 1299.99,
        '512GB': 1499.99,
        '1TB': 1699.99,
        '2TB': 1899.99
      },
      specs: {
        'Display': '15.3-inch Liquid Retina display',
        'Chip': 'M3 chip with 8-core CPU and 10-core GPU',
        'Memory': '8GB unified memory',
        'Battery': 'Up to 18 hours battery life',
        'Ports': 'MagSafe 3, 2x Thunderbolt 4, 3.5mm headphone jack',
        'Operating System': 'macOS Sonoma',
        'Dimensions': '340.4 x 237.6 x 11.5 mm',
        'Weight': '1.51 kg'
      }
    },
    {
      id: 4,
      name: 'iPad Pro M4',
      description: 'Professional-grade tablet',
      price: 899.99,
      category: 'Tablets',
      image: '/AppleProducts/ipad_pro_13_m4_wifi_silver_pdp_image_position_1b__en-me.png',
      stock: 25,
      features: ['M4 Chip', 'ProMotion Display', 'Apple Pencil Support'],
      colors: ['Silver', 'Space Gray'],
      colorImages: {
        'Silver': '/AppleProducts/ipad_pro_13_m4_wifi_silver_pdp_image_position_1b__en-me.png',
        'Space Gray': '/AppleProducts/ipad_pro_13_m4_wifi_space_black_pdp_image_position_1b__en-me.png'
      },
      storage: ['128GB', '256GB', '512GB', '1TB', '2TB'],
      storagePrices: {
        '128GB': 899.99,
        '256GB': 999.99,
        '512GB': 1199.99,
        '1TB': 1399.99,
        '2TB': 1599.99
      },
      specs: {
        'Display': '12.9-inch Liquid Retina XDR display with ProMotion',
        'Chip': 'M4 chip with Neural Engine',
        'Camera': '12MP Wide + 10MP Ultra Wide',
        'Battery': 'Up to 10 hours battery life',
        'Ports': 'Thunderbolt 4, USB-C',
        'Operating System': 'iPadOS 18',
        'Dimensions': '280.6 x 214.9 x 5.9 mm',
        'Weight': '682g'
      }
    },
    {
      id: 5,
      name: 'Apple Watch Series 10',
      description: 'Advanced health and fitness companion',
      price: 399.99,
      category: 'Watches',
      image: '/AppleProducts/APPLE WATCH SERIES 10 BLACK.png',
      stock: 40,
      features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
      colors: ['Black', 'Rose Gold'],
      colorImages: {
        'Black': '/AppleProducts/APPLE WATCH SERIES 10 BLACK.png',
        'Rose Gold': '/AppleProducts/APPLE WATCH SERIES 10 ROSEGOLD.png'
      },
      storage: ['32GB'],
      storagePrices: {
        '32GB': 399.99
      },
      specs: {
        'Display': 'Always-On Retina display',
        'Chip': 'S10 chip with Neural Engine',
        'Sensors': 'Heart rate, Blood oxygen, ECG, Temperature',
        'Battery': 'Up to 18 hours battery life',
        'Water Resistance': 'Water resistant to 50 meters',
        'Operating System': 'watchOS 11',
        'Dimensions': '45 x 38 x 10.7 mm',
        'Weight': '38.8g'
      }
    },
    {
      id: 6,
      name: 'AirPods Pro',
      description: 'Wireless earbuds with active noise cancellation',
      price: 249.99,
      category: 'Audio',
      image: '/AppleProducts/airpods-3.png',
      stock: 60,
      features: ['Active Noise Cancellation', 'Spatial Audio', 'MagSafe Charging'],
      colors: ['White'],
      colorImages: {
        'White': '/AppleProducts/airpods-3.png'
      },
      storage: ['Standard'],
      storagePrices: {
        'Standard': 249.99
      },
      specs: {
        'Chip': 'H2 chip',
        'Battery Life': 'Up to 6 hours listening time',
        'Charging': 'MagSafe Charging Case',
        'Connectivity': 'Bluetooth 5.3',
        'Water Resistance': 'IPX4 rated',
        'Features': 'Active Noise Cancellation, Transparency mode',
        'Dimensions': '30.9 x 21.8 x 24.0 mm',
        'Weight': '5.3g per earbud'
      }
    },
    {
      id: 7,
      name: 'iPad Air',
      description: 'Lightweight and powerful tablet',
      price: 599.99,
      category: 'Tablets',
      image: '/AppleProducts/ipad_air_11_m2_wifi_starlight_pdp_image_position_1__en-ae_1_3.png',
      stock: 35,
      features: ['M2 Chip', 'Retina Display', 'Apple Pencil Support'],
      colors: ['Starlight', 'Blue', 'Purple'],
      colorImages: {
        'Starlight': '/AppleProducts/ipad_air_11_m2_wifi_starlight_pdp_image_position_1__en-ae_1_3.png',
        'Blue': '/AppleProducts/ipad_air_11_m2_wifi_blue_pdp_image_position_1__en-ae_2.png',
        'Purple': '/AppleProducts/ipad_air_13_m2_wifi_purple_pdp_image_position_1b__en-ae_1.png'
      },
      storage: ['64GB', '256GB'],
      storagePrices: {
        '64GB': 599.99,
        '256GB': 749.99
      },
      specs: {
        'Display': '10.9-inch Liquid Retina display',
        'Chip': 'M2 chip with Neural Engine',
        'Camera': '12MP Wide camera',
        'Battery': 'Up to 10 hours battery life',
        'Ports': 'USB-C',
        'Operating System': 'iPadOS 18',
        'Dimensions': '247.6 x 178.5 x 6.1 mm',
        'Weight': '461g'
      }
    },
    {
      id: 8,
      name: 'Apple Watch SE',
      description: 'Affordable smartwatch with essential features',
      price: 279.99,
      category: 'Watches',
      image: '/AppleProducts/apple_watch_se_40mm_gps_starlight_aluminum_starlight_sport_band_pdp_image_position-1__en-me_1.png',
      stock: 55,
      features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
      colors: ['Starlight', 'Midnight'],
      colorImages: {
        'Starlight': '/AppleProducts/apple_watch_se_40mm_gps_starlight_aluminum_starlight_sport_band_pdp_image_position-1__en-me_1.png',
        'Midnight': '/AppleProducts/apple_watch_se_40mm_gps_midnight_aluminum_sport_band_midnight_pdp_image_position_1__en-me.png'
      },
      storage: ['32GB'],
      storagePrices: {
        '32GB': 279.99
      },
      specs: {
        'Display': 'Retina display',
        'Chip': 'S9 chip',
        'Sensors': 'Heart rate, Accelerometer, Gyroscope',
        'Battery': 'Up to 18 hours battery life',
        'Water Resistance': 'Water resistant to 50 meters',
        'Operating System': 'watchOS 11',
        'Dimensions': '40 x 34 x 10.7 mm',
        'Weight': '30.5g'
      }
    }
  ];

  // Use local product data
  useEffect(() => {
    setProducts(localProducts);
    setFilteredProducts(localProducts);
    setLoading(false);
  }, []);

  // Filter and sort effect
  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || 
                            (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, #34d39922 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, #34d39922 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, #34d39922 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, #34d39922 0%, transparent 50%)',
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative py-12 px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isFiltersOpen={isFiltersOpen}
          onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
          products={products}
        />

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode="wait">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onQuickView={handleQuickView}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Quick View Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <QuickViewModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
            />
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-emerald-400 text-black px-6 py-3 rounded-lg shadow-lg"
              onAnimationComplete={() => {
                setTimeout(() => setShowToast(false), 2000);
              }}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

// Add radial gradient utility to tailwind
const styles = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .bg-gradient-radial {
    background-image: radial-gradient(var(--tw-gradient-stops));
  }
`;

// Add style tag to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Shop;