import React from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer'

const About = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: "Quality Products",
      description: "We source only the highest quality tech products from trusted manufacturers worldwide."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Best Prices",
      description: "Competitive pricing without compromising on quality, making technology accessible to everyone."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Fast Delivery",
      description: "Quick and reliable delivery service across Lebanon, ensuring you get your products when you need them."
    }
  ];

  const stats = [
    { number: "26", text: "Years Experience" },
    { number: "1999", text: "Established" },
    { number: "Tyre, Lebanon", text: "Location" },
    { number: "1000+", text: "Happy Customers" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, #00ff8822 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, #00ff8822 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, #00ff8822 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, #00ff8822 0%, transparent 50%)',
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

      {/* Content */}
      <div className="flex-grow relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-emerald-600 mb-4">About <span className="text-emerald-500">Bawab Cell</span></h1>
            <p className="text-emerald-500 text-lg">Your Trusted Source for Technology in Tyre, Lebanon</p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-emerald-600">Your Technology Experience Starts Here</h2>
              <p className="text-gray-700">
                At Bawab Cell, we believe in providing more than just Apple devices – we offer a wide range of technology products to enhance your digital lifestyle. Located in Tyre, Lebanon and established in 1999, we've grown to become one of the most trusted names in the industry.
              </p>
              <p className="text-gray-700">
                Our commitment to quality, authenticity, and customer satisfaction sets us apart. We carefully select each product in our inventory, ensuring it meets the highest standards of quality and effectiveness.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white border border-emerald-100 rounded-xl p-6 text-center shadow-sm"
                >
                  <h3 className="text-2xl font-bold text-emerald-600">{stat.number}</h3>
                  <p className="text-gray-600">{stat.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-emerald-50 border border-emerald-100 rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-emerald-700 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold text-emerald-600 mb-4">Our Expert Team</h2>
            <p className="text-emerald-500 mb-12">Dedicated professionals committed to your technology experience</p>
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 max-w-sm"
              >
                <img 
                  src="/unnamed.jpg" 
                  alt="Rabih Bawab" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-emerald-700">Rabih Bawab</h3>
                <p className="text-emerald-600">Tech Expert</p>
                <p className="text-gray-700 mt-2">Certified specialist with extensive experience in technology products and customer support.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About; 