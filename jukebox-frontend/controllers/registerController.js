// Import utility functions from user model
import { emailExists, addUser } from '../models/userModel.js';

// Main function to handle registration form submission
export function handleRegister(event) {
  event.preventDefault(); // Prevent default form submission

  // Get input values and trim extra spaces
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const msgBox = document.getElementById("regMessage");

  // Check if any field is empty
  if (!name || !email || !password) {
    msgBox.textContent = "All fields are required.";
    msgBox.style.color = "red";
    return;
  }

  // Validate name, only letters and spaces allowed
  if (!/^[A-Za-z\s]+$/.test(name)) {
    msgBox.textContent = "Name must contain only letters.";
    msgBox.style.color = "red";
    return;
  }

  // Validate password, must contain both letters and numbers
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    msgBox.textContent = "Password must include letters and numbers.";
    msgBox.style.color = "red";
    return;
  }

  // Check if email is already registered, in-memory check
  if (emailExists(email)) {
    msgBox.textContent = "Email already registered.";
    msgBox.style.color = "red";
    return;
  }

  // Add user to temporary in-memory list 
  addUser(email, password);

  // Show success message
  msgBox.textContent = "Registration successful!";
  msgBox.style.color = "lightgreen";
}
