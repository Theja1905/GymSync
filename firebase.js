// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

export { auth };

