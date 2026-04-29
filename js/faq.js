/*
  File: js/faq.js
  Purpose: FAQ accordion interactions for quick service guidance.
*/

(function initFaq() {
  const triggers = document.querySelectorAll("[data-faq-trigger]");

  triggers.forEach(function bind(trigger) {
    trigger.addEventListener("click", function onToggle() {
      const targetId = trigger.getAttribute("aria-controls");
      const panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) {
        return;
      }

      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });
})();
