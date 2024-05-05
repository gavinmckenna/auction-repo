import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";


document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userRef = collection(db, 'User');
        const q = query(userRef, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error('No matching user');
        }

        let userAuthenticated = false;
        let userId = '';

        snapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.password === password) {
                userAuthenticated = true;
                userId = doc.id;
                console.log('User authenticated:', userData);
            }
        });

        if (!userAuthenticated) {
            throw new Error('Incorrect email or password');
        }

        window.location.href = `../homepage.html?userId=${userId}`;

    } catch (error) {
        console.error('Authentication error:', error);
        document.getElementById('login-error').textContent = error.message;
    }
});