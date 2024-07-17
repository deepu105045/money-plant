// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDLESTcDoB3-yLMnCk5uj28HfUs0gphQx4",
    authDomain: "expense-tracker-plus.firebaseapp.com",
    projectId: "expense-tracker-plus",
    storageBucket: "expense-tracker-plus",
    messagingSenderId: "1060437550938",
    appId: "1:1060437550938:web:9ecf1ef31a8c48b9ff7563",
    measurementId: "G-S57D8RHFBL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, 
        googleProvider, 
        signInWithPopup, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword,
        updateProfile,
        db,
        signOut
     };
