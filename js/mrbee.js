/* Mr. Bee is a curated website guide. He never reads or sends form contents. */
(() => {
  "use strict";
  if (document.documentElement.dataset.mrbeeInitialized) return;
  document.documentElement.dataset.mrbeeInitialized = "true";
  const scriptURL = new URL(document.currentScript?.src || "js/mrbee.js", location.href);
  const siteRoot = new URL("../", scriptURL);
  const quietKey = "beeInfinity.mrBee.quiet.v1";
  const nudgeKey = "beeInfinity.mrBee.nudges.v1";
  const moodKey = "beeInfinity.mrBee.mood.v1";
  const journeyKey = "beeInfinity.mrBee.journey.v1";
  const banterKey = "beeInfinity.mrBee.banter.v1";
  const noAutoPages = new Set(["contact", "apply", "cart", "auth", "checkout", "success", "launch"]);
  const sensitivePages = new Set(["auth", "checkout", "success"]);
  const overlaySelector = "dialog, #lightbox, #popup, #loader, .cinema-loader, #enter-screen, .razorpay-container, #successPopup";
  const events = new AbortController();
  const { signal } = events;
  let queuedContext = null;
  let receiveContext;
  let queuedWelcome = ["guide", "browse"].includes(window.__mrBeeWelcomePending?.choice) ? window.__mrBeeWelcomePending : null;
  let receiveWelcome;
  let queuedMood = null;
  let receiveMood;

  addEventListener("mrbee:context", event => {
    if (!event.detail || typeof event.detail !== "object") return;
    queuedContext = event.detail;
    receiveContext?.(event.detail);
  }, { signal });
  addEventListener("mrbee:welcome-choice", event => {
    if (!event.detail || !["guide", "browse"].includes(event.detail.choice)) return;
    queuedWelcome = event.detail;
    receiveWelcome?.(event.detail);
  }, { signal });
  addEventListener("mrbee:welcome-mood", event => {
    if (!event.detail || !["neutral", "excited", "sad"].includes(event.detail.mood)) return;
    queuedMood = event.detail.mood;
    receiveMood?.(event.detail.mood);
  }, { signal });

  const read = (storage, key) => { try { return window[storage].getItem(key); } catch { return null; } };
  const write = (storage, key, value) => { try { window[storage].setItem(key, value); } catch { /* The guide also works without browser storage. */ } };

  function pageFromPath(value = location.pathname) {
    let path;
    try { path = decodeURIComponent(value).toLowerCase(); } catch { path = value.toLowerCase(); }
    if (/\/merch(?:\/|$)/.test(path)) {
      if (/\/checkout(?:\/|$)/.test(path)) return "checkout";
      if (/\/auth(?:\/|$)/.test(path)) return "auth";
      if (/\/success(?:\/|$)/.test(path)) return "success";
      return "merch";
    }
    const file = path.split("/").pop() || "index.html";
    const names = {
      "index.html": "home", "about.html": "about", "divisions.html": "divisions",
      "ourservices.html": "services", "gallery.html": "gallery", "spectrum.html": "spectrum",
      "contact.html": "contact", "careers.html": "careers", "careers - copy.html": "careers",
      "apply.html": "apply", "bigcinemaz.html": "cinemaz", "announcingsoon.html": "botd",
      "merch.html": "merch", "cart.html": "cart", "merchlaunchingsoon.html": "launch",
      "0merchlaunchingsoon copy.html": "launch"
    };
    return names[file] || "home";
  }

  function boot(content, journeyContent) {
    if (document.getElementById("mrbeeGuide")) return;
    const pages = content.pages;
    const jokes = (content.jokes || []).filter(line => typeof line === "string");
    const banter = Object.fromEntries(["secrets", "founders", "scolded", "bee", "company"].flatMap(key => {
      const group = content.banter?.[key];
      const lines = [...new Set((group?.lines || []).filter(value => typeof value === "string" && value.trim()))];
      return lines.length ? [[key, { label: group.label || key, lines }]] : [];
    }));
    const mixedCategories = ["secrets", "bee", "scolded", "founders"].filter(key => banter[key]);
    const nodes = journeyContent.nodes || {};
    const root = document.createElement("div");
    root.className = "mrbee-guide";
    root.id = "mrbeeGuide";
    root.hidden = true;
    root.innerHTML = `
      <div class="mrbee-nudge" id="mrbeeNudge" hidden>
        <p id="mrbeeNudgeText" role="status" aria-live="polite" aria-atomic="true"></p>
        <button class="mrbee-nudge-close" type="button" aria-label="Dismiss Mr. Bee’s tip"><span aria-hidden="true">×</span></button>
      </div>
      <section class="mrbee-panel" id="mrbeePanel" role="dialog" aria-modal="false" aria-labelledby="mrbeePanelTitle" aria-describedby="mrbeeJourneyText" hidden>
        <header class="mrbee-panel-header"><div><p class="mrbee-eyebrow">Your website guide</p><h2 id="mrbeePanelTitle">Mr. Bee, at your service.</h2></div><button class="mrbee-panel-close" id="mrbeePanelClose" type="button" aria-label="Close Mr. Bee’s guide"><span aria-hidden="true">×</span></button></header>
        <div class="mrbee-modes" role="group" aria-label="Choose how Mr. Bee can help"><button type="button" id="mrbeeExploreMode" aria-pressed="true" aria-controls="mrbeeJourney">Explore with me</button><button type="button" id="mrbeeTipsMode" aria-pressed="false" aria-controls="mrbeePageTips">Page tips</button></div>
        <section class="mrbee-journey" id="mrbeeJourney" aria-labelledby="mrbeeJourneyTitle"><h3 id="mrbeeJourneyTitle" tabindex="-1"></h3><p id="mrbeeJourneyText"></p><div class="mrbee-journey-choices" id="mrbeeJourneyChoices"></div><div class="mrbee-journey-actions"><button type="button" id="mrbeeJourneyBack">← Back</button><button type="button" id="mrbeeJourneyFinish">I’ll browse here</button></div></section>
        <div id="mrbeePageTips" hidden><p class="mrbee-page-title" id="mrbeePageTitle"></p>
          <p class="mrbee-line" id="mrbeeLine" role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="mrbee-banter-control"><label for="mrbeeBanterCategory">Pick your buzz</label><select id="mrbeeBanterCategory" aria-describedby="mrbeeBanterNote"><option value="mixed">Surprise me</option></select></div>
          <div class="mrbee-tools"><button id="mrbeeTip" type="button">Page tip</button><button id="mrbeeJoke" type="button">Make me smile</button></div>
          <p class="mrbee-banter-note" id="mrbeeBanterNote" hidden></p>
          <nav class="mrbee-links" id="mrbeeLinks" aria-label="Mr. Bee’s shortcuts"></nav>
        </div>
        <footer class="mrbee-panel-footer"><label><input id="mrbeeQuiet" type="checkbox" aria-describedby="mrbeeQuietNote"><span>Quiet mode</span></label><small id="mrbeeQuietNote"></small></footer>
      </section>
      <button class="mrbee-launcher" id="mrbeeLauncher" type="button" aria-label="Open Mr. Bee, your website guide" aria-controls="mrbeePanel" aria-expanded="false"><span class="mrbee-portrait" aria-hidden="true"><img alt="" width="156" height="144" decoding="async"><canvas id="mrbeeGuideCanvas" aria-hidden="true"></canvas></span><span class="mrbee-launcher-label">Mr. Bee</span></button>`;
    const find = id => root.querySelector(`#${id}`);
    const launcher = find("mrbeeLauncher");
    const canvas = find("mrbeeGuideCanvas");
    const panel = find("mrbeePanel");
    const panelClose = find("mrbeePanelClose");
    const line = find("mrbeeLine");
    const pageTitle = find("mrbeePageTitle");
    const links = find("mrbeeLinks");
    const tipButton = find("mrbeeTip");
    const jokeButton = find("mrbeeJoke");
    const banterCategory = find("mrbeeBanterCategory");
    const banterNote = find("mrbeeBanterNote");
    for (const [key, group] of Object.entries(banter)) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = group.label;
      banterCategory.appendChild(option);
    }
    banterCategory.parentElement.hidden = !mixedCategories.length;
    const quietInput = find("mrbeeQuiet");
    const quietNote = find("mrbeeQuietNote");
    const nudge = find("mrbeeNudge");
    const nudgeText = find("mrbeeNudgeText");
    const exploreMode = find("mrbeeExploreMode");
    const tipsMode = find("mrbeeTipsMode");
    const pageTips = find("mrbeePageTips");
    const journey = find("mrbeeJourney");
    const journeyTitle = find("mrbeeJourneyTitle");
    const journeyText = find("mrbeeJourneyText");
    const journeyChoices = find("mrbeeJourneyChoices");
    const journeyBack = find("mrbeeJourneyBack");
    const journeyFinish = find("mrbeeJourneyFinish");
    const portrait = root.querySelector(".mrbee-portrait");
    root.querySelector(".mrbee-portrait img").src = new URL("assets/images/logo/Bee.png", siteRoot).href;
    document.body.appendChild(root);

    let quiet = read("localStorage", quietKey) === "1";
    let context = { page: pageFromPath(), route: location.pathname, busy: false, sensitive: false };
    let currentContent = pages[context.page] || pages.home;
    let tipIndex = 0;
    let banterHistory = { used: [], nextCategory: 0, lastLine: "" };
    let autoTimer = 0;
    let nudgeTimer = 0;
    let nudgeStarted = 0;
    let nudgeRemaining = 9000;
    let pageStarted = Date.now();
    let manualUsed = false;
    let lastActivity = pageStarted;
    let stateFrame = 0;
    let scene;
    let scenePromise;
    let needsPortraitPaint = true;
    let destroyed = false;
    let blocked = true;
    let teamInView = false;
    let teamObserver;
    let mode = "tour";
    let journeyNode = "start";
    let journeyHistory = [];
    let arrivalView = false;
    let pendingWelcome = queuedWelcome;
    let pendingArrival = null;
    let arrivalTimer = 0;
    let flightAnimation;
    let mood = queuedMood || read("sessionStorage", moodKey) || "neutral";
    if (!["neutral", "excited", "sad"].includes(mood)) mood = "neutral";
    let nudgeState = { count: 0, lastAt: 0, pages: [] };
    refreshNudgeState();
    const welcome = document.getElementById("mrbeeWelcome");
    const expectWelcome = welcome && (read("sessionStorage", "beeInfinity.mrBee.welcomeSeen.v1") !== "1" || new URLSearchParams(location.search).get("mrbee") === "preview");
    const revealAfter = expectWelcome ? Date.now() + 1800 : 0;

    function setMood(value) {
      mood = ["neutral", "excited", "sad"].includes(value) ? value : "neutral";
      root.dataset.mood = mood;
      write("sessionStorage", moodKey, mood);
      scene?.setMood?.(mood);
      needsPortraitPaint = true;
      syncPortrait();
    }
    receiveMood = setMood;

    function safeDestination(value) {
      let destination;
      try { destination = new URL(value, siteRoot); } catch { return null; }
      return destination.origin === siteRoot.origin && destination.pathname.startsWith(siteRoot.pathname) ? destination : null;
    }
    function canonicalPath(value) { return value.replace(/\/index\.html$/i, "/"); }
    function clearJourney() {
      pendingArrival = null;
      clearTimeout(arrivalTimer);
      arrivalTimer = 0;
      write("sessionStorage", journeyKey, "null");
    }
    function readArrival() {
      try {
        const saved = JSON.parse(read("sessionStorage", journeyKey) || "null");
        if (!saved?.active || typeof saved.targetPath !== "string" || !Number.isFinite(saved.createdAt) || Date.now() - saved.createdAt > 600000) return null;
        if (!saved.targetPath.startsWith(siteRoot.pathname) || canonicalPath(saved.targetPath) !== canonicalPath(location.pathname)) return null;
        if (saved.targetHash && saved.targetHash !== location.hash) return null;
        return saved;
      } catch { return null; }
    }
    function setMode(value) {
      mode = value === "tips" ? "tips" : "tour";
      root.dataset.mode = mode;
      journey.hidden = mode !== "tour";
      pageTips.hidden = mode !== "tips";
      exploreMode.setAttribute("aria-pressed", String(mode === "tour"));
      tipsMode.setAttribute("aria-pressed", String(mode === "tips"));
      panel.setAttribute("aria-describedby", mode === "tour" ? "mrbeeJourneyText" : "mrbeeLine");
    }
    function addJourneyChoice(choice) {
      if (!choice || typeof choice.label !== "string") return;
      const destination = typeof choice.href === "string" ? safeDestination(choice.href) : null;
      const next = typeof choice.next === "string" && nodes[choice.next] ? choice.next : null;
      if (!destination && !next) return;
      const option = document.createElement(destination ? "a" : "button");
      option.className = "mrbee-journey-choice";
      option.textContent = choice.label;
      option.setAttribute("aria-label", choice.label);
      if (destination) {
        option.href = destination.href;
        option.addEventListener("click", event => {
          // Preserve normal new-tab and modified-link behaviour without opening a tour elsewhere.
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const record = { active: true, node: journeyNode, targetPath: destination.pathname, targetHash: destination.hash, createdAt: Date.now() };
          write("sessionStorage", journeyKey, JSON.stringify(record));
          if (destination.pathname === location.pathname && destination.search === location.search) {
            pendingArrival = record;
            clearTimeout(arrivalTimer);
            arrivalTimer = setTimeout(() => { arrivalTimer = 0; requestSync(); }, 650);
          }
          setMood("excited");
          closePanel(false, true);
        }, { signal });
      } else {
        option.type = "button";
        option.addEventListener("click", () => {
          journeyHistory.push(journeyNode);
          showJourney(next, true);
          setMood("excited");
        }, { signal });
      }
      journeyChoices.appendChild(option);
    }
    function showJourney(id = "start", focus = false) {
      const node = nodes[id] || nodes.start;
      if (!node) return;
      arrivalView = false;
      journeyNode = nodes[id] ? id : "start";
      root.dataset.journey = journeyNode;
      delete root.dataset.arrival;
      journeyTitle.textContent = node.title || "What would you like to explore?";
      journeyText.textContent = node.text || "Pick a direction. I’ll lead the way.";
      journeyChoices.replaceChildren();
      (node.choices || []).forEach(addJourneyChoice);
      journeyBack.hidden = journeyHistory.length === 0;
      journeyFinish.textContent = "I’ll browse myself";
      setMode("tour");
      panel.scrollTop = 0;
      if (focus && !panel.hidden) journeyTitle.focus({ preventScroll: true });
    }
    function showArrival() {
      arrivalView = true;
      root.dataset.arrival = "true";
      root.dataset.journey = "arrival";
      journeyTitle.textContent = "Here we are!";
      journeyText.textContent = "Take a look—or pick another stop. My badge can wait.";
      journeyChoices.replaceChildren();
      const another = document.createElement("button");
      another.type = "button";
      another.className = "mrbee-journey-choice";
      another.textContent = "Explore somewhere else";
      another.setAttribute("aria-label", "Explore somewhere else");
      another.addEventListener("click", () => { journeyHistory = []; showJourney("start", true); }, { signal });
      journeyChoices.appendChild(another);
      journeyBack.hidden = true;
      journeyFinish.textContent = "I’ll browse here";
      setMode("tour");
      panel.scrollTop = 0;
    }
    function tryArrival() {
      if (!pendingArrival || blocked || document.hidden || fieldFocused() || formBusy() || arrivalTimer) return;
      if (canonicalPath(pendingArrival.targetPath) !== canonicalPath(location.pathname) || (pendingArrival.targetHash && pendingArrival.targetHash !== location.hash)) return;
      clearJourney();
      showArrival();
      openPanel(false);
    }
    function flyToCorner(from) {
      if (!from || matchMedia("(prefers-reduced-motion: reduce)").matches || typeof portrait.animate !== "function") return;
      const x = Number(from.x ?? from.left);
      const y = Number(from.y ?? from.top);
      const sourceWidth = Number(from.width);
      const sourceHeight = Number(from.height);
      if (![x, y, sourceWidth, sourceHeight].every(Number.isFinite) || sourceWidth <= 0 || sourceHeight <= 0) return;
      const destination = portrait.getBoundingClientRect();
      if (!destination.width || !destination.height || root.hidden) return;
      const dx = x + sourceWidth / 2 - (destination.left + destination.width / 2);
      const dy = y + sourceHeight / 2 - (destination.top + destination.height / 2);
      const scale = Math.min(4, sourceWidth / destination.width, sourceHeight / destination.height);
      flightAnimation?.cancel();
      flightAnimation = portrait.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.88 },
        { transform: "translate(0, 0) scale(1)", opacity: 1 }
      ], { duration: 720, easing: "cubic-bezier(.2,.65,.25,1)" });
    }
    function handleWelcome(detail) {
      pendingWelcome = detail;
      setMood(detail.mood || (detail.choice === "guide" ? "excited" : "neutral"));
      requestSync();
    }
    receiveWelcome = handleWelcome;
    function finishWelcome() {
      if (!pendingWelcome || blocked || document.hidden) return;
      const detail = pendingWelcome;
      pendingWelcome = null;
      queuedWelcome = null;
      delete window.__mrBeeWelcomePending;
      clearJourney();
      manualUsed = true;
      if (detail.choice === "guide") {
        journeyHistory = [];
        showJourney("start");
        openPanel(false);
      } else {
        closePanel(false, true);
        setMood(detail.mood || "neutral");
        loadPortrait();
        Promise.resolve(scenePromise).then(() => { if (!destroyed) flyToCorner(detail.from); });
      }
    }

    function fieldFocused() {
      const element = document.activeElement;
      return element instanceof Element && !root.contains(element) && element.matches("input:not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio]), textarea, select, [contenteditable=true], [role=textbox]");
    }
    function visibleOverlay(element) {
      if (!element.isConnected || element.hidden) return false;
      if (element instanceof HTMLDialogElement) return element.open;
      if (element.id === "lightbox") return element.classList.contains("active");
      const style = getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && style.visibility !== "collapse" && Number.parseFloat(style.opacity) > 0.01 && style.pointerEvents !== "none";
    }
    function isBlocked() {
      return Date.now() < revealAfter || context.busy || context.sensitive || sensitivePages.has(context.page) ||
        document.body.classList.contains("site-menu-open") || document.body.classList.contains("menu-open") ||
        Boolean(document.getElementById("siteExplore")?.open) || [...document.querySelectorAll(overlaySelector)].some(visibleOverlay);
    }
    function formBusy() { return Boolean(document.querySelector('form[aria-busy="true"], [data-mrbee-busy="true"]')); }
    function refreshNudgeState() {
      try {
        const stored = JSON.parse(window.sessionStorage.getItem(nudgeKey) || "null");
        if (!stored || !Number.isFinite(stored.count) || !Number.isFinite(stored.lastAt) || !Array.isArray(stored.pages)) return;
        const pagesSeen = [...new Set([...nudgeState.pages, ...stored.pages.filter(page => typeof page === "string").slice(0, 20)])];
        nudgeState = {
          count: Math.max(nudgeState.count, stored.count, pagesSeen.length),
          lastAt: Math.max(nudgeState.lastAt, stored.lastAt),
          pages: pagesSeen.slice(0, 20)
        };
      } catch { /* Keep the in-memory budget if storage is unavailable or invalid. */ }
    }
    function refreshQuietPreference() {
      const previous = quiet;
      try { quiet = window.localStorage.getItem(quietKey) === "1"; } catch { /* Keep the current preference when storage is unavailable. */ }
      return quiet !== previous;
    }
    function saveNudges() { write("sessionStorage", nudgeKey, JSON.stringify(nudgeState)); }
    function hideNudge() {
      clearTimeout(nudgeTimer);
      nudgeTimer = 0;
      nudge.hidden = true;
      launcher.removeAttribute("aria-describedby");
    }
    function pauseNudge() {
      if (!nudgeTimer) return;
      clearTimeout(nudgeTimer);
      nudgeTimer = 0;
      nudgeRemaining = Math.max(0, nudgeRemaining - (Date.now() - nudgeStarted));
    }
    function continueNudge() {
      if (nudge.hidden || nudge.matches(":hover") || nudge.contains(document.activeElement)) return;
      clearTimeout(nudgeTimer);
      nudgeStarted = Date.now();
      nudgeTimer = setTimeout(hideNudge, nudgeRemaining);
    }
    function eligibleForNudge() {
      return !destroyed && !manualUsed && root.dataset.recruiting !== "true" && mood !== "sad" && !quiet && !noAutoPages.has(context.page) && nudgeState.count < 2 && !nudgeState.pages.includes(context.page);
    }
    function scheduleNudge() {
      clearTimeout(autoTimer);
      autoTimer = 0;
      if (!eligibleForNudge() || blocked || document.hidden || !panel.hidden) return;
      const due = Math.max(pageStarted + 14000, lastActivity + 6000, nudgeState.lastAt + 90000);
      autoTimer = setTimeout(tryNudge, Math.max(200, due - Date.now()));
    }
    function tryNudge() {
      autoTimer = 0;
      refreshNudgeState();
      if (refreshQuietPreference()) updateQuiet(false);
      if (!eligibleForNudge()) return;
      if (isBlocked() || document.hidden || !panel.hidden) return;
      if (fieldFocused() || formBusy()) {
        autoTimer = setTimeout(tryNudge, 10000);
        return;
      }
      const due = Math.max(pageStarted + 14000, lastActivity + 6000, nudgeState.lastAt + 90000);
      if (Date.now() < due) { scheduleNudge(); return; }
      const text = context.page === "about" && teamInView ? currentContent.tips?.[1] || currentContent.intro : currentContent.tips?.[0] || currentContent.intro;
      if (!text) return;
      nudgeText.textContent = text;
      nudge.hidden = false;
      nudgeRemaining = 9000;
      launcher.setAttribute("aria-describedby", "mrbeeNudgeText");
      nudgeState.count += 1;
      nudgeState.lastAt = Date.now();
      nudgeState.pages.push(context.page);
      saveNudges();
      continueNudge();
    }

    function syncPortrait() {
      if (!scene) return;
      if (blocked || root.hidden || document.hidden || destroyed) { scene.stop(); return; }
      if (!panel.hidden && context.page !== "spectrum") {
        scene.start();
      } else {
        scene.stop();
        if (needsPortraitPaint || !canvas.classList.contains("is-ready")) {
          scene.start();
          scene.stop();
          needsPortraitPaint = false;
        }
      }
    }
    function loadPortrait() {
      if (scenePromise || destroyed) return;
      scenePromise = import(new URL("mrbee-welcome-scene.js?v=briefcase-v1", scriptURL).href).then(module => {
        if (destroyed) return;
        scene = module.createWelcomeBee(canvas);
        scene.setMood?.(mood);
        needsPortraitPaint = true;
        syncPortrait();
      }).catch(() => { /* The original bee image remains the portrait fallback. */ });
    }
    function closePanel(restoreFocus = false, preserveJourney = false) {
      if (panel.hidden) return;
      const focusInside = panel.contains(document.activeElement);
      if (!preserveJourney) {
        clearJourney();
        if (mood !== "sad") setMood("neutral");
      }
      panel.hidden = true;
      root.dataset.open = "false";
      launcher.setAttribute("aria-expanded", "false");
      launcher.setAttribute("aria-label", "Open Mr. Bee, your website guide");
      syncPortrait();
      if (restoreFocus && focusInside && !root.hidden) launcher.focus({ preventScroll: true });
      scheduleNudge();
    }
    function openPanel(resetJourney = true) {
      if (isBlocked() || document.hidden) return;
      manualUsed = true;
      if (resetJourney) {
        clearJourney();
        journeyHistory = [];
        showJourney("start");
      }
      setMood("excited");
      hideNudge();
      clearTimeout(autoTimer);
      autoTimer = 0;
      panel.hidden = false;
      root.dataset.open = "true";
      launcher.setAttribute("aria-expanded", "true");
      launcher.setAttribute("aria-label", "Close Mr. Bee’s guide");
      loadPortrait();
      syncPortrait();
      panelClose.focus({ preventScroll: true });
    }
    function updateQuiet(schedule = true) {
      quietInput.checked = quiet;
      root.dataset.quiet = String(quiet);
      quietNote.textContent = quiet ? "I’ll stay available, without popping up." : "A small tip now and then. You’re always in control.";
      if (quiet) { hideNudge(); clearTimeout(autoTimer); autoTimer = 0; }
      else if (schedule) scheduleNudge();
    }
    function renderContent() {
      currentContent = pages[context.page] || pages.home;
      root.dataset.page = context.page;
      pageTitle.textContent = currentContent.title;
      line.textContent = currentContent.intro;
      banterNote.hidden = true;
      links.replaceChildren();
      (currentContent.links || []).forEach(shortcut => {
        let href;
        try { href = new URL(shortcut.href, siteRoot); } catch { return; }
        if (href.origin !== siteRoot.origin) return;
        const anchor = document.createElement("a");
        anchor.href = href.href;
        anchor.setAttribute("aria-label", shortcut.label);
        const name = document.createElement("span");
        name.textContent = shortcut.label;
        anchor.appendChild(name);
        links.appendChild(anchor);
      });
      tipButton.disabled = !currentContent.tips?.length;
      jokeButton.disabled = !jokes.length && !Object.keys(banter).length;
      tipIndex = 0;
    }
    function showBanter() {
      // Keep the deck across navigation, without storing anything visitors type.
      try {
        const saved = JSON.parse(read("sessionStorage", banterKey) || "null");
        if (saved && Array.isArray(saved.used)) banterHistory = {
          used: saved.used.filter(value => typeof value === "string").slice(-100),
          nextCategory: Number.isSafeInteger(saved.nextCategory) && saved.nextCategory >= 0 ? saved.nextCategory : 0,
          lastLine: typeof saved.lastLine === "string" ? saved.lastLine : ""
        };
      } catch { /* Keep the in-memory deck when storage is unavailable or invalid. */ }
      let category = banterCategory.value;
      if (category === "mixed" && mixedCategories.length) {
        category = mixedCategories[banterHistory.nextCategory % mixedCategories.length];
        banterHistory.nextCategory = (banterHistory.nextCategory + 1) % mixedCategories.length;
      }
      const group = banter[category] || { label: "A little Bee humour", lines: jokes };
      if (!group.lines.length) return;
      let available = group.lines.filter(value => !banterHistory.used.includes(value));
      if (!available.length) {
        banterHistory.used = banterHistory.used.filter(value => !group.lines.includes(value));
        available = group.lines.filter(value => group.lines.length === 1 || value !== banterHistory.lastLine);
      }
      const nextLine = available[Math.floor(Math.random() * available.length)];
      banterHistory.used.push(nextLine);
      banterHistory.lastLine = nextLine;
      write("sessionStorage", banterKey, JSON.stringify(banterHistory));
      pageTitle.textContent = group.label;
      line.textContent = nextLine;
      banterNote.textContent = category === "company" ? "A little about Bee Infinity Groups." : "A little mascot mischief. All in good fun.";
      banterNote.hidden = false;
      setMood("excited");
    }
    function syncState() {
      stateFrame = 0;
      if (destroyed) return;
      blocked = isBlocked();
      if (blocked) {
        hideNudge();
        closePanel(false, true);
        clearTimeout(autoTimer);
        autoTimer = 0;
        if (root.contains(document.activeElement)) document.activeElement.blur();
      }
      root.hidden = blocked;
      if (!blocked) loadPortrait();
      syncPortrait();
      if (!blocked) {
        finishWelcome();
        tryArrival();
      }
      scheduleNudge();
    }
    function requestSync() { if (!stateFrame && !destroyed) stateFrame = requestAnimationFrame(syncState); }
    function setContext(detail = {}) {
      const page = typeof detail.page === "string" && pages[detail.page] ? detail.page : pageFromPath();
      const route = typeof detail.route === "string" ? detail.route : location.pathname;
      const routeChanged = page !== context.page || route !== context.route;
      if (routeChanged) {
        closePanel(false, true);
        hideNudge();
        manualUsed = false;
        pageStarted = Date.now();
        lastActivity = pageStarted;
      }
      context = { page, route, busy: Boolean(detail.busy), sensitive: Boolean(detail.sensitive) };
      if (routeChanged) { renderContent(); pendingArrival = readArrival(); }
      requestSync();
    }
    receiveContext = setContext;

    launcher.addEventListener("click", () => { if (panel.hidden) openPanel(); else closePanel(true); }, { signal });
    panelClose.addEventListener("click", () => closePanel(true), { signal });
    exploreMode.addEventListener("click", () => {
      if (!arrivalView && !journeyChoices.children.length) showJourney("start");
      setMode("tour");
    }, { signal });
    tipsMode.addEventListener("click", () => { setMode("tips"); panel.scrollTop = 0; }, { signal });
    journeyBack.addEventListener("click", () => { showJourney(journeyHistory.pop() || "start", true); }, { signal });
    journeyFinish.addEventListener("click", () => { clearJourney(); closePanel(true); }, { signal });
    links.addEventListener("click", event => {
      if (event.target instanceof Element && event.target.closest("a[href]")) {
        closePanel(false);
        hideNudge();
      }
    }, { signal });
    root.querySelector(".mrbee-nudge-close").addEventListener("click", hideNudge, { signal });
    tipButton.addEventListener("click", () => {
      const tips = currentContent.tips || [];
      if (tips.length) {
        pageTitle.textContent = currentContent.title;
        line.textContent = tips[tipIndex % tips.length];
        banterNote.hidden = true;
        tipIndex += 1;
      }
    }, { signal });
    jokeButton.addEventListener("click", showBanter, { signal });
    banterCategory.addEventListener("change", () => {
      jokeButton.textContent = banterCategory.value === "company" ? "Another fact" : "Make me smile";
      showBanter();
    }, { signal });
    quietInput.addEventListener("change", () => { quiet = quietInput.checked; write("localStorage", quietKey, quiet ? "1" : "0"); updateQuiet(); }, { signal });
    nudge.addEventListener("pointerenter", pauseNudge, { signal });
    nudge.addEventListener("pointerleave", continueNudge, { signal });
    nudge.addEventListener("focusin", pauseNudge, { signal });
    nudge.addEventListener("focusout", event => { if (!nudge.contains(event.relatedTarget)) queueMicrotask(continueNudge); }, { signal });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !event.defaultPrevented && !panel.hidden) { event.preventDefault(); closePanel(true); }
      lastActivity = Date.now();
      scheduleNudge();
    }, { signal });
    document.addEventListener("pointerdown", event => {
      lastActivity = Date.now();
      if (!root.contains(event.target)) { closePanel(false); hideNudge(); }
      scheduleNudge();
      if (pendingArrival) requestSync();
    }, { passive: true, signal });
    document.addEventListener("focusin", () => {
      if (fieldFocused()) { hideNudge(); closePanel(false); if (pendingArrival) clearJourney(); }
      scheduleNudge();
    }, { signal });
    addEventListener("scroll", () => {
      if (Date.now() - lastActivity > 800) { lastActivity = Date.now(); scheduleNudge(); }
    }, { passive: true, signal });
    addEventListener("storage", event => { if (event.key === quietKey) { quiet = event.newValue === "1"; updateQuiet(); } }, { signal });
    addEventListener("resize", () => { needsPortraitPaint = true; requestSync(); }, { passive: true, signal });
    addEventListener("hashchange", () => {
      pendingArrival = readArrival();
      if (pendingArrival && !arrivalTimer) arrivalTimer = setTimeout(() => { arrivalTimer = 0; requestSync(); }, 650);
    }, { signal });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { clearTimeout(autoTimer); autoTimer = 0; hideNudge(); scene?.stop(); }
      else { lastActivity = Date.now(); requestSync(); }
    }, { signal });

    /* Watch only overlay state, never text or values entered into a form. */
    const watched = new WeakSet();
    const stateObserver = new MutationObserver(requestSync);
    stateObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    function watchOverlays(scope = document) {
      const nodes = [...scope.querySelectorAll(`${overlaySelector}, #siteHeader, #siteExplore, form[aria-busy]`)];
      if (scope instanceof Element && scope.matches(overlaySelector)) nodes.push(scope);
      nodes.forEach(element => {
        if (watched.has(element) || root.contains(element)) return;
        watched.add(element);
        stateObserver.observe(element, { attributes: true, attributeFilter: ["class", "style", "hidden", "open", "aria-busy"] });
      });
    }
    watchOverlays();
    const discoveryObserver = new MutationObserver(records => {
      let changed = false;
      records.forEach(record => {
        if (root.contains(record.target)) return;
        [...record.addedNodes, ...record.removedNodes].forEach(node => {
          if (!(node instanceof Element) || root.contains(node)) return;
          if (node.matches(overlaySelector) || node.querySelector(overlaySelector)) {
            changed = true;
            if (node.isConnected) watchOverlays(node);
          }
        });
      });
      if (changed) requestSync();
    });
    discoveryObserver.observe(document.body, { childList: true, subtree: true });
    if (typeof IntersectionObserver === "function" && document.getElementById("team")) {
      teamObserver = new IntersectionObserver(entries => { teamInView = entries.some(entry => entry.isIntersecting); }, { threshold: 0.1 });
      teamObserver.observe(document.getElementById("team"));
    }
    const welcomeTimer = revealAfter ? setTimeout(requestSync, Math.max(0, revealAfter - Date.now()) + 20) : 0;
    addEventListener("pagehide", event => {
      clearTimeout(autoTimer);
      autoTimer = 0;
      hideNudge();
      scene?.stop();
      flightAnimation?.cancel();
      clearTimeout(arrivalTimer);
      arrivalTimer = 0;
      if (stateFrame) cancelAnimationFrame(stateFrame);
      stateFrame = 0;
      if (!event.persisted) {
        destroyed = true;
        clearTimeout(welcomeTimer);
        events.abort();
        stateObserver.disconnect();
        discoveryObserver.disconnect();
        teamObserver?.disconnect();
        scene?.dispose();
      }
    }, { signal });
    addEventListener("pageshow", () => {
      needsPortraitPaint = true;
      lastActivity = Date.now();
      refreshNudgeState();
      refreshQuietPreference();
      pendingArrival = readArrival();
      const storedMood = read("sessionStorage", moodKey);
      if (["neutral", "excited", "sad"].includes(storedMood)) setMood(storedMood);
      updateQuiet();
      requestSync();
    }, { signal });
    renderContent();
    if (queuedContext) setContext(queuedContext);
    setMood(queuedWelcome?.mood || mood);
    showJourney("start");
    pendingArrival = readArrival();
    updateQuiet();
    syncState();
    document.documentElement.dataset.mrbeeReady = "true";
    window.dispatchEvent(new CustomEvent("mrbee:ready"));
  }

  Promise.all([
    import(new URL("mrbee-content.js?v=guided-v2", scriptURL).href),
    import(new URL("mrbee-journey.js?v=guided-v2", scriptURL).href)
  ]).then(([content, journey]) => boot(content, journey)).catch(() => {
    /* A missing optional guide must never prevent the main website from loading. */
    delete document.documentElement.dataset.mrbeeInitialized;
    events.abort();
  });
})();
