import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyBln6czUrPfOFrY4DIp0YpCvK1m72Groi0",
  authDomain: "shoppal-network-cea5c.firebaseapp.com",
  projectId: "shoppal-network-cea5c",
  storageBucket: "shoppal-network-cea5c.firebasestorage.app",
  messagingSenderId: "883975753461",
  appId: "1:883975753461:web:64b7201a973923aa953fbc",
  
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider();