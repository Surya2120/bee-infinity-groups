/* The About page careers invitation gives Mr. Bee a short, optional cameo. */
(() => {
  "use strict";
  const join = document.getElementById("teamJoin");
  const cta = document.getElementById("teamJoinCta");
  const prompt = document.getElementById("teamJoinPrompt");
  const line = document.getElementById("teamJoinLine");
  const choices = document.getElementById("teamJoinChoices");
  const yes = document.getElementById("teamJoinYes");
  const no = document.getElementById("teamJoinNo");
  if (!join || !cta || !prompt || !line || !choices || !yes || !no) return;

  let active = false;
  let answered = false;
  let returnTimer = 0;
  let finishTimer = 0;
  let navigateTimer = 0;
  const messageDuration = 5000;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const hoverable = matchMedia("(hover: hover) and (pointer: fine)");
  const bee = () => document.getElementById("mrbeeGuide");
  const mood = value => dispatchEvent(new CustomEvent("mrbee:welcome-mood", { detail: { mood: value } }));

  function positionBee() {
    const root = bee();
    const portrait = root?.querySelector(".mrbee-portrait");
    const launcher = root?.querySelector(".mrbee-launcher");
    if (!active || !root || root.hidden || !portrait || !launcher) return;
    const button = cta.getBoundingClientRect();
    const base = launcher.getBoundingClientRect();
    const beeWidth = portrait.offsetWidth;
    const beeHeight = portrait.offsetHeight;
    const originX = base.left + portrait.offsetLeft + beeWidth / 2;
    const originY = base.top + portrait.offsetTop + beeHeight / 2;
    const roomOnRight = innerWidth - button.right > beeWidth + 22;
    const targetX = Math.max(beeWidth / 2 + 5, Math.min(innerWidth - beeWidth / 2 - 5,
      roomOnRight ? button.right + beeWidth / 2 + 12 : button.right - beeWidth / 2));
    const targetY = Math.max(beeHeight / 2 + 10, Math.min(innerHeight - beeHeight / 2 - 10,
      roomOnRight ? button.top + button.height / 2 : button.top - beeHeight / 2 - 8));
    root.style.setProperty("--mrbee-recruit-x", `${Math.round(targetX - originX)}px`);
    root.style.setProperty("--mrbee-recruit-y", `${Math.round(targetY - originY)}px`);
    root.dataset.returning = "false";
    root.dataset.recruiting = "true";
  }

  function finishReturn() {
    const root = bee();
    root?.removeAttribute("data-returning");
    root?.style.removeProperty("--mrbee-recruit-x");
    root?.style.removeProperty("--mrbee-recruit-y");
    prompt.hidden = true;
    choices.hidden = false;
    cta.setAttribute("aria-expanded", "false");
    active = false;
    answered = false;
    finishTimer = 0;
  }

  function returnBee(showFarewell = false) {
    clearTimeout(returnTimer);
    clearTimeout(finishTimer);
    returnTimer = 0;
    answered = true;
    choices.hidden = true;
    if (!showFarewell) prompt.hidden = true;
    const root = bee();
    if (root) {
      root.dataset.returning = "true";
      root.dataset.recruiting = "false";
    }
    finishTimer = setTimeout(finishReturn, reducedMotion.matches ? 0 : 800);
  }

  function invite() {
    if (active || answered) return;
    clearTimeout(returnTimer);
    clearTimeout(finishTimer);
    active = true;
    choices.hidden = false;
    prompt.hidden = false;
    line.textContent = "Psst... the founders asked me to find good people. I found you. Shall we look at Careers?";
    cta.setAttribute("aria-expanded", "true");
    const root = bee();
    const openPanel = root?.querySelector("#mrbeePanel:not([hidden]) #mrbeePanelClose");
    openPanel?.click();
    mood("excited");
    positionBee();
  }

  cta.addEventListener("pointerenter", () => { if (hoverable.matches) invite(); });
  cta.addEventListener("click", event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    invite();
    prompt.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "nearest" });
  });
  yes.addEventListener("click", () => {
    if (!active || answered) return;
    answered = true;
    choices.hidden = true;
    line.textContent = "Yes! I’ll tell the founders I found you all by myself. Let’s go!";
    mood("excited");
    navigateTimer = setTimeout(() => { location.href = cta.href; }, messageDuration);
  });
  no.addEventListener("click", () => {
    if (!active || answered) return;
    answered = true;
    choices.hidden = true;
    line.textContent = "Oh. I’ll tell the founders my recruiting dance needs practice. Back to my corner!";
    mood("sad");
    cta.focus({ preventScroll: true });
    returnTimer = setTimeout(() => returnBee(true), messageDuration);
  });
  document.addEventListener("pointerdown", event => {
    if (!active || answered || join.contains(event.target)) return;
    mood("neutral");
    returnBee();
  }, { passive: true });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !active || answered) return;
    event.preventDefault();
    mood("neutral");
    returnBee();
    cta.focus({ preventScroll: true });
  });
  addEventListener("scroll", () => {
    if (!active || answered) return;
    const rect = join.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) {
      mood("neutral");
      returnBee();
    } else positionBee();
  }, { passive: true });
  addEventListener("resize", () => { if (active && !answered) positionBee(); }, { passive: true });
  addEventListener("mrbee:ready", () => { if (active) positionBee(); });
  addEventListener("pagehide", () => {
    clearTimeout(returnTimer);
    clearTimeout(finishTimer);
    clearTimeout(navigateTimer);
    const root = bee();
    root?.removeAttribute("data-recruiting");
    root?.removeAttribute("data-returning");
    root?.style.removeProperty("--mrbee-recruit-x");
    root?.style.removeProperty("--mrbee-recruit-y");
    prompt.hidden = true;
    choices.hidden = false;
    cta.setAttribute("aria-expanded", "false");
    active = false;
    answered = false;
  });
})();
