import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  deleteUser
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to reset admin account
  async function resetAdminAccount() {
    try {
      const adminEmail = 'admin@bawabcell.com';
      const adminPassword = 'Admin@123456';

      // Check if admin account exists
      const methods = await fetchSignInMethodsForEmail(auth, adminEmail);
      
      if (methods.length === 0) {
        // Create new admin account if it doesn't exist
        console.log('Creating new admin account...');
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        await updateProfile(userCredential.user, {
          displayName: 'Admin'
        });
        console.log('New admin account created successfully');
        await signOut(auth);
      } else {
        console.log('Admin account already exists');
      }
    } catch (error) {
      console.error('Error in resetAdminAccount:', error.code, error.message);
    }
  }

  // Call resetAdminAccount when the app starts
  useEffect(() => {
    console.log('Initializing admin account...');
    resetAdminAccount();
  }, []);

  async function signup(email, password, fullName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      console.log('Attempting login with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Login error details:', error.code, error.message);
      switch (error.code) {
        case 'auth/invalid-credential':
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        case 'auth/user-not-found':
          throw new Error('No account found with this email. Please sign up first.');
        case 'auth/wrong-password':
          throw new Error('Incorrect password. Please try again.');
        case 'auth/too-many-requests':
          throw new Error('Too many failed login attempts. Please try again later.');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled. Please contact support.');
        default:
          throw new Error('An error occurred during login. Please try again.');
      }
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }

  async function updateUserProfile(displayName) {
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      // Update local state
      setUser(prev => ({
        ...prev,
        displayName: displayName
      }));
    } catch (error) {
      throw error;
    }
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 