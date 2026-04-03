/* =========================
   HEADER SCROLL EFFECT (FIXED)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Run after full load (prevents auto shrink)
  window.addEventListener("load", updateNavbar);

  // Scroll listener
  window.addEventListener("scroll", updateNavbar);

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

document.addEventListener("DOMContentLoaded", () => {

  const footer = document.querySelector(".footer-modern");

  if (!footer) return;

  footer.addEventListener("mousemove", (e) => {
    const rect = footer.getBoundingClientRect();

    footer.style.setProperty("--x", `${e.clientX - rect.left}px`);
    footer.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });

});


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


/* =========================
   SCROLL TO TOP (NO JUMP)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  function handleScroll() {

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    /* SHOW / HIDE */
    if (scrollTop > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }

    /* COLOR SHIFT */
    if (scrollPercent < 0.33) {
      btn.style.background = "rgba(255,255,255,0.08)";
      btn.style.color = "#ffcc70";
    }
    else if (scrollPercent < 0.66) {
      btn.style.background = "rgba(255,123,0,0.15)";
      btn.style.color = "#ff7b00";
    }
    else {
      btn.style.background = "rgba(10,61,145,0.2)";
      btn.style.color = "#0a3d91";
    }
  }

  window.addEventListener("scroll", handleScroll);

  /* SMOOTH SCROLL ENGINE */
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const start = window.scrollY;
    const duration = 700;
    let startTime = null;

    function scrollStep(timestamp) {
      if (!startTime) startTime = timestamp;

      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);

      const ease = 1 - Math.pow(1 - percent, 3);

      window.scrollTo(0, start * (1 - ease));

      if (progress < duration) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  });

  handleScroll();

});