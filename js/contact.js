/* Contact form and the lightweight Mr. Bee appearance in the page hero. */
(() => {
  "use strict";
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contactStatus");
  const submit = form?.querySelector('.submit-btn');
  const submitText = submit?.querySelector('.btn-text');
  const beeLine = document.getElementById("contactBeeLine");
  const beeCanvas = document.getElementById("contactBeeCanvas");
  const beeFigure = beeCanvas?.parentElement;
  if (!form || !status || !submit || !submitText) return;

  const endpoint = "https://script.google.com/macros/s/AKfycbzyEpagQaJLVrsJGWFGGcf1P-3CripF7nZcmoKI_YFTTvA-OlowqlXfCCMlBnWmgk5LSg/exec";
  const originalBeeLine = beeLine?.textContent || "";
  let sending = false;
  let buttonTimer = 0;
  let beeLineTimer = 0;
  let beeScene;
  let beePromise;
  let beeVisible = false;

  function setStatus(message, kind) {
    status.textContent = message;
    status.dataset.kind = kind;
    status.hidden = false;
  }
  function setBeeMood(value, message) {
    dispatchEvent(new CustomEvent("mrbee:welcome-mood", { detail: { mood: value } }));
    beeScene?.setMood?.(value);
    if (!beeLine) return;
    clearTimeout(beeLineTimer);
    beeLine.textContent = message;
    beeLineTimer = setTimeout(() => { beeLine.textContent = originalBeeLine; }, 5000);
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    clearTimeout(buttonTimer);
    sending = true;
    submit.disabled = true;
    submitText.textContent = "Sending...";
    form.setAttribute("aria-busy", "true");
    setStatus("Sending your message…", "sending");

    const fields = new FormData(form);
    const data = {
      name: String(fields.get("name") || "").trim(),
      email: String(fields.get("email") || "").trim(),
      phone: String(fields.get("phone") || "").trim(),
      message: String(fields.get("message") || "").trim()
    };

    try {
      const response = await fetch(endpoint, { method: "POST", body: JSON.stringify(data) });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      form.reset();
      submitText.textContent = "Message sent";
      setStatus("Thanks! Your message has been sent to Bee Infinity Groups.", "success");
      setBeeMood("excited", "Message delivered! I’ll let the founders take it from here. They’re better at email than I am.");
      buttonTimer = setTimeout(() => { submitText.textContent = "Send message"; }, 5000);
    } catch {
      submitText.textContent = "Send message";
      setStatus("Your message couldn’t be sent. Please try again, or call or email us directly.", "error");
      setBeeMood("sad", "A little turbulence! Please try again, or reach the team by phone or email.");
    } finally {
      sending = false;
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });

  if (beeCanvas && beeFigure) {
    const readiness = new MutationObserver(() => {
      if (beeCanvas.classList.contains("is-ready")) beeFigure.classList.add("is-rendered");
    });
    readiness.observe(beeCanvas, { attributes: true, attributeFilter: ["class"] });

    function loadBee() {
      if (!beePromise) {
        beePromise = import("./mrbee-welcome-scene.js?v=briefcase-v1").then(module => {
          beeScene = module.createWelcomeBee(beeCanvas);
          beeScene.setMood?.("neutral");
          if (beeVisible) beeScene.start?.();
        }).catch(() => { /* Keep the original bee image as the fallback. */ });
      } else if (beeScene && beeVisible) beeScene.start?.();
    }

    if (typeof IntersectionObserver === "function") {
      const observer = new IntersectionObserver(entries => {
        beeVisible = entries.some(entry => entry.isIntersecting);
        if (beeVisible) loadBee();
        else beeScene?.stop?.();
      }, { rootMargin: "80px 0px", threshold: 0.05 });
      observer.observe(beeFigure);
      addEventListener("pagehide", event => {
        if (!event.persisted) {
          observer.disconnect();
          readiness.disconnect();
          beeScene?.dispose?.();
        }
      });
    } else {
      beeVisible = true;
      loadBee();
      addEventListener("pagehide", () => readiness.disconnect());
    }
  }
  addEventListener("pagehide", () => { clearTimeout(buttonTimer); clearTimeout(beeLineTimer); });
})();
