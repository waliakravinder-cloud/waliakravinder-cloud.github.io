/*
  File: js/dashboard.js
  Purpose: Populate dashboard with mock user state and small wireframe insights.
*/

(function initDashboard() {
  const nameTarget = document.getElementById("dashboard-user-name");
  const statusTarget = document.getElementById("dashboard-status");

  if (!nameTarget || !statusTarget) {
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("portalCurrentUser") || "null");

  if (!currentUser) {
    nameTarget.textContent = "Guest";
    statusTarget.textContent = "You are viewing mock dashboard data. Login mock is optional.";
    return;
  }

  nameTarget.textContent = currentUser.firstName + " " + currentUser.lastName;
  statusTarget.textContent = "Mock account session active for " + currentUser.email;
})();
