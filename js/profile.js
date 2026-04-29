/*
  File: js/profile.js
  Purpose: Wireframe-only profile editing with localStorage draft updates.
*/

(function initProfile() {
  const form = document.getElementById("profile-form");
  const status = document.getElementById("profile-status");

  if (!form || !status) {
    return;
  }

  const user = JSON.parse(localStorage.getItem("portalCurrentUser") || "null");
  if (user) {
    form.elements.firstName.value = user.firstName || "";
    form.elements.lastName.value = user.lastName || "";
    form.elements.email.value = user.email || "";
  }

  form.addEventListener("submit", function onSave(event) {
    event.preventDefault();
    status.textContent = "Profile changes saved in mock local storage.";
    status.className = "alert success";
  });
})();
