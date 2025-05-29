// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-4ibBVklZiVUAjvxKG6IikKjlj_X5zIs",
  authDomain: "artisan-auctions.firebaseapp.com",
  projectId: "artisan-auctions",
  storageBucket: "artisan-auctions.firebasestorage.app",
  messagingSenderId: "458562162478",
  appId: "1:458562162478:web:cdb553aa5d31f2d18fb4bf",
  measurementId: "G-HLR2FL3XZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };