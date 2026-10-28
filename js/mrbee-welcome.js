(() => {
  "use strict";
  const panel = document.getElementById("mrbeeWelcome");
  const closeButton = document.getElementById("mrbeeWelcomeClose");
  const continueButton = document.getElementById("mrbeeWelcomeContinue");
  const browseButton = document.getElementById("mrbeeWelcomeBrowse");
  const cornerButton = document.getElementById("mrbeeWelcomeCorner");
  const choices = document.getElementById("mrbeeWelcomeChoices");
  const title = document.getElementById("mrbeeWelcomeTitle");
  const text = document.getElementById("mrbeeWelcomeText");
  const canvas = document.getElementById("mrbeeWelcomeCanvas");
  if (!panel || !closeButton || !continueButton || !browseButton || !cornerButton || !choices || !title || !text || !canvas) return;
  const storageKey = "beeInfinity.mrBee.welcomeSeen.v1";
  const preview = new URLSearchParams(location.search).get("mrbee") === "preview";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let timer = 0;
  let choiceTimer = 0;
  let dockTimer = 0;
  let dockRemaining = 5000;
  let dockStarted = 0;
  let keyboardDecline = false;
  let seen = false;
  let dismissed = false;
  let phase = "welcome";
  let mood = "neutral";
  let previousFocus = null;
  let scenePromise;
  let scene;
  try { seen = sessionStorage.getItem(storageKey) === "1"; } catch { /* The greeting works without browser storage. */ }

  function setMood(next) {
    mood = next;
    panel.dataset.mood = next;
    scene?.setMood?.(next);
    window.dispatchEvent(new CustomEvent("mrbee:welcome-mood", { detail: { mood: next } }));
  }
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
    scenePromise = import("./mrbee-welcome-scene.js?v=guided-v2").then(module => {
      if (dismissed) return;
      scene = module.createWelcomeBee(canvas);
      scene.setMood?.(mood);
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
    panel.dataset.phase = phase;
    setMood("neutral");
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
  function pauseDock() {
    if (!dockTimer) return;
    window.clearTimeout(dockTimer);
    dockTimer = 0;
    dockRemaining = Math.max(0, dockRemaining - (Date.now() - dockStarted));
  }
  function resumeDock() {
    if (dismissed || phase !== "declined" || keyboardDecline || dockTimer || document.hidden) return;
    dockStarted = Date.now();
    dockTimer = window.setTimeout(() => finish("browse", "sad"), dockRemaining);
  }
  function clearTimers() {
    window.clearTimeout(timer);
    window.clearTimeout(choiceTimer);
    window.clearTimeout(dockTimer);
    timer = choiceTimer = dockTimer = 0;
  }
  function pauseChoice() {
    window.clearTimeout(choiceTimer);
    choiceTimer = 0;
  }
  function resumeChoice() {
    if (dismissed || phase !== "excited" || choiceTimer || document.hidden || !panel.open) return;
    choiceTimer = window.setTimeout(() => finish("guide", "excited"), reducedMotion.matches ? 0 : 1050);
  }
  function finish(choice, finalMood = mood) {
    if (!panel.open) return;
    const restoreFocus = panel.contains(document.activeElement);
    const rect = canvas.getBoundingClientRect();
    const from = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    dismissed = true;
    phase = "docked";
    clearTimers();
    setMood(finalMood);
    panel.close();
    document.documentElement.classList.remove("mrbee-welcome-open");
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
    const handoff = { choice, mood: finalMood, from };
    // Keep a one-shot handoff if the shared guide is still downloading.
    window.__mrBeeWelcomePending = handoff;
    window.dispatchEvent(new CustomEvent("mrbee:welcome-choice", { detail: handoff }));
  }
  function guide() {
    if (phase !== "welcome" || dismissed) return;
    phase = "excited";
    panel.dataset.phase = phase;
    continueButton.disabled = true;
    browseButton.disabled = true;
    title.textContent = "Yes! Let’s explore.";
    text.textContent = "My Chief Buzz Officer badge is getting closer!";
    setMood("excited");
    resumeChoice();
  }
  function browse(event) {
    if (phase !== "welcome" || dismissed) return;
    phase = "declined";
    panel.dataset.phase = phase;
    keyboardDecline = event.detail === 0;
    choices.hidden = true;
    cornerButton.hidden = false;
    title.textContent = "My badge can wait…";
    text.textContent = "I was practising for my Chief Buzz Officer badge. I’ll be in the corner—call me whenever you need.";
    setMood("sad");
    cornerButton.focus({ preventScroll: true });
    resumeDock();
  }
  closeButton.addEventListener("click", () => finish("browse", "neutral"));
  continueButton.addEventListener("click", guide);
  browseButton.addEventListener("click", browse);
  cornerButton.addEventListener("click", () => finish("browse", "sad"));
  panel.addEventListener("keydown", () => {
    if (phase === "declined") { keyboardDecline = true; pauseDock(); }
  });
  panel.addEventListener("cancel", event => {
    event.preventDefault();
    finish("browse", "neutral");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { pauseDock(); pauseChoice(); }
    else { resumeDock(); resumeChoice(); }
    syncScene();
    schedule();
  });
  document.getElementById("siteExplore")?.addEventListener("toggle", () => { syncScene(); schedule(); });
  const bodyObserver = new MutationObserver(() => { syncScene(); schedule(); });
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  addEventListener("pagehide", event => {
    window.clearTimeout(timer);
    timer = 0;
    pauseDock();
    pauseChoice();
    scene?.stop();
    if (!event.persisted) bodyObserver.disconnect();
  });
  addEventListener("pageshow", () => { syncScene(); resumeDock(); resumeChoice(); schedule(); });
  schedule();
})();
