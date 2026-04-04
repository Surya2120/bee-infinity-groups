




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


/* SUMBIT FORM */



// ==========================
// EMAILJS INIT
// ==========================
(function () {
  emailjs.init("RrB7lYG1wswiJ8sqT"); // 🔁 replace
})();

// ==========================
// SEND EMAIL
// ==========================
function sendEmail() {

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("serviceName").value.trim();
  const details = document.getElementById("details").value.trim();

  // ✅ Validation
  if (!name || !phone) {
    alert("Please enter your name and phone number");
    return;
  }

  // 📦 Data to send
  const params = {
    name: name,
    phone: phone,
    service: service,
    details: details
  };

  // 🚀 Send Email
  emailjs.send("service_aghcu12", "template_05np1uc", params)
    .then(() => {
      alert("Enquiry sent successfully!");

      // 🧹 Clear form
      document.getElementById("name").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("serviceName").value = "";
      document.getElementById("details").value = "";

      closeForm(); // optional (only if you have this function)
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      alert("Failed to send enquiry. Try again.");
    });
}



/* WHATSAPP */

function whatsappBooking(){

let service=document.getElementById("serviceName").value;

let phone="919739710942";

let message=`Hello Bee Infinity Groups, I want to enquire about ${service}`;

let url=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

window.open(url);

}





