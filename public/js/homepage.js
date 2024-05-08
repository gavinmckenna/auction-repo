import { db, auth } from './firebase-config.js';
import { getFirestore, collection, addDoc, doc, serverTimestamp, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');
    const userNameDisplay = document.getElementById('user-name').querySelector('span');

    auth.onAuthStateChanged(user => {
        if (user) {
            userNameDisplay.textContent = user.displayName || user.email || 'User';
            messageWinners()
        } else {
            window.location.href = 'index.html';
        }
    });

    async function messageWinners() {
        try {
            const itemQuery = query(collection(db, "Item"), where("activeStatus", "==", false), where("messaged", "==", false));
            const itemSnapshot = await getDocs(itemQuery);
            for(const itemDoc of itemSnapshot.docs) {
                const item = itemDoc.data();
                const usernameQuery = query(collection(db, "User"), where("userId", "==", item.winnerID));
                const usernameSnapshot = await getDocs(usernameQuery);
                const username = usernameSnapshot.docs[0].data().username;
                
                const message = "You have won the auction for: " + item.itemName + "! Check your bids.";

                const messageData = {
                    senderID: "Console",
                    toUser: username,
                    msg: message,
                    msgTime: serverTimestamp()
                }

                addDoc(collection(db, "Message"), messageData)
                .then(() => {
                    console.log("Message sent successfully!");

                    updateMessageList(item.itemID);

                })
                .catch(error => {
                    console.error("Error sending message:", error);
                });

            }
        } catch (error) {
            console.error("Error messaging winners:", error);
        }
        
    }

    async function updateMessageList(itemID) {
        try {
            const itemRef = doc(db, "Item", itemID);
            await updateDoc(itemRef, {
                messaged: true
            });
        }
        catch (error) {
            console.error("Failed to load update user messaged status:", error);
        }
    }

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
