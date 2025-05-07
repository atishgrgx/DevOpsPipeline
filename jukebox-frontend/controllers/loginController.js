// Import function to find user from the in-memory model
import { findUser } from "../models/userModel.js";

// Function to handle login form submission
export function handleLogin(event) {
  event.preventDefault(); // Prevent default form submission (page reload)

  // Get input values from form
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Look for a matching user (email + password)
  const user = findUser(email, password);

  // Reference to message box to show feedback
  const msgBox = document.getElementById("message");

  if (user) {
    // Save user details to session storage for later use (e.g., on profile page)
    sessionStorage.setItem('userName', user.name || "User");
    sessionStorage.setItem('userEmail', user.email);

    // Show success message
    msgBox.textContent = "Login successful!";
    msgBox.style.color = "lightgreen";

    // Wait 1.5 seconds before redirecting to profile page
    setTimeout(() => {
      window.location.href = "../views/profile.html";
    }, 1500);
  } else {
    // Show error message if user not found or wrong credentials
    msgBox.textContent = "Invalid email or password.";
    msgBox.style.color = "red";
  }
}
