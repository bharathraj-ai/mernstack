// Firebase configuration
// You need to replace these values with your own Firebase project config
// Go to: https://console.firebase.google.com → Create Project → Add Web App → Copy config

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID
});

// Admin email that is allowed
const ADMIN_EMAIL = "bharathraj95317@gmail.com";

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        return {
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid
        };
    } catch (error) {
        throw error;
    }
};

export const logoutAdmin = async () => {
    await signOut(auth);
};

export { auth, ADMIN_EMAIL };
