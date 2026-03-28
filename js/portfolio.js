/* =========================
   GLOBAL INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  initNavbarScroll();
  initDropdown();
  initPortfolio();
  initHamburgerMenu();

});


/* =========================
   HEADER SCROLL
========================= */

function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}


/* =========================
   DROPDOWN MENU
========================= */

function initDropdown() {
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
}


/* =========================
   PORTFOLIO + LIGHTBOX
========================= */

function initPortfolio() {

  const tabs = document.querySelectorAll(".tab");
  const items = document.querySelectorAll(".portfolio-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close-btn");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const counter = document.querySelector(".counter");

  if (!lightbox) return;

  let currentIndex = 0;
  let filteredImages = [];

  // 🔥 ensure hidden on load
  lightbox.style.display = "none";


  /* FILTER TABS */
  tabs.forEach(tab => {
    tab.addEventListener("click", function () {

      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      const category = this.dataset.category;

      items.forEach(item => {
        item.style.display =
          (category === "all" || item.dataset.category === category)
            ? "block"
            : "none";
      });

    });
  });


  /* UPDATE IMAGE LIST */
  function updateFilteredImages() {
    filteredImages = Array.from(items)
      .filter(item => item.style.display !== "none")
      .map(item => item.querySelector("img"));
  }


  /* OPEN LIGHTBOX */
  function openLightbox(index) {
    updateFilteredImages();

    if (!filteredImages.length) return;

    currentIndex = index;
    lightboxImg.src = filteredImages[currentIndex].src;

    lightbox.style.display = "flex";
    updateCounter();
  }


  function updateCounter() {
    counter.textContent = `${currentIndex + 1} / ${filteredImages.length}`;
  }


  function showNext() {
    currentIndex = (currentIndex + 1) % filteredImages.length;
    lightboxImg.src = filteredImages[currentIndex].src;
    updateCounter();
  }


  function showPrev() {
    currentIndex =
      (currentIndex - 1 + filteredImages.length) % filteredImages.length;

    lightboxImg.src = filteredImages[currentIndex].src;
    updateCounter();
  }


  function closeLightbox() {
    lightbox.style.display = "none";
  }


  /* IMAGE CLICK */
  items.forEach(item => {
    const img = item.querySelector("img");

    if (!img) return;

    img.addEventListener("click", function () {
      updateFilteredImages();
      const index = filteredImages.indexOf(this);
      openLightbox(index);
    });
  });


  /* BUTTONS */
  nextBtn?.addEventListener("click", showNext);
  prevBtn?.addEventListener("click", showPrev);
  closeBtn?.addEventListener("click", closeLightbox);


  /* CLICK OUTSIDE */
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });


  /* KEYBOARD */
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") closeLightbox();
    }
  });

}


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
   HAMBURGER MENU
========================= */

function initHamburgerMenu() {

  const toggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav-links");

  if (!toggle || !nav) return;

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

  toggle.addEventListener("click", () => {
    nav.classList.contains("active") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

}