/* Keeps the photo wall tactile without making the page depend on motion. */
(() => {
  "use strict";

  const gallery = document.querySelector("[data-spectrum-gallery]");
  const viewer = document.getElementById("spectrumPhotoViewer");
  if (!gallery || !viewer) return;

  const cards = [...gallery.querySelectorAll("[data-spectrum-photo]")];
  const triggers = cards.map(card => card.querySelector(".spectrum-photo-open")).filter(Boolean);
  const largeImage = document.getElementById("spectrumPhotoLarge");
  const caption = document.getElementById("spectrumPhotoCaption");
  const counter = document.getElementById("spectrumPhotoCounter");
  const closeButton = document.getElementById("spectrumPhotoClose");
  const previousButton = document.getElementById("spectrumPhotoPrevious");
  const nextButton = document.getElementById("spectrumPhotoNext");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const events = new AbortController();
  const { signal } = events;
  const visibleCards = new Set(cards);
  let activeIndex = 0;
  let returnFocus;
  let raf = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const isPaused = () => reducedMotion.matches || document.body.classList.contains("spectrum-motion-paused");
  const requestMotion = () => {
    if (!raf && !document.hidden) raf = requestAnimationFrame(updateMotion);
  };

  function clearMotion(card) {
    card.style.setProperty("--gallery-scroll-y", "0px");
    card.style.setProperty("--gallery-scroll-z", "0px");
    card.style.setProperty("--gallery-scroll-turn", "0deg");
  }

  function updateMotion() {
    raf = 0;
    if (isPaused()) {
      cards.forEach(card => {
        clearMotion(card);
        card.style.setProperty("--gallery-tilt-x", "0deg");
        card.style.setProperty("--gallery-tilt-y", "0deg");
      });
      return;
    }
    const middle = innerHeight * 0.5;
    visibleCards.forEach(card => {
      const bounds = card.getBoundingClientRect();
      const distance = clamp((middle - (bounds.top + bounds.height * 0.5)) / Math.max(innerHeight, 1), -0.7, 0.7);
      const reach = 1 - Math.min(1, Math.abs(distance) / 0.7);
      card.style.setProperty("--gallery-scroll-y", `${Math.round(distance * 24)}px`);
      card.style.setProperty("--gallery-scroll-z", `${Math.round(reach * 18)}px`);
      card.style.setProperty("--gallery-scroll-turn", `${(distance * -1.4).toFixed(2)}deg`);
    });
  }

  function photoDetails(index) {
    const trigger = triggers[index];
    const image = trigger?.querySelector("img");
    const copy = trigger?.closest("figure")?.querySelector("figcaption");
    return { trigger, image, copy };
  }

  function renderPhoto(index) {
    activeIndex = (index + triggers.length) % triggers.length;
    const { image, copy } = photoDetails(activeIndex);
    if (!image || !largeImage || !caption || !counter) return;
    largeImage.src = image.currentSrc || image.src;
    largeImage.alt = image.alt;
    caption.textContent = copy?.textContent?.replace(/^\s*\d+\s*/, "").trim() || "School celebrations in motion.";
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(triggers.length).padStart(2, "0")}`;
  }

  function announceViewer(open) {
    window.dispatchEvent(new CustomEvent("spectrum:photo-viewer", { detail: { open } }));
  }

  function openViewer(index) {
    if (!triggers.length) return;
    returnFocus = triggers[index];
    renderPhoto(index);
    if (!viewer.open) viewer.showModal();
    announceViewer(true);
    closeButton?.focus({ preventScroll: true });
  }

  function closeViewer() {
    if (viewer.open) viewer.close();
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openViewer(index), { signal });
  });
  closeButton?.addEventListener("click", closeViewer, { signal });
  previousButton?.addEventListener("click", () => renderPhoto(activeIndex - 1), { signal });
  nextButton?.addEventListener("click", () => renderPhoto(activeIndex + 1), { signal });
  viewer.addEventListener("click", event => { if (event.target === viewer) closeViewer(); }, { signal });
  viewer.addEventListener("close", () => {
    announceViewer(false);
    const focusTarget = returnFocus;
    returnFocus = undefined;
    focusTarget?.focus({ preventScroll: true });
  }, { signal });
  viewer.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); renderPhoto(activeIndex - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); renderPhoto(activeIndex + 1); }
  }, { signal });

  if (typeof IntersectionObserver === "function") {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleCards.add(entry.target);
        else visibleCards.delete(entry.target);
      });
      requestMotion();
    }, { rootMargin: "180px 0px" });
    cards.forEach(card => observer.observe(card));
    addEventListener("pagehide", event => { if (!event.persisted) observer.disconnect(); }, { signal });
  }

  function attachTilt(trigger) {
    const card = trigger.closest("[data-spectrum-photo]");
    if (!card) return;
    trigger.addEventListener("pointermove", event => {
      if (!finePointer.matches || isPaused() || event.pointerType === "touch") return;
      const bounds = trigger.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / Math.max(bounds.width, 1), 0, 1) - 0.5;
      const y = clamp((event.clientY - bounds.top) / Math.max(bounds.height, 1), 0, 1) - 0.5;
      card.style.setProperty("--gallery-tilt-x", `${(-y * 6).toFixed(2)}deg`);
      card.style.setProperty("--gallery-tilt-y", `${(x * 7).toFixed(2)}deg`);
    }, { passive: true, signal });
    trigger.addEventListener("pointerleave", () => {
      card.style.setProperty("--gallery-tilt-x", "0deg");
      card.style.setProperty("--gallery-tilt-y", "0deg");
    }, { signal });
  }
  triggers.forEach(attachTilt);

  addEventListener("scroll", requestMotion, { passive: true, signal });
  addEventListener("resize", requestMotion, { passive: true, signal });
  addEventListener("spectrum:progress", requestMotion, { signal });
  reducedMotion.addEventListener("change", requestMotion, { signal });
  document.addEventListener("visibilitychange", requestMotion, { signal });
  addEventListener("pagehide", event => {
    if (raf) cancelAnimationFrame(raf);
    if (!event.persisted) events.abort();
  }, { signal });
  requestMotion();
})();
