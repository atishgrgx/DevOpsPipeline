import { findUser } from "../models/userModel.js";

export function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const user = findUser(email, password);

  const msgBox = document.getElementById("message");
  if (user) {
    msgBox.textContent = "Login successful!";
    msgBox.style.color = "green";
  } else {
    msgBox.textContent = "Invalid email or password.";
    msgBox.style.color = "red";
  }
}
