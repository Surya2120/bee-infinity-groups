/* =========================
   GALLERY + LIGHTBOX (FINAL SAFE)
========================= */

(function () {

  function initGallery() {

    const tabs = document.querySelectorAll(".tab");
    const items = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    // ✅ Safe exit (prevents breaking global.js)
    if (!lightbox || !lightboxImg || !items.length) return;

    const closeBtn = document.querySelector(".close-btn");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const counter = document.querySelector(".counter");

    let currentIndex = 0;
    let filteredImages = [];


/* =========================
   FILTER
========================= */
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

    // 🔥 FORCE SCROLL (THIS WILL WORK)
setTimeout(() => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}, 50);

  });
});


    /* =========================
       UPDATE IMAGES
    ========================= */
    function updateFilteredImages() {
      filteredImages = Array.from(items)
        .filter(item => item.style.display !== "none")
        .map(item => item.querySelector("img"))
        .filter(Boolean);
    }


    /* =========================
       OPEN LIGHTBOX
    ========================= */
    function openLightbox(index) {
      updateFilteredImages();

      if (!filteredImages.length) return;

      currentIndex = Math.max(0, Math.min(index, filteredImages.length - 1));

      lightboxImg.src = filteredImages[currentIndex].src;
      lightbox.classList.add("active");

      updateCounter();
    }


    function updateCounter() {
      if (!counter) return;
      counter.textContent = `${currentIndex + 1} / ${filteredImages.length}`;
    }


    /* =========================
       NAVIGATION
    ========================= */
    function showNext() {
      if (!filteredImages.length) return;

      currentIndex = (currentIndex + 1) % filteredImages.length;
      lightboxImg.src = filteredImages[currentIndex].src;

      updateCounter();
    }

    function showPrev() {
      if (!filteredImages.length) return;

      currentIndex =
        (currentIndex - 1 + filteredImages.length) % filteredImages.length;

      lightboxImg.src = filteredImages[currentIndex].src;

      updateCounter();
    }


    function closeLightbox() {
      lightbox.classList.remove("active");
    }


    /* =========================
       IMAGE CLICK
    ========================= */
    items.forEach(item => {
      const img = item.querySelector("img");
      if (!img) return;

      img.addEventListener("click", function () {
        updateFilteredImages();
        const index = filteredImages.indexOf(this);
        if (index !== -1) openLightbox(index);
      });
    });


    /* =========================
       BUTTONS
    ========================= */
    nextBtn?.addEventListener("click", showNext);
    prevBtn?.addEventListener("click", showPrev);
    closeBtn?.addEventListener("click", closeLightbox);


    /* =========================
       OUTSIDE CLICK
    ========================= */
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });


    /* =========================
       KEYBOARD
    ========================= */
    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("active")) {
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "Escape") closeLightbox();
      }
    });

  }


  /* =========================
     SAFE INIT (NO CONFLICT)
  ========================= */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGallery);
  } else {
    initGallery();
  }

})();