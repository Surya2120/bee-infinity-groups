
/* =========================
   HERO IMAGE SLIDER
=========================*/
document.addEventListener("DOMContentLoaded", () => {

  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".hero-slider .slide");

  console.log("Slides found:", slides.length);

  if (!slider || slides.length === 0) return;

  let index = 0;
  let interval;

  /* =====================
     SHOW SLIDE
  ===================== */
  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  /* =====================
     AUTO SLIDE
  ===================== */
  function startSlider() {
    interval = setInterval(nextSlide, 4000);
  }

  function stopSlider() {
    clearInterval(interval);
  }

  showSlide(index);
  startSlider();

  /* =====================
     SWIPE + DRAG
  ===================== */
  let startX = 0;
  let isDragging = false;

  /* TOUCH (mobile) */
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopSlider();
  });

  slider.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(startX, endX);
    startSlider();
  });

  /* MOUSE (desktop) */
  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    stopSlider();
  });

  slider.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.clientX;
    handleSwipe(startX, endX);
    startSlider();
  });

  /* =====================
     SWIPE LOGIC
  ===================== */
  function handleSwipe(start, end) {
    const diff = start - end;

    if (Math.abs(diff) > 70) {
      if (diff > 0) {
        nextSlide(); // swipe left
      } else {
        prevSlide(); // swipe right
      }
    }
  }

});


/* =========================
   HERO VIDEO MUTE
=========================
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
   VIDEO TESTIMONIALS – FINAL
========================= 

document.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector(".video-testimonials");
  const track = document.querySelector(".track");
  const viewport = document.querySelector(".viewport");
  const prev = document.querySelector(".carousel .prev");
  const next = document.querySelector(".carousel .next");

  if (!track || !viewport) return;

  let cards = Array.from(track.querySelectorAll(".card"));
  if (cards.length < 3) return;

  let index = 2;
  let isVisible = false;

  /* =========================
     CLONE FOR INFINITE LOOP
  ========================= 

  const startClones = cards.slice(-2).map(c => c.cloneNode(true));
  const endClones = cards.slice(0, 2).map(c => c.cloneNode(true));

  startClones.forEach(c => track.prepend(c));
  endClones.forEach(c => track.append(c));

  cards = Array.from(track.querySelectorAll(".card"));

  /* =========================
     UPDATE FUNCTION
  ========================= 

  function update(animate = true) {

    cards.forEach(card => card.classList.remove("active"));

    const active = cards[index];
    if (!active) return;

    active.classList.add("active");

    const activeRect = active.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();

    const activeCenter = activeRect.left + activeRect.width / 2;
    const viewportCenter = viewportRect.left + viewportRect.width / 2;

    const shift = activeCenter - viewportCenter;

    const style = window.getComputedStyle(track);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const currentX = matrix.m41;

    track.style.transition = animate ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(${currentX - shift}px)`;

    /* VIDEO CONTROL 

    cards.forEach(card => {
      const v = card.querySelector("video");
      if (v) {
        v.pause();
        v.currentTime = 0;
        v.muted = true;
      }
    });

    if (isVisible) {
      const video = active.querySelector("video");
      if (video) {
        video.muted = false;
        video.play().catch(() => {});
      }
    }
  }

  /* NAVIGATION 

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

  /* LOOP FIX 

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

  /* SWIPE 

  let startX = 0;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) nextSlide();
    if (endX - startX > 50) prevSlide();
  });

  /* SCROLL-AWARE PLAY 

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        isVisible = true;

        const activeVideo = section.querySelector(".card.active video");
        if (activeVideo) {
          activeVideo.muted = false;
          activeVideo.play().catch(() => {});
        }

      } else {
        isVisible = false;

        section.querySelectorAll("video").forEach(v => v.pause());
      }

    });
  }, { threshold: [0.3, 0.6, 0.8] });

  if (section) observer.observe(section);

  /* INIT 

  window.addEventListener("load", () => {
    update(false);
    setTimeout(() => update(false), 100);
    setTimeout(() => update(false), 300);
  });

  window.addEventListener("resize", () => {
    setTimeout(() => update(false), 100);
  });

});


*/






/* =======================
WRITTING TESTIMONIAL
=========================*/

document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".reviews-track");
  const wrapper = document.querySelector(".reviews-wrapper");
  const prev = document.querySelector(".review-btn.prev");
  const next = document.querySelector(".review-btn.next");

  if (!track || !wrapper) return;

  let cards = Array.from(track.querySelectorAll(".review-card"));
  if (cards.length < 3) return;

  let index = 2;

  // CLONES
  const startClones = cards.slice(-2).map(c => c.cloneNode(true));
  const endClones = cards.slice(0, 2).map(c => c.cloneNode(true));

  startClones.forEach(c => track.prepend(c));
  endClones.forEach(c => track.append(c));

  cards = Array.from(track.querySelectorAll(".review-card"));

  function update(animate = true) {

    cards.forEach(card => card.classList.remove("active"));

    const active = cards[index];
    if (!active) return;

    active.classList.add("active");

    const activeRect = active.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const activeCenter = activeRect.left + activeRect.width / 2;
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

    const shift = activeCenter - wrapperCenter;

    const style = window.getComputedStyle(track);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const currentX = matrix.m41;

    track.style.transition = animate ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(${currentX - shift}px)`;
  }

  function nextSlide() {
    index++;
    update();
  }

  function prevSlide() {
    index--;
    update();
  }

  // ✅ BUTTON CONTROLS ONLY
  next?.addEventListener("click", nextSlide);
  prev?.addEventListener("click", prevSlide);

  // LOOP FIX
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

  // INITIAL POSITION
  window.addEventListener("load", () => {
    update(false);
    setTimeout(() => update(false), 100);
  });

  window.addEventListener("resize", () => {
    setTimeout(() => update(false), 100);
  });

});


/* =========================
   GLOBAL KEYBOARD NAVIGATION
========================= */

document.addEventListener("keydown", (e) => {

  const reviewSection = document.querySelector(".client-reviews");

  const reviewVisible =
    reviewSection &&
    reviewSection.getBoundingClientRect().top < window.innerHeight / 2;

  if (!reviewVisible) return;

  if (e.key === "ArrowRight") {
    document.querySelector(".review-btn.next")?.click();
  }

  if (e.key === "ArrowLeft") {
    document.querySelector(".review-btn.prev")?.click();
  }

});