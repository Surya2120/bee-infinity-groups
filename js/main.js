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
   BEE EFFECT
========================= */

const beeWrapper = document.querySelector(".bee-wrapper");
const bee = document.querySelector(".bee");
const canvas = document.getElementById("beeTrail");
const sound = document.getElementById("beeSound");
const heroSection = document.querySelector(".about-hero");
const sectionTitles = document.querySelectorAll("h2");

if (beeWrapper && bee && canvas) {

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let lastScroll = window.scrollY;
  let trail = [];
  let infinityElement = null;

  function updateBee() {

    const scrollY = window.scrollY;

    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom > window.innerHeight / 2) {
        beeWrapper.classList.remove("visible");
      } else {
        beeWrapper.classList.add("visible");
      }
    }

    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = scrollY / maxScroll;

    const x = 10 + progress * 70;
    const y = 30 + Math.sin(progress * Math.PI * 2) * 15;

    beeWrapper.style.transform = `translate(${x}vw, ${y}vh)`;

    if (scrollY > lastScroll) {
      bee.style.transform = "rotate(25deg)";
    } else {
      bee.style.transform = "rotate(-25deg)";
    }

    const rect = beeWrapper.getBoundingClientRect();
    trail.push({ x: rect.left + 30, y: rect.top + 30 });
    if (trail.length > 25) trail.shift();

    drawTrail();
    lastScroll = scrollY;
  }

  function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, i * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242,196,0,${i / trail.length})`;
      ctx.fill();
    }
  }

  window.addEventListener("scroll", updateBee);

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}


/* =========================
   MOBILE NAV TOGGLE
========================= */
document.addEventListener("DOMContentLoaded", function () {

  const toggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav-links");
  const overlay = document.getElementById("menuOverlay");
  const body = document.body;
  const clickSound = document.getElementById("menuClick");

  if (!toggle || !nav || !overlay) return;

  const links = document.querySelectorAll(".nav-links a");

  function openMenu() {
    nav.classList.add("active");
    toggle.classList.add("active");
    overlay.classList.add("active");
    body.classList.add("menu-open");

    links.forEach((link, i) => {
      link.style.transitionDelay = `${i * 0.08}s`;
    });

    if (clickSound) clickSound.play();
  }

  function closeMenu() {
    nav.classList.remove("active");
    toggle.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("menu-open");

    links.forEach(link => {
      link.style.transitionDelay = "0s";
    });
  }

  toggle.addEventListener("click", function () {
    if (nav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

});