
/* =========================
    TIMLINE REVEAL ON SCROLL
   ========================= */
document.addEventListener("DOMContentLoaded", function(){

  const items = document.querySelectorAll(".journey-item");

  function reveal(){

    items.forEach(item => {

      const rect = item.getBoundingClientRect();

      if(rect.top < window.innerHeight * 0.8 && rect.bottom > 0){
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }

    });

  }

  window.addEventListener("scroll", reveal);
  reveal();

});
