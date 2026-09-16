// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_vd4T-bKDttPyWlbfo-Lwoq7qITLUTtU",
  authDomain: "goldenbite-ef668.firebaseapp.com",
  projectId: "goldenbite-ef668",
  storageBucket: "goldenbite-ef668.firebasestorage.app",
  messagingSenderId: "656555826570",
  appId: "1:656555826570:web:3c00d1de46d3b55539bc73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);