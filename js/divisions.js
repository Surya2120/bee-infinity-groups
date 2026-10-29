/* =========================
   BUTTON TOGGLE
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const divisionHeads = document.querySelectorAll(".division-head");

  function setDivisionState(body, open) {
    body.classList.toggle("active", open);
    const button = body.previousElementSibling?.querySelector(".expand-btn");
    if (!button) return;
    button.textContent = open ? "−" : "+";
    button.setAttribute("aria-expanded", String(open));
    button.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
  }

  // Guide links open the requested division as well as taking visitors to it.
  function openLinkedDivision() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target?.classList.contains("division-body")) return;
    document.querySelectorAll(".division-body").forEach(body => setDivisionState(body, body === target));
    requestAnimationFrame(() => target.previousElementSibling?.scrollIntoView({ block: "start", behavior: "auto" }));
  }
  addEventListener("hashchange", openLinkedDivision);
  addEventListener("pageshow", openLinkedDivision);
  addEventListener("load", openLinkedDivision, { once: true });
  openLinkedDivision();

  document.querySelectorAll('.division-jump a[href^="#"], .ecosystem-programme a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target?.classList.contains("division-body")) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
      openLinkedDivision();
    });
  });

  divisionHeads.forEach(head => {
    head.addEventListener("click", () => {
      const currentBody = head.nextElementSibling;
      const open = !currentBody.classList.contains("active");
      document.querySelectorAll(".division-body").forEach(body => setDivisionState(body, body === currentBody && open));
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
