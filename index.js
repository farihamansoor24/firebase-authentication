import { 
      getAuth,
     createUserWithEmailAndPassword ,
     signInWithEmailAndPassword,
     signOut,
     signInWithPopup, 
     GoogleAuthProvider,
     FacebookAuthProvider ,
     sendEmailVerification,

    }  from "./firebase-config.js";
import app from "./firebase-config.js";
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const auth = getAuth(app);


// const auth = getAuth();
//----------------------- Register User -----------------------
document.getElementById("signup-form")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.querySelector('input[placeholder="Enter your email"]').value;
    const password = document.querySelector('input[placeholder="Create password"]').value;

try{

 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
 
 const user = userCredential.user;
 if(!user.emailVerified){
   // signOut(auth); // Sign out the user if email is not verified
    await sendEmailVerification(user);
    console.log("Verification email sent to:", user.email);
 }
 else{
    console.log("User signed up and email is verified:", user);
 }
 console.log("User signed up:", user);
}
catch(error){
        console.error("Error Signing Up:", error.message);
}
})

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
 