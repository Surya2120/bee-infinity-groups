/* Native scrolling drives the story; every service remains readable without motion. */
(() => {
  "use strict";
  const chapters = [...document.querySelectorAll(".spectrum-chapter[data-spectrum-step]")];
  if (!chapters.length) return;
  const links = [...document.querySelectorAll(".spectrum-chapter-nav > a")];
  const control = document.getElementById("spectrumMotion");
  const label = document.getElementById("spectrumMotionLabel");
  const counter = document.getElementById("spectrumStepNumber");
  const sceneLabel = document.getElementById("spectrumSceneLabel");
  const main = document.getElementById("main");
  const header = document.getElementById("siteHeader");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const { signal } = events;
  const revealTargets = [...document.querySelectorAll("[data-spectrum-reveal]")];
  const clamp = value => Math.min(1, Math.max(0, value));
  let paused = false;
  let raf = 0;
  let needsMeasure = true;
  let offsets = [];
  let headerHeight = 92;
  let revealObserver;
  let layoutObserver;
  let active = -1;

  function reveal(element) {
    element.classList.add("is-revealed");
    revealObserver?.unobserve(element);
  }
  function revealAll() { revealTargets.forEach(reveal); }
  function revealDestination() {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!target) return;
    if (target.matches("[data-spectrum-reveal]")) reveal(target);
    target.querySelectorAll("[data-spectrum-reveal]").forEach(reveal);
    const parent = target.closest("[data-spectrum-reveal]");
    if (parent) reveal(parent);
  }
  if (typeof IntersectionObserver === "function" && !reducedMotion.matches) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    revealTargets.forEach(element => revealObserver.observe(element));
    document.body.classList.add("spectrum-enhanced");
  } else revealAll();

  function update() {
    raf = 0;
    if (needsMeasure) {
      headerHeight = header?.getBoundingClientRect().height || 92;
      offsets = chapters.map(chapter => chapter.getBoundingClientRect().top + scrollY);
      needsMeasure = false;
    }
    const position = scrollY + headerHeight;
    let index = 0;
    offsets.forEach((offset, i) => { if (position + 1 >= offset) index = i; });
    const next = offsets[index + 1];
    const local = next !== undefined ? clamp((position - offsets[index]) / Math.max(1, next - offsets[index])) : 0;
    const progress = clamp((index + local) / Math.max(1, chapters.length - 1));
    const visiblePosition = scrollY + innerHeight * 0.45;
    let visible = 0;
    offsets.forEach((offset, i) => { if (visiblePosition >= offset) visible = i; });
    const navigationOpen = document.body.classList.contains("site-menu-open") || Boolean(document.getElementById("siteExplore")?.open);
    const effectivePaused = paused || navigationOpen;
    document.body.style.setProperty("--spectrum-progress", String(progress));
    document.body.style.setProperty("--spectrum-chapter-progress", String(local));
    document.body.style.setProperty("--spectrum-card-shift", reducedMotion.matches || effectivePaused ? "0" : String(Math.sin(progress * Math.PI * 4)));
    document.body.classList.toggle("spectrum-motion-paused", effectivePaused || reducedMotion.matches);
    if (visible !== active) {
      active = visible;
      document.body.dataset.spectrumChapter = String(visible);
      links.forEach((link, i) => {
        if (i === visible) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      if (counter) counter.textContent = String(visible + 1).padStart(2, "0");
      if (sceneLabel) sceneLabel.textContent = chapters[visible].dataset.sceneLabel || "";
    }
    if (control) {
      control.setAttribute("aria-pressed", String(paused || reducedMotion.matches));
      control.setAttribute("aria-label", reducedMotion.matches ? "Reduced motion is enabled in your device settings" : paused ? "Resume decorative motion" : "Pause decorative motion");
      control.disabled = reducedMotion.matches;
    }
    if (label) label.textContent = reducedMotion.matches ? "Reduced motion" : paused ? "Motion paused" : "Motion on";
    window.dispatchEvent(new CustomEvent("spectrum:progress", {
      detail: { progress, step: visible, index, local, count: chapters.length, reducedMotion: reducedMotion.matches, paused: effectivePaused }
    }));
  }
  function requestUpdate() {
    if (!raf && !document.hidden) raf = requestAnimationFrame(update);
  }
  function measure() { needsMeasure = true; requestUpdate(); }
  control?.addEventListener("click", () => {
    paused = !paused;
    if (paused) revealAll();
    requestUpdate();
  }, { signal });
  addEventListener("scroll", requestUpdate, { passive: true, signal });
  addEventListener("resize", measure, { passive: true, signal });
  addEventListener("load", measure, { once: true, signal });
  addEventListener("hashchange", () => { revealDestination(); requestUpdate(); }, { signal });
  addEventListener("spectrum:scene-ready", requestUpdate, { signal });
  document.addEventListener("visibilitychange", requestUpdate, { signal });
  document.addEventListener("focusin", event => {
    const element = event.target instanceof Element ? event.target.closest("[data-spectrum-reveal]") : null;
    if (element) reveal(element);
  }, { signal });
  document.getElementById("siteExplore")?.addEventListener("toggle", requestUpdate, { signal });
  const menuObserver = new MutationObserver(requestUpdate);
  if (header) menuObserver.observe(header, { attributes: true, attributeFilter: ["class"] });
  reducedMotion.addEventListener("change", () => { if (reducedMotion.matches) revealAll(); requestUpdate(); }, { signal });
  if (typeof ResizeObserver === "function" && main) {
    layoutObserver = new ResizeObserver(measure);
    layoutObserver.observe(main);
    if (header) layoutObserver.observe(header);
  }
  document.fonts?.ready.then(measure);
  addEventListener("pagehide", event => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (!event.persisted) {
      events.abort();
      revealObserver?.disconnect();
      layoutObserver?.disconnect();
      menuObserver.disconnect();
    }
  }, { signal });
  addEventListener("pageshow", measure, { signal });
  revealDestination();
  measure();
})();
