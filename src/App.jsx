import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Shop from './components/Shop';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import UserPage from './components/UserPage';
import AdminPanel from './components/AdminPanel';
import PublicRoute from './components/PublicRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ProductDetailsRoute from './components/ProductDetailsRoute';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader only on first load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <SocketProvider>
      <AuthProvider>
        <CartProvider>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loading" />
            ) : (
              <div className="flex flex-col min-h-screen bg-white text-gray-900">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <PublicRoute>
                          <Home />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/shop"
                      element={
                        <PublicRoute>
                          <Shop />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <PublicRoute>
                          <About />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <PublicRoute>
                          <Contact />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        <PublicRoute>
                          <Signup />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/user"
                      element={
                        <PublicRoute>
                          <UserPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/product/:id"
                      element={
                        <PublicRoute>
                          <ProductDetailsRoute />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedAdminRoute>
                          <AdminPanel />
                        </ProtectedAdminRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            )}
          </AnimatePresence>
        </CartProvider>
      </AuthProvider>
    </SocketProvider>
  );
}

export default App;
