/*
  File: js/login.js
  Purpose: Mock login behavior for wireframe portal (no real authentication).
*/

(function initLogin() {
  const form = document.getElementById("login-form");
  const status = document.getElementById("login-status");
  const emailInput = document.getElementById("login-email");

  if (!form || !status || !emailInput) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const emailFromQuery = params.get("email");
  const wasRegistered = params.get("registered") === "1";

  if (emailFromQuery) {
    emailInput.value = emailFromQuery;
  }

  if (wasRegistered) {
    status.textContent = "Registration mock complete. Please sign in to continue.";
    status.className = "alert success";
  }

  form.addEventListener("submit", function onLogin(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim().toLowerCase();

    const users = JSON.parse(localStorage.getItem("portalMockUsers") || "[]");
    const matched = users.find(function byEmail(user) {
      return user.email === email;
    });

    if (!matched) {
      status.textContent = "No mock account found for that email. Try registration first.";
      status.className = "alert info";
      return;
    }

    localStorage.setItem("portalCurrentUser", JSON.stringify(matched));
    window.location.href = "dashboard.html";
  });
})();
