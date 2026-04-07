// ============================
// LOADER EXPERIENCE (FAST)
// ============================

const IMPACT_TIME = 1273; // 🔥 adjust to your beat

document.addEventListener("DOMContentLoaded", () => {

  const loader = document.querySelector(".cinema-loader");
  const flash = document.querySelector(".flash");
  const sound = document.getElementById("introSound");
  const tap = document.querySelector(".tap-enter");

  let started = false;

  function startExperience() {
    if (started) return;
    started = true;

    // hide tap
    if (tap) tap.style.display = "none";

    // 🔊 PLAY SOUND
    if (sound) {
      sound.currentTime = 0;
      sound.volume = 0.6;
      sound.play();
    }

    // 💥 IMPACT TIMED (NOT waiting for full audio)
    setTimeout(() => {

      // flash
      if (flash) flash.classList.add("active");

      // shake
      document.body.classList.add("shake", "impact-glow");

      setTimeout(() => {
        document.body.classList.remove("shake");
      }, 200);

      // fade loader
      if (loader) {
        loader.classList.add("hide");
        loader.style.pointerEvents = "none";
      }

      // remove loader + start site
      setTimeout(() => {
        if (loader) loader.remove();

        // 🔥 start rest of site
        if (typeof initMainSite === "function") {
          initMainSite();
        }

      }, 400);

    }, IMPACT_TIME);
  }

  // EVENTS
  if (tap) {
    tap.addEventListener("click", startExperience);
    tap.addEventListener("touchstart", startExperience);
  }

});


// ============================
// MAIN SITE (LOAD AFTER LOADER)
// ============================

function initMainSite() {

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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  }, { threshold: 0.2 });

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

    btn.addEventListener("click", () => {
      btn.style.transform = "scale(0.92)";
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

}