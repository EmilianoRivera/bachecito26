
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, doc, addDoc,updateDoc, deleteDoc, query, where,} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {

  apiKey: "AIzaSyDRgcJ0DpDxYXlbvjB0kNa6-IMcMI6UPS0",

  authDomain: "web---1.firebaseapp.com",

  projectId: "web---1",

  storageBucket: "web---1.appspot.com",

  messagingSenderId: "493674989659",

  appId: "1:493674989659:web:7f7f59c2d7418db6ff177e"

};





// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export {
    db, collection, getDocs, onSnapshot,doc, updateDoc, getAuth, query, where, deleteDoc, signInWithEmailAndPassword, auth, sendPasswordResetEmail, addDoc
}