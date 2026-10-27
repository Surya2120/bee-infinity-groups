(() => {
  "use strict";

  function initHome() {
    const header = document.getElementById("homeHeader");
    const navigation = document.getElementById("homeNavigation");
    const menuToggle = document.getElementById("homeMenuToggle");
    const explore = document.getElementById("homeExplore");
    const mobile = window.matchMedia("(max-width: 980px)");

    function closeExplore(restoreFocus = false) {
      if (!explore?.open) return;
      explore.open = false;
      if (restoreFocus) explore.querySelector("summary")?.focus();
    }

    function setMenu(open, restoreFocus = false) {
      if (!header || !navigation || !menuToggle) return;
      const expanded = mobile.matches && open;
      header.classList.toggle("menu-open", expanded);
      document.body.classList.toggle("menu-open", expanded);
      menuToggle.setAttribute("aria-expanded", String(expanded));
      menuToggle.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
      navigation.inert = mobile.matches && !expanded;
      if (navigation.inert) navigation.setAttribute("aria-hidden", "true");
      else navigation.removeAttribute("aria-hidden");
      if (!expanded) closeExplore();
      if (restoreFocus && mobile.matches) menuToggle.focus();
    }

    if (header && navigation && menuToggle) {
      document.body.classList.add("nav-ready");
      setMenu(false);

      menuToggle.addEventListener("click", () => {
        setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
      });

      navigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a[href]")) {
          closeExplore();
          setMenu(false);
        }
      });

      mobile.addEventListener("change", () => {
        const focusInside = navigation.contains(document.activeElement);
        setMenu(false, focusInside);
      });

      header.addEventListener("focusout", (event) => {
        if (event.relatedTarget instanceof Node && !header.contains(event.relatedTarget)) {
          setMenu(false);
        }
      });
    }

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Node)) return;
      if (explore && !explore.contains(event.target)) {
        closeExplore(explore.contains(document.activeElement));
      }
      if (header && !header.contains(event.target) && header.classList.contains("menu-open")) {
        setMenu(false, navigation?.contains(document.activeElement));
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (explore?.open) {
        event.preventDefault();
        closeExplore(explore.contains(document.activeElement));
      } else if (header?.classList.contains("menu-open")) {
        event.preventDefault();
        setMenu(false, true);
      }
    });

    function initHeroCarousel() {
      const carousel = document.getElementById("heroCarousel");
      if (!carousel) return;
      const images = Array.from(carousel.querySelectorAll(".carousel-image"));
      const sources = Array.from(carousel.querySelectorAll(".carousel-source"))
        .map((source) => source.dataset.image).filter(Boolean);
      if (images.length < 2 || !sources.length) return;
      document.body.classList.add("nav-ready");

      const previous = document.getElementById("heroPrev");
      const next = document.getElementById("heroNext");
      const playback = document.getElementById("heroPlayback");
      const count = document.getElementById("heroCount");
      const status = document.getElementById("heroStatus");
      const controls = [previous, next, playback].filter(Boolean);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let activeImage = images.find((image) => image.classList.contains("is-active")) || images[0];
      let currentIndex = Math.max(0, sources.indexOf(activeImage.getAttribute("src")));
      let cursor = currentIndex;
      let enabled = Boolean(playback) && !reducedMotion.matches;
      let focusPaused = controls.includes(document.activeElement);
      let timer = null;
      let cycle = 0;
      let selection = 0;
      let activeLoad = 0;
      let preparedPhoto;
      let touchStart;

      const normalize = (index) => (index + sources.length) % sources.length;
      const canPlay = () => enabled && !document.hidden && !focusPaused;

      function clearTimer() {
        if (timer !== null) window.clearTimeout(timer);
        timer = null;
      }

      function updateCount(announce) {
        if (count) count.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(sources.length).padStart(2, "0")}`;
        if (announce && status) status.textContent = `Showing photo ${currentIndex + 1} of ${sources.length}.`;
      }

      function preparePhoto(index) {
        if (preparedPhoto?.index === index) return preparedPhoto.promise;
        const photo = new Image();
        const promise = new Promise((resolve, reject) => {
          photo.onload = resolve;
          photo.onerror = reject;
          photo.src = sources[index];
        }).then(async () => {
          if (typeof photo.decode === "function") await photo.decode();
          return photo;
        });
        preparedPhoto = { index, promise };
        return promise;
      }

      function prefetchNext() {
        if (sources.length > 1) preparePhoto(normalize(cursor + 1)).catch(() => {});
      }

      function scheduleNext() {
        clearTimer();
        if (!canPlay() || activeLoad || sources.length < 2) return;
        timer = window.setTimeout(() => {
          timer = null;
          showSlide(normalize(cursor + 1), false, true);
        }, 4000);
      }

      function updatePlayback() {
        cycle++;
        if (playback) {
          playback.textContent = enabled ? "Pause" : "Play";
          playback.setAttribute("aria-label", enabled ? "Pause automatic photos" : "Play automatic photos");
        }
        scheduleNext();
      }

      async function showSlide(index, announce = true, automatic = false) {
        const request = ++selection;
        const requestCycle = cycle;
        cursor = normalize(index);
        const targetIndex = cursor;
        activeLoad = request;
        clearTimer();
        const isCurrentRequest = () => request === selection && (!automatic || (requestCycle === cycle && canPlay()));
        try {
          if (targetIndex !== currentIndex) {
            await preparePhoto(targetIndex);
            if (!isCurrentRequest()) return;
            const buffer = images.find((image) => image !== activeImage);
            // Finish an earlier fade before reusing its outgoing image.
            buffer.getAnimations?.().forEach((animation) => animation.finish());
            buffer.src = sources[targetIndex];
            if (typeof buffer.decode === "function") await buffer.decode();
            if (!isCurrentRequest()) return;
            buffer.classList.add("is-active");
            activeImage.classList.remove("is-active");
            activeImage = buffer;
            currentIndex = targetIndex;
          }
          if (isCurrentRequest()) updateCount(announce);
        } catch {
          if (announce && request === selection && status) {
            status.textContent = "This photo is unavailable. The current photo is still displayed.";
          }
        } finally {
          if (activeLoad === request) {
            activeLoad = 0;
            prefetchNext();
            scheduleNext();
          }
        }
      }

      previous?.addEventListener("click", () => showSlide(normalize(cursor - 1)));
      next?.addEventListener("click", () => showSlide(normalize(cursor + 1)));
      playback?.addEventListener("click", () => {
        enabled = !enabled;
        if (enabled) focusPaused = false;
        updatePlayback();
      });
      carousel.addEventListener("focusin", (event) => {
        if (controls.includes(event.target)) {
          focusPaused = true;
          updatePlayback();
        }
      });
      carousel.addEventListener("focusout", (event) => {
        if (controls.includes(event.target)) {
          focusPaused = controls.includes(event.relatedTarget);
          updatePlayback();
        }
      });
      document.addEventListener("visibilitychange", updatePlayback);
      reducedMotion.addEventListener("change", () => {
        if (reducedMotion.matches) enabled = false;
        updatePlayback();
      });

      carousel.addEventListener("touchstart", (event) => {
        touchStart = undefined;
        if (event.touches.length !== 1 || (event.target instanceof Element && event.target.closest("button, a, input, select, textarea, summary"))) return;
        const touch = event.touches[0];
        touchStart = { x: touch.clientX, y: touch.clientY, id: touch.identifier };
      }, { passive: true });
      carousel.addEventListener("touchend", (event) => {
        if (!touchStart) return;
        const touch = Array.from(event.changedTouches).find((item) => item.identifier === touchStart.id);
        if (touch) {
          const horizontal = touch.clientX - touchStart.x;
          const vertical = touch.clientY - touchStart.y;
          if (Math.abs(horizontal) >= 50 && Math.abs(horizontal) > Math.abs(vertical) * 1.25) {
            showSlide(normalize(cursor + (horizontal < 0 ? 1 : -1)));
          }
        }
        touchStart = undefined;
      }, { passive: true });
      carousel.addEventListener("touchcancel", () => { touchStart = undefined; }, { passive: true });

      updateCount(false);
      prefetchNext();
      updatePlayback();
    }
    initHeroCarousel();
    const year = document.getElementById("homeYear");
    if (year) year.textContent = new Date().getFullYear();

    const topButton = document.getElementById("homeTop");
    if (topButton) {
      const updateTopButton = () => {
        const visible = window.scrollY > 500;
        topButton.classList.toggle("visible", visible);
        topButton.tabIndex = visible ? 0 : -1;
        topButton.setAttribute("aria-hidden", String(!visible));
      };
      window.addEventListener("scroll", updateTopButton, { passive: true });
      topButton.addEventListener("click", () => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      });
      updateTopButton();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initHome);
  else initHome();
})();
