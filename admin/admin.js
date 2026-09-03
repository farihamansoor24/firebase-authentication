import{auth,onAuthStateChanged,signOut,db,getDocs,doc,getDoc,collection,where,updateDoc,setDoc} from "../js/firebase-config.js";

onAuthStateChanged(auth, async(user) => {
  
  if(user){
  let userRef = doc(db, "users", user.uid);
    let userData = await getDoc(userRef);
    if (userData.exists()) {
      let data = userData.data();
  if(data && data.role !== "Admin"){

    window.location.href = "../page_not_found.html";
  }
}
}
});
let users=[]
 // Configuration
let currentPage = 1;
const rowsPerPage = 3;


// DOM Elements
const userTableBody = document.getElementById("userTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumbers = document.getElementById("pageNumbers");
const paginationInfo = document.getElementById("paginationInfo");

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
    if(doc.data().role !== "Admin"){
        users.push({...doc.data(),id:doc.id});
    }
});
let filteredUsers = [...users];


// Initialize Dashboard Table
function renderTable() {
  userTableBody.innerHTML = "";

  // Pagination Calculation
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = filteredUsers.slice(start, end);
//   const paginatedItems = data.slice(start, end);


  if (paginatedItems.length === 0) {
    userTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: #707ebe;">No users found.</td></tr>`;
  } else {
    paginatedItems.forEach(user => {
      const isBlocked = user.status === "Block";
      const row = document.createElement("tr");
      
      row.innerHTML = `
        <td>
          <div class="user-info-cell">
            <img src="${user.photoURL?user.photoURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuKiVrFgaCktxXF0QFKHAD9ZwirmPjLN5jaE5c4hZkHg&s=10"}" class="user-avatar" alt="${user.name}">
            <strong>${user.name}</strong>
          </div>
        </td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <span class="badge ${isBlocked ? 'badge-blocked' : 'badge-active'}">
            ${user.status ? user.status.toUpperCase() : 'Active'}
          </span>
        </td>
        <td>
          <button class="btn-action ${isBlocked ? 'btn-unblock' : 'btn-block'}" onclick="toggleUserStatus('${user.id}')">
            ${isBlocked ? 'Unblock' : 'Block'}
          </button>
        </td>
      `;
      userTableBody.appendChild(row);
    });
  }

  updatePaginationControls();
}

// Block / Unblock Toggle Functionality
window.toggleUserStatus = async function(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.status = user.status === "Active" ? "Block" : "Active";
    const userRef = doc(db, "users", userId);

    // update the status  of user active or block in firestore
    await updateDoc(userRef, {
        status: user.status
     });
    filterAndSearchData(); // Refresh View
  }
};

// Filter & Search Logic
function filterAndSearchData() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  currentPage = 1; // Reset to page 1 on new filter
renderTable();
}

// Pagination Controls Logic
function updatePaginationControls() {
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  
  // Text Info
  const startCount = filteredUsers.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endCount = Math.min(currentPage * rowsPerPage, filteredUsers.length);
  paginationInfo.textContent = `Showing ${startCount}-${endCount} of ${filteredUsers.length} users`;

  // Buttons state
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Page Numbers
  pageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("page-num");
    if (i === currentPage) pageBtn.classList.add("active");
    pageBtn.textContent = i;
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
    });
    pageNumbers.appendChild(pageBtn);
  }
}

// Event Listeners
searchInput?.addEventListener("input", filterAndSearchData);
statusFilter?.addEventListener("change", filterAndSearchData);

prevBtn?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

nextBtn?.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

// Initial Render
renderTable();
// document.addEventListener("DOMContentLoaded", renderTable);

  const adminLogoutBtn = document.getElementById("adminLogoutBtn");
  if (adminLogoutBtn) {
    adminLogoutBtn?.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out?")) {
        signOut(auth)
        window.location.href = "../login.html";
      }
    });
  }
