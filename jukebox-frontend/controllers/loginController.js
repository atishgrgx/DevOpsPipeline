export function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msgBox = document.getElementById("message");

  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(async res => {
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("userEmail", data.user.email);
        sessionStorage.setItem("userName", data.user.username || "User");
        localStorage.setItem("token", data.token);
        msgBox.textContent = "Login successful!";
        msgBox.style.color = "lightgreen";

        setTimeout(() => {
          window.location.href = "../views/home.html";
        }, 1500);
      } else {
        msgBox.textContent = data.message || "Login failed.";
        msgBox.style.color = "red";
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      msgBox.textContent = "Server error. Please try again later.";
      msgBox.style.color = "red";
    });
}
