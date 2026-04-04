// ============================
// DOM READY
// ============================

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     FOOTER MOUSE GLOW
  ========================= */
  const footer = document.querySelector(".footer-modern");

  if (footer) {
    footer.addEventListener("mousemove", (e) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      footer.style.setProperty("--x", x + "px");
      footer.style.setProperty("--y", y + "px");
    });
  }

  /* =========================
     SCROLL REVEAL
  ========================= */
  const sections = document.querySelectorAll(
    ".cinemaz-intro, .cinemaz-open, .cinemaz-acquisition, .cinemaz-production, .cinemaz-post, .cinemaz-bts, .cinemaz-dubbing, .cinemaz-commercial, .cinemaz-cta"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((sec) => observer.observe(sec));

  /* =========================
     CTA BUTTON (MAGNETIC)
  ========================= */
  const buttons = document.querySelectorAll(".cta-btn");

  buttons.forEach((btn) => {

    let rect;

    function move(e) {
      rect = btn.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.08)`;
    }

    btn.addEventListener("mousemove", move);

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0) scale(1)";
    });

    btn.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      move(touch);
    });

    btn.addEventListener("touchend", () => {
      btn.style.transform = "translate(0,0) scale(1)";
    });

    // 🔥 IMPORTANT: DO NOT BLOCK LINK
    btn.addEventListener("click", () => {
      btn.style.transform = "scale(0.95)";

      setTimeout(() => {
        btn.style.transform = "scale(1)";
      }, 150);
    });

  });

  /* =========================
     CURSOR GLOW
  ========================= */
  const glow = document.createElement("div");
  glow.classList.add("cursor-glow");
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    glow.style.left = glowX + "px";
    glow.style.top = glowY + "px";

    requestAnimationFrame(animateGlow);
  }

  animateGlow();

  /* =========================
     PARALLAX HERO
  ========================= */
  const hero = document.querySelector(".cinemaz-hero");

  window.addEventListener("scroll", () => {
    if (hero && window.innerWidth > 768) {
      const offset = window.scrollY;
      hero.style.backgroundPositionY = offset * 0.4 + "px";
    }
  });

});


// ============================
// LOADER / INTRO (FINAL FIX)
// ============================
window.addEventListener("load", () => {

  const loader = document.querySelector(".cinema-loader");
  const tap = document.querySelector(".tap-enter");

  function startExperience() {

    // 🔥 REMOVE LOADER COMPLETELY
    if (loader) {
      loader.style.display = "none";
      loader.remove();
    }
  }

  if (tap) {
    tap.addEventListener("click", startExperience);
  }

});   