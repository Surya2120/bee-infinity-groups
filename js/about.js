/* =========================
    HEADER SCROLL EFFECT
   ========================= */


const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


/* =========================
    ROTATER
   ========================= */
const words = [
  "Creators",
  "Filmmakers",
  "Storytellers",
  "Innovators",
  "Performers"
];

const dynamicWord = document.getElementById("dynamicWord");

let index = 0;
const changeSpeed = 2500; // 🔥 change every 2.5 sec

function rotateWord() {

  dynamicWord.classList.remove("show");
  dynamicWord.classList.add("hide");

  setTimeout(() => {
    index = (index + 1) % words.length;
    dynamicWord.textContent = words[index];

    dynamicWord.classList.remove("hide");
    dynamicWord.classList.add("show");
  }, 600); // matches CSS transition
}

dynamicWord.classList.add("show");
setInterval(rotateWord, changeSpeed);



  /* ---------- JOURNEY ---------- */
document.addEventListener("DOMContentLoaded", function () {

  const section = document.querySelector(".journey-section");
  const cards = document.querySelectorAll(".journey-card");
  const svg = document.querySelector(".journey-line");
  const path = document.querySelector("#mainLine");


  
  function generateCurve() {

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = section.offsetHeight;

    svg.setAttribute("viewBox", `0 0 200 ${sectionHeight}`);
    svg.style.height = sectionHeight + "px";

    let centerX = 100;
    let amplitude = 50;
    let smoothness = 0.6;
    let curve = "";
    let lastY = 0;

    cards.forEach((card, index) => {

      const rect = card.getBoundingClientRect();
      const dotOffset = 30 + 8;
      const y = (rect.top + window.scrollY - sectionTop) + dotOffset;

      if (index === 0) {
        curve += `M ${centerX} ${y} `;
      } else {

        const prevCard = cards[index - 1];
        const prevRect = prevCard.getBoundingClientRect();
        const prevY = (prevRect.top + window.scrollY - sectionTop) + dotOffset;

        const midY = (prevY + y) / 2;
        const direction = index % 2 === 0 ? -1 : 1;
        const controlX = centerX + (direction * amplitude);

        curve += `
          C ${controlX} ${prevY + (midY - prevY) * smoothness},
            ${controlX} ${y - (y - midY) * smoothness},
            ${centerX} ${y}
        `;
      }

      lastY = y;
    });


    
    /* Infinity End */
    const infinityWidth = 60;
    const infinityHeight = 30;

    curve += `
      C ${centerX - infinityWidth} ${lastY - infinityHeight},
        ${centerX - infinityWidth} ${lastY + infinityHeight},
        ${centerX} ${lastY}
      C ${centerX + infinityWidth} ${lastY - infinityHeight},
        ${centerX + infinityWidth} ${lastY + infinityHeight},
        ${centerX} ${lastY}
    `;

    path.setAttribute("d", curve);
  }

  function revealCards() {
    const windowHeight = window.innerHeight;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < windowHeight * 0.75) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  }

  generateCurve();
  window.addEventListener("resize", generateCurve);
  window.addEventListener("scroll", revealCards);

});

/* =====================================
   JOURNEY EXTRAS (NON-DESTRUCTIVE)
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const header = document.querySelector(".journey-header");
  const quote = document.querySelector(".journey-quote");
  const nextChapter = document.querySelector(".next-chapter");
  const infinityPath = document.querySelector("#infinityPath");
  const cards = document.querySelectorAll(".journey-card");

  function revealExtras() {

    const windowHeight = window.innerHeight;

    /* Header Reveal */
    if (header) {
      const rect = header.getBoundingClientRect();
      if (rect.top < windowHeight * 0.85) {
        header.classList.add("active");
      }
    }

    /* Quote Reveal */
    if (quote) {
      const rect = quote.getBoundingClientRect();
      if (rect.top < windowHeight * 0.8) {
        quote.classList.add("active");
      }
    }

    /* Next Chapter Reveal */
    if (nextChapter) {
      const rect = nextChapter.getBoundingClientRect();
      if (rect.top < windowHeight * 0.8) {
        nextChapter.classList.add("active");
      }
    }

    /* Infinity Glow when last card visible */
    const lastCard = cards[cards.length - 1];
    if (lastCard && infinityPath) {
      const rect = lastCard.getBoundingClientRect();
      if (rect.top < windowHeight * 0.6) {
        infinityPath.classList.add("glow");
      }
    }
  }

  window.addEventListener("scroll", revealExtras);
  revealExtras(); // run once on load

});

