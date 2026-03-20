/* =========================
   HEADER SCROLL EFFECT
========================= */

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});




/* =========================
   DROP DOWN MENU
========================= */


document.addEventListener("DOMContentLoaded", function () {

  const exploreToggle = document.getElementById("exploreToggle");
  const dropdown = exploreToggle.parentElement;

  exploreToggle.addEventListener("click", function (e) {
    e.preventDefault();

    // toggle open class
    dropdown.classList.toggle("open");
  });

  // close when clicking outside
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

});





/* =========================
   HAMBURGER MENU SYSTEM
========================= */


document.addEventListener("DOMContentLoaded", function () {

  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  const exploreToggle = document.getElementById("exploreToggle");
  const exploreMenu = document.getElementById("exploreMenu");

  // Create overlay
  const overlay = document.createElement("div");
  overlay.classList.add("menu-overlay");
  document.body.appendChild(overlay);

  function openMenu() {
    nav.classList.add("active");
    overlay.classList.add("active");
  }

  function closeMenu() {
    nav.classList.remove("active");
    overlay.classList.remove("active");
    exploreMenu.classList.remove("show");
  }

  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", closeMenu);

  // EXPLORE DROPDOWN
  exploreToggle.addEventListener("click", function (e) {
    e.preventDefault();
    exploreMenu.classList.toggle("show");
  });

  // CLOSE MENU ONLY FOR REAL LINKS
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function () {
      if (!link.classList.contains("no-close")) {
        closeMenu();
      }
    });
  });

});

