import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7_LafHV-f9DGAIKb1UK0Lu9jorVXixws",
  authDomain: "bs-cortes.firebaseapp.com",
  projectId: "bs-cortes",
  storageBucket: "bs-cortes.firebasestorage.app",
  messagingSenderId: "882587173844",
  appId: "1:882587173844:web:46b6e3935acc197fc98c41"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
