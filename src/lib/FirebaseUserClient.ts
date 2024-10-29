// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import "firebase/firestore";
import ReactObserver from "react-event-observer";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//safe for client-side, protected by firebase rules
const firebaseConfig = {
  apiKey: "AIzaSyAKe_37-yHm899DPXhgJy3V5Qnq2cqmqDE",
  authDomain: "passion-project-e8a02.firebaseapp.com",
  projectId: "passion-project-e8a02",
  storageBucket: "passion-project-e8a02.appspot.com",
  messagingSenderId: "795690315375",
  appId: "1:795690315375:web:138e2f0109c3b5bf76279a",
  measurementId: "G-DWZ446MQE6",
};

// Initialize Firebase

const clientFirebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(clientFirebaseApp);
const auth = getAuth(clientFirebaseApp);
const googleProvider = new GoogleAuthProvider();
export const firebaseObserver = ReactObserver();

auth.onAuthStateChanged(function (user) {
  firebaseObserver.publish("authStateChanged", loggedIn());
});

export function loggedIn() {
  return !!auth.currentUser;
}
export { auth, googleProvider };

export default clientFirebaseApp;
