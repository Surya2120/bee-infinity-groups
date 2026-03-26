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

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // 🔥 ADD BOUNCE WHEN COUNT FINISHES
          el.classList.add("bounce");

          setTimeout(() => {
            el.classList.remove("bounce");
          }, 400);
        }
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

  const track = document.querySelector(".track");
  const viewport = document.querySelector(".viewport");
  if (!track || !viewport) return;

  let cards = Array.from(track.querySelectorAll(".card"));
  const prev = document.querySelector(".carousel .prev");
  const next = document.querySelector(".carousel .next");

  if (cards.length < 3) return;

  let index = 2;

  // 🔁 CREATE CLONES
  const startClones = cards.slice(-2).map(c => c.cloneNode(true));
  const endClones = cards.slice(0, 2).map(c => c.cloneNode(true));

  startClones.forEach(c => track.prepend(c));
  endClones.forEach(c => track.append(c));

  cards = Array.from(track.querySelectorAll(".card"));

  function update(animate = true) {

    // REMOVE ACTIVE
    cards.forEach(card => card.classList.remove("active"));

    const active = cards[index];
    if (!active) return;

    active.classList.add("active");

    const gap = 20;
    const viewportWidth = viewport.offsetWidth;

    let translate = 0;

    // 🔥 CALCULATE POSITION
    for (let i = 0; i < index; i++) {
      translate += cards[i].offsetWidth + gap;
    }

    const activeWidth = active.offsetWidth;

    // 🔥 CENTER FIX
    translate -= (viewportWidth / 2 - activeWidth / 2);

    track.style.transition = animate ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(-${translate}px)`;

    // 🎬 VIDEO CONTROL
    cards.forEach(card => {
      const v = card.querySelector("video");
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });

    active.querySelector("video")?.play().catch(() => {});
  }

  function nextSlide() {
    index++;
    update();
  }

  function prevSlide() {
    index--;
    update();
  }

  next?.addEventListener("click", nextSlide);
  prev?.addEventListener("click", prevSlide);

  // 🔁 LOOP FIX
  track.addEventListener("transitionend", () => {

    if (index >= cards.length - 2) {
      index = 2;
      update(false);
    }

    if (index <= 1) {
      index = cards.length - 4;
      update(false);
    }

  });

  // ⌨️ KEYBOARD
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // 🔥 PERFECT INITIAL LOAD FIX
  window.addEventListener("load", () => {

    // first render
    update(false);

    // second correction (layout settle)
    setTimeout(() => update(false), 100);

    // final correction (mobile fix)
    setTimeout(() => update(false), 300);

  });

  // 🔥 RESPONSIVE FIX
  window.addEventListener("resize", () => {
    setTimeout(() => update(false), 100);
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