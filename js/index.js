import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendEmailVerification,
  onAuthStateChanged,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  sendPasswordResetEmail,
  updateProfile,
  updateDoc,db,auth
} from "./firebase-config.js";
import { uploadToCloudinary } from "./cloudinary.js";
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();



// Check Page Type
const currentPage = window.location.pathname;
const isLoginPage = currentPage.includes("login.html") || currentPage.includes("sign-up.html");
let alert_msg = document.getElementById("alert-msg");
// Firebase Auth Listener
onAuthStateChanged(auth, async (user) => {

  if (user) {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let contact = document.getElementById('contact');
    let country = document.getElementById('country');
    let avatarPreview = document.getElementById('avatarPreview');
     let profileImg = document.getElementById('profileImg');
    // 1. User Signed In hai
    let userRef = doc(db, "users", user.uid);
    let userData = await getDoc(userRef);
    if (userData.exists()) {
      let data = userData.data();

      let splitPath = window.location.href.split('/');
      //  If logged in user redirect to login or signup 
      if (splitPath.includes('login.html') || splitPath.includes('sign-up.html')) {
        if (data.role === "Admin") {
          window.location.replace("../admin/admin_dashboard.html"); // Redirect to admin dashboard page

        }
        if (data.role === "User") {
          window.location.replace("../user/user_dashboard.html");
          // Redirect to user dashboard page  
        }
      }
      // ----If Admin or User want to access thier profile -----------
      if (data.role === "Admin") {

        if (splitPath.includes('user')) {
          window.location.replace('../admin/admin_dashboard.html')
        }
      }
      if (data.role === "User") {

        if (splitPath.includes('admin')) {
          window.location.replace('../user/user_dashboard.html')
        }
      }
      if (data) {
        if (name) name.value = data.name;
        if (email) email.value = data.email;
        if (contact) contact.value = data.contact;
        if (country) country.value = data.country;
        if (data.photoURL) {
          if (profileImg) profileImg.src = data.photoURL;
          if (avatarPreview) avatarPreview.src = data.photoURL;
        }
      }
    }

  } else {
    // 2. User Signed In NAHI hai
 
    if (!isLoginPage) {
      window.location.href = "./login.html";
    }
  }
});
// const auth = getAuth();
//----------------------- Register User -----------------------
document.getElementById("signup-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  let name = document.getElementById('name')?.value;
  let contact = document.getElementById('contact')?.value;
  let country = document.getElementById('country')?.value;
  let email = document.getElementById('email')?.value;
  let password = document.getElementById('password')?.value;
  let alert_msg = document.getElementById("alert-msg");
  // console.log("User signed up:", name, contact, country, email, password);

  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add a new document in collection "users"
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      name: name,
      contact: contact,
      country: country,
      role: "User",
      status:"Block",
      photoUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMU70Bo4T8_O9Ca1_Z8VvDg1860IlXZWHEA5KZj76wKfwAJ5lYPEvPyeDT&s=10",
      createdAt: serverTimestamp()
    });
    // if (!user.emailVerified) {

    //   await sendEmailVerification(user);

    //   if (alert_msg) {
    //     alert_msg.style.display = "block";
    //     alert_msg.style.color = "green";
    //     alert_msg.innerText = "Verification email sent to: " + user.email;
    //   }
    //   // console.log("Verification email sent to:", user.email);
    // }
    

  }
  catch (error) {
    console.error("Error Signing Up:", error.message);
    if (alert_msg) {

      alert_msg.style.display = "block";
      alert_msg.style.color = "red";
      alert_msg.innerText = "Email ID already in use! "
    }
  }
})

document.getElementById("loginBtn")?.addEventListener("click", function () {
  window.location.href = "./login.html"; // Redirect to login page

});




// --------------Login User ------------------------
document.getElementById("login-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;
  // const role= document.getElementById('role')?.value;

  let userCredential = await signInWithEmailAndPassword(auth, email, password);
  try {
    // Signed in 
    const user = userCredential.user;
    // alert(user)
    //      if(!user.emailVerified){
    //         if (alert_msg) {
    //       alert_msg.style.display = "block";
    //       alert_msg.style.color = "red";
    //       alert_msg.innerText = "Email not verified. Please check your inbox for the verification email."
    //   }
    //  }else{
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      if (data.role === "Admin") {
        window.location.href = "./admin/admin_dashboard.html"; // Redirect to admin dashboard page
      }
      else {
        window.location.href = "./user/user_dashboard.html"; // Redirect to user dashboard page
      }
    } else {
      // docSnap.data() will be undefined in this case
      if (alert_msg) {
        alert_msg.style.display = "block";
        alert_msg.style.color = "red";
        alert_msg.innerText = "No such user data found in database. Please contact support."
      }
      //}
    }
    // ...
  }
  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error logging in:", errorCode, errorMessage);
  };

})

