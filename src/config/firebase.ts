import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAL9FobNTuxm4A7f3EO-iPpvsNMF9s42oE",
  authDomain: "fir-67e34.firebaseapp.com",
  databaseURL: "https://fir-67e34-default-rtdb.firebaseio.com",
  projectId: "fir-67e34",
  storageBucket: "fir-67e34.firebasestorage.app",
  messagingSenderId: "29540790964",
  appId: "1:29540790964:web:58967fd030359948259de1",
  measurementId: "G-PJMHKZ6MPS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;