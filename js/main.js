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
   HERO VIDEO MUTE
========================= */
const heroVideo = document.getElementById("heroVideo");
const muteBtn = document.getElementById("muteToggle");

if (heroVideo && muteBtn) {
  muteBtn.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    muteBtn.textContent = heroVideo.muted ? "🔇" : "🔊";
  });
}


/* =========================
   PORTFOLIO FILTER
========================= 
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

if (filterButtons.length && portfolioItems.length) {
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      document.querySelector(".filter-btn.active")?.classList.remove("active");
      button.classList.add("active");

      const filter = button.dataset.filter;
      let visible = 0;

      portfolioItems.forEach(item => {
        const category = item.dataset.category;

        if (filter === "all") {
          item.style.display = visible < 4 ? "block" : "none";
          visible++;
        } else {
          item.style.display = category === filter ? "block" : "none";
        }
      });

    });
  });
}

*/


/* =========================
   WHAT WE DO REVEAL
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const items = document.querySelectorAll(".what-item");
  if (!items.length) return;

  function reveal() {
    const trigger = window.innerHeight * 0.85;

    items.forEach((item, i) => {
      if (item.getBoundingClientRect().top < trigger) {
        setTimeout(() => item.classList.add("show"), i * 150);
      }
    });
  }

  window.addEventListener("scroll", reveal);
  reveal();

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
   IMPACT STATS
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector(".impact-stats");
  if (!section) return;

  const items = document.querySelectorAll(".impact-item");
  const numbers = document.querySelectorAll(".impact-number");

  let animated = false;

  function animateNumbers() {
    numbers.forEach(el => {

      const text = el.textContent.trim();
      const target = parseInt(text.replace(/\D/g, "")) || 0;
      const suffix = text.replace(/[0-9]/g, "");

      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / 1600, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        el.textContent = Math.floor(target * ease) + suffix;

        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  function reveal() {
    if (animated) return;

    if (section.getBoundingClientRect().top < window.innerHeight * 0.8) {

      items.forEach((item, i) => {
        setTimeout(() => item.classList.add("show"), i * 150);
      });

      animateNumbers();
      animated = true;
    }
  }

  window.addEventListener("scroll", reveal);
  reveal();

});



/* =========================
   CLIENT LOGO SCROLL
========================= */
const logoTrack = document.getElementById("logoTrack");

if (logoTrack) {

  logoTrack.innerHTML += logoTrack.innerHTML;

  let position = 0;

  function animate() {
    position -= 0.5;

    if (Math.abs(position) >= logoTrack.scrollWidth / 2) {
      position = 0;
    }

    logoTrack.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}



/* =========================
   VIDEO TESTIMONIALS (CENTER FIXED)
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const videoTrack = document.querySelector(".track");
  const viewport = document.querySelector(".viewport");
  if (!videoTrack || !viewport) return;

  let cards = Array.from(videoTrack.querySelectorAll(".card"));
  const prev = document.querySelector(".carousel .prev");
  const next = document.querySelector(".carousel .next");

  if (cards.length < 3) return;

  let index = 2; // 🔥 start from real center

  // CLONES
  const startClones = cards.slice(-2).map(c => c.cloneNode(true));
  const endClones = cards.slice(0, 2).map(c => c.cloneNode(true));

  startClones.forEach(c => videoTrack.prepend(c));
  endClones.forEach(c => videoTrack.append(c));

  cards = Array.from(videoTrack.querySelectorAll(".card"));

  function update(animate = true) {

    const cardWidth = cards[0].offsetWidth + 20; // gap
    const viewportWidth = viewport.offsetWidth;

    // 🔥 CENTER CALCULATION
    const offset = (viewportWidth / 2) - (cards[0].offsetWidth / 2);
    const translate = (index * cardWidth) - offset;

    videoTrack.style.transition = animate ? "transform 0.5s ease" : "none";
    videoTrack.style.transform = `translateX(-${translate}px)`;

    // pause all
    cards.forEach(card => {
      card.classList.remove("active");
      const v = card.querySelector("video");
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });

    // 🔥 CORRECT CENTER
    const active = cards[index];
    if (active) {
      active.classList.add("active");
      active.querySelector("video")?.play().catch(()=>{});
    }
  }

  function nextSlide() { index++; update(); }
  function prevSlide() { index--; update(); }

  next?.addEventListener("click", nextSlide);
  prev?.addEventListener("click", prevSlide);

  videoTrack.addEventListener("transitionend", () => {

    if (index >= cards.length - 3) {
      index = 2;
      update(false);
    }

    if (index <= 1) {
      index = cards.length - 5;
      update(false);
    }

  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  window.addEventListener("load", () => update(false));

});


/* =========================
   WRITTEN TESTIMONIALS (CENTER FIXED)
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const reviewTrack = document.querySelector(".reviews-track");
  const wrapper = document.querySelector(".reviews-wrapper");
  if (!reviewTrack || !wrapper) return;

  let cards = Array.from(reviewTrack.querySelectorAll(".review-card"));
  const nextBtn = document.querySelector(".review-btn.next");
  const prevBtn = document.querySelector(".review-btn.prev");

  const visible = 3;
  let index = visible;

  const start = cards.slice(0, visible).map(c => c.cloneNode(true));
  const end = cards.slice(-visible).map(c => c.cloneNode(true));

  end.forEach(c => reviewTrack.prepend(c));
  start.forEach(c => reviewTrack.append(c));

  cards = Array.from(reviewTrack.querySelectorAll(".review-card"));

  function update(animate = true) {

    const cardWidth = cards[0].offsetWidth + 20;
    const wrapperWidth = wrapper.offsetWidth;

    // 🔥 CENTER CALCULATION
    const offset = (wrapperWidth / 2) - (cards[0].offsetWidth / 2);
    const translate = (index * cardWidth) - offset;

    reviewTrack.style.transition = animate ? "transform 0.5s ease" : "none";
    reviewTrack.style.transform = `translateX(-${translate}px)`;

    cards.forEach(c => c.classList.remove("active"));

    // 🔥 CORRECT CENTER
    cards[index]?.classList.add("active");
  }

  nextBtn?.addEventListener("click", () => { index++; update(); });
  prevBtn?.addEventListener("click", () => { index--; update(); });

  reviewTrack.addEventListener("transitionend", () => {

    if (index >= cards.length - visible) {
      index = visible;
      update(false);
    }

    if (index <= 0) {
      index = cards.length - visible * 2;
      update(false);
    }

  });

  window.addEventListener("load", () => update(false));

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