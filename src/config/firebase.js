import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "have-a-happy-day.firebaseapp.com",
  databaseURL: "https://have-a-happy-day.firebaseio.com",
  projectId: "have-a-happy-day",
  storageBucket: "have-a-happy-day.appspot.com",
  messagingSenderId: "945780311693",
  appId: "1:945780311693:web:1179cd0aaaaf50a61ec4c4",
  measurementId: "G-77GW1LN8KR",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getFirestore(app);
