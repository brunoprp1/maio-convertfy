import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB4Ht0oNN5sKgLjfQ1_Cn7cbvObShbzLgs",
  authDomain: "app-convertfy-v2.firebaseapp.com",
  projectId: "app-convertfy-v2",
  storageBucket: "app-convertfy-v2.appspot.com",
  messagingSenderId: "745054377673",
  appId: "1:745054377673:web:8f9b9f9b9b9f9b9b9b9f9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.warn('Firebase persistence failed - multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
    console.warn('Firebase persistence not supported in this browser');
  }
});

export default app;