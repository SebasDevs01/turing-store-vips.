import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// IMPORTANTE: REEMPLAZA ESTO CON LA CONFIGURACIÓN REAL DE TU PROYECTO FIREBASE
// Para obtener esto: Consola de Firebase -> Configuración del proyecto -> Mis aplicaciones (Añadir Web app)
const firebaseConfig = {
  apiKey: "AIzaSyB388pKhS5UW1arg9mMaBKAO6xukX7xyTc",
  authDomain: "turingstore-95d12.firebaseapp.com",
  projectId: "turingstore-95d12",
  storageBucket: "turingstore-95d12.firebasestorage.app",
  messagingSenderId: "283199203834",
  appId: "1:283199203834:web:6212502a0dec0ea04a1c43"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Exportar funciones útiles de autenticación y base de datos
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc, collection, getDocs, updateDoc };
