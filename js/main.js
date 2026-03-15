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
  const speed = 0.5;

  function animateLogos() {

    position -= speed;

    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0;
    }

    track.style.transform = `translateX(${position}px)`;

    requestAnimationFrame(animateLogos);
  }

  requestAnimationFrame(animateLogos);
}






/* =========================================
   WHAT WE DO – SLIDE REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const whatItems = document.querySelectorAll(".what-item");

  function revealWhat() {
    const triggerPoint = window.innerHeight * 0.85;

    whatItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();

      if (rect.top < triggerPoint) {

        // Stagger effect
        setTimeout(() => {
          item.classList.add("show");
        }, index * 150);

      }
    });
  }

  window.addEventListener("scroll", revealWhat);
  revealWhat(); // run once on load

});


/* =========================================
   IMPACT STATS – POP + COUNT UP
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const section = document.querySelector(".impact-stats");
  const impactItems = document.querySelectorAll(".impact-item");
  const numbers = document.querySelectorAll(".impact-number");

  if (!section) return;

  let hasAnimated = false;

  function animateNumbers() {

    numbers.forEach(number => {

      const targetText = number.textContent.trim();
      const target = parseInt(targetText.replace("+", ""));
      const suffix = targetText.includes("+") ? "+" : "";

      let current = 0;
      const duration = 1500;
      const frameRate = 60;
      const totalFrames = duration / (1000 / frameRate);
      const increment = target / totalFrames;

      function updateCount() {

        current += increment;

        if (current < target) {
          number.textContent = Math.floor(current) + suffix;
          requestAnimationFrame(updateCount);
        } else {
          number.textContent = target + suffix;
        }

      }

      updateCount();

    });

  }

  function revealImpact() {

    const rect = section.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.8;

    if (rect.top < triggerPoint && !hasAnimated) {

      impactItems.forEach((item, index) => {

        setTimeout(() => {
          item.classList.add("show");
        }, index * 200);

      });

      animateNumbers();
      hasAnimated = true;
    }

  }

  window.addEventListener("scroll", revealImpact);

  revealImpact();

});



/* =========================================
   ULTRA FLAGSHIP – SLIDE IN REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", function () {

const ultra = document.querySelector(".ultra-card");
const badge = document.querySelector(".ultra-badge");

window.addEventListener("scroll", () => {

  const trigger = window.innerHeight * 0.85;
  const top = ultra.getBoundingClientRect().top;

  if (top < trigger) {
    ultra.classList.add("show");
    badge.classList.add("show");
  }

});

  observer.observe(ultraCard);

});





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


