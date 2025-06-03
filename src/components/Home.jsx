import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { auth } from '../firebase/config'
import Footer from './Footer'

// SVG Components for animated background
const ProteinMolecule = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="20" className="fill-current" />
    <circle cx="85" cy="50" r="10" className="fill-current" />
    <circle cx="15" cy="50" r="10" className="fill-current" />
    <circle cx="50" cy="85" r="10" className="fill-current" />
    <circle cx="50" cy="15" r="10" className="fill-current" />
  </svg>
)

const AminoAcid = ({ type }) => {
  const aminoAcids = {
    leucine: "Leu",
    isoleucine: "Ile",
    valine: "Val",
    glutamine: "Gln",
    alanine: "Ala"
  }
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="40" className="fill-current opacity-30" />
      <text x="50" y="50" 
            className="fill-current text-2xl font-bold" 
            textAnchor="middle" 
            dominantBaseline="middle">
        {aminoAcids[type] || "AA"}
      </text>
    </svg>
  )
}

const Capsule = () => (
  <svg viewBox="0 0 100 40" className="w-full h-full">
    <path d="M10,20 L70,20 Q90,20 90,20 T90,20" 
          className="stroke-current" 
          strokeWidth="15" 
          strokeLinecap="round"
          fill="none" />
  </svg>
)

const Vitamin = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <text x="50" y="50" 
          className="fill-current text-4xl font-bold" 
          textAnchor="middle" 
          dominantBaseline="middle">
      B12
    </text>
  </svg>
)

const ProteinChain = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full">
    <path d="M20,50 Q50,20 80,50 T140,50 T200,50" 
          className="stroke-current" 
          strokeWidth="8"
          fill="none" />
    <circle cx="20" cy="50" r="10" className="fill-current" />
    <circle cx="80" cy="50" r="10" className="fill-current" />
    <circle cx="140" cy="50" r="10" className="fill-current" />
  </svg>
)

const MuscleIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50" 
          className="fill-current" />
    <path d="M35,50 C35,35 65,35 65,50 C65,65 35,65 35,50" 
          className="fill-current opacity-50" />
  </svg>
)

// Updated SVG Components
const DumbbellIcon = () => (
  <svg viewBox="0 0 100 40" className="w-full h-full">
    <circle cx="15" cy="20" r="12" className="fill-current" />
    <circle cx="85" cy="20" r="12" className="fill-current" />
    <rect x="15" y="17" width="70" height="6" className="fill-current" />
  </svg>
)

const ShakeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M30,20 L70,20 L65,90 L35,90 Z" className="fill-current" />
    <path d="M40,10 L60,10 L70,20 L30,20 Z" className="fill-current" />
    <path d="M35,30 L65,30 M35,40 L65,40 M35,50 L65,50" 
          className="stroke-current" 
          strokeWidth="3"
          fill="none" />
  </svg>
)