// ----------- lOGOUT USER -------------------
document.getElementById("logoutBtn")?.addEventListener("click", function () {
  signOut(auth).then(() => {
    window.location.href = "../login.html"; // Redirect to login page
  }).catch((error) => {
    console.error("Error logging out:", error.message);
  })
});

// ------------------- Google Sign In -------------------
//  For prevent the account selection prompt every time, you can set custom parameters for the GoogleAuthProvider.
googleProvider.setCustomParameters({
  prompt: "select_account"
});

document.getElementById("googleLoginBtn")?.addEventListener("click", async (e) => {
  let result = signInWithPopup(auth, googleProvider)
  try {

    // The signed-in user info.
    const user = result.user;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      if (data.role === "Admin") {
        window.location.href="../admin/admin_dashboard.html"; // Redirect to admin dashboard page
      }
      else {
        window.location.href = "./user/user_dashboard.html"; // Redirect to user dashboard page
      }
    } else {
      // docSnap.data() will be undefined in this case

      // Add a new document in collection "users"
      await setDoc(doc(db, "users", user?.uid), {
        email: user.email,
        name: user.displayName,
        contact: "0000000000",
        country: "Pakistan",
        role: "User",
        status:'Block',
        createdAt: serverTimestamp()
      });

    }
  } catch (error) {

    const errorMessage = error.message;
    console.error("Error signing in with Google:", errorMessage);

  };
})


// ------------------- Facebook Sign In -------------------
facebookProvider.setCustomParameters({
  'display': 'popup'
});

document.getElementById("facebookLoginBtn")?.addEventListener("click",
  async function () {

    const result = await signInWithPopup(auth, facebookProvider)
    console.log("Facebook sign-in result:", result);
    try {
      const user = result.user;
      console.log("User signed in with Facebook:", user);
    }
    catch (error) {
      console.error("Error signing in with Facebook:", error.message);
    }
  })



// ---------- Forgot Password --------------------------//
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const modal = document.getElementById('forgotPasswordModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const resetForm = document.getElementById('resetPasswordForm');
const resetEmailInput = document.getElementById('resetEmail');
const statusMsg = document.getElementById('modalStatus');

// 1. Open Modal on Link Click
forgotPasswordLink?.addEventListener('click', (e) => {
  e.preventDefault();
  statusMsg.textContent = '';
  statusMsg.className = 'status-message';
  resetEmailInput.value = '';
  modal.showModal(); // Opens modal with backdrop
});
// 2. Close Modal on Cancel Button Click
closeModalBtn?.addEventListener('click', () => {
  modal.close();
});

// 3. Handle Form Submission & Firebase Email Reset
resetForm?.addEventListener('submit', async (e) => {
  e.preventDefault(); // Stop form from closing automatically before request finishes

  const email = resetEmailInput.value.trim();

  if (!email) {
    statusMsg.textContent = 'Please enter a valid email address.';
    statusMsg.className = 'status-message error';
    return;
  }

  try {
    statusMsg.textContent = 'Sending reset email...';
    statusMsg.className = 'status-message';

    // Firebase Auth Request
    await sendPasswordResetEmail(auth, email);

    statusMsg.textContent = 'Reset link sent! Check your inbox.';
    statusMsg.className = 'status-message success';

    // Auto-close modal after 2 seconds
    setTimeout(() => {
      modal.close();
    }, 2000);

  } catch (error) {
    console.error('Password reset error:', error);
    statusMsg.textContent = error.message || 'Failed to send reset email.';
    statusMsg.className = 'status-message error';
  }
});
// ---------------------------------------------------------------//


// -------------Update Profile --------------------------//
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const file = document.getElementById('avatarInput')?.files[0];
    const photoURL = await uploadToCloudinary(file);
    await updateProfile(auth.currentUser,
      {
        displayName: document.getElementById('name')?.value,
        email: document.getElementById('email').value,
        photoURL: photoURL,

      });
    const userRef = doc(db, "users", auth.currentUser.uid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(userRef, {
      name: document.getElementById('name')?.value,
      email: document.getElementById('email').value,
      contact: document.getElementById('contact')?.value,
      country: document.getElementById('country').value,
      photoURL: photoURL,
    });
    console.log('Profile updated');
  } catch (error) {
    // An error occurred
    // ...
    console.log(error);
  };
})

