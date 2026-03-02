document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".clients-scroll");
  if (!track) return;

  let speed = 0.5; // scrolling speed
  let position = 0;

  function move() {
    position -= speed;

    const firstLogo = track.children[0];
    if (!firstLogo) return;

    const logoWidth = firstLogo.offsetWidth + 60; // 60 = gap

    // when first logo fully exits
    if (Math.abs(position) >= logoWidth) {
      track.appendChild(firstLogo);
      position += logoWidth;
    }

    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(move);
  }

  move();
});


// HERO VIDEO SOUND CONTROLS
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const muteBtn = document.getElementById("muteToggle");
  const volumeSlider = document.getElementById("volumeControl");

  if (!video || !muteBtn || !volumeSlider) return;

  // Initial state
  video.muted = true;
  video.volume = volumeSlider.value;
  volumeSlider.classList.add("volume-hidden");
  muteBtn.textContent = "🔇";

  // Mute / Unmute toggle
  muteBtn.addEventListener("click", () => {
    if (video.muted) {
      video.muted = false;
      muteBtn.textContent = "🔊";
      volumeSlider.classList.remove("volume-hidden");
    } else {
      video.muted = true;
      muteBtn.textContent = "🔇";
      volumeSlider.classList.add("volume-hidden");
    }
  });

  // Volume change
  volumeSlider.addEventListener("input", () => {
    video.volume = volumeSlider.value;

    if (video.volume === 0) {
      video.muted = true;
      muteBtn.textContent = "🔇";
      volumeSlider.classList.add("volume-hidden");
    }
  });
});









document.addEventListener("DOMContentLoaded", () => {
  const divisionHeads = document.querySelectorAll(".division-head");

  divisionHeads.forEach(head => {
    head.addEventListener("click", () => {

      const currentBody = head.nextElementSibling;
      const currentBtn = head.querySelector(".expand-btn");

      // Close all others
      document.querySelectorAll(".division-body").forEach(body => {
        if (body !== currentBody) {
          body.classList.remove("active");
        }
      });

      document.querySelectorAll(".expand-btn").forEach(btn => {
        if (btn !== currentBtn) {
          btn.textContent = "+";
          btn.style.transform = "rotate(0deg)";
        }
      });

      // Toggle current
      if (currentBody.classList.contains("active")) {
        currentBody.classList.remove("active");
        currentBtn.textContent = "+";
        currentBtn.style.transform = "rotate(0deg)";
      } else {
        currentBody.classList.add("active");
        currentBtn.textContent = "−";
        currentBtn.style.transform = "rotate(180deg)";
      }
    });
  });
});
