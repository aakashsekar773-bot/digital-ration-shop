// firebase.js - modular helpers (client)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase, ref as dbRef, set as dbSet, onValue as dbOnValue, off as dbOff,
  push as dbPush, get as dbGet
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import {
  getMessaging, getToken, onMessage
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDd-tU2V_wV2lwaX3_AkdDZZf3c-rA54VE",
  authDomain: "new-idea-1f401.firebaseapp.com",
  databaseURL: "https://new-idea-1f401-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "new-idea-1f401",
  storageBucket: "new-idea-1f401.firebasestorage.app",
  messagingSenderId: "34069771276",
  appId: "1:34069771276:web:7af73f0e682f5d8b806a29",
  measurementId: "G-C7RR1MWT9V"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messaging = getMessaging(app);

// Export helpers
export {
  app,
  db,
  dbRef,
  dbSet,
  dbPush,
  dbOnValue,
  dbOff,
  dbGet,
  messaging,
  getToken,
  onMessage
};
