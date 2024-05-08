import { db, auth } from './firebase-config.js';
import { collection, getDocs, getDoc, doc, updateDoc, addDoc, serverTimestamp, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    initializeSearch();
    await loadAndDisplayAuctionItems();
});

async function loadAndDisplayAuctionItems() {
    try {
        const itemsRef = collection(db, "Item");
        const querySnapshot = await getDocs(itemsRef);
        const itemsContainer = document.getElementById('auction-container');
        itemsContainer.innerHTML = '';

        const itemsWithUsers = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const item = doc.data();
            const userEmail = await fetchUserEmail(item.sellerID);
            return { item, userEmail, docId: doc.id };
        }));

        itemsWithUsers.forEach(({ item, userEmail, docId }) => {
            const itemElement = createItemElement(docId, item, userEmail);
            itemsContainer.appendChild(itemElement);
            initializeCountdown(`countdown-${docId}`, item.endTime.seconds * 1000);
        });
    } catch (error) {
        console.error("Failed to load auction items:", error);
    }
}

async function fetchUserEmail(userId) {
    const userRef = collection(db, 'User');
    const q = query(userRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
        return querySnapshot.docs[0].data().email;
    } else {
        return 'Unknown';
    }
}

function createItemElement(docId, item, userEmail) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item-container');

    itemElement.innerHTML = `
        <div class="item-title">${item.itemName}</div>
        <div class="item-desc">${item.itemDesc}</div>
        <div class="item-price">Current Bid: $${item.currPrice}</div>
        <div class="item-buyout">Buyout Price: $${item.buyoutPrice}</div>
        <div class="item-seller">Posted by: ${userEmail}</div>
    `;

    const bidInput = document.createElement('input');
    bidInput.type = 'number';
    bidInput.className = 'bid-input';
    bidInput.min = item.currPrice + 1;
    bidInput.value = item.currPrice + 1;

    const bidButton = document.createElement('button');
    bidButton.textContent = 'Place Bid';
    bidButton.onclick = () => placeBid(docId, parseFloat(bidInput.value));

    const buyoutButton = document.createElement('button');
    buyoutButton.textContent = 'Buyout';
    buyoutButton.onclick = () => buyoutItem(docId, item.buyoutPrice);

    itemElement.appendChild(bidInput);
    itemElement.appendChild(bidButton);
    itemElement.appendChild(buyoutButton);

    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown';
    countdownElement.id = `countdown-${docId}`;
    itemElement.appendChild(countdownElement);

    return itemElement;
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;
    searchInput.addEventListener('keyup', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filterItems(searchInput.value);
        }, 300);
    });
}

function filterItems(filterText) {
    const filter = filterText.toUpperCase();
    const itemsContainer = document.getElementById('auction-container');
    const items = itemsContainer.getElementsByClassName('item-container');

    Array.from(items).forEach(item => {
        const title = item.getElementsByClassName('item-title')[0];
        const desc = item.getElementsByClassName('item-desc')[0];
        const textName = title.textContent || title.innerText;
        const textDesc = desc.textContent || desc.innerText;

        if (textName.toUpperCase().includes(filter) || textDesc.toUpperCase().includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

async function placeBid(itemId, bidAmount) {
    const itemRef = doc(db, "Item", itemId);
    const itemSnapshot = await getDoc(itemRef);

    if (!itemSnapshot.exists()) {
        alert("Item not found!");
        return;
    }

    const itemData = itemSnapshot.data();
    bidAmount = parseFloat(bidAmount);

    if (bidAmount > itemData.currPrice) {
        await updateDoc(itemRef, {
            currPrice: bidAmount,
            winnerID: auth.currentUser.uid
        });

        await addDoc(collection(db, "Bid"), {
            itemID: itemId,
            bidderID: auth.currentUser.uid,
            bidAmount: bidAmount,
            bidTime: serverTimestamp()
        });

        alert("Bid placed successfully!");
    } else {
        alert("Your bid must be higher than the current price!");
    }
}

async function buyoutItem(itemId, buyoutPrice) {
    const itemRef = doc(db, "Item", itemId);

    try {
        await updateDoc(itemRef, {
            currPrice: buyoutPrice,
            winnerID: auth.currentUser.uid,
            activeStatus: false,
            endTime: serverTimestamp()
        });

        await addDoc(collection(db, "Bid"), {
            itemID: itemId,
            bidderID: auth.currentUser.uid,
            bidAmount: buyoutPrice,
            bidTime: serverTimestamp()
        });

        alert("Buyout successful! The item is yours.");
    } catch (error) {
        console.error("Error completing buyout:", error);
        alert("Failed to complete buyout. Please try again.");
    }
}

function initializeCountdown(elementId, endTime) {
    const countdownElement = document.getElementById(elementId);
    updateCountdown(countdownElement, endTime);

    setInterval(() => {
        updateCountdown(countdownElement, endTime);
    }, 1000);
}

function updateCountdown(element, endTime) {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const timeDiff = end - now;

    if (timeDiff < 0) {
        element.innerHTML = "EXPIRED";
        return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
}