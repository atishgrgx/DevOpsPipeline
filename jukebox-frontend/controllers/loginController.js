export async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msgBox = document.getElementById("message");

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("Login Response:", data);

    if (res.ok) {
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("userName", data.name || "User");
      sessionStorage.setItem("userRole", data.role);

      msgBox.textContent = "Login successful!";
      msgBox.style.color = "lightgreen";

      setTimeout(() => {
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/home";
        }
      }, 1500);
    } else {
      msgBox.textContent = data.message || "Login failed.";
      msgBox.style.color = "red";
    }
  } catch (err) {
    console.error("Login error:", err);
    msgBox.textContent = "Server error. Please try again later.";
    msgBox.style.color = "red";
  }
}
