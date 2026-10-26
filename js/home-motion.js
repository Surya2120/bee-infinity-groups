(() => {
  "use strict";

  function initMotion() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const starters = [];

    function makeClone(element) {
      const clone = element.cloneNode(true);
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach((child) => child.removeAttribute("id"));
      clone.setAttribute("data-motion-clone", "true");
      clone.setAttribute("aria-hidden", "true");
      clone.inert = true;
      return clone;
    }

    function watchSection(section, update) {
      if (typeof IntersectionObserver === "function") {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => update(entry.isIntersecting));
        }, { threshold: 0.05 });
        observer.observe(section);
      } else {
        const check = () => {
          const rect = section.getBoundingClientRect();
          update(rect.bottom > 0 && rect.top < window.innerHeight);
        };
        window.addEventListener("scroll", check, { passive: true });
        window.addEventListener("resize", check);
        check();
      }
    }

    function installPlayback(section, button, label, refresh, pauseOnHover = true, autoplayWithoutButton = false) {
      const state = {
        enabled: (Boolean(button) || autoplayWithoutButton) && !reducedMotion.matches,
        hovered: false,
        focused: section.contains(document.activeElement),
        inView: false,
        canPlay() {
          return this.enabled && !this.hovered && !this.focused && this.inView && !document.hidden;
        }
      };
      const update = () => {
        if (button) {
          button.textContent = state.enabled ? "Pause" : "Play";
          button.setAttribute("aria-label", `${state.enabled ? "Pause" : "Play"} ${label}`);
        }
        refresh(state.canPlay());
      };
      button?.addEventListener("click", () => {
        state.enabled = !state.enabled;
        if (state.enabled) {
          state.hovered = false;
          state.focused = false;
        }
        update();
      });
      section.addEventListener("pointerenter", (event) => {
        if (pauseOnHover && (event.pointerType === "mouse" || event.pointerType === "pen")) {
          state.hovered = true;
          update();
        }
      });
      section.addEventListener("pointerleave", () => {
        state.hovered = false;
        update();
      });
      section.addEventListener("focusin", () => {
        state.focused = true;
        update();
      });
      section.addEventListener("focusout", (event) => {
        state.focused = event.relatedTarget instanceof Node && section.contains(event.relatedTarget);
        update();
      });
      document.addEventListener("visibilitychange", update);
      reducedMotion.addEventListener("change", () => {
        if (reducedMotion.matches) state.enabled = false;
        else if (autoplayWithoutButton && !button) state.enabled = true;
        update();
      });
      watchSection(section, (visible) => {
        state.inView = visible;
        update();
      });
      return { state, update };
    }

    function initRotator(options) {
      const section = document.getElementById(options.section);
      const track = document.getElementById(options.track);
      const viewport = section?.querySelector(options.viewport);
      if (!section || !track || !viewport || track.dataset.motionReady) return;
      const cards = Array.from(track.querySelectorAll(options.card));
      if (!cards.length) return;
      track.dataset.motionReady = "true";
      const previous = document.getElementById(options.previous);
      const next = document.getElementById(options.next);
      const playback = document.getElementById(options.playback);
      const countdown = options.countdown ? playback : null;
      const count = document.getElementById(options.count);
      const status = document.getElementById(options.status);
      cards.slice(0, Math.min(3, cards.length)).forEach((card) => track.appendChild(makeClone(card)));

      let position = 0;
      let step = 0;
      let visible = 1;
      let timer = null;
      let finishTimer = null;
      let resizeFrame = null;
      let moving = false;
      let version = 0;
      let mayPlay = false;
      const normalize = (value) => (value + cards.length) % cards.length;

      function clearTimer() {
        if (timer !== null) window.clearTimeout(timer);
        timer = null;
        countdown?.style.setProperty("--countdown-state", "paused");
      }

      function render() {
        track.style.transform = `translateX(${-position * step}px)`;
        // Warm only the current view and its next two photos, not the entire collection.
        for (let offset = 0; offset < visible + 2; offset++) {
          cards[normalize(position + offset)].querySelectorAll("img").forEach((image) => {
            image.loading = "eager";
          });
        }
        cards.forEach((card, index) => {
          const isVisible = index >= position && index < position + visible;
          card.inert = !isVisible;
          if (isVisible) card.removeAttribute("aria-hidden");
          else card.setAttribute("aria-hidden", "true");
        });
        if (count) count.textContent = `${String(normalize(position) + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      }

      function snap(value) {
        position = value;
        track.style.transition = "none";
        render();
        // Commit a snap before restoring the CSS transition for the next move.
        void track.offsetWidth;
        track.style.transition = "";
      }

      function settle() {
        version++;
        if (finishTimer !== null) window.clearTimeout(finishTimer);
        finishTimer = null;
        moving = false;
        snap(normalize(position));
      }

      function schedule() {
        clearTimer();
        if (!mayPlay || moving || !step || cards.length <= visible) return;
        if (countdown) {
          countdown.classList.remove("is-counting");
          countdown.style.setProperty("--countdown-duration", `${options.interval}ms`);
          void countdown.offsetWidth;
          countdown.classList.add("is-counting");
          countdown.style.setProperty("--countdown-state", "running");
        }
        timer = window.setTimeout(() => {
          timer = null;
          move(1, false);
        }, options.interval);
      }

      function move(direction, announce) {
        clearTimer();
        countdown?.classList.remove("is-counting");
        settle();
        if (!step || cards.length <= visible) return;
        if (direction < 0 && position === 0) snap(cards.length);
        position += direction;
        if (reducedMotion.matches) track.style.transition = "none";
        moving = !reducedMotion.matches;
        render();
        if (announce && status) {
          status.textContent = `Showing ${options.itemLabel} ${normalize(position) + 1} of ${cards.length}.`;
        }
        if (!moving) {
          settle();
          schedule();
          return;
        }
        const transitionVersion = version;
        finishTimer = window.setTimeout(() => {
          if (transitionVersion !== version) return;
          settle();
          schedule();
        }, 480);
      }

      function measure() {
        clearTimer();
        settle();
        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.columnGap) || Number.parseFloat(styles.getPropertyValue("--motion-gap")) || 24;
        step = cards[0].getBoundingClientRect().width + gap;
        visible = Math.max(1, Math.min(3, cards.length, Number.parseInt(styles.getPropertyValue("--visible"), 10) || Math.round((viewport.clientWidth + gap) / step)));
        previous && (previous.disabled = cards.length <= visible);
        next && (next.disabled = cards.length <= visible);
        playback && (playback.disabled = cards.length <= visible);
        snap(normalize(position));
        schedule();
      }

      previous?.addEventListener("click", () => move(-1, true));
      next?.addEventListener("click", () => move(1, true));
      const controller = installPlayback(section, playback, options.playbackLabel, (playing) => {
        mayPlay = playing;
        clearTimer();
        if (moving) settle();
        schedule();
      }, options.pauseOnHover !== false);
      const resize = () => {
        clearTimer();
        if (moving) settle();
        if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = null;
          measure();
        });
      };
      if (typeof ResizeObserver === "function") new ResizeObserver(resize).observe(viewport);
      else window.addEventListener("resize", resize);
      starters.push(() => {
        measure();
        controller.update();
      });
    }

    initRotator({
      section: "work", track: "workTrack", viewport: ".work-viewport", card: "a.work-item",
      previous: "workPrev", next: "workNext", playback: "workPlayback", count: "workCount", status: "workStatus",
      interval: 3500, itemLabel: "work photo", playbackLabel: "automatic work photos", pauseOnHover: false
    });
    initRotator({
      section: "voices", track: "quoteTrack", viewport: ".quotes-viewport", card: "figure.quote",
      previous: "quotesPrev", next: "quotesNext", playback: "quotesPlayback", count: "quotesCount", status: "quotesStatus",
      interval: 6500, itemLabel: "testimonial", playbackLabel: "automatic testimonials", countdown: true
    });

    const clients = document.getElementById("clients");
    const logoTrack = clients?.querySelector(".client-logo-track");
    const logoGroup = logoTrack?.querySelector(".client-logo-group");
    if (clients && logoTrack && logoGroup && !logoTrack.dataset.motionReady) {
      logoTrack.dataset.motionReady = "true";
      logoTrack.appendChild(makeClone(logoGroup));
      const controller = installPlayback(clients, null, "client logos", (playing) => {
        clients.classList.toggle("logo-playing", playing);
      }, true, true);
      starters.push(controller.update);
    }

    if (starters.length) {
      document.body.classList.add("motion-ready");
      starters.forEach((start) => start());
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initMotion);
  else initMotion();
})();
