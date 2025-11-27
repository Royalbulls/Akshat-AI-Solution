
import { auth, db } from '../src/firebaseConfig';
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthUser } from '../types';

const googleProvider = new GoogleAuthProvider();

// --- Authentication ---

export const loginWithGoogle = async (): Promise<AuthUser> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return {
            id: user.uid,
            name: user.displayName || 'User',
            email: user.email || ''
        };
    } catch (error: any) {
        console.error("Google Login Error:", error);
        throw new Error(error.message);
    }
};

export const loginWithEmail = async (email: string, pass: string): Promise<AuthUser> => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        const user = result.user;
        return {
            id: user.uid,
            name: user.displayName || email.split('@')[0],
            email: user.email || ''
        };
    } catch (error: any) {
        console.error("Email Login Error:", error);
        throw new Error(error.message);
    }
};

export const registerWithEmail = async (email: string, pass: string, name: string): Promise<AuthUser> => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const user = result.user;
        await updateProfile(user, { displayName: name });
        return {
            id: user.uid,
            name: name,
            email: user.email || ''
        };
    } catch (error: any) {
        console.error("Registration Error:", error);
        throw new Error(error.message);
    }
};

export const logout = async () => {
    await firebaseSignOut(auth);
};

// --- Database Sync ---

export const saveUserData = async (userId: string, data: any) => {
    if (!userId) return;
    try {
        const userRef = doc(db, 'users', userId);
        // We use setDoc with merge: true to update existing fields or create if missing
        await setDoc(userRef, data, { merge: true });
    } catch (error) {
        console.error("Error saving user data:", error);
    }
};

export const getUserData = async (userId: string) => {
    if (!userId) return null;
    try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
};