const ProductCard = ({ product }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart() // Add cart context

  return (
    <motion.div
      className="relative h-[600px] perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-white/90 rounded-2xl border border-emerald-500/20 overflow-hidden">
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, #84cc16 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, #84cc16 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, #84cc16 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, #84cc16 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, #84cc16 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="relative h-72 overflow-hidden rounded-t-2xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"
              animate={{
                opacity: isHovered ? 1 : 0.7
              }}
            />
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.4 }}
            />
            {/* Floating Product Details */}
            <motion.div
              className="absolute top-4 right-4 bg-white/80 backdrop-blur border border-emerald-500/20 rounded-lg px-3 py-1 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-emerald-500 font-bold">${product.price}</span>
            </motion.div>
            {/* Product Badge */}
            {product.badge && (
              <motion.div
                className="absolute top-4 left-4 bg-emerald-500 text-black rounded-lg px-3 py-1 z-20 font-semibold text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {product.badge}
              </motion.div>
            )}
          </div>

          <div className="p-6 relative">
            {/* Product Category */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-500 text-sm font-medium">{product.category}</span>
              <span className="w-1 h-1 bg-emerald-500/50 rounded-full"/>
              <span className="text-gray-400 text-sm">{product.size}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              {product.name}
              {product.isNew && (
                <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-full">NEW</span>
              )}
            </h3>
            
            <p className="text-gray-400 mb-4 line-clamp-2">{product.description}</p>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.keyFeatures?.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                  className="text-black bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                  Add to Cart
                  <span className="text-xl">🛒</span>
                </motion.button>
                <motion.button
                  onClick={() => setIsFlipped(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:block text-emerald-500 hover:text-emerald-400 px-4 py-3 rounded-lg font-semibold border border-emerald-500/20 hover:border-emerald-500/40"
                >
                  Details
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-white/90 rounded-2xl border border-emerald-500/20 [transform:rotateY(180deg)] [backface-visibility:hidden] cursor-pointer group/back"
          onClick={() => setIsFlipped(false)}
        >
          <div className="p-8 h-full flex flex-col relative">
            {/* Flip indicator */}
            <motion.div
              className="absolute top-4 right-4 text-gray-400 flex items-center gap-2 opacity-50 group-hover/back:opacity-100 transition-opacity"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 0.5 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-sm">Click anywhere to flip back</span>
              <svg 
                className="w-5 h-5 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
            </motion.div>

            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-bold text-emerald-500">Nutrition Facts</h4>
            </div>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.entries(product.nutrition || {}).map(([key, value]) => (
                <div 
                  key={key} 
                  className="bg-white/30 border border-emerald-500/10 rounded-lg p-4 hover:border-emerald-500/30 transition-colors"
                >
                  <h5 className="text-gray-400 text-sm mb-1 capitalize">{key}</h5>
                  <p className="text-white text-xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-emerald-500 mb-4">Key Benefits</h4>
              <ul className="space-y-3">
                {product.benefits?.map((benefit, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="text-emerald-500 text-xl">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage Instructions */}
            <div className="mt-auto">
              <h4 className="text-xl font-bold text-emerald-500 mb-4">Recommended Usage</h4>
              <p className="text-gray-300">{product.usage}</p>
            </div>

            {/* Visual feedback for clickable area */}
            <motion.div
              className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 0.98 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Why Choose Us Icons
const QualityIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
  </svg>
)

const SpeedIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M12 2V4M12 20V22M4 12H2M6.31 6.31L4.89 4.89M17.69 6.31L19.11 4.89M6.31 17.69L4.89 19.11M17.69 17.69L19.11 19.11M22 12H20"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      strokeWidth="2"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    />
  </svg>
)

const LabIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M9 2V4M15 2V4"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
    />
    <motion.path
      d="M10 14L8 20H16L14 14M10 14L12 8M10 14H14M14 14L12 8M12 8V4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
  </svg>
)

const ExpertIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      strokeWidth="2"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.path
      d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.path
      d="M12 2V4M12 20V22M2 12H4M20 12H22"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
    />
  </svg>
)

const NaturalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M12 2L14 6L12 12L10 6L12 2Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.path
      d="M12 12C12 12 18 11 18 6C18 11 24 12 24 12C24 12 18 13 18 18C18 13 12 12 12 12ZM12 12C12 12 6 11 6 6C6 11 0 12 0 12C0 12 6 13 6 18C6 13 12 12 12 12Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    />
  </svg>
)

const ResultsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
    <motion.path
      d="M4 20H20"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
    />
    <motion.path
      d="M4 20V12M8 20V8M12 20V4M16 20V8M20 20V12"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, y: 10 }}
      animate={{ pathLength: 1, y: 0 }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
  </svg>
)

// Add these helper functions before the Home component
const calculateBMR = (weight, height, age, gender) => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  }
  return (10 * weight) + (6.25 * height) - (5 * age) - 161;
}

const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9
  };
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

