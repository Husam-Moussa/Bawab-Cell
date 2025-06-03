import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate full name
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName.trim()
      });

      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      
      // If the account already exists, try to sign in
      if (error.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
          navigate('/admin');
          return;
        } catch (signInError) {
          setError('Account exists but password is incorrect. Please try logging in instead.');
        }
      } else {
        switch (error.code) {
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/operation-not-allowed':
            setError('Email/password accounts are not enabled. Please contact support.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Please use a stronger password.');
            break;
          default:
            setError('Failed to create account. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      navigate('/', { replace: true });
    } catch (error) {
      setError('Google sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-emerald-100"
      >
        <h1 className="text-3xl font-bold mb-6 text-emerald-700 text-center">Sign Up</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-emerald-50 border border-emerald-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-emerald-50 border border-emerald-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-emerald-50 border border-emerald-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-emerald-50 border border-emerald-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="my-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-emerald-100" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-emerald-100" />
        </div>
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-emerald-200 text-emerald-700 font-semibold py-3 rounded-lg shadow hover:bg-emerald-50 transition-colors mb-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          Sign up with Google
        </button>
        <p className="mt-4 text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-emerald-600 hover:underline font-semibold">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup; 