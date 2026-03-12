const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach(item => observer.observe(item));

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("lead-form");
  const successMessage = document.getElementById("success-message");
  const phoneInput = document.querySelector("#phone");

  if (!form || !phoneInput || !successMessage) return;

  /* ==========================
      intl-tel-input
  ========================== */

  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "auto",

    geoIpLookup: callback => {
      fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(data => callback(data.country_code?.toLowerCase() || "uk"))
        .catch(() => callback("uk"));
    },

    preferredCountries: ["uk", "pl", "de"],
    separateDialCode: true,

    /* 🔹 добавляет поиск стран */
    countrySearch: true,

    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.12/build/js/utils.js",
  });

  /* ==========================
      FORM SUBMIT
  ========================== */

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!iti.isValidNumber()) {
      alert("Введите корректный номер телефона");
      phoneInput.focus();
      return;
    }

    const formData = new FormData(form);

    const lead = {
      firstName: formData.get("firstName")?.trim(),
      lastName: formData.get("lastName")?.trim(),
      email: formData.get("email")?.trim(),
      phone: iti.getNumber(),
      createdAt: new Date().toISOString(),
    };

    const savedLeads = JSON.parse(localStorage.getItem("velora-leads") || "[]");
    savedLeads.push(lead);
    localStorage.setItem("velora-leads", JSON.stringify(savedLeads));

    console.log("Saved lead:", lead);

    form.reset();
    iti.setCountry("ua");

    successMessage.hidden = false;

    setTimeout(() => {
      successMessage.hidden = true;
    }, 5000);
  });

});