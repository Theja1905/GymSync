// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// firebase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCeF82pnOO0Xk90afb4fI6u8XPBXAv_E18',
  authDomain: 'gymsync-125a5.firebaseapp.com',
  projectId: 'gymsync-125a5',
  storageBucket: 'gymsync-125a5.appspot.com',
  messagingSenderId: '648350050567',
  appId: '1:648350050567:web:36af206b7ba8949a20bda2',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };


