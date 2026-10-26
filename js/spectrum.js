document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const scrollTop = document.getElementById("scrollTop");
  if (!scrollTop) return;

  const updateScrollTop = () => {
    const visible = window.scrollY > 500;
    scrollTop.classList.toggle("is-visible", visible);
    scrollTop.tabIndex = visible ? 0 : -1;
  };

  window.addEventListener("scroll", updateScrollTop, { passive: true });
  scrollTop.addEventListener("click", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });
  updateScrollTop();
});
