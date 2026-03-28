/* =========================
   HEADER SCROLL EFFECT
========================= */

const navbar = document.querySelector(".navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}



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


/* =========================
   FOOTER
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
   HAMBURGER MENU SYSTEM
========================= */

document.addEventListener("DOMContentLoaded", function () {

  const toggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav-links");

  if (!toggle || !nav) return;

  /* Create overlay */
  const overlay = document.createElement("div");
  overlay.classList.add("menu-overlay");
  document.body.appendChild(overlay);

  function openMenu() {
    toggle.classList.add("active");
    nav.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    toggle.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (nav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  /* Close when link clicked */
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  /* Close on ESC */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

});

