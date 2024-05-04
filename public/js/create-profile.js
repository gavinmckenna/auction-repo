import { db } from './firebase-config.js';
import { Timestamp, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getNextUserId } from '../../archives/getNextUserId.js';

document.getElementById('create-profile').addEventListener('click', async function() {
    const username = prompt("Enter a username:");
    const password = prompt("Enter a password:");

    if (username && password) {
        try {
            const userId = Math.floor(Math.random() * 1000000);
            const userRef = collection(db, 'User');
            await addDoc(userRef, {
                username: username,
                password: password,
                sessionID: Timestamp,
                userId: userId
            });
            alert("Profile created successfully!");
        } catch (error) {
            console.error("Error creating profile:", error);
            alert("Failed to create profile: " + error.message);
        }
    } else {
        alert("Username and password cannot be empty.");
    }
});
