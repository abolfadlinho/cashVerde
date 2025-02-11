import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCPwqKgydqdbKVGid4GWFVpWjudjXcRiAg",
  authDomain: "recycling-f58c3.firebaseapp.com",
  projectId: "recycling-f58c3",
  storageBucket: "recycling-f58c3.firebasestorage.app",
  messagingSenderId: "1033577339070",
  appId: "1:1033577339070:web:f81b51d3590f32b9d566ef",
  measurementId: "G-WDCDQVRNK8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
}) || getAuth(app);

export {app, db, auth};