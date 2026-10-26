document.querySelectorAll(".team-photo img").forEach((image) => {
  const showInitials = () => { image.hidden = true; };

  image.addEventListener("error", showInitials);
  image.addEventListener("load", () => { image.hidden = false; });

  if (image.complete && image.naturalWidth === 0) showInitials();
});
