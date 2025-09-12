
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// This configuration has been updated with your provided credentials.
const firebaseConfig = {
  apiKey: "AIzaSyCnRefCTJ45F-795HSh-Bbnj3yYpxJHpV8",
  authDomain: "doctrac-9d7c4.firebaseapp.com",
  projectId: "doctrac-9d7c4",
  storageBucket: "doctrac-9d7c4.firebasestorage.app",
  messagingSenderId: "332140202659",
  appId: "1:332140202659:web:5438567d03c6baaf928d16",
  measurementId: "G-BVJTH1JF4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
