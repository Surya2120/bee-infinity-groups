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
