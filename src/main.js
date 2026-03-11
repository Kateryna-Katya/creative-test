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

const form = document.getElementById("lead-form");
const successMessage = document.getElementById("success-message");

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);

    const lead = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      email: formData.get("email"),
      createdAt: new Date().toISOString(),
    };

    const savedLeads = JSON.parse(localStorage.getItem("velora-leads") || "[]");
    savedLeads.push(lead);
    localStorage.setItem("velora-leads", JSON.stringify(savedLeads));

    form.reset();
    successMessage.hidden = false;

    setTimeout(() => {
      successMessage.hidden = true;
    }, 5000);
  });
}