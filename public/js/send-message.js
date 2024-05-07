import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth(); 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

var username;
onAuthStateChanged(auth, user => {
    if (user) {
        loadUsername(user.uid);
    } else {
        console.log("No user is signed in.");
    }
});

async function loadUsername(userId) {
    const usernameQuery = query(collection(db, "User"), where("userId", "==", userId));
    const usernameSnapshot = await getDocs(usernameQuery);
    username = usernameSnapshot.docs[0].data().username;
    console.log("Username: ", username);
}
const sendMessageForm = document.getElementById('send-message-form');

sendMessageForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    

    const to = sendMessageForm.to.value;
    const broadcast = sendMessageForm.broadcast.checked;
    const from = username; // Get current user ID
    const message = sendMessageForm.message.value;

    const messageData = {
        senderID: from,
        msg: message,
        msgTime: serverTimestamp()  // Add a timestamp
    };

    if(broadcast) {
        messageData.broadcast = true;
    } else {
        messageData.toUser = to;
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
