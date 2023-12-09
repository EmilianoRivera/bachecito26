
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, doc, addDoc,updateDoc, deleteDoc, query, where,getDoc} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {

  apiKey: "AIzaSyBw_d1q_5PvrmN4uPHCHGOjmHVXCd43NeU",

  authDomain: "bachecito-26-3.firebaseapp.com",

  projectId: "bachecito-26-3",

  storageBucket: "bachecito-26-3.appspot.com",

  messagingSenderId: "579834044731",

  appId: "1:579834044731:web:eda3bcee5213884b6e171e"

};






// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export {
    db, sendEmailVerification, createUserWithEmailAndPassword, collection, getDocs, onSnapshot,doc, updateDoc, getDoc, getAuth, query, where, deleteDoc, signInWithEmailAndPassword, auth, sendPasswordResetEmail, addDoc
}