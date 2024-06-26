import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";  // Importing Firebase Auth

const firebaseConfig = {
    apiKey: "AIzaSyDrBjx5vJEpCdoiQ-0M1yR-QWNZcwYjAZw",
    authDomain: "auction-site-mess.firebaseapp.com",
    projectId: "auction-site-mess",
    storageBucket: "auction-site-mess.appspot.com",
    messagingSenderId: "954911786444",
    appId: "1:954911786444:web:68f7d4327b239a41088969",
    measurementId: "G-ESXSZQ41YY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
