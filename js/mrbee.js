/* Mr. Bee is a curated website guide. He never reads or sends form contents. */
(() => {
  "use strict";
  if (document.documentElement.dataset.mrbeeInitialized) return;
  document.documentElement.dataset.mrbeeInitialized = "true";
  const scriptURL = new URL(document.currentScript?.src || "js/mrbee.js", location.href);
  const siteRoot = new URL("../", scriptURL);
  const quietKey = "beeInfinity.mrBee.quiet.v1";
  const nudgeKey = "beeInfinity.mrBee.nudges.v1";
  const noAutoPages = new Set(["contact", "apply", "cart", "auth", "checkout", "success", "launch"]);
  const sensitivePages = new Set(["auth", "checkout", "success"]);
  const overlaySelector = "dialog, #lightbox, #popup, #loader, .cinema-loader, #enter-screen, .razorpay-container, #successPopup";
  const events = new AbortController();
  const { signal } = events;
  let queuedContext = null;
  let receiveContext;

  addEventListener("mrbee:context", event => {
    if (!event.detail || typeof event.detail !== "object") return;
    queuedContext = event.detail;
    receiveContext?.(event.detail);
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

  function boot(content) {
    if (document.getElementById("mrbeeGuide")) return;
    const pages = content.pages;
    const jokes = content.jokes.filter(line => typeof line === "string");
    const root = document.createElement("div");
    root.className = "mrbee-guide";
    root.id = "mrbeeGuide";
    root.hidden = true;
    root.innerHTML = `
      <div class="mrbee-nudge" id="mrbeeNudge" hidden>
        <p id="mrbeeNudgeText" role="status" aria-live="polite" aria-atomic="true"></p>
        <button class="mrbee-nudge-close" type="button" aria-label="Dismiss Mr. Bee’s tip"><span aria-hidden="true">×</span></button>
      </div>
      <section class="mrbee-panel" id="mrbeePanel" role="dialog" aria-modal="false" aria-labelledby="mrbeePanelTitle" aria-describedby="mrbeeLine" hidden>
        <header class="mrbee-panel-header"><div><p class="mrbee-eyebrow">Your website guide</p><h2 id="mrbeePanelTitle">Hello again, I’m Mr. Bee.</h2></div><button class="mrbee-panel-close" id="mrbeePanelClose" type="button" aria-label="Close Mr. Bee’s guide"><span aria-hidden="true">×</span></button></header>
        <p class="mrbee-page-title" id="mrbeePageTitle"></p>
        <p class="mrbee-line" id="mrbeeLine" role="status" aria-live="polite" aria-atomic="true"></p>
        <nav class="mrbee-links" id="mrbeeLinks" aria-label="Mr. Bee’s shortcuts"></nav>
        <div class="mrbee-tools"><button id="mrbeeTip" type="button">Page tip</button><button id="mrbeeJoke" type="button">Make me smile</button></div>
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
    const quietInput = find("mrbeeQuiet");
    const quietNote = find("mrbeeQuietNote");
    const nudge = find("mrbeeNudge");
    const nudgeText = find("mrbeeNudgeText");
    root.querySelector(".mrbee-portrait img").src = new URL("assets/images/logo/Bee.png", siteRoot).href;
    document.body.appendChild(root);

    let quiet = read("localStorage", quietKey) === "1";
    let context = { page: pageFromPath(), route: location.pathname, busy: false, sensitive: false };
    let currentContent = pages[context.page] || pages.home;
    let tipIndex = 0;
    let jokeIndex = 0;
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
    let nudgeState = { count: 0, lastAt: 0, pages: [] };
    refreshNudgeState();
    const welcome = document.getElementById("mrbeeWelcome");
    const expectWelcome = welcome && (read("sessionStorage", "beeInfinity.mrBee.welcomeSeen.v1") !== "1" || new URLSearchParams(location.search).get("mrbee") === "preview");
    const revealAfter = expectWelcome ? Date.now() + 1800 : 0;

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
      return !destroyed && !manualUsed && !quiet && !noAutoPages.has(context.page) && nudgeState.count < 2 && !nudgeState.pages.includes(context.page);
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
      const text = context.page === "about" && teamInView && jokes[0] ? jokes[0] : currentContent.tips?.[0] || currentContent.intro;
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
      scenePromise = import(new URL("mrbee-welcome-scene.js", scriptURL).href).then(module => {
        if (destroyed) return;
        scene = module.createWelcomeBee(canvas);
        needsPortraitPaint = true;
        syncPortrait();
      }).catch(() => { /* The original bee image remains the portrait fallback. */ });
    }
    function closePanel(restoreFocus = false) {
      if (panel.hidden) return;
      const focusInside = panel.contains(document.activeElement);
      panel.hidden = true;
      root.dataset.open = "false";
      launcher.setAttribute("aria-expanded", "false");
      launcher.setAttribute("aria-label", "Open Mr. Bee, your website guide");
      syncPortrait();
      if (restoreFocus && focusInside && !root.hidden) launcher.focus({ preventScroll: true });
      scheduleNudge();
    }
    function openPanel() {
      if (isBlocked() || document.hidden) return;
      manualUsed = true;
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
      links.replaceChildren();
      (currentContent.links || []).forEach(shortcut => {
        let href;
        try { href = new URL(shortcut.href, siteRoot); } catch { return; }
        if (href.origin !== siteRoot.origin) return;
        const anchor = document.createElement("a");
        anchor.href = href.href;
        const name = document.createElement("span");
        name.textContent = shortcut.label;
        anchor.appendChild(name);
        links.appendChild(anchor);
      });
      tipButton.disabled = !currentContent.tips?.length;
      jokeButton.disabled = !jokes.length;
      tipIndex = 0;
    }
    function syncState() {
      stateFrame = 0;
      if (destroyed) return;
      blocked = isBlocked();
      if (blocked) {
        hideNudge();
        closePanel(false);
        clearTimeout(autoTimer);
        autoTimer = 0;
        if (root.contains(document.activeElement)) document.activeElement.blur();
      }
      root.hidden = blocked;
      if (!blocked) loadPortrait();
      syncPortrait();
      scheduleNudge();
    }
    function requestSync() { if (!stateFrame && !destroyed) stateFrame = requestAnimationFrame(syncState); }
    function setContext(detail = {}) {
      const page = typeof detail.page === "string" && pages[detail.page] ? detail.page : pageFromPath();
      const route = typeof detail.route === "string" ? detail.route : location.pathname;
      const routeChanged = page !== context.page || route !== context.route;
      if (routeChanged) {
        closePanel(false);
        hideNudge();
        manualUsed = false;
        pageStarted = Date.now();
        lastActivity = pageStarted;
      }
      context = { page, route, busy: Boolean(detail.busy), sensitive: Boolean(detail.sensitive) };
      if (routeChanged) renderContent();
      requestSync();
    }
    receiveContext = setContext;

    launcher.addEventListener("click", () => { if (panel.hidden) openPanel(); else closePanel(true); }, { signal });
    panelClose.addEventListener("click", () => closePanel(true), { signal });
    links.addEventListener("click", event => {
      if (event.target instanceof Element && event.target.closest("a[href]")) {
        closePanel(false);
        hideNudge();
      }
    }, { signal });
    root.querySelector(".mrbee-nudge-close").addEventListener("click", hideNudge, { signal });
    tipButton.addEventListener("click", () => {
      const tips = currentContent.tips || [];
      if (tips.length) { line.textContent = tips[tipIndex % tips.length]; tipIndex += 1; }
    }, { signal });
    jokeButton.addEventListener("click", () => {
      if (jokes.length) { line.textContent = jokes[jokeIndex % jokes.length]; jokeIndex += 1; }
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
    }, { passive: true, signal });
    document.addEventListener("focusin", () => {
      if (fieldFocused()) { hideNudge(); closePanel(false); }
      scheduleNudge();
    }, { signal });
    addEventListener("scroll", () => {
      if (Date.now() - lastActivity > 800) { lastActivity = Date.now(); scheduleNudge(); }
    }, { passive: true, signal });
    addEventListener("storage", event => { if (event.key === quietKey) { quiet = event.newValue === "1"; updateQuiet(); } }, { signal });
    addEventListener("resize", () => { needsPortraitPaint = true; requestSync(); }, { passive: true, signal });
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
      updateQuiet();
      requestSync();
    }, { signal });
    renderContent();
    if (queuedContext) setContext(queuedContext);
    updateQuiet();
    syncState();
    document.documentElement.dataset.mrbeeReady = "true";
    window.dispatchEvent(new CustomEvent("mrbee:ready"));
  }

  import(new URL("mrbee-content.js", scriptURL).href).then(boot).catch(() => {
    /* A missing optional guide must never prevent the main website from loading. */
    delete document.documentElement.dataset.mrbeeInitialized;
    events.abort();
  });
})();
