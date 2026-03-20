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
      roleInput.value = role;
    }
  }
});


// ================= FORM SUBMIT =================

const form = document.getElementById("applicationForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const file = document.getElementById("resumeFile").files[0];

  // 🔒 Validation
  if (!file) {
    alert("Please upload your resume ⚠️");
    return;
  }

  if (file.size > 500000) {
    alert("File too large (Max 500KB) ⚠️");
    return;
  }

  const submitBtn = form.querySelector("button");
  submitBtn.innerText = "Sending...";
  submitBtn.disabled = true;

  const reader = new FileReader();

  reader.onload = function () {

    const data = {
      jobRole: form.jobRole.value,
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      experience: form.experience.value,
      skills: form.skills.value,
      portfolio: form.portfolio.value,
      message: form.message.value,
      resume: reader.result
    };

    // 🔥 YOUR SERVICE + TEMPLATE
    emailjs.send("service_aghcu12", "template_d26sq62", data)
      .then(() => {

        alert("Application sent successfully ✅");

        form.reset();

        // keep role after reset
        const params = new URLSearchParams(window.location.search);
        const role = params.get("role");
        if (role) form.jobRole.value = role;

      })
      .catch((error) => {

        console.error("EmailJS Error:", error);
        alert("Failed to send ❌ Check console");

      })
      .finally(() => {

        submitBtn.innerText = "Submit Application";
        submitBtn.disabled = false;

      });

  };

  reader.readAsDataURL(file);
});