/*
  File: js/registration.js
  Purpose: Mock registration flow for wireframe-only account creation and handoff to login.
*/

(function initRegistration() {
  const form = document.getElementById("registration-form");
  const status = document.getElementById("registration-status");

  if (!form || !status) {
    return;
  }

  form.addEventListener("submit", function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!firstName || !lastName || !email || !password) {
      status.textContent = "Please fill in all required fields.";
      status.className = "alert info";
      return;
    }

    const users = JSON.parse(localStorage.getItem("portalMockUsers") || "[]");
    const existing = users.find(function byEmail(user) {
      return user.email === email;
    });

    if (existing) {
      status.textContent = "This email is already registered in mock data. Try login instead.";
      status.className = "alert info";
      return;
    }

    users.push({
      id: Date.now(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem("portalMockUsers", JSON.stringify(users));

    status.textContent = "Mock account created. Redirecting to login...";
    status.className = "alert success";

    window.setTimeout(function goToLogin() {
      window.location.href = "login.html?registered=1&email=" + encodeURIComponent(email);
    }, 800);
  });
})();
