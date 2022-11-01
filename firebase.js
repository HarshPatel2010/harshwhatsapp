// import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBHt91vB4jzBzdw0acIHBnWBZ22TyD90m4",
    authDomain: "harshwebwhatsapp.firebaseapp.com",
    projectId: "harshwebwhatsapp",
    storageBucket: "harshwebwhatsapp.appspot.com",
    messagingSenderId: "374677932430",
    appId: "1:374677932430:web:8fb38129e812d1069e7cdf",
    measurementId: "G-MX5HES1PLE"
  };


  const appp = initializeApp(firebaseConfig);
 
  const app = !appp.length ? initializeApp(firebaseConfig) : appp;
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();



// const app = !firebase.app.length  ? firebase.initializeApp(firebaseConfig):firebase.app;
// const app = if(!firebase.getApps.length){firebase.initializeApp(firebaseConfig)}
// const db = app.firestore();
// const auth = app.auth();
// const provider = new firebase.auth.GoogleAuthProvider();
export {db,auth,provider};