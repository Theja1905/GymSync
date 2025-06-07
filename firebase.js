import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCeF82pnOO0Xk90afb4fI6u8XPBXAv_E18",
  authDomain: "gymsync-125a5.firebaseapp.com",
  projectId: "gymsync-125a5",
  storageBucket: "gymsync-125a5.appspot.com",
  messagingSenderId: "648350050567",
  appId: "1:648350050567:web:36af206b7ba8949a20bda2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
