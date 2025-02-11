import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const signUpWithEmailAndPassword = async (email, password, username, phone, dob, city, neighbourhood) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
    
        await setDoc(doc(db, "users", userId), {
            userId,
            username,
            email,
            phone,
            dob,
            bankAccount: {},
            totalPoints: 0,
            currentPoints: 0,
            monthPoints: 0,
            wallet: 0.0,
            city,
            neighbourhood,
            voucherIds: [],
            communities: [],
            reported: false,
            createdAt: serverTimestamp(),
        });
    
        return userCredential.user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
    return auth.signOut();
};