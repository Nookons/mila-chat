import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCbxeuJsp-KvP1RNYzzQZIkFfuVXSTsBAo",
    authDomain: "mila-movies.firebaseapp.com",
    projectId: "mila-movies",
    storageBucket: "mila-movies.firebasestorage.app",
    messagingSenderId: "706424272307",
    appId: "1:706424272307:web:6f00706fa2c9c8aac707c6",
    measurementId: "G-Z3GBRL6L3L"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);