const calculateMacros = (tdee, goal) => {
  let protein, carbs, fats;
  
  switch(goal) {
    case 'muscle_gain':
      protein = Math.round((tdee * 0.3) / 4); // 30% of calories from protein
      fats = Math.round((tdee * 0.25) / 9); // 25% of calories from fat
      carbs = Math.round((tdee * 0.45) / 4); // 45% of calories from carbs
      break;
    case 'weight_loss':
      tdee = tdee - 500; // 500 calorie deficit
      protein = Math.round((tdee * 0.4) / 4); // 40% of calories from protein
      fats = Math.round((tdee * 0.3) / 9); // 30% of calories from fat
      carbs = Math.round((tdee * 0.3) / 4); // 30% of calories from carbs
      break;
    default: // maintenance
      protein = Math.round((tdee * 0.3) / 4);
      fats = Math.round((tdee * 0.3) / 9);
      carbs = Math.round((tdee * 0.4) / 4);
  }

  return { protein, carbs, fats, calories: tdee };
}

const getSupplementRecommendations = (goal, restrictions) => {
  const baseRecommendations = {
    muscle_gain: [
      { name: "Pro Whey Isolate", dosage: "2 scoops daily", timing: "Post-workout and between meals" },
      { name: "Creatine Monohydrate", dosage: "5g daily", timing: "Any time" },
      { name: "BCAAs", dosage: "5-10g", timing: "During workouts" },
      { name: "Mass Gainer", dosage: "1-2 scoops daily", timing: "Post-workout" },
      { name: "Glutamine", dosage: "5g daily", timing: "Before bed" },
      { name: "ZMA", dosage: "1 serving", timing: "Before bed" }
    ],
    weight_loss: [
      { name: "Whey Protein Isolate", dosage: "1-2 scoops daily", timing: "Between meals" },
      { name: "L-Carnitine", dosage: "2g daily", timing: "Before cardio" },
      { name: "CLA", dosage: "3g daily", timing: "With meals" },
      { name: "Green Tea Extract", dosage: "500mg daily", timing: "Morning and afternoon" },
      { name: "Fat Burner Complex", dosage: "1 serving", timing: "Morning" },
      { name: "BCAAs", dosage: "5g", timing: "During workouts" }
    ],
    performance: [
      { name: "Pre-Workout Complex", dosage: "1 scoop", timing: "30 mins before workout" },
      { name: "Beta-Alanine", dosage: "3-5g daily", timing: "Any time" },
      { name: "Electrolyte Formula", dosage: "1 serving", timing: "During workouts" },
      { name: "Creatine Monohydrate", dosage: "5g daily", timing: "Any time" },
      { name: "Nitric Oxide Booster", dosage: "1 serving", timing: "Pre-workout" },
      { name: "BCAAs", dosage: "5-10g", timing: "During workouts" }
    ],
    recovery: [
      { name: "Post-Workout Recovery", dosage: "1 scoop", timing: "Immediately after workout" },
      { name: "Glutamine", dosage: "5g daily", timing: "Before bed" },
      { name: "ZMA", dosage: "1 serving", timing: "Before bed" },
      { name: "BCAAs", dosage: "5g", timing: "During workouts" },
      { name: "Omega-3 Fish Oil", dosage: "2-3g daily", timing: "With meals" },
      { name: "Vitamin D3", dosage: "2000-5000 IU daily", timing: "Morning" }
    ]
  };

  // Filter based on restrictions
  return baseRecommendations[goal].filter(supp => {
    if (restrictions.includes('vegan') && supp.name.toLowerCase().includes('whey')) {
      return false;
    }
    if (restrictions.includes('vegetarian') && supp.name.toLowerCase().includes('fish')) {
      return false;
    }
    return true;
  });
};

