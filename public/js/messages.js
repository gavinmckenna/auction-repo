import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
onAuthStateChanged(auth, user => {
    if (user) {
        loadMessages(user.uid);
    } else {
        console.log("No user is signed in.");
    }
});

// Function to load and show messages
async function loadMessages(userId) {
  
    // Query messages for the current user
    const messagesQuery = query(collection(db, "Message"), where("redID", "==", parseInt(userId)));
    const broadcastQuery = quert(collection(db, "Message"), where("broadcast", "==", true));
    const [messagesSnapshot, broadcastSnapshot] = await Promise.all([
        getDocs(messagesQuery),
        getDocs(broadcastQuery)
    ]);
  
    // Display messages
    const messagesTable = document.getElementById("messages-table").getElementsByTagName("tbody")[0];
    messagesSnapshot.forEach(doc => {
      const data = doc.data();
      const row = messagesTable.insertRow();
      row.insertCell().textContent = data.redID;
      row.insertCell().textContent = data.senderID;
      row.insertCell().textContent = data.msgTime.toDate().toLocaleString(); // Convert timestamp to readable date
      row.insertCell().textContent = data.msg;
    });

    broadcastSnapshot.forEach(doc => {
        const data = doc.data();
        const row = messagesTable.insertRow();
        row.insertCell().textContent = "All";
        row.insertCell().textContent = data.senderID;
        row.insertCell().textContent = data.msgTime.toDate().toLocaleString(); // Convert timestamp to readable date
        row.insertCell().textContent = data.msg;
      });
}