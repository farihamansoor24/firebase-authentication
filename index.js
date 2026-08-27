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

// Check Page Type
const currentPage = window.location.pathname;
const isLoginPage = currentPage.includes("login.html") || currentPage.includes("sign-up.html");
   let alert_msg = document.getElementById("alert-msg");
// Firebase Auth Listener
 onAuthStateChanged(auth, async (user) => {

    if (user) {
        // 1. User Signed In hai
        let userRef = doc(db, "users", user.uid);
        let userData = await getDoc(userRef);
        if (userData.exists()) {
        let data= userData.data();
      
        let splitPath= window.location.href.split('/');
      //  If logged in user redirect to login or signup 
        if(splitPath.includes('login.html') || splitPath.includes('sign-up.html')){
          if(data.role === "Admin"){
             window.location.replace ("../admin/admin_dashboard.html"); // Redirect to admin dashboard page
           
        }
         if(data.role === "User"){
             window.location.replace ("../user_dashobard.html"); 
             // Redirect to user dashboard page  
        }
        }
        // ----If Admin or User want to access thier profile -----------
        if(data.role === "Admin"){

            if(splitPath.includes('user') ){ 
                window.location.replace('../admin/admin_dashboard.html')    
            }
        }
         if(data.role === "User"){

            if(splitPath.includes('admin') ){
                window.location.replace('../user/user_dashboard.html')    
            }
        }
      }
        // if (isLoginPage) {
        //     window.location.href = "./dashboard.html";
        // }
    } else {
        // 2. User Signed In NAHI hai
        if (alert_msg) {
    
            alert_msg.style.display = "block";
            alert_msg.style.color = "red";
            alert_msg.innerText = "No user is signed in! "
        }

        // Agar user Dashboard/Main page par hai bina login kiye,
        // toh usko Login page par redirect kar dein
        if (!isLoginPage) {
            window.location.href = "./login.html";
        }
    }
});
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
  role: "User",
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
    alert_msg.style.color = "red";
    alert_msg.innerText = "Email ID already in use! "
}
}
})

document.getElementById("loginBtn")?.addEventListener("click", function() {
  window.location.href = "./login.html"; // Redirect to login page

});




// --------------Login User ------------------------
document.getElementById("login-form")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    const role= document.getElementById('role')?.value;
    
    let userCredential = await signInWithEmailAndPassword(auth, email, password);
  try {
    // Signed in 
    const user = userCredential.user;
    
     if(!user.emailVerified){
        if (alert_msg) {
      alert_msg.style.display = "block";
      alert_msg.style.color = "red";
      alert_msg.innerText = "Email not verified. Please check your inbox for the verification email."
  }
 }else{
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data= docSnap.data();
        if(data.role === "Admin"){
            window.location.href = "./admin/admin_dashboard.html"; // Redirect to admin dashboard page
        }
        else
        {
          window.location.href = "./user_dashobard.html"; // Redirect to user dashboard page
        }
    } else {
        // docSnap.data() will be undefined in this case
   if (alert_msg) {
      alert_msg.style.display = "block";
      alert_msg.style.color = "red";
      alert_msg.innerText = "No such user data found in database. Please contact support."
  }
}
 }
    // ...
  }
  catch(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error logging in:", errorCode, errorMessage);
  };

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

 