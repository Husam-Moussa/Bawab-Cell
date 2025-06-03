import React from 'react';
import { motion } from 'framer-motion';

const emerald500 = '#10b981';
const emerald400 = '#34d399';

const LoadingScreen = () => {
  const bLetterVariants = {
    initial: { 
      pathLength: 0,
      opacity: 0
    },
    animate: { 
      pathLength: 1,
      opacity: 1,
      transition: { 
        duration: 3.5,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.7, 0.3],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 2.5, ease: 'easeOut' }
    }
  };

  const letterContainerVariants = {
    animate: {
      background: [
        `linear-gradient(45deg, ${emerald500} 0%, ${emerald400} 50%, ${emerald500} 100%)`,
        `linear-gradient(45deg, ${emerald400} 0%, ${emerald500} 50%, ${emerald400} 100%)`,
        `linear-gradient(45deg, ${emerald500} 0%, ${emerald400} 50%, ${emerald500} 100%)`
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 2.5,
        staggerChildren: 0.1
      }
    }
  };

  const titleLetterVariants = {
    initial: { 
      opacity: 0, 
      y: 0,
      scale: 0.8,
      rotate: -10,
      filter: 'blur(8px)'
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        delay: 0,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.2,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const titleContainerVariants = {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 2.5,
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${emerald500}20 1px, transparent 1px),
              linear-gradient(to bottom, ${emerald500}20 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-8">
        {/* Laser B Letter */}
        <motion.div
          className="mb-6 sm:mb-8 relative"
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={glowVariants}
            animate="animate"
            className="absolute inset-0 rounded-full blur-xl"
            style={{ background: `${emerald500}33` }}
          />
          <motion.div
            variants={letterContainerVariants}
            animate="animate"
            className="relative bg-white/80 backdrop-blur-lg border rounded-full p-6 sm:p-10 md:p-12 shadow-lg overflow-hidden"
            style={{ borderColor: `${emerald500}4D` }}
          >
            <div className="absolute inset-0 bg-white/90" />
            <svg 
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 relative z-10" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                variants={bLetterVariants}
                initial="initial"
                animate="animate"
                d="M30 20H60C65.5228 20 70 24.4772 70 30V35C70 40.5228 65.5228 45 60 45H40M40 45H60C65.5228 45 70 49.4772 70 55V60C70 65.5228 65.5228 70 60 70H30M40 45V70"
                stroke={emerald500}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </svg>
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          variants={titleContainerVariants}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <div className="flex justify-center gap-0.5 sm:gap-1">
            {'BAWAB CELL'.split('').map((letter, index) => (
              <motion.span
                key={index}
                variants={titleLetterVariants}
                whileHover="hover"
                className="text-2xl sm:text-3xl md:text-4xl font-bold inline-block"
                style={{
                  background: `linear-gradient(90deg, ${emerald500}, ${emerald400})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: `0 0 10px ${emerald500}55`,
                  padding: '0 1px'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.p 
            variants={textVariants}
            className="mt-1 sm:mt-2 text-base sm:text-lg font-medium"
            style={{
              color: emerald400,
              textShadow: `0 0 8px ${emerald400}33`
            }}
          >
            Your Trusted Mobile Store
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen; 