document.addEventListener("DOMContentLoaded", () => {
  // Initialize Materialize components
  const modals = document.querySelectorAll('.modal');
  const selects = document.querySelectorAll('select');
  const tabs = document.querySelectorAll('.tabs');

  if (modals.length) M.Modal.init(modals);
  if (selects.length) M.FormSelect.init(selects);
  if (tabs.length) M.Tabs.init(tabs);

  M.updateTextFields();

  // Display user info from sessionStorage
  const name = sessionStorage.getItem("userName");
  const email = sessionStorage.getItem("userEmail") || "Not available";

  const nameEl = document.getElementById("userNameDisplay");
  const emailEl = document.getElementById("userEmail");

  if (nameEl) nameEl.textContent = name;
  if (emailEl) emailEl.textContent = email;
});

// Logout handler
function handleLogout() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

// Save personal info from modal
function savePersonalInfo() {
  const dob = document.getElementById("dob")?.value;
  const age = document.getElementById("age")?.value;
  const gender = document.getElementById("gender")?.value;

  if (!dob || !age || !gender) {
    M.toast({ html: "Please fill all fields", classes: "red" });
    return;
  }

  const dobDisplay = document.getElementById("dobDisplay");
  const ageDisplay = document.getElementById("ageDisplay");
  const genderDisplay = document.getElementById("genderDisplay");

  if (dobDisplay) dobDisplay.textContent = dob;
  if (ageDisplay) ageDisplay.textContent = age;
  if (genderDisplay) genderDisplay.textContent = gender;

  const modalInstance = M.Modal.getInstance(document.getElementById("personalModal"));
  if (modalInstance) modalInstance.close();

  M.toast({ html: "Personal details saved", classes: "green" });
}

// Optional: if using <a id="logoutBtn">Logout</a>
document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogout();
});
