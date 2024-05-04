import { doc, getDoc, increment, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from '../public/js/firebase-config.js';

export async function getNextUserId() {
    const counterRef = doc(db, 'counters', 'UsersCounter');
    const counterDoc = await getDoc(counterRef);
    let currentId = 0;

    if (counterDoc.exists()) {
        currentId = counterDoc.data().currentId;
        await updateDoc(counterRef, { currentId: increment(1) });
    } else {
        await setDoc(counterRef, { currentId: 1 });
        currentId = 1;
    }

    return currentId;
}


