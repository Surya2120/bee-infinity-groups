/* Section shortcuts stay in sync with the About page without touching its photo tracks. */
(() => {
  "use strict";
  const nav = document.getElementById("aboutJump");
  const toggle = document.getElementById("aboutJumpToggle");
  const currentLabel = document.getElementById("aboutJumpCurrent");
  const hero = document.querySelector(".about-hero");
  if (!nav || !toggle || !currentLabel || !hero) return;

  const items = [...nav.querySelectorAll('.about-jump__links a[href^="#"]')]
    .map(link => ({ link, target: document.getElementById(link.hash.slice(1)) }))
    .filter(item => item.target);
  if (!items.length) return;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;

  function closeMenu(restoreFocus = false) {
    nav.dataset.open = "false";
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) toggle.focus({ preventScroll: true });
  }

  function update() {
    frame = 0;
    const headerHeight = document.getElementById("siteHeader")?.offsetHeight || 92;
    nav.hidden = hero.getBoundingClientRect().bottom > headerHeight + 30;
    if (nav.hidden) closeMenu();

    const line = headerHeight + Math.min(110, innerHeight * .18);
    let active = items[0];
    for (const item of items) {
      if (item.target.getBoundingClientRect().top <= line) active = item;
      else break;
    }
    for (const item of items) {
      if (item === active) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    }
    currentLabel.textContent = active.link.dataset.label || active.link.textContent.trim();
  }
  function scheduleUpdate() { if (!frame) frame = requestAnimationFrame(update); }

  toggle.addEventListener("click", () => {
    const open = nav.dataset.open !== "true";
    nav.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", event => {
    const link = event.target.closest?.('.about-jump__links a[href^="#"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    dispatchEvent(new Event("about:section-jump"));
    closeMenu();
    history.pushState(null, "", link.hash);
    target.tabIndex = -1;
    target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
    scheduleUpdate();
  });
  document.addEventListener("pointerdown", event => {
    if (nav.dataset.open === "true" && !nav.contains(event.target)) closeMenu();
  }, { passive: true });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.dataset.open === "true") {
      event.preventDefault();
      closeMenu(true);
    }
  });
  addEventListener("scroll", scheduleUpdate, { passive: true });
  addEventListener("resize", scheduleUpdate, { passive: true });
  addEventListener("hashchange", scheduleUpdate);
  addEventListener("pageshow", scheduleUpdate);
  addEventListener("load", scheduleUpdate);
  update();
})();
