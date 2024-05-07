import { auth } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');
    const userNameDisplay = document.getElementById('user-name').querySelector('span');

    auth.onAuthStateChanged(user => {
        if (user) {
            userNameDisplay.textContent = user.displayName || user.email || 'User';
        } else {
            window.location.href = 'index.html';
        }
    });

    logoutButton.addEventListener('click', function() {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Logout Failed', error);
        });
    });

    document.getElementById('view-all-items').addEventListener('click', function() {
        window.location.href = 'auction-house.html';
    });

    document.getElementById('view-your-bids').addEventListener('click', function() {
        window.location.href = 'bids.html';
    });

    document.getElementById('view-your-items').addEventListener('click', function() {
        window.location.href = 'items.html';
    });

    document.getElementById('view-your-messages').addEventListener('click', function() {
        window.location.href = 'messages.html';
    });
});
