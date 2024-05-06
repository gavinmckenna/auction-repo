import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const sendMessageForm = document.getElementById('send-message-form');

sendMessageForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const to = sendMessageForm.to.value;
    const sendToEveryone = sendMessageForm.sendToEveryone.checked;
    const from = auth.currentUser.uid; // Get current user ID
    const message = sendMessageForm.message.value;

    const messageData = {
        redID: from,
        msg: message,
        msgTime: serverTimestamp()
    };

    if (sendToEveryone) {
        messageData.broadcast = true;
    } else {
        messageData.senderID = to;
    }
    // Create a new message document in the 'messages' collection
    addDoc(collection(db, 'Message'), messageData)
    .then(() => {
        alert("Message sent successfully!");
        sendMessageForm.reset(); // Clear the form
    })
    .catch(error => {
        console.error("Error sending message:", error);
        alert("An error occurred while sending the message.");
    });
});