const QuickView = ({ product, onClose, isFavorite, onToggleFavorite }) => {
  const { addToCart } = useCart() // Add cart context
  
  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden lg:flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white border border-emerald-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 bg-emerald-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                {product.badge}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">{product.name}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleFavorite(product.id)}
                className={`p-2 rounded-full ${
                  isFavorite ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-emerald-500">${product.price}</span>
              {product.oldPrice && (
                <span className="text-xl text-gray-500 line-through">${product.oldPrice}</span>
              )}
            </div>

            <p className="text-gray-300">{product.description}</p>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.keyFeatures?.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {product.nutrition && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.nutrition).map(([key, value]) => (
                    <div key={key} className="bg-white/30 border border-emerald-500/10 rounded-lg p-4">
                      <h5 className="text-gray-400 text-sm capitalize">{key}</h5>
                      <p className="text-white text-lg font-bold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                addToCart({ ...product, flavor: selectedFlavor, size: selectedSize });
                onClose();
              }}
              className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              Add to Cart
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke
                Linecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Enhanced DeviceFinder: multi-step, more options, animated loader, card UI
const deviceOptions = [
  { brand: "Apple", label: "iPhone 15 Pro Max", use: "Photography", price: "High", image: "/Images/iphone15promax.jpg", desc: "Unmatched camera system with ProRAW, ProRes, and advanced night mode." },
  { brand: "Samsung", label: "Galaxy S24 Ultra", use: "Productivity", price: "High", image: "/Images/galaxys24ultra.jpg", desc: "S Pen, 200MP camera, and stunning AMOLED display." },
  { brand: "Xiaomi", label: "Redmi Note 13", use: "Everyday", price: "Budget", image: "/Images/redminote13.jpg", desc: "Great performance and features at an affordable price." },
  { brand: "Google", label: "Pixel 8 Pro", use: "Photography", price: "Mid", image: "/Images/pixel8pro.jpg", desc: "Best-in-class AI camera and clean Android experience." },
  { brand: "OnePlus", label: "OnePlus 12", use: "Gaming", price: "Mid", image: "/Images/oneplus12.jpg", desc: "Flagship performance and fast charging for gamers." },
  { brand: "Oppo", label: "Oppo Reno 11", use: "Everyday", price: "Budget", image: "/Images/opporeno11.jpg", desc: "Sleek design and reliable performance for daily use." },
  { brand: "Apple", label: "iPhone SE (2022)", use: "Everyday", price: "Budget", image: "/Images/iphonese2022.jpg", desc: "Compact, powerful, and affordable Apple device." },
  { brand: "Samsung", label: "Galaxy A54", use: "Everyday", price: "Mid", image: "/Images/galaxya54.jpg", desc: "Balanced features and value from Samsung." },
];

function DeviceFinder() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({ use: null, price: null, brand: null });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const uses = [
    { label: "Photography" },
    { label: "Gaming" },
    { label: "Productivity" },
    { label: "Everyday" },
  ];
  const prices = [
    { label: "Budget" },
    { label: "Mid" },
    { label: "High" },
  ];
  const brands = [
    { label: "Apple" },
    { label: "Samsung" },
    { label: "Xiaomi" },
    { label: "Google" },
    { label: "OnePlus" },
    { label: "Oppo" },
  ];

  function handleSelect(field, value) {
    setAnswers(prev => ({ ...prev, [field]: value }));
    setStep(step + 1);
  }

  React.useEffect(() => {
    if (step === 3 && answers.use && answers.price && answers.brand) {
      setLoading(true);
      setTimeout(() => {
        // Find best match
        const match = deviceOptions.find(
          d => d.use === answers.use && d.price === answers.price && d.brand === answers.brand
        ) || deviceOptions.find(d => d.use === answers.use && d.price === answers.price) || deviceOptions[0];
        setResult(match);
        setLoading(false);
        setStep(4);
      }, 1800);
    }
  }, [step, answers]);

  function reset() {
    setStep(0);
    setAnswers({ use: null, price: null, brand: null });
    setResult(null);
    setLoading(false);
  }

  return (
    <motion.div className="bg-white border border-emerald-100 rounded-xl p-4 sm:p-8 shadow-lg mb-12">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">Device Finder</h2>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="q1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <p className="text-lg text-gray-700 text-center mb-6">What will you use your device for?</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {uses.map(opt => (
                <button key={opt.label} onClick={() => handleSelect('use', opt.label)} className="w-full p-4 sm:p-6 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 font-semibold shadow-sm hover:bg-emerald-100 transition-all text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="q2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <p className="text-lg text-gray-700 text-center mb-6">What's your budget?</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {prices.map(opt => (
                <button key={opt.label} onClick={() => handleSelect('price', opt.label)} className="w-full p-4 sm:p-6 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 font-semibold shadow-sm hover:bg-emerald-100 transition-all text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="q3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <p className="text-lg text-gray-700 text-center mb-6">Preferred brand?</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {brands.map(opt => (
                <button key={opt.label} onClick={() => handleSelect('brand', opt.label)} className="w-full p-4 sm:p-6 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 font-semibold shadow-sm hover:bg-emerald-100 transition-all text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {loading && (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[200px] py-8">
            <motion.div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
            <p className="text-emerald-700 font-semibold">Finding your perfect device...</p>
          </motion.div>
        )}
        {step === 4 && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-4 py-4">
            <img src={result.image} alt={result.label} className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-xl border border-emerald-100" />
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 text-center">{result.label}</h3>
            <p className="text-gray-700 text-center max-w-xs sm:max-w-md">{result.desc}</p>
            <button onClick={reset} className="mt-4 px-4 sm:px-6 py-2 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors w-full max-w-xs">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Enhanced AccessoryMatch: multi-step, more options, animated loader, card UI
const accessoryOptions = [
  { device: "iPhone 15 Pro Max", need: "Charging", brand: "Apple", accessory: { name: "MagSafe Charger", image: "/Images/magsafe.jpg", desc: "Fast wireless charging for iPhone." } },
  { device: "Galaxy S24 Ultra", need: "Stylus", brand: "Samsung", accessory: { name: "S Pen Pro", image: "/Images/spenpro.jpg", desc: "Precision stylus for Galaxy S24 Ultra." } },
  { device: "Redmi Note 13", need: "Fitness", brand: "Xiaomi", accessory: { name: "Mi Band 8", image: "/Images/miband8.jpg", desc: "Track your fitness and notifications." } },
  { device: "Pixel 8 Pro", need: "Audio", brand: "Google", accessory: { name: "Pixel Buds Pro", image: "/Images/pixelbudspro.jpg", desc: "Premium wireless earbuds for Pixel." } },
  { device: "OnePlus 12", need: "Charging", brand: "OnePlus", accessory: { name: "Warp Charger 80W", image: "/Images/warpcharger.jpg", desc: "Super-fast charging for OnePlus devices." } },
  { device: "Oppo Reno 11", need: "Protection", brand: "Oppo", accessory: { name: "Oppo Smart Case", image: "/Images/oppocase.jpg", desc: "Stylish and protective case for Oppo Reno." } },
  { device: "iPhone SE (2022)", need: "Audio", brand: "Apple", accessory: { name: "AirPods 3rd Gen", image: "/Images/airpods3.jpg", desc: "Wireless audio for iPhone SE." } },
  { device: "Galaxy A54", need: "Protection", brand: "Samsung", accessory: { name: "Samsung Clear Case", image: "/Images/samsungcase.jpg", desc: "Crystal clear protection for Galaxy A54." } },
];

function AccessoryMatch() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({ device: null, need: null, brand: null });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const devices = [
    "iPhone 15 Pro Max", "Galaxy S24 Ultra", "Redmi Note 13", "Pixel 8 Pro", "OnePlus 12", "Oppo Reno 11", "iPhone SE (2022)", "Galaxy A54"
  ];
  const needs = [
    "Charging", "Audio", "Protection", "Fitness", "Stylus"
  ];
  const brands = [
    "Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Oppo"
  ];

  function handleSelect(field, value) {
    setAnswers(prev => ({ ...prev, [field]: value }));
    setStep(step + 1);
  }

  React.useEffect(() => {
    if (step === 3 && answers.device && answers.need && answers.brand) {
      setLoading(true);
      setTimeout(() => {
        // Find best match
        const match = accessoryOptions.find(
          a => a.device === answers.device && a.need === answers.need && a.brand === answers.brand
        ) || accessoryOptions.find(a => a.device === answers.device && a.need === answers.need) || accessoryOptions[0];
        setResult(match);
        setLoading(false);
        setStep(4);
      }, 1800);
    }
  }, [step, answers]);

  function reset() {
    setStep(0);
    setAnswers({ device: null, need: null, brand: null });
    setResult(null);
    setLoading(false);
  }

  return (
    <motion.div className="bg-white border border-emerald-100 rounded-xl p-4 sm:p-8 shadow-lg mt-12">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">Accessory Match</h2>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="q1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <p className="text-lg text-gray-700 text-center mb-6">Which device do you have?</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {devices.map(opt => (
                <button key={opt} onClick={() => handleSelect('device', opt)} className="w-full p-4 sm:p-6 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 font-semibold shadow-sm hover:bg-emerald-100 transition-all text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-emerald-200">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="q2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <p className="text-lg text-gray-700 text-center mb-6">What do you need most?</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {needs.map(opt => (
                <button key={opt} onClick={() => handleSelect('need', opt)} className="w-full p-4 sm:p-6 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 font-semibold shadow-sm hover:bg-emerald-100 transition-all text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-emerald-200">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="q3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <p className="text-lg text-gray-700 text-center mb-6">Preferred accessory brand?</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {brands.map(opt => (
                <button key={opt} onClick={() => handleSelect('brand', opt)} className="w-full p-4 sm:p-6 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 font-semibold shadow-sm hover:bg-emerald-100 transition-all text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-emerald-200">{opt}</button>
              ))}
            </div>
          </motion.div>
        )}
        {loading && (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[200px] py-8">
            <motion.div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
            <p className="text-emerald-700 font-semibold">Finding your perfect accessory...</p>
          </motion.div>
        )}
        {step === 4 && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-4 py-4">
            <img src={result.accessory.image} alt={result.accessory.name} className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-xl border border-emerald-100" />
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 text-center">{result.accessory.name}</h3>
            <p className="text-gray-700 text-center max-w-xs sm:max-w-md">{result.accessory.desc}</p>
            <button onClick={reset} className="mt-4 px-4 sm:px-6 py-2 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors w-full max-w-xs">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const Home = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const { addToCart } = useCart() // Use cart context instead of local state

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Nutrition Calculator States
  const [calculatorData, setCalculatorData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintenance'
  });

  const [nutritionResults, setNutritionResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Supplement Quiz States
  const [quizData, setQuizData] = useState({
    goal: '',
    fitnessLevel: 50,
    restrictions: []
  });

  const [quizResults, setQuizResults] = useState(null);
  const [quizStep, setQuizStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculator handlers
  const handleCalculatorInput = (e) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNutrition = () => {
    const { weight, height, age, gender, activityLevel, goal } = calculatorData;
    
    if (!weight || !height || !age) return;

    setIsCalculating(true);
    setNutritionResults(null);

    // Simulate calculation time for better UX
    setTimeout(() => {
      const bmr = calculateBMR(Number(weight), Number(height), Number(age), gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      const macros = calculateMacros(tdee, goal);
      setNutritionResults(macros);
      setIsCalculating(false);
    }, 2000);
  };

  // Quiz handlers
  const handleQuizInput = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRestrictionToggle = (restriction) => {
    setQuizData(prev => ({
      ...prev,
      restrictions: prev.restrictions.includes(restriction)
        ? prev.restrictions.filter(r => r !== restriction)
        : [...prev.restrictions, restriction]
    }));
  };

  const submitQuiz = () => {
    const recommendations = getSupplementRecommendations(quizData.goal, quizData.restrictions);
    setQuizResults(recommendations);
  };

  const featuredProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: 1299,
      image: "/Images/iphone15promax.jpg",
      description: "Apple's latest flagship with A17 Pro chip, ProMotion display, and advanced camera system.",
      category: "Smartphone",
      size: "256GB / 512GB / 1TB",
      badge: "Best Seller",
      isNew: true,
      rating: 4.9,
      reviews: 312,
      stock: 8,
      keyFeatures: [
        "A17 Pro Chip",
        "ProMotion 120Hz Display",
        "Triple Camera System",
        "Titanium Design",
        "5G Connectivity",
        "Face ID"
      ],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: 1199,
      image: "/Images/galaxys24ultra.jpg",
      description: "Samsung's most powerful phone with S Pen, 200MP camera, and stunning AMOLED display.",
      category: "Smartphone",
      size: "256GB / 512GB / 1TB",
      badge: "Top Rated",
      rating: 4.8,
      reviews: 210,
      stock: 12,
      keyFeatures: [
        "S Pen Included",
        "200MP Camera",
        "AMOLED 120Hz Display",
        "Snapdragon 8 Gen 3",
        "5G Connectivity",
        "8K Video"
      ],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      id: 3,
      name: "Anker PowerCore 20000mAh",
      price: 59,
      image: "/Images/ankerpowercore.jpg",
      description: "High-capacity portable charger for all your devices. Fast charging, compact, and reliable.",
      category: "Accessory",
      size: "20000mAh",
      isNew: true,
      rating: 4.7,
      reviews: 98,
      stock: 20,
      keyFeatures: [
        "20,000mAh Capacity",
        "Fast Charging",
        "Dual USB Output",
        "Compact Design",
        "Universal Compatibility",
        "MultiProtect Safety"
      ],
      color: "from-emerald-500 to-emerald-600"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const backgroundElements = [
    { Component: ProteinMolecule, size: 80 },
    { Component: AminoAcid, size: 60 },
    { Component: Capsule, size: 100 },
    { Component: Vitamin, size: 70 }
  ]

  // Add this loading animation component
  const LoadingAnimation = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          className="w-20 h-20 text-emerald-500"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <motion.path
              d="M12 2L15 5.5L12 9L9 5.5L12 2Z"
              animate={{ fill: ['rgba(132, 204, 22, 0)', 'rgba(132, 204, 22, 1)', 'rgba(132, 204, 22, 0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M12 15L15 18.5L12 22L9 18.5L12 15Z"
              animate={{ fill: ['rgba(132, 204, 22, 0)', 'rgba(132, 204, 22, 1)', 'rgba(132, 204, 22, 0)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.path
              d="M2 8.5L5 12L2 15.5L-1 12L2 8.5Z"
              animate={{ fill: ['rgba(132, 204, 22, 0)', 'rgba(132, 204, 22, 1)', 'rgba(132, 204, 22, 0)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.path
              d="M22 8.5L25 12L22 15.5L19 12L22 8.5Z"
              animate={{ fill: ['rgba(132, 204, 22, 0)', 'rgba(132, 204, 22, 1)', 'rgba(132, 204, 22, 0)'] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </svg>
        </motion.div>
        <motion.div
          className="text-emerald-500 font-bold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Calculating your nutrition plan...
        </motion.div>
        <motion.div
          className="text-gray-400 text-sm max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We're analyzing your data to create a personalized nutrition and supplement plan
        </motion.div>
      </div>
      <motion.div
        className="w-full h-2 bg-emerald-500/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
      >
        {/* Animated Background Elements */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left space-y-6 sm:space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 sm:px-6 py-2"
              >
                <span className="text-emerald-500 font-semibold text-sm sm:text-base">Your Trusted Mobile Store</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight"
              >
                <span className="relative block sm:inline-block mt-2 sm:mt-0">
                  <span className="relative z-10 text-emerald-500 sm:ml-4">Discover the Latest Mobile Devices</span>
                  <motion.span
                    className="absolute inset-0 bg-emerald-500/10 -skew-x-12 rounded"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0"
              >
                Shop the latest smartphones, tablets, and accessories from top brands. Fast delivery, expert advice, and genuine products—right here in Tyre, Lebanon.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-emerald-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Shop Now
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-emerald-500/20"
              >
                {[
                  { 
                    icon: (
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        className="w-8 h-8" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                      </motion.svg>
                    ),
                    text: "Premium Quality" 
                  },
                  { 
                    icon: (
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        className="w-8 h-8" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M10 2v4M14 2v4M8 12h8M9 16h6"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                        <motion.path
                          d="M7 4h10v16l-5-3-5 3V4z"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, delay: 0.2 }}
                        />
                      </motion.svg>
                    ),
                    text: "Genuine Products" 
                  },
                  { 
                    icon: (
                      <motion.svg 
                        viewBox="0 0 24 24" 
                        className="w-8 h-8" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                      </motion.svg>
                    ),
                    text: "Fast Results" 
                  }
                ].map((badge, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
                  >
                    <div className="text-emerald-500">
                      {badge.icon}
                    </div>
                    <span className="text-gray-400 text-sm font-medium">{badge.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - 3D Product Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mt-8 lg:mt-0"
            >
              {/* Product Image Container */}
              <motion.div
                animate={{
                  rotateY: [0, 10, 0],
                  rotateX: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative z-10"
              >
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/20">
                  <img
                    src="/About.jpg"
                    alt="Premium Mobile Devices"
                    className="w-full h-full object-contain p-4 sm:p-8"
                  />
                </div>
              </motion.div>

              {/* Background Glow Effect */}
              <motion.div
                className="absolute inset-0 -z-10 blur-3xl"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
                    'radial-gradient(circle at 60% 60%, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
                    'radial-gradient(circle at 40% 40%, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
                    'radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.3) 0%, transparent 70%)',
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-6">
              About <span className="text-emerald-500">Bawab Cell</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Bawab Cell has been serving Tyre, Lebanon since 1999, offering the latest in mobile technology, accessories, and expert device advice. We pride ourselves on genuine products, great service, and 26 years of experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="border border-emerald-500/20 rounded-xl p-6 bg-white/80">
                <h3 className="text-2xl font-bold text-emerald-500 mb-4">Genuine Products</h3>
                <p className="text-gray-700">
                  All our devices and accessories are 100% original and come with full warranty and support.
                </p>
              </div>
              <div className="border border-emerald-500/20 rounded-xl p-6 bg-white/80">
                <h3 className="text-2xl font-bold text-emerald-500 mb-4">Expert Advice</h3>
                <p className="text-gray-700">
                  Our team helps you choose the perfect device or accessory for your needs, with honest recommendations and after-sales support.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 overflow-hidden"
      >
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-emerald-500/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-emerald-600"
          >
            Why Choose <span className="text-emerald-500">Bawab Cell</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: QualityIcon,
                title: "Genuine Devices",
                description: "All products are 100% original and covered by warranty."
              },
              {
                icon: SpeedIcon,
                title: "Fast Delivery",
                description: "Get your device quickly with our reliable delivery service."
              },
              {
                icon: LabIcon,
                title: "Warranty & Support",
                description: "Enjoy peace of mind with full warranty and after-sales support."
              },
              {
                icon: ExpertIcon,
                title: "Expert Advice",
                description: "Our team helps you choose the right device for your needs."
              },
              {
                icon: NaturalIcon,
                title: "Wide Selection",
                description: "Choose from the latest smartphones, tablets, and accessories."
              },
              {
                icon: ResultsIcon,
                title: "Trusted Since 1999",
                description: "Serving Tyre, Lebanon for over 26 years."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white backdrop-blur border border-emerald-100 rounded-xl p-8 hover:border-emerald-200 transition-all group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-emerald-500 mb-6 relative">
                  <item.icon />
                  <motion.div
                    className="absolute inset-0 bg-emerald-500/10 rounded-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1.2, opacity: 1 }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-emerald-700 mb-2 group-hover:text-emerald-500 transition-colors">{item.title}</h3>
                <p className="text-gray-700 group-hover:text-gray-600 transition-colors">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Device Finder & Accessory Match Section */}
      <section className="py-24 bg-emerald-50">
        <div className="max-w-5xl mx-auto px-4">
          <DeviceFinder />
          <AccessoryMatch />
                    </div>
      </section>

      {/* Reviews Section */}
      {/* ... (insert your reviews section JSX here) ... */}

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

export default Home