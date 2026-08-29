
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";
  import { 
      getAuth,
     createUserWithEmailAndPassword ,
     signInWithEmailAndPassword,
     signOut,
     signInWithPopup, 
     GoogleAuthProvider,
     FacebookAuthProvider ,
     sendEmailVerification,
     onAuthStateChanged,
     sendPasswordResetEmail, 
     updateProfile

    }    from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
    import { 
      getFirestore,
      doc,
      setDoc,
      getDoc,
      serverTimestamp,
      updateDoc
    
    } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBlIO6FvF_y4TfmFeAvJCR9D-LgTdhd7Ws",
    authDomain: "my-auth-app-77c4e.firebaseapp.com",
    projectId: "my-auth-app-77c4e",
    storageBucket: "my-auth-app-77c4e.firebasestorage.app",
    messagingSenderId: "376327421412",
    appId: "1:376327421412:web:e59f4390cbc3870d3b1bf1",
    measurementId: "G-X5EZF9LFD8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
export default app;
export { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,   sendEmailVerification, onAuthStateChanged, getFirestore, doc, setDoc, getDoc, serverTimestamp,sendPasswordResetEmail ,updateProfile,updateDoc
 };