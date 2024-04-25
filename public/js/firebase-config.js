// Import necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrBjx5vJEpCdoiQ-0M1yR-QWNZcwYjAZw",
  authDomain: "auction-site-mess.firebaseapp.com",
  projectId: "auction-site-mess",
  storageBucket: "auction-site-mess.appspot.com",
  messagingSenderId: "954911786444",
  appId: "1:954911786444:web:68f7d4327b239a41088969",
  measurementId: "G-ESXSZQ41YY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Get a Firestore instance
const auth = getAuth(app);     // Get an Auth instance
const analytics = getAnalytics(app);  // Initialize Firebase Analytics
