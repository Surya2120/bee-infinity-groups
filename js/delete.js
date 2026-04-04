/* =========================
   LOADER / INTRO (ISOLATED & SAFE)
========================= */

window.addEventListener("load", () => {

  const loader = document.querySelector(".cinema-loader");
  const flash = document.querySelector(".flash");
  const sound = document.getElementById("introSound");
  const tap = document.querySelector(".tap-enter");

  let started = false;
  const IMPACT_TIME = 1200; // timing for cinematic delay

  function startExperience(e) {
    if (started) return;
    started = true;

    // 🛑 stop event from affecting anything else
    e.stopPropagation();

    // 🔊 SOUND
    if (sound) {
      sound.currentTime = 0;
      sound.volume = 0.6;
      sound.play().catch(()=>{});
    }

    // hide tap button
    if (tap) tap.style.display = "none";

    // 💥 IMPACT EFFECT
    setTimeout(() => {

      if (flash) flash.classList.add("active");
      document.body.classList.add("shake", "impact-glow");

      // remove shake
      setTimeout(() => {
        document.body.classList.remove("shake");
      }, 400);

      // 🔥 DISABLE LOADER INTERACTION IMMEDIATELY
        if (loader) {
          loader.classList.add("hide");
          loader.style.pointerEvents = "none";
        }

      // 🎬 EXIT LOADER
      // 🔥 REMOVE COMPLETELY AFTER ANIMATION
      setTimeout(() => {
        if (loader) loader.remove();
      }, 400);

    }, IMPACT_TIME);
  }

  tap.addEventListener("click", startExperience);

});


