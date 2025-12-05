import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyCNRrv__BPISDAKNfKFWlVQcOqwUKW-uwE",
  authDomain: "secret-santa-19310.firebaseapp.com",
  projectId: "secret-santa-19310",
  storageBucket: "secret-santa-19310.firebasestorage.app",
  messagingSenderId: "415482926904",
  appId: "1:415482926904:web:b3fc13a5501a48ed6413cd",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
