import '../styles/globals.css';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase"
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from "react";
import firestore from "firebase/firestore";
import { collection, doc, setDoc,serverTimestamp } from "firebase/firestore";


function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
   if(user){
    const userRef = collection(db, "users");
    setDoc(doc(userRef, user.uid), {
      email: user.email,
      lastSeen: serverTimestamp(),
      photo: user.photoURL
    },
      { merge: true })
   }
    // db.collection("users").doc(user.uid).set({
    //   email: user.email,
    //   lastSeen: firestore.FieldValue.serverTimestamp(),
    //   photo: user.photoURL
    // },
    //   { merge: true }
    // )
  }, [user])
  if (loading) return <Loading />
  if (!user) return <Login />



  return <Component {...pageProps} />
}

export default MyApp
