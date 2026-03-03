import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCQOPbl4zfRKzBvd0qoNt81GBUhpBirVEE",
    authDomain: "portfolio-5584d.firebaseapp.com",
    projectId: "portfolio-5584d",
    storageBucket: "portfolio-5584d.firebasestorage.app",
    messagingSenderId: "73154381636",
    appId: "1:73154381636:web:e1360d071d7b140fc53911"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
