import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyALmjEIFgYenSD6Lb99sVwF4Sf4MFZlbOU",
  authDomain: "bawab-cell-959ef.firebaseapp.com",
  projectId: "bawab-cell-959ef",
  storageBucket: "bawab-cell-959ef.firebasestorage.app",
  messagingSenderId: "965727547862",
  appId: "1:965727547862:web:e2cb3b7472e87801af7477",
  measurementId: "G-GW6WZCXWF6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app); 