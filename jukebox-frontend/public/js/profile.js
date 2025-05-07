// Wait until the full HTML document is loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  
  // Retrieve user data from session storage (set during login)
  const name = sessionStorage.getItem("userName") || "Guest"; // Default to "Guest" if not found
  const email = sessionStorage.getItem("userEmail") || "Not available"; // Default if no email

  // Update the profile page with the user's name and email
  document.getElementById("userName").textContent = name;
  document.getElementById("userEmail").textContent = email;
});
