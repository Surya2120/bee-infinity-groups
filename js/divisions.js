/* =========================
   BUTTON TOGGLE
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const divisionHeads = document.querySelectorAll(".division-head");

  // Guide links open the requested division as well as taking visitors to it.
  function openLinkedDivision() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target?.classList.contains("division-body")) return;
    document.querySelectorAll(".division-body").forEach(body => {
      const open = body === target;
      body.classList.toggle("active", open);
      const button = body.previousElementSibling?.querySelector(".expand-btn");
      if (button) {
        button.textContent = open ? "−" : "+";
        button.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
      }
    });
    requestAnimationFrame(() => target.previousElementSibling?.scrollIntoView({ block: "start", behavior: "instant" }));
  }
  addEventListener("hashchange", openLinkedDivision);
  addEventListener("pageshow", openLinkedDivision);
  addEventListener("load", openLinkedDivision, { once: true });
  openLinkedDivision();

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

  function revealFlagship() {
    const trigger = window.innerHeight * 0.85;
    const top = ultra.getBoundingClientRect().top;

    if (top < trigger) {
      ultra.classList.add("show");
      badge.classList.add("show");
    }
  }

  window.addEventListener("scroll", revealFlagship, { passive: true });
  window.addEventListener("load", revealFlagship, { once: true });
  window.addEventListener("pageshow", revealFlagship);
  revealFlagship();

});
