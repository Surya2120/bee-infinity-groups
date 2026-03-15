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


/* =========================
   WHO IMAGES ROTATION
========================= */

const whoImages = document.querySelectorAll(".who-images img");

const imageSets = [
  [
    "assets/images/dance/dance (9).JPG",
    "assets/images/dance/dance (13).jpg",
    "assets/images/dance/dance (6).jpg",
    "assets/images/events/events (4).jpg",
    "assets/images/events/events (8).jpg"
  ],
  [
    "assets/images/dance/dance (1).jpg",
    "assets/images/dance/dance (2).jpg",
    "assets/images/dance/dance (3).jpg",
    "assets/images/events/events (1).jpg",
    "assets/images/events/events (2).jpg"
  ],
  [
    "assets/images/dance/dance (4).jpg",
    "assets/images/dance/dance (5).jpg",
    "assets/images/dance/dance (7).jpg",
    "assets/images/events/events (3).jpg",
    "assets/images/events/events (5).jpg"
  ],
  [
    "assets/images/dance/dance (8).jpg",
    "assets/images/dance/dance (10).jpg",
    "assets/images/dance/dance (11).jpg",
    "assets/images/events/events (6).jpg",
    "assets/images/events/events (7).jpg"
  ]
];

let currentSet = 0;

function changeImages() {

  // fade out
  whoImages.forEach(img => {
    img.style.opacity = "0";
  });

  setTimeout(() => {

    currentSet++;
    if (currentSet >= imageSets.length) currentSet = 0;

    whoImages.forEach((img, index) => {
      img.src = imageSets[currentSet][index];
    });

    // fade in
    whoImages.forEach(img => {
      img.style.opacity = "1";
    });

  }, 600);

}

setInterval(changeImages, 5000);




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
  VISION & MISSION  SCROLL ANIMATION
========================= */

const futureCards = document.querySelectorAll(".future-card");

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }

  });

},{threshold:0.2});

futureCards.forEach(card => {
  observer.observe(card);
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

