import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth(); 

const sendMessageForm = document.getElementById('send-message-form');

sendMessageForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const to = sendMessageForm.to.value;
    const broadcast = sendMessageForm.broadcast.checked;
    const from = auth.currentUser.uid; // Get current user ID
    const message = sendMessageForm.message.value;

    const messageData = {
        senderID: from,
        msg: message,
        msgTime: serverTimestamp()  // Add a timestamp
    };

    if(broadcast) {
        messageData.broadcast = true;
    } else {
        messageData.redID = to;
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
