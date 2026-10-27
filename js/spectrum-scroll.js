(() => {
  "use strict";
  const chapters = [...document.querySelectorAll(".spectrum-chapter[data-spectrum-step]")];
  if (!chapters.length) return;
  const links = [...document.querySelectorAll(".spectrum-chapter-nav > a")];
  const control = document.getElementById("spectrumMotion");
  const label = document.getElementById("spectrumMotionLabel");
  const counter = document.getElementById("spectrumStepNumber");
  const footer = document.querySelector(".home-footer");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;
  let requested = false;
  let offsets = [];
  let headerHeight = 92;
  const clamp = value => Math.min(1, Math.max(0, value));

  function measure() {
    headerHeight = document.getElementById("siteHeader")?.getBoundingClientRect().height || 92;
    offsets = chapters.map(chapter => chapter.getBoundingClientRect().top + scrollY);
    requestUpdate();
  }
  function update() {
    requested = false;
    const position = scrollY + headerHeight;
    let index = 0;
    for (let i = 0; i < offsets.length; i++) if (position >= offsets[i]) index = i;
    const next = offsets[index + 1];
    const local = next ? clamp((position - offsets[index]) / (next - offsets[index])) : 0;
    const progress = clamp((index + local) / (chapters.length - 1));
    const visiblePosition = scrollY + innerHeight * .45;
    let visible = 0;
    offsets.forEach((offset, i) => { if (visiblePosition >= offset) visible = i; });
    document.body.style.setProperty("--spectrum-progress", String(progress));
    document.body.style.setProperty("--spectrum-card-shift", reducedMotion.matches || paused ? "0" : String(Math.sin(progress * Math.PI * 2)));
    document.body.classList.toggle("spectrum-at-footer", Boolean(footer && footer.getBoundingClientRect().top < innerHeight * .65));
    document.body.classList.toggle("spectrum-motion-paused", paused || reducedMotion.matches);
    links.forEach((link, i) => {
      if (i === visible) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    if (counter) counter.textContent = String(visible + 1).padStart(2, "0");
    if (control) {
      control.setAttribute("aria-pressed", String(paused || reducedMotion.matches));
      control.setAttribute("aria-label", reducedMotion.matches ? "Reduced motion is enabled in your device settings" : paused ? "Resume decorative motion" : "Pause decorative motion");
      control.disabled = reducedMotion.matches;
    }
    if (label) label.textContent = reducedMotion.matches ? "Reduced motion" : paused ? "Motion paused" : "Motion on";
    window.dispatchEvent(new CustomEvent("spectrum:progress", { detail: { progress, step: visible, reducedMotion: reducedMotion.matches, paused } }));
  }
  function requestUpdate() {
    if (requested) return;
    requested = true;
    requestAnimationFrame(update);
  }
  control?.addEventListener("click", () => { paused = !paused; requestUpdate(); });
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", measure, { passive: true });
  addEventListener("load", measure, { once: true });
  addEventListener("spectrum:scene-ready", requestUpdate);
  document.addEventListener("visibilitychange", requestUpdate);
  reducedMotion.addEventListener("change", requestUpdate);
  if (typeof ResizeObserver === "function") new ResizeObserver(measure).observe(document.getElementById("main"));
  measure();
})();