/* =========================
   CLIENT LOGOS – AUTO SCROLL
========================= */

document.addEventListener("DOMContentLoaded", function () {
  const tracks = document.querySelectorAll(".media-track");

  tracks.forEach(track => {
    const originalContent = track.innerHTML;
    track.innerHTML += originalContent;
  });
});





/* =========================
   CLIENT LOGOS – AUTO SCROLL
========================= */


const track = document.getElementById("logoTrack");

// Duplicate logos automatically
track.innerHTML += track.innerHTML;

let position = 0;
let speed = 0.5; // lower = slower

function animateLogos() {
  position -= speed;

  if (Math.abs(position) >= track.scrollWidth / 2) {
    position = 0;
  }

  track.style.transform = `translateX(${position}px)`;

  requestAnimationFrame(animateLogos);
}

animateLogos();



/* =========================
bee landing sound effect
========================= */
document.addEventListener("DOMContentLoaded", function () {

  const beeWrapper = document.querySelector(".bee-wrapper");
  const bee = document.querySelector(".bee");
  const canvas = document.getElementById("beeTrail");

  if (!beeWrapper || !bee || !canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const sectionTitles = document.querySelectorAll("h2");

  let scrollTarget = window.scrollY;
  let scrollCurrent = window.scrollY;

  let beeX = window.innerWidth * 0.2;
  let beeY = window.innerHeight * 0.4;

  let trail = [];
  let lastScroll = window.scrollY;

  /* =========================
     SMOOTH SCROLL TRACKING
  ========================= */

  window.addEventListener("scroll", () => {
    scrollTarget = window.scrollY;
  });

  /* =========================
     MAIN ANIMATION LOOP
  ========================= */

  function animate() {

    /* Smooth scroll interpolation */
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.08;

    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollCurrent / maxScroll : 0;

    /* Smooth flight curve */
    const targetX = window.innerWidth * (0.1 + progress * 0.8);
    const targetY = window.innerHeight * (0.35 + Math.sin(progress * Math.PI * 2) * 0.15);

    beeX += (targetX - beeX) * 0.1;
    beeY += (targetY - beeY) * 0.1;

    beeWrapper.style.left = beeX + "px";
    beeWrapper.style.top = beeY + "px";

    /* Rotation based on direction */
    const scrollSpeed = scrollTarget - lastScroll;
    bee.style.transform = scrollSpeed > 0 ? "rotate(15deg)" : "rotate(-15deg)";
    lastScroll = scrollTarget;

    /* Flap speed dynamic */
    const flapSpeed = Math.max(0.4, 1 - Math.abs(scrollSpeed) / 100);
    bee.style.animation = `wingFloat ${flapSpeed}s ease-in-out infinite`;

    /* Trail */
    trail.push({ x: beeX + 20, y: beeY + 20 });
    if (trail.length > 30) trail.shift();

    drawTrail();

    checkLanding();

    requestAnimationFrame(animate);
  }

  /* =========================
     TRAIL DRAW
  ========================= */

  function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, i * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242,196,0,${i / trail.length})`;
      ctx.fill();
    }
  }

  /* =========================
     LAND ON TITLES
  ========================= */

  function checkLanding() {

    const mid = window.innerHeight / 2;
    let landed = false;

    sectionTitles.forEach(title => {
      const rect = title.getBoundingClientRect();

      if (rect.top < mid && rect.bottom > mid) {

        const targetLandX = rect.left + rect.width / 2;
        const targetLandY = rect.top - 40;

        beeX += (targetLandX - beeX) * 0.08;
        beeY += (targetLandY - beeY) * 0.08;

        landed = true;
      }
    });

    if (landed) {
      bee.style.animation = "wingFloat 1.2s ease-in-out infinite";
    }
  }

  animate();

});
















