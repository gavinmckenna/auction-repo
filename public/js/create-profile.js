import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './firebase-config.js';
import { db } from './firebase-config.js';
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const createProfileButton = document.getElementById('create-profile');
    if (createProfileButton) {
        createProfileButton.addEventListener('click', async function() {
            const email = prompt("Enter your email:");
            const password = prompt("Enter a password:");
            if (email && password) {
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    const userId = user.uid;
                    const userRef = collection(db, 'User');
                    await addDoc(userRef, {
                        username: email,
                        email: email,
                        sessionID: Timestamp.now(),
                        userId: userId
                    });
                    alert("Profile created successfully!");
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("Error creating profile:", error);
                    alert("Failed to create profile: " + error.message);
                }
            } else {
                alert("Email and password cannot be empty.");
            }
        });
    } else {
        console.error('Create profile button not found');
    }
});
