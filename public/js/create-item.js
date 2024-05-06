import { db, auth } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-item-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const itemName = document.getElementById('itemName').value;
            const itemDesc = document.getElementById('itemDesc').value;
            const startPrice = document.getElementById('startPrice').value;
            const buyoutPrice = document.getElementById('buyoutPrice').value;
            const endTime = new Date(document.getElementById('endTime').value);

            const startTime = new Date();

            const itemId = generateItemId(itemName, startTime);

            try {
                const docRef = await addDoc(collection(db, "Item"), {
                    itemName: itemName,
                    itemDesc: itemDesc,
                    itemID: itemId,
                    startPrice: parseFloat(startPrice),
                    buyoutPrice: parseFloat(buyoutPrice),
                    startTime: startTime,
                    endTime: endTime,
                    sellerID: auth.currentUser.uid,
                    activeStatus: true,
                    currPrice: parseFloat(startPrice),
                    winnerID: ""
                });
                console.log("Document written with ID: ", docRef.id);
                alert("Item created successfully!");
                window.location.href = 'items.html';
            } catch (e) {
                console.error("Error adding document: ", e);
                alert("Failed to create item.");
            }
        });
    } else {
        console.error('Form not found. Check the ID and ensure it is loaded in the DOM.');
    }
});

function generateItemId(itemName, startDate) {
    const dateSegment = startDate.toISOString().slice(0, 10);
    const randomSegment = Math.floor(Math.random() * 1000);
    return `${itemName.replace(/\s+/g, '')}-${dateSegment}-${randomSegment}`;
}
