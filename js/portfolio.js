/* =========================
   HEADER SCROLL EFFECT
========================= */

const navbar = document.querySelector(".navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}







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


/*========================= */






document.addEventListener("DOMContentLoaded", function () {

  const tabs = document.querySelectorAll(".tab");
  const items = document.querySelectorAll(".portfolio-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close-btn");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const counter = document.querySelector(".counter");

  let currentIndex = 0;
  let filteredImages = [];

  /* ======================
     FILTER TABS
  ====================== */
  tabs.forEach(tab => {
    tab.addEventListener("click", function () {

      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      const category = this.dataset.category;

      items.forEach(item => {
        if (category === "all" || item.dataset.category === category) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

    });
  });

  /* ======================
     UPDATE IMAGE LIST
  ====================== */
  function updateFilteredImages() {
    filteredImages = Array.from(
      document.querySelectorAll(".portfolio-item")
    ).filter(item => item.style.display !== "none")
     .map(item => item.querySelector("img"));
  }

  /* ======================
     OPEN LIGHTBOX
  ====================== */
  function openLightbox(index) {
    updateFilteredImages();

    if (filteredImages.length === 0) return;

    currentIndex = index;
    lightboxImg.src = filteredImages[currentIndex].src;
    lightbox.style.display = "flex";
    updateCounter();
  }

  function updateCounter() {
    counter.textContent = (currentIndex + 1) + " / " + filteredImages.length;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % filteredImages.length;
    lightboxImg.src = filteredImages[currentIndex].src;
    updateCounter();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    lightboxImg.src = filteredImages[currentIndex].src;
    updateCounter();
  }

  function closeLightbox() {
    lightbox.style.display = "none";
  }

  /* ======================
     IMAGE CLICK
  ====================== */
  items.forEach((item, index) => {
    const img = item.querySelector("img");

    img.addEventListener("click", function () {

      updateFilteredImages();

      const clickedIndex = filteredImages.indexOf(this);
      openLightbox(clickedIndex);

    });
  });

  /* ======================
     BUTTON EVENTS
  ====================== */
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);
  closeBtn.addEventListener("click", closeLightbox);

  /* CLICK OUTSIDE IMAGE CLOSE */
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  /* KEYBOARD CONTROLS */
  document.addEventListener("keydown", function (e) {
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") closeLightbox();
    }
  });

});






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
