

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

document.addEventListener("DOMContentLoaded", () => {

  const leftImages = document.querySelectorAll(".who-left img");
  const rightImage = document.querySelector(".who-right img");

  if (!leftImages.length || !rightImage) {
    console.warn("Images not found");
    return;
  }

  const leftSets = [

    [ // ✅ FIXED (comma added)
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

  /* PRELOAD IMAGES */
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
        }, 800); // ⏱ animation duration

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
      }, 800); // ⏱ animation duration

    }, 300);

  }

  /* 🔥 CHANGE SLIDE TIMING HERE */
  setInterval(changeImages, 3000); // 👈 6000ms = 6 seconds

});



/* =========================
SWEEP LINE ANIMATION
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const target = document.querySelector(".origin-image");
  if (!target) return;

  function handleScroll() {
    const rect = target.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.8;

    if (rect.top < triggerPoint && rect.bottom > 0) {
      // in viewport → keep animation running
      target.classList.add("active");
    } else {
      // out of view → reset animation
      target.classList.remove("active");
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // initial check

});



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



/* =========================
   DIVISION DRAG SCROLL (SMOOTH)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const sliders = document.querySelectorAll(".division-media");

  sliders.forEach((slider) => {

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let velocity = 0;
    let lastX = 0;
    let momentumID;

    /* =========================
       STOP MOMENTUM
    ========================= */
    function stopMomentum() {
      cancelAnimationFrame(momentumID);
    }

    /* =========================
       MOMENTUM EFFECT (INERTIA)
    ========================= */
    function momentumScroll() {
      slider.scrollLeft -= velocity;
      velocity *= 0.95; // friction

      if (Math.abs(velocity) > 0.5) {
        momentumID = requestAnimationFrame(momentumScroll);
      }
    }

    /* =========================
       MOUSE DOWN
    ========================= */
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("dragging");

      startX = e.clientX;
      scrollStart = slider.scrollLeft;
      lastX = e.clientX;

      stopMomentum();
    });

    /* =========================
       MOUSE MOVE
    ========================= */
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;

      e.preventDefault();

      const dx = e.clientX - startX;
      slider.scrollLeft = scrollStart - dx * 1.4;

      velocity = e.clientX - lastX;
      lastX = e.clientX;
    });

    /* =========================
       MOUSE UP / LEAVE
    ========================= */
    function stopDrag() {
      if (!isDown) return;

      isDown = false;
      slider.classList.remove("dragging");

      momentumScroll(); // 🔥 continue smooth scroll
    }

    slider.addEventListener("mouseup", stopDrag);
    slider.addEventListener("mouseleave", stopDrag);

    /* =========================
       TOUCH START
    ========================= */
    slider.addEventListener("touchstart", (e) => {
      isDown = true;
      slider.classList.add("dragging");

      startX = e.touches[0].clientX;
      scrollStart = slider.scrollLeft;
      lastX = e.touches[0].clientX;

      stopMomentum();
    }, { passive: true });

    /* =========================
       TOUCH MOVE
    ========================= */
    slider.addEventListener("touchmove", (e) => {
      if (!isDown) return;

      const x = e.touches[0].clientX;
      const dx = x - startX;

      slider.scrollLeft = scrollStart - dx * 1.2;

      velocity = x - lastX;
      lastX = x;
    }, { passive: true });

    /* =========================
       TOUCH END
    ========================= */
    slider.addEventListener("touchend", stopDrag);

  });

});




/** =========================
    OUR FUTURE
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".future-card");

  function revealCards() {
    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {
      const top = card.getBoundingClientRect().top;

      if (top < trigger) {
        card.classList.add("show");
      }
    });
  }

  window.addEventListener("scroll", revealCards);
  revealCards();

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
   STATS ANIMATIONS (FIXED)
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const impactItems = document.querySelectorAll(".impact-item");

  function animateImpact() {
    const trigger = window.innerHeight - 100;

    impactItems.forEach((item, index) => {
      const top = item.getBoundingClientRect().top;

      if (top < trigger && !item.classList.contains("show")) {

        item.classList.add("show");

        // delay for stagger effect
        setTimeout(() => {
          startCount(item);
        }, index * 150);
      }
    });
  }

  /* =========================
     COUNT-UP FUNCTION
  ========================= */

  function startCount(item) {

    const numberEl = item.querySelector(".impact-number");

    // prevent multiple runs
    if (numberEl.classList.contains("counted")) return;
    numberEl.classList.add("counted");

    const text = numberEl.innerText.replace("+", "").trim();
    const target = parseInt(text);

    if (isNaN(target)) return;

    let count = 0;
    const duration = 1000; // ⏱ total animation time
    const increment = target / (duration / 16);

    function update() {
      count += increment;

      if (count < target) {
        numberEl.innerText = Math.floor(count) + "+";
        requestAnimationFrame(update);
      } else {
        numberEl.innerText = target + "+";
      }
    }

    update();
  }

  /* =========================
     EVENTS
  ========================= */

  window.addEventListener("scroll", animateImpact);
  window.addEventListener("load", animateImpact);

});












/* =========================
   ABOUT PAGE INTRO (WORKING)
========================= */

window.addEventListener("load", () => {

  const brand = document.getElementById("brandStart");
  if (!brand) return;

  // STEP 1: center brand section (no calculation issues)
  brand.scrollIntoView({
    block: "center",
    behavior: "auto"
  });

  // STEP 2: after 3 sec → smooth scroll to top
  setTimeout(() => {

    const start = window.scrollY;
    const duration = 4000;
    let startTime = null;

    function scrollUp(currentTime) {
      if (!startTime) startTime = currentTime;

      const time = currentTime - startTime;
      const progress = Math.min(time / duration, 1);

      // ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, start * (1 - ease));

      if (time < duration) {
        requestAnimationFrame(scrollUp);
      }
    }

    requestAnimationFrame(scrollUp);

  }, 3000);

});