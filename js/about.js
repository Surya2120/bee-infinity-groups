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
   DROP DOWN MENU
========================= */


document.addEventListener("DOMContentLoaded", function () {

  const exploreToggle = document.getElementById("exploreToggle");
  const dropdown = exploreToggle.parentElement;

  exploreToggle.addEventListener("click", function (e) {
    e.preventDefault();

    // toggle open class
    dropdown.classList.toggle("open");
  });

  // close when clicking outside
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

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
   WHO IMAGES – CINEMATIC FADE
========================= */

const leftImages = document.querySelectorAll(".who-left img");
const rightImage = document.querySelector(".who-right img");

if (!leftImages.length || !rightImage) {
  console.warn("Images not found");
} else {

  const leftSets = [
    [
      "assets/images/dance/dance (9).JPG",
      "assets/images/dance/dance (13).jpg",
      "assets/images/dance/dance (6).jpg"
    ],
    [
      "assets/images/dance/dance (1).jpg",
      "assets/images/events/events (9).jpg",
      "assets/images/dance/dance (3).jpg"
    ],
    [
      "assets/images/events/events (3).jpg",
      "assets/images/dance/dance (5).jpg",
      "assets/images/dance/dance (17).jpg"
    ],
    [
      "assets/images/events/events (14).jpg",
      "assets/images/dance/dance (10).jpg",
      "assets/images/dance/dance (11).jpg"
    ]
  ];

  const rightSet = [
    "assets/images/dance/dance (23).jpg",
    "assets/images/dance/dance (2).jpg",
    "assets/images/dance/dance (4).jpg",
    "assets/images/studio/studio (1).jpg"
  ];

  let currentIndex = 0;
  let isAnimating = false;

  /* preload */
  [...leftSets.flat(), ...rightSet].forEach(src => {
    const img = new Image();
    img.src = src;
  });

  function changeImages() {

    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (currentIndex + 1) % leftSets.length;

    /* LEFT SIDE */
    leftImages.forEach((img, i) => {

      img.classList.add("fade-out");

      setTimeout(() => {
        img.src = leftSets[currentIndex][i];
        img.classList.remove("fade-out");
        img.classList.add("fade-in");

        setTimeout(() => {
          img.classList.remove("fade-in");
        }, 800);

      }, 300);

    });

    /* RIGHT SIDE */
    rightImage.classList.add("fade-out");

    setTimeout(() => {
      rightImage.src = rightSet[currentIndex];
      rightImage.classList.remove("fade-out");
      rightImage.classList.add("fade-in");

      setTimeout(() => {
        rightImage.classList.remove("fade-in");
        isAnimating = false;
      }, 800);

    }, 300);

  }

  setInterval(changeImages, 6000);
}



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


/* orgin story */

const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);




  /* =====================
     DIVISION ANIMATION
  ===================== */



const sliders = document.querySelectorAll(".division-media");

sliders.forEach(slider => {
  let isDown = false;
  let startX;
  let scrollLeft;

  // MOUSE DOWN
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("dragging");

    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  // MOUSE LEAVE
  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("dragging");
  });

  // MOUSE UP
  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("dragging");
  });

  // MOUSE MOVE
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // 🔥 speed control

    slider.scrollLeft = scrollLeft - walk;
  });

  /* =====================
     TOUCH SUPPORT
  ===================== */

  slider.addEventListener("touchstart", (e) => {
    isDown = true;
    slider.classList.add("dragging");

    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("touchend", () => {
    isDown = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDown) return;

    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;

    slider.scrollLeft = scrollLeft - walk;
  });
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
   WHY US ANIATIONS
========================= */
const whyCards = document.querySelectorAll(".why-grid div");

function revealWhy() {
  const trigger = window.innerHeight - 80;

  whyCards.forEach((card, index) => {
    const top = card.getBoundingClientRect().top;

    if (top < trigger && !card.classList.contains("show")) {

      setTimeout(() => {
        card.classList.add("show");
      }, index * 120); // stagger effect
    }
  });
}

window.addEventListener("scroll", revealWhy);
window.addEventListener("load", revealWhy);




/* =========================
   SATS ANIATIONS
========================= */


const impactItems = document.querySelectorAll(".impact-item");

function animateImpact() {
  const trigger = window.innerHeight - 100;

  impactItems.forEach((item, index) => {
    const top = item.getBoundingClientRect().top;

    if (top < trigger && !item.classList.contains("show")) {

      // reveal animation with delay
      setTimeout(() => {
        item.classList.add("show");
        startCount(item);
      }, index * 150);
    }
  });
}

/* COUNT-UP FUNCTION */
function startCount(item) {
  const numberEl = item.querySelector("h3");
  const text = numberEl.innerText.replace("+", "");
  const target = parseInt(text);

  let count = 0;
  const speed = target / 40;

  function update() {
    count += speed;

    if (count < target) {
      numberEl.innerText = Math.floor(count) + "+";
      requestAnimationFrame(update);
    } else {
      numberEl.innerText = target + "+";
    }
  }

  update();
}

/* EVENTS */
window.addEventListener("scroll", animateImpact);
window.addEventListener("load", animateImpact);




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

