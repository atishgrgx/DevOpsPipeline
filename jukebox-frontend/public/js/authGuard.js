document.addEventListener("DOMContentLoaded", () => {
    const userEmail = sessionStorage.getItem("userEmail");
    const userRole = sessionStorage.getItem("userRole");
  
    // Redirect if not logged in
    if (!userEmail) {
      window.location.href = "/login";
      return;
    }
  
    // Redirect non-admins if accessing admin page
    if (window.location.pathname.includes("admin") && userRole !== "admin") {
      window.location.href = "/admin";
      return;
    }
  
    // Show Admin tab only if user is an admin
    const adminTab = document.getElementById("adminTab");
    if (userRole === "admin" && adminTab) {
      adminTab.style.display = "inline-block";
    }
  });
  