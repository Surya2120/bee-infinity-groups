




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





