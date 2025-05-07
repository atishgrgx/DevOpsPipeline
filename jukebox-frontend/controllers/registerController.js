import { emailExists, addUser } from '../models/userModel.js';

export function handleRegister(event) {
    event.preventDefault();
  
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const msgBox = document.getElementById("regMessage");
  
    if (!name || !email || !password) {
      msgBox.textContent = "All fields are required.";
      msgBox.style.color = "red";
      return;
    }
  
    if (!/^[A-Za-z\s]+$/.test(name)) {
      msgBox.textContent = "Name must contain only letters.";
      msgBox.style.color = "red";
      return;
    }
  
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      msgBox.textContent = "Password must include letters and numbers.";
      msgBox.style.color = "red";
      return;
    }
  
    if (emailExists(email)) {
      msgBox.textContent = "Email already registered.";
      msgBox.style.color = "red";
      return;
    }
  
    addUser(email, password);
    msgBox.textContent = "Registration successful!";
    msgBox.style.color = "lightgreen";
  }
  