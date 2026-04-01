


/* =========================
   BUTTON TOGGLE
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const divisionHeads = document.querySelectorAll(".division-head");

  divisionHeads.forEach(head => {
    head.addEventListener("click", () => {

      const currentBody = head.nextElementSibling;
      const currentBtn = head.querySelector(".expand-btn");

      // Close all others
      document.querySelectorAll(".division-body").forEach(body => {
        if (body !== currentBody) {
          body.classList.remove("active");
        }
      });

      document.querySelectorAll(".expand-btn").forEach(btn => {
        if (btn !== currentBtn) {
          btn.textContent = "+";
          btn.style.transform = "rotate(0deg)";
        }
      });

      // Toggle current
      if (currentBody.classList.contains("active")) {
        currentBody.classList.remove("active");
        currentBtn.textContent = "+";
        currentBtn.style.transform = "rotate(0deg)";
      } else {
        currentBody.classList.add("active");
        currentBtn.textContent = "−";
        currentBtn.style.transform = "rotate(180deg)";
      }
    });
  });
});




/* =========================
   ULTRA SECTION
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const ultra = document.querySelector(".ultra-card");
  const badge = document.querySelector(".ultra-badge");

  if (!ultra || !badge) return;

  window.addEventListener("scroll", () => {
    const trigger = window.innerHeight * 0.85;
    const top = ultra.getBoundingClientRect().top;

    if (top < trigger) {
      ultra.classList.add("show");
      badge.classList.add("show");
    }
  });

});
