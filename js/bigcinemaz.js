
/* =========================
   FOOTER
========================= */


const footer = document.querySelector(".footer-modern");

footer.addEventListener("mousemove", (e) => {
  const rect = footer.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  footer.style.setProperty("--x", x + "px");
  footer.style.setProperty("--y", y + "px");
});



// ============================
// PERFECT CINEMATIC SYNC
// ============================

window.addEventListener("load", () => {

  const loader = document.querySelector(".cinema-loader");
  const flash = document.querySelector(".flash");
  const sound = document.getElementById("introSound");
  const tap = document.querySelector(".tap-enter");

  let started = false;

  // 🔥 ADJUST THIS BASED ON YOUR SOUND
  const IMPACT_TIME = 1600; // milliseconds (1.2 sec)

  function startExperience() {
    if (started) return;
    started = true;

    // 🔊 PLAY SOUND
    if (sound) {
      sound.currentTime = 0;
      sound.volume = 0.6;
      sound.play().catch(()=>{});
    }

    // hide tap
    if (tap) tap.style.display = "none";

    // ============================
    // 💥 IMPACT MOMENT SYNC
    // ============================
// ============================
// PERFECT EXIT (NO DELAY AFTER FLASH)
// ============================

setTimeout(() => {

  // ⚡ FLASH + IMPACT
  if (flash) flash.classList.add("active");
  document.body.classList.add("shake");
  document.body.classList.add("impact-glow");

  // 💥 IMMEDIATE EXIT START (KEY FIX)
  if (loader) loader.classList.add("hide");

  setTimeout(() => {
    document.body.classList.remove("shake");
  }, 400);

  // remove loader completely
  setTimeout(() => {
    if (loader) loader.style.display = "none";
  }, 600); // faster removal

}, IMPACT_TIME);

    // ============================
    // 🎬 EXIT TIMELINE
    // ============================

    setTimeout(() => {
      loader.classList.add("hide");

      setTimeout(() => {
        loader.style.display = "none";
      }, 1000);

    }, IMPACT_TIME + 800);
  }

  // USER INTERACTION
  window.addEventListener("click", startExperience);
  window.addEventListener("touchstart", startExperience);

});





// ============================
// SCROLL REVEAL (INTERSECTION)
// ============================

const sections = document.querySelectorAll(
  ".cinemaz-intro, .cinemaz-open, .cinemaz-acquisition, .cinemaz-production, .cinemaz-post, .cinemaz-bts, .cinemaz-dubbing, .cinemaz-commercial, .cinemaz-cta"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((sec) => observer.observe(sec));


// ============================
// CURSOR GLOW (SMOOTH)
// ============================

const glow = document.createElement("div");
glow.classList.add("cursor-glow");
document.body.appendChild(glow);

let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

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


// ============================
// MAGNETIC BUTTON
// ============================

const buttons = document.querySelectorAll(".cta-btn");

buttons.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0) scale(1)";
  });
});


// ============================
// PARALLAX HERO (SAFE)
// ============================

const hero = document.querySelector(".cinemaz-hero");

window.addEventListener("scroll", () => {
  if (window.innerWidth > 768) {
    const offset = window.scrollY;
    hero.style.backgroundPositionY = offset * 0.4 + "px";
  }
});