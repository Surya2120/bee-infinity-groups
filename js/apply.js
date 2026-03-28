// ================= EMAILJS INIT =================
(function () {
  emailjs.init("RrB7lYG1wswiJ8sqT");
})();


// ================= GET ROLE FROM URL =================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role");

  if (role) {
    const roleInput = document.getElementById("jobRole");
    if (roleInput) {
      roleInput.value = decodeURIComponent(role);
      roleInput.readOnly = true; // 🔒 optional
    }
  }
});


// ================= FORM SUBMIT =================
const form = document.getElementById("applicationForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // 🔒 Basic validation
  if (!form.name.value || !form.email.value || !form.phone.value || !form.resumeLink.value) {
    alert("Please fill all required fields ⚠️");
    return;
  }

  const submitBtn = form.querySelector("button");
  submitBtn.innerText = "Sending...";
  submitBtn.disabled = true;

  const data = {
    jobRole: form.jobRole.value,
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    experience: form.experience.value,
    skills: form.skills.value,
    portfolio: form.portfolio.value,
    message: document.getElementById("message").value,
    resumeLink: form.resumeLink.value
  };

  // ================= SEND EMAIL =================
  emailjs.send("service_aghcu12", "template_d26sq62", data)
    .then(() => {

      // 🔥 SHOW POPUP INSTEAD OF ALERT
      document.getElementById("successPopup").style.display = "flex";

      form.reset();

      // keep role after reset
      const params = new URLSearchParams(window.location.search);
      const role = params.get("role");
      if (role) form.jobRole.value = decodeURIComponent(role);

      // ⏳ auto close popup after 3 sec (optional)
      setTimeout(() => {
        closePopup();
      }, 3000);

    })
    .catch((error) => {

      console.error("EmailJS Error:", error);
      alert("Failed to send ❌ Check console");

    })
    .finally(() => {

      submitBtn.innerText = "Submit Application";
      submitBtn.disabled = false;

    });
});


// ================= CLOSE POPUP =================
function closePopup() {
  document.getElementById("successPopup").style.display = "none";
}