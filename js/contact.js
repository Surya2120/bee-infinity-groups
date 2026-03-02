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


document.addEventListener("DOMContentLoaded", function(){

/* =====================================================
   1️⃣ EMAIL JS
===================================================== */
emailjs.init("YOUR_PUBLIC_KEY");

const form = document.getElementById("contact-form");
const modal = document.getElementById("successModal");
const submitBtn = document.querySelector(".submit-btn");

form.addEventListener("submit", function(e){
  e.preventDefault();

  submitBtn.innerHTML = "Sending...";
  submitBtn.style.opacity = "0.7";

  emailjs.sendForm(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    this
  ).then(function(){
      modal.classList.add("active");
      form.reset();
      submitBtn.innerHTML = "Send Message";
      submitBtn.style.opacity = "1";

      setTimeout(()=>{
        modal.classList.remove("active");
      },3000);

  }, function(){
      alert("Error sending message.");
      submitBtn.innerHTML = "Send Message";
      submitBtn.style.opacity = "1";
  });
});


/* =====================================================
   2️⃣ CINEMATIC TYPING EFFECT
===================================================== */
const textElement = document.getElementById("typing-text");
const text = "Let’s Build Something Legendary";

let index = 0;
textElement.textContent = ""; // CLEAR FIRST

function typeEffect() {
  if (index < text.length) {
    textElement.textContent += text.charAt(index);
    index++;
    setTimeout(typeEffect, 50);
  }
}

typeEffect();

/* ===============================
   PREMIUM PARTICLES (Opposite Cursor)
================================= */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 200;

let mouse = {
  x: null,
  y: null
};

window.addEventListener("mousemove", function(e){
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("resize", function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

class Particle {
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.speedX = Math.random() * 0.3 - 0.15;
    this.speedY = Math.random() * 0.3 - 0.15;
  }

  update(){
    this.x += this.speedX;
    this.y += this.speedY;

    // Opposite cursor movement
    if(mouse.x && mouse.y){
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if(distance < 150){
        let force = (150 - distance) / 150;
        this.x += dx * force * 0.08;
        this.y += dy * force * 0.08;
      }
    }

    // Wrap edges
    if(this.x > canvas.width) this.x = 0;
    if(this.x < 0) this.x = canvas.width;
    if(this.y > canvas.height) this.y = 0;
    if(this.y < 0) this.y = canvas.height;
  }

  draw(){
ctx.fillStyle = "rgba(242,196,0,0.4)";
ctx.shadowColor = "#f2c400";
ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles(){
  particlesArray = [];
  for(let i = 0; i < numberOfParticles; i++){
    particlesArray.push(new Particle());
  }
}


function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i = 0; i < particlesArray.length; i++){
    particlesArray[i].update();
    particlesArray[i].draw();
  }


  requestAnimationFrame(animate);
}

initParticles();
animate();

/* =====================================================
   4️⃣ 3D TILT EFFECT ON FORM
===================================================== */
const formWrapper = document.querySelector(".contact-form-wrapper");

formWrapper.addEventListener("mousemove", (e) => {
  const rect = formWrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = -(y - centerY) / 25;
  const rotateY = (x - centerX) / 25;

  formWrapper.style.transform =
    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

formWrapper.addEventListener("mouseleave", () => {
  formWrapper.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg)";
});


/* =====================================================
   5️⃣ MAGNETIC BUTTON EFFECT
===================================================== */
submitBtn.addEventListener("mousemove", function(e){
  const rect = submitBtn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width/2;
  const y = e.clientY - rect.top - rect.height/2;

  submitBtn.style.transform = 
    `translate(${x*0.2}px, ${y*0.2}px)`;
});

submitBtn.addEventListener("mouseleave", function(){
  submitBtn.style.transform = "translate(0,0)";
});

});



  