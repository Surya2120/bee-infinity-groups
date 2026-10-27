(() => {
  "use strict";
  const panel = document.getElementById("mrbeeWelcome");
  const closeButton = document.getElementById("mrbeeWelcomeClose");
  const continueButton = document.getElementById("mrbeeWelcomeContinue");
  const canvas = document.getElementById("mrbeeWelcomeCanvas");
  if (!panel || !closeButton || !continueButton || !canvas) return;
  const storageKey = "beeInfinity.mrBee.welcomeSeen.v1";
  const preview = new URLSearchParams(location.search).get("mrbee") === "preview";
  let timer = 0;
  let seen = false;
  let dismissed = false;
  let previousFocus = null;
  let scenePromise;
  let scene;
  try { seen = sessionStorage.getItem(storageKey) === "1"; } catch { /* The greeting works without browser storage. */ }

  function headerBusy() {
    return document.body.classList.contains("site-menu-open") || Boolean(document.getElementById("siteExplore")?.open);
  }
  function syncScene() {
    if (!scene) return;
    if (!panel.open || document.hidden || headerBusy()) scene.stop();
    else scene.start();
  }
  function loadScene() {
    if (scenePromise) return;
    scenePromise = import("./mrbee-welcome-scene.js").then(module => {
      if (dismissed) return;
      scene = module.createWelcomeBee(canvas);
      syncScene();
    }).catch(() => { /* The original bee image remains a usable fallback. */ });
  }
  function show() {
    timer = 0;
    if (dismissed || (seen && !preview) || document.hidden || headerBusy()) return;
    seen = true;
    previousFocus = document.activeElement;
    panel.showModal();
    document.documentElement.classList.add("mrbee-welcome-open");
    continueButton.focus({ preventScroll: true });
    if (!preview) {
      try { sessionStorage.setItem(storageKey, "1"); } catch { /* Session-only in-memory fallback. */ }
    }
    loadScene();
  }
  function schedule() {
    if (dismissed || (seen && !preview) || panel.open || timer || document.hidden || headerBusy()) return;
    timer = window.setTimeout(show, 1100);
  }
  function dismiss() {
    if (!panel.open) return;
    const restoreFocus = panel.contains(document.activeElement);
    dismissed = true;
    panel.close();
    document.documentElement.classList.remove("mrbee-welcome-open");
    window.clearTimeout(timer);
    timer = 0;
    scene?.stop();
    scene?.dispose();
    scene = null;
    if (!preview) {
      try { sessionStorage.setItem(storageKey, "1"); } catch { /* Dismissal still works when storage is unavailable. */ }
    }
    if (restoreFocus) {
      const target = previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected
        ? previousFocus : document.querySelector(".carousel-actions a");
      target?.focus({ preventScroll: true });
    }
  }
  closeButton.addEventListener("click", dismiss);
  continueButton.addEventListener("click", dismiss);
  panel.addEventListener("cancel", event => {
    event.preventDefault();
    dismiss();
  });
  document.addEventListener("visibilitychange", () => { syncScene(); schedule(); });
  document.getElementById("siteExplore")?.addEventListener("toggle", () => { syncScene(); schedule(); });
  const bodyObserver = new MutationObserver(() => { syncScene(); schedule(); });
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  addEventListener("pagehide", () => {
    window.clearTimeout(timer);
    timer = 0;
    scene?.stop();
  });
  addEventListener("pageshow", () => { syncScene(); schedule(); });
  schedule();
})();
