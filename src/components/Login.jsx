import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with email:', formData.email);
      const userCredential = await login(formData.email, formData.password);
      console.log('Login successful:', userCredential.user.email);
      
      // Check if user is admin
      if (userCredential.user.email === 'admin@bawabcell.com') {
        console.log('Admin user detected, redirecting to admin panel');
        navigate('/admin', { replace: true });
      } else {
        console.log('Regular user detected, redirecting to home');
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      navigate('/', { replace: true });
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-emerald-100"
      >
        <h1 className="text-3xl font-bold mb-6 text-emerald-700 text-center">Sign In</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center border border-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-emerald-50 border border-emerald-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="my-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-emerald-100" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-emerald-100" />
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-emerald-200 text-emerald-700 font-semibold py-3 rounded-lg shadow hover:bg-emerald-50 transition-colors mb-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>
        <p className="mt-4 text-center text-gray-500">
          Don't have an account? <Link to="/signup" className="text-emerald-600 hover:underline font-semibold">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login; 