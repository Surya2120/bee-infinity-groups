/* =========================
    HEADER SCROLL EFFECT
   ========================= */


const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});



/* SCROLL REVEAL */

function revealSections(){

const reveals=document.querySelectorAll(".reveal");

reveals.forEach(section=>{

const windowHeight=window.innerHeight;
const elementTop=section.getBoundingClientRect().top;

if(elementTop < windowHeight - 120){

section.classList.add("active");

}

});

}

window.addEventListener("scroll", revealSections);



/* PARALLAX */

window.addEventListener("scroll", function(){

const images=document.querySelectorAll(".parallax");

images.forEach(img=>{

const speed=0.15;

const rect=img.getBoundingClientRect();

const offset=rect.top * speed;

img.style.transform=`translateY(${offset}px)`;

});

});



/* POPUP */

function openForm(service){

document.getElementById("popup").style.display="flex";

document.getElementById("serviceName").value=service;

}

function closeForm(){

document.getElementById("popup").style.display="none";

}



/* WHATSAPP */

function whatsappBooking(){

let service=document.getElementById("serviceName").value;

let phone="919000000000";

let message=`Hello Bee Infinity Groups, I want to enquire about ${service}`;

let url=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

window.open(url);

}










/* =========================
   HAMBURGER MENU SYSTEM
========================= */

document.addEventListener("DOMContentLoaded", function () {

  const toggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav-links");

  if (!toggle || !nav) return;

  /* Create overlay */
  const overlay = document.createElement("div");
  overlay.classList.add("menu-overlay");
  document.body.appendChild(overlay);

  function openMenu() {
    toggle.classList.add("active");
    nav.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    toggle.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (nav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  /* Close when link clicked */
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  /* Close on ESC */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

});

