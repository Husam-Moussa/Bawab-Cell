import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ProductDetail from './ProductDetail';

const ProductDetailsRoute = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return <ProductDetail product={product} onClose={() => window.history.back()} onAddToCart={() => {}} />;
};

export default ProductDetailsRoute; 