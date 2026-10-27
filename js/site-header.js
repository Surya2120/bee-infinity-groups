(() => {
  "use strict";

  function initSiteHeader() {
    const header = document.getElementById("siteHeader");
    const navigation = document.getElementById("siteNavigation");
    const toggle = document.getElementById("siteMenuToggle");
    const explore = document.getElementById("siteExplore");
    if (!header || !navigation || !toggle || header.dataset.siteHeaderReady) return;
    header.dataset.siteHeaderReady = "true";
    const mobile = window.matchMedia("(max-width: 980px)");

    function closeExplore(restoreFocus = false) {
      if (!explore?.open) return;
      explore.open = false;
      if (restoreFocus) explore.querySelector("summary")?.focus();
    }

    function setMenu(open, restoreFocus = false) {
      const expanded = mobile.matches && open;
      header.classList.toggle("is-menu-open", expanded);
      document.body.classList.toggle("site-menu-open", expanded);
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
      navigation.inert = mobile.matches && !expanded;
      if (navigation.inert) navigation.setAttribute("aria-hidden", "true");
      else navigation.removeAttribute("aria-hidden");
      if (!expanded) closeExplore();
      if (restoreFocus && mobile.matches) toggle.focus();
    }

    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a[href]")) setMenu(false);
    });
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Node)) return;
      if (explore && !explore.contains(event.target)) {
        closeExplore(explore.contains(document.activeElement));
      }
      if (!header.contains(event.target) && header.classList.contains("is-menu-open")) {
        setMenu(false, navigation.contains(document.activeElement));
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (explore?.open) {
        event.preventDefault();
        closeExplore(explore.contains(document.activeElement));
      } else if (header.classList.contains("is-menu-open")) {
        event.preventDefault();
        setMenu(false, true);
      }
    });
    header.addEventListener("focusout", (event) => {
      if (event.relatedTarget instanceof Node && !header.contains(event.relatedTarget)) setMenu(false);
    });
    mobile.addEventListener("change", () => {
      const focused = document.activeElement;
      setMenu(false, mobile.matches && navigation.contains(focused));
      if (!mobile.matches && focused === toggle) navigation.querySelector("a[href]")?.focus();
    });

    setMenu(false);
    document.body.classList.add("site-nav-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initSiteHeader);
  else initSiteHeader();
})();
