import { db } from './firebase-config.js';

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    db.collection('User').where('username', '==', username).get()
    .then(snapshot => {
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
    })
    .catch(error => {
        console.error('Authentication error:', error);
        document.getElementById('login-error').textContent = error.message;
    });
});
