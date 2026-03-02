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
   HERO VIDEO MUTE BUTTON
========================= */

const video = document.getElementById("heroVideo");
const muteBtn = document.getElementById("muteToggle");

if (video && muteBtn) {
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  });
}


/* =========================
   PORTFOLIO FILTER
========================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

if (filterButtons.length && portfolioItems.length) {
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      const activeBtn = document.querySelector(".filter-btn.active");
      if (activeBtn) activeBtn.classList.remove("active");

      button.classList.add("active");

      const filter = button.getAttribute("data-filter");
      let visibleCount = 0;

      portfolioItems.forEach(item => {
        const category = item.getAttribute("data-category");

        if (filter === "all") {
          if (visibleCount < 4) {
            item.style.display = "block";
            visibleCount++;
          } else {
            item.style.display = "none";
          }
        } else {
          item.style.display = category === filter ? "block" : "none";
        }
      });
    });
  });
}


/* =========================
   CLIENT LOGO AUTO SCROLL
========================= */

const track = document.getElementById("logoTrack");

if (track) {
  track.innerHTML += track.innerHTML;

  let position = 0;
  let speed = 0.5;

  function animateLogos() {
    position -= speed;

    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0;
    }

    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animateLogos);
  }

  animateLogos();
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