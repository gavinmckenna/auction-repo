import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
    if (user) {
        renderItems(user.uid);
    } else {
        console.log("No user is signed in.");
    }
});

async function renderItems(userId) {

    try {
        const bidsRef = collection(db, 'Bid');
        const q = query(bidsRef, where('bidderID', '==', userId));
        const querySnapshot = await getDocs(q);
        const bidsTable = document.getElementById('bids-table');

        for (const bidDoc of querySnapshot.docs) {
            const bid = bidDoc.data();
            const itemRef = doc(db, 'Item', bid.itemID);
            const itemSnap = await getDoc(itemRef);
            if (!itemSnap.exists()) continue;
            const item = itemSnap.data();

            const isWinning = bid.bidAmount >= item.currPrice;
            const auctionStatus = new Date(item.endTime.seconds * 1000) < new Date() ? (isWinning ? "Won" : "Lost") : "Ongoing";
            const timeRemaining = calculateTimeRemaining(item.endTime.seconds);

            const row = `
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.itemDesc}</td>
                    <td>$${bid.bidAmount}</td>
                    <td>$${item.currPrice}</td>
                    <td>$${item.buyoutPrice}</td>
                    <td>${isWinning ? "Winning" : "Outbid"}</td>
                    <td>${auctionStatus}</td>
                    <td>${timeRemaining}</td>
                </tr>
            `;
            bidsTable.innerHTML += row;
        }
    } catch (error) {
        console.error("Error loading bids:", error);
    }
}

function calculateTimeRemaining(endTimeSeconds) {
    const endTime = new Date(endTimeSeconds * 1000);
    const now = new Date();
    const timeDiff = endTime - now;
    if (timeDiff < 0) {
        return "Expired";
    }
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
}
