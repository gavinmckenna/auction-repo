import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const userRef = collection(db, 'User');
        const q = query(userRef, where('username', '==', username));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error('No matching user');
        }

        let userAuthenticated = false;
        snapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.password === password) {
                userAuthenticated = true;
                console.log('User authenticated:', userData);
            }
        });

        if (!userAuthenticated) {
            throw new Error('Incorrect username or password');
        }

    } catch (error) {
        console.error('Authentication error:', error);
        document.getElementById('login-error').textContent = error.message;
    }
});

