/* =========================
   HEADER SCROLL EFFECT
========================= */
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  navbar.classList.toggle("scrolled", window.scrollY > 50);
});


/* =========================
   DROPDOWN MENU
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const exploreToggle = document.getElementById("exploreToggle");
  if (!exploreToggle) return;

  const dropdown = exploreToggle.parentElement;

  exploreToggle.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

});





/* =========================
   FOOTER EFFECT
========================= */
const footer = document.querySelector(".footer-modern");

if (footer) {
  footer.addEventListener("mousemove", (e) => {
    const rect = footer.getBoundingClientRect();

    footer.style.setProperty("--x", `${e.clientX - rect.left}px`);
    footer.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
}


/* =========================
   MOBILE MENU
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  const exploreToggle = document.getElementById("exploreToggle");
  const exploreMenu = document.getElementById("exploreMenu");

  if (!toggle || !nav) return;

  const overlay = document.createElement("div");
  overlay.classList.add("menu-overlay");
  document.body.appendChild(overlay);

  const close = () => {
    nav.classList.remove("active");
    overlay.classList.remove("active");
    exploreMenu?.classList.remove("show");
  };

  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", close);

  exploreToggle?.addEventListener("click", (e) => {
    e.preventDefault();
    exploreMenu?.classList.toggle("show");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (!link.classList.contains("no-close")) close();
    });
  });

});