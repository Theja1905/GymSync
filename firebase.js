// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// firebase.js
<<<<<<< HEAD
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
=======
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
>>>>>>> e843ab2694311fb4ab599cb4eb3caf6c8fb2b725

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCeF82pnOO0Xk90afb4fI6u8XPBXAv_E18',
  authDomain: 'gymsync-125a5.firebaseapp.com',
  projectId: 'gymsync-125a5',
  storageBucket: 'gymsync-125a5.appspot.com',
  messagingSenderId: '648350050567',
  appId: '1:648350050567:web:36af206b7ba8949a20bda2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };

