import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaShoppingCart, FaPlus, FaEdit, FaTrash, FaTimes, FaChevronDown } from 'react-icons/fa';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleQuantityChange, getPriceForStorage, getImageForColor } from '../utils/productUtils';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    price: '',
    rating: '',
    stock: '',
    colors: [],
    colorImages: {},
    storage: [],
    storagePrices: {},
    features: [],
    specs: {
      'Display': '',
      'Processor': '',
      'Storage': '',
      'Battery': '',
      'Water Resistance': '',
      'Sensors': ''
    }
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [colorImagePreviews, setColorImagePreviews] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newStorage, setNewStorage] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'order' or 'product'
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categories = [
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'smartwatches', label: 'Smartwatches' },
    { value: 'accessories', label: 'Accessories' }
  ];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products. Please try again.');
    }
  };

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const compressImage = (base64String, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with reduced quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result);
          setImagePreview(compressedImage);
        } catch (error) {
          console.error('Error compressing image:', error);
          alert('Error processing image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorImageChange = async (color, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result);
          setColorImagePreviews(prev => ({
            ...prev,
            [color]: compressedImage
          }));
          setFormData(prev => ({
            ...prev,
            colorImages: {
              ...prev.colorImages,
              [color]: compressedImage
            }
          }));
        } catch (error) {
          console.error('Error compressing image:', error);
          alert('Error processing image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayInput = (field, value) => {
    const values = value.split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0); // Remove empty values

    setFormData(prev => {
      const newData = { ...prev, [field]: values };
      
      // If it's colors, initialize color images
      if (field === 'colors') {
        const newColorImages = { ...prev.colorImages };
        // Only keep images for colors that still exist
        Object.keys(newColorImages).forEach(color => {
          if (!values.includes(color)) {
            delete newColorImages[color];
          }
        });
        // Add empty entries for new colors
        values.forEach(color => {
          if (!newColorImages[color]) {
            newColorImages[color] = '';
          }
        });
        newData.colorImages = newColorImages;
      }
      
      // If it's storage, initialize storage prices
      if (field === 'storage') {
        const newStoragePrices = { ...prev.storagePrices };
        // Only keep prices for storage options that still exist
        Object.keys(newStoragePrices).forEach(storage => {
          if (!values.includes(storage)) {
            delete newStoragePrices[storage];
          }
        });
        // Add empty entries for new storage options
        values.forEach(storage => {
          if (!newStoragePrices[storage]) {
            newStoragePrices[storage] = '';
          }
        });
        newData.storagePrices = newStoragePrices;
      }
      
      return newData;
    });
  };

  const handleStoragePriceChange = (storage, price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert('Please enter a valid price (positive number)');
      return;
    }
    setFormData(prev => ({
      ...prev,
      storagePrices: {
        ...prev.storagePrices,
        [storage]: price
      }
    }));
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: value
      }
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'color') handleAddColor();
      if (type === 'storage') handleAddStorage();
    }
  };

  const clearFeatures = () => {
    setFormData(prev => ({ ...prev, features: [] }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      category: '',
      price: '',
      rating: '',
      stock: '',
      colors: [],
      colorImages: {},
      storage: [],
      storagePrices: {},
      features: [],
      specs: {
        'Display': '',
        'Processor': '',
        'Storage': '',
        'Battery': '',
        'Water Resistance': '',
        'Sensors': ''
      }
    });
    setImageFile(null);
    setImagePreview('');
    setColorImagePreviews({});
    setNewFeature('');
    setNewColor('');
    setNewStorage('');
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type }), 3000);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.category || !formData.price) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      // Create product data object
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: imagePreview,
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating) || 0,
        stock: parseInt(formData.stock) || 0,
        colors: formData.colors.map(color => color.trim()),
        colorImages: Object.fromEntries(
          Object.entries(formData.colorImages)
            .filter(([color]) => formData.colors.includes(color))
            .map(([color, image]) => [color.trim(), image])
        ),
        storage: formData.storage.map(storage => storage.trim()),
        storagePrices: Object.fromEntries(
          Object.entries(formData.storagePrices)
            .filter(([storage]) => formData.storage.includes(storage))
            .map(([storage, price]) => [storage.trim(), parseFloat(price)])
        ),
        features: formData.features.filter(feature => feature.trim().length > 0),
        specs: {
          'Display': formData.specs['Display']?.trim() || '',
          'Processor': formData.specs['Processor']?.trim() || '',
          'Storage': formData.specs['Storage']?.trim() || '',
          'Battery': formData.specs['Battery']?.trim() || '',
          'Water Resistance': formData.specs['Water Resistance']?.trim() || '',
          'Sensors': formData.specs['Sensors']?.trim() || ''
        },
        updatedAt: new Date()
      };

      if (editingProduct) {
        // Update existing product
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, productData);
        showToast('Product updated successfully', 'success');
      } else {
        // Add new product
        productData.createdAt = new Date();
        const docRef = await addDoc(collection(db, 'products'), productData);
        showToast('Product saved successfully', 'success');
      }

      // Reset form and state
      setFormData({
        name: '',
        description: '',
        image: '',
        category: '',
        price: '',
        rating: '',
        stock: '',
        colors: [],
        colorImages: {},
        storage: [],
        storagePrices: {},
        features: [],
        specs: {
          'Display': '',
          'Processor': '',
          'Storage': '',
          'Battery': '',
          'Water Resistance': '',
          'Sensors': ''
        }
      });
      setImagePreview('');
      setColorImagePreviews({});
      setIsAddingProduct(false);
      setEditingProduct(null);
      
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Failed to save product. Please try again.', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    // Initialize form with existing product data
    setFormData({
      name: product.name || '',
      description: product.description || '',
      image: product.image || '',
      category: product.category || '',
      price: product.price?.toString() || '',
      rating: product.rating?.toString() || '',
      stock: product.stock?.toString() || '',
      colors: product.colors || [],
      colorImages: product.colorImages || {},
      storage: product.storage || [],
      storagePrices: product.storagePrices || {},
      features: product.features || [],
      specs: {
        'Display': product.specs?.['Display'] || '',
        'Processor': product.specs?.['Processor'] || '',
        'Storage': product.specs?.['Storage'] || '',
        'Battery': product.specs?.['Battery'] || '',
        'Water Resistance': product.specs?.['Water Resistance'] || '',
        'Sensors': product.specs?.['Sensors'] || ''
      }
    });
    setImagePreview(product.image || '');
    setColorImagePreviews(product.colorImages || {});
    setIsAddingProduct(true);
  };

  const handleDelete = async (productId) => {
    setProductToDelete(productId);
    setDeleteType('product');
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'product') {
        await deleteDoc(doc(db, 'products', productToDelete));
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productToDelete));
        showToast('Product deleted successfully', 'success');
      } else if (deleteType === 'order') {
        await deleteDoc(doc(db, 'orders', orderToDelete));
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderToDelete));
        showToast('Order deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showToast(`Failed to delete ${deleteType}`, 'error');
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      setOrderToDelete(null);
      setDeleteType('');
    }
  };

  const handleAddColor = () => {
    if (newColor.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
        colorImages: {
          ...prev.colorImages,
          [newColor.trim()]: ''
        }
      }));
      setNewColor('');
    }
  };

  const handleAddStorage = () => {
    if (newStorage.trim()) {
      setFormData(prev => ({
        ...prev,
        storage: [...prev.storage, newStorage.trim()],
        storagePrices: {
          ...prev.storagePrices,
          [newStorage.trim()]: ''
        }
      }));
      setNewStorage('');
    }
  };

  const handleRemoveColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color),
      colorImages: Object.fromEntries(
        Object.entries(prev.colorImages).filter(([c]) => c !== color)
      )
    }));
    setColorImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[color];
      return newPreviews;
    });
  };

  const handleRemoveStorage = (storage) => {
    setFormData(prev => ({
      ...prev,
      storage: prev.storage.filter(s => s !== storage),
      storagePrices: Object.fromEntries(
        Object.entries(prev.storagePrices).filter(([s]) => s !== storage)
      )
    }));
  };

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteType('order');
    setShowDeleteConfirm(true);
  };

  const handleQuantityChange = (type, currentQuantity, maxStock) => {
    if (type === 'decrease' && currentQuantity > 1) {
      return currentQuantity - 1;
    } else if (type === 'increase' && currentQuantity < maxStock) {
      return currentQuantity + 1;
    }
    return currentQuantity;
  };

  const renderProducts = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => {
            setIsAddingProduct(true);
            setEditingProduct(null);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
        >
          <FaPlus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {isAddingProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg border border-emerald-500/20"
        >
          <h3 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleAddProduct} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 flex items-center justify-between bg-white"
                  >
                    <span className="text-gray-700">
                      {formData.category ? categories.find(c => c.value === formData.category)?.label : 'Select a category'}
                    </span>
                    <FaChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                      >
                        {categories.map((category, index) => (
                          <motion.button
                            key={category.value}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              setFormData({ ...formData, category: category.value });
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-emerald-50 transition-colors ${
                              formData.category === category.value ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'
                            }`}
                          >
                            {category.label}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                  min="0"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows="3"
                required
              />
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <button
                  type="button"
                  onClick={clearFeatures}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear all
                </button>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'feature')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter a feature and press Enter or click Add"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddFeature();
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                >
                  Add
                </motion.button>
              </div>

              <AnimatePresence>
                {formData.features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Features List:</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between group"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-emerald-600">•</span>
                              <span className="text-gray-700">{feature}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => handleRemoveFeature(index)}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash className="w-4 h-4" />
                            </motion.button>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {Object.entries(formData.specs).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: key === 'Display' ? 0.1 : key === 'Processor' ? 0.2 : key === 'Storage' ? 0.3 : key === 'Battery' ? 0.4 : key === 'Water Resistance' ? 0.5 : 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleSpecChange(key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={`Enter ${key.toLowerCase()}`}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Main Product Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required={!editingProduct}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
            </motion.div>

            {/* Colors and Storage Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Colors */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Colors</label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, colors: [], colorImages: {} }));
                      setColorImagePreviews({});
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                </div>

                {/* Add Color Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'color')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter a color and press Enter or click Add"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    Add
                  </motion.button>
                </div>

                {/* Colors List */}
                {formData.colors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {formData.colors.map((color) => (
                      <motion.div
                        key={color}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-700">{color}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => handleRemoveColor(color)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleColorImageChange(color, e)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required={!editingProduct}
                        />
                        {colorImagePreviews[color] && (
                          <div className="mt-2">
                            <img
                              src={colorImagePreviews[color]}
                              alt={`${color} preview`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Storage */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Storage Options</label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, storage: [], storagePrices: {} }));
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                </div>

                {/* Add Storage Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'storage')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter storage (e.g., 128GB) and press Enter or click Add"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleAddStorage}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    Add
                  </motion.button>
                </div>

                {/* Storage List */}
                {formData.storage.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {formData.storage.map((storage) => (
                      <motion.div
                        key={storage}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-700">{storage}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => handleRemoveStorage(storage)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <input
                          type="number"
                          value={formData.storagePrices[storage] || ''}
                          onChange={(e) => handleStoragePriceChange(storage, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          required
                          min="0"
                          step="0.01"
                          placeholder="Enter price"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Preview Section */}
            {formData.colors.length > 0 && formData.storage.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Variants Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.colors.map((color) => (
                    <motion.div
                      key={color}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-2 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="aspect-w-1 aspect-h-1">
                        <img
                          src={colorImagePreviews[color]}
                          alt={`${color} preview`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-medium text-gray-700">{color}</h4>
                      <div className="space-y-1">
                        {formData.storage.map((storage) => (
                          <div key={storage} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{storage}</span>
                            <span className="font-medium text-emerald-600">
                              ${formData.storagePrices[storage]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
              >
                {editingProduct ? 'Update Product' : 'Save Product'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <motion.button
                  onClick={() => handleEdit(product)}
                  className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                  whileHover={{ scale: 1.1, rotate: -15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{product.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-green-600 font-semibold">${product.price}</span>
                <span className="text-gray-500 text-sm">{product.stock} in stock</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const updateProductQuantity = async (productId, newQuantity) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        quantity: newQuantity,
        updatedAt: new Date()
      });
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, quantity: newQuantity }
            : product
        )
      );
    } catch (error) {
      console.error('Error updating product quantity:', error);
      showToast('Failed to update quantity', 'error');
    }
  };

  const renderOrders = () => (
    <div className="space-y-6">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-6)}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt?.toDate()).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {order.customerInfo?.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {order.customerInfo?.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {order.customerInfo?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span> {order.customerInfo?.fullAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-white rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} × ${item.price}
                    </p>
                    {item.color && (
                      <p className="text-sm text-gray-500">Color: {item.color}</p>
                    )}
                    {item.storage && (
                      <p className="text-sm text-gray-500">Storage: {item.storage}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteOrder(order.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete Order
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-emerald-500/10">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Manage your products and orders</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-emerald-500/10">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-4 text-base font-medium transition-all ${
                activeTab === 'products'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <FaBox className="w-5 h-5" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-4 text-base font-medium transition-all ${
                activeTab === 'orders'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <FaShoppingCart className="w-5 h-5" />
              Orders
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence>
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'orders' && renderOrders()}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Delete {deleteType === 'product' ? 'Product' : 'Order'}
                </h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete this {deleteType}? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setProductToDelete(null);
                      setOrderToDelete(null);
                      setDeleteType('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30,
              duration: 0.3
            }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-xl shadow-xl flex items-center gap-3
              ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 
                toast.type === 'error' ? 'bg-red-500 text-white' : 
                'bg-yellow-400 text-black'}`}
          >
            {toast.type === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                  delay: 0.1
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
            {toast.type === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                  delay: 0.1
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
            )}
            {toast.type === 'warning' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                  delay: 0.1
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
              </motion.div>
            )}
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-semibold text-base"
            >
              {toast.message}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel; 