import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase/config';
import { updatePassword, updateEmail, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';

const UserPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      displayName: user.displayName || '',
      email: user.email || '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;
      
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.displayName
        });
      }

      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await updatePassword(user, formData.newPassword);
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      setError('');
      setSuccess('');
      setIsResettingPassword(true);
      
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setResetEmailSent(true);
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError(error.message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <FaCog className="w-5 h-5" /> }
  ];

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3 
      }}
      className="space-y-6"
    >
      {isEditing ? (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full bg-white/80 border border-emerald-500/20 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/80 border border-emerald-500/20 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full bg-white/80 border border-emerald-500/20 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-white/80 border border-emerald-500/20 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FaEdit className="w-4 h-4" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 border border-emerald-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Display Name</h3>
              <p className="text-gray-600">{formData.displayName || 'Not set'}</p>
            </div>
            <div className="bg-white/80 border border-emerald-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FaEdit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      )}
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3 
      }}
      className="space-y-6"
    >
      <div className="bg-white/80 border border-emerald-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Settings</h3>
        <button
          onClick={handleResetPassword}
          disabled={isResettingPassword || resetEmailSent}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FaKey className="w-4 h-4" />
          {isResettingPassword ? 'Sending...' : resetEmailSent ? 'Email Sent' : 'Reset Password'}
        </button>
      </div>

      <div className="bg-white/80 border border-emerald-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <FaSignOutAlt className="w-4 h-4" />
          Logout
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="bg-white/80 backdrop-blur border border-emerald-500/20 rounded-xl overflow-hidden shadow-xl"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 border-b border-emerald-500/10"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                  delay: 0.3
                }}
                className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <FaUser className="w-12 h-12 text-white" />
              </motion.div>
              <div className="text-center sm:text-left">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {auth.currentUser?.displayName || 'User'}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 mt-2"
                >
                  {auth.currentUser?.email}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap border-b border-emerald-500/10"
          >
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-4 text-base font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500 rounded-lg text-emerald-500"
                >
                  {success}
                </motion.div>
              )}

              {activeTab === 'profile' && renderProfile()}
              {activeTab === 'settings' && renderSettings()}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserPage; 