import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
    if (user) {
        renderItems(user.uid);
    } else {
        console.log("No user is signed in.");
    }
});

async function fetchUserItems(userId) {
    try {
        const itemsRef = collection(db, 'Item');
        const q = query(itemsRef, where('sellerID', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
}

async function renderItems(userId) {
    try {
        const items = await fetchUserItems(userId);
        let tableContent = '<tr><th>Item Name</th><th>Description</th><th>Start Price</th><th>Current Price</th><th>Buyout Price</th><th>End Time</th></tr>';
        items.forEach(item => {
            tableContent += `<tr>
                                <td>${item.itemName}</td>
                                <td>${item.itemDesc}</td>
                                <td>${item.startPrice}</td>
                                <td>${item.currPrice}</td>
                                <td>${item.buyoutPrice}</td>
                                <td>${new Date(item.endTime.seconds * 1000).toLocaleString()}</td>
                             </tr>`;
        });
        const itemsTable = document.getElementById('items-table');
        itemsTable.innerHTML = tableContent;
    } catch (error) {
        console.error("Error rendering items:", error);
    }
}

