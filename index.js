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
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
    }  from "./firebase-config.js";
import app from "./firebase-config.js";
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


// const auth = getAuth();
//----------------------- Register User -----------------------
document.getElementById("signup-form")?.addEventListener("submit", async function(e) {
    e.preventDefault();
  let name = document.getElementById('name')?.value;
  let contact = document.getElementById('contact')?.value;
  let country = document.getElementById('country')?.value;
  let email = document.getElementById('email')?.value;
  let password = document.getElementById('password')?.value;
  let alert_msg = document.getElementById("alert-msg");
  // console.log("User signed up:", name, contact, country, email, password);

try{

 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Add a new document in collection "users"
await setDoc(doc(db, "users", user?.uid), {
  email: email,
  name: name,
  contact: contact,
  country: country,
  createdAt: serverTimestamp()
});
 if(!user.emailVerified){

   // signOut(auth); // Sign out the user if email is not verified
    await sendEmailVerification(user);
   
      if (alert_msg) {
      alert_msg.style.display = "block";
    alert_msg.style.color = "green";
    alert_msg.innerText = "Verification email sent to: " + user.email;
}
    // console.log("Verification email sent to:", user.email);
 }
 else{
  if (alert_msg) {
  alert_msg.style.display = "block";
    alert_msg.style.color = "green";
    alert_msg.innerText = "Email already in use! "
}
   
 }

}
catch(error){
        console.error("Error Signing Up:", error.message);
     if (alert_msg) {
     alert_msg.style.display = "block";
    alert_msg.style.color = "green";
    alert_msg.innerText = "Email ID already in use! "
}
}
})

document.getElementById("loginBtn")?.addEventListener("click", function() {
  window.location.href = "./login.html"; // Redirect to login page

});

// --------------Login User ------------------------
document.getElementById("login-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.querySelector('input[placeholder="Enter your email"]').value;
    const password = document.querySelector('input[placeholder="Enter your password"]').value;
  console.log("User logged in:", email, password);
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
     if(!user.emailVerified){
       console.log("Email not verified. Please check your inbox for the verification email.");
      // signOut(auth); // Sign out the user if email is not verified
 }else{
    console.log("User logged in:", user);
     window.location.href = "index.html"; // Redirect to dashboard page
 }
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error logging in:", errorCode, errorMessage);
  });

})

// ----------- lOGOUT USER -------------------
document.getElementById("logoutBtn")?.addEventListener("click", function() {
    signOut(auth).then(() => {
        window.location.href = "login.html"; // Redirect to login page
    }).catch((error) => {
        console.error("Error logging out:", error.message);
    })
});

// ------------------- Google Sign In -------------------
//  For prevent the account selection prompt every time, you can set custom parameters for the GoogleAuthProvider.
googleProvider.setCustomParameters({
  prompt: "select_account"
});

document.getElementById("googleLoginBtn")?.addEventListener("click", function() {
    signInWithPopup(auth, googleProvider)
  .then((result) => {

    // The signed-in user info.
    const user = result.user;
    window.location.href = "index.html"; // Redirect to dashboard page
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
   
    const errorMessage = error.message;
    console.error("Error signing in with Google:", errorMessage);
   
  });
})
// ------------------- Facebook Sign In -------------------
facebookProvider.setCustomParameters({
  'display': 'popup'
});

document.getElementById("facebookLoginBtn")?.addEventListener("click", 
  async function() {
   
    const result = await signInWithPopup(auth, facebookProvider)
    console.log("Facebook sign-in result:", result);
try{
   const user = result.user;
   console.log("User signed in with Facebook:", user);
}
catch(error){
   console.error("Error signing in with Facebook:", error.message);
}
}) 
 