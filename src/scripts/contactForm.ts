import { actions, isInputError } from "astro:actions";

function initContactForm() {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const submitBtn = document.getElementById("contact-submit-btn") as HTMLButtonElement | null;
  const successMsg = document.getElementById("contact-success-msg");
  const errorMsg = document.getElementById("contact-error-msg");

  if (!form || !submitBtn || !successMsg || !errorMsg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    successMsg.classList.add("hidden");
    errorMsg.classList.add("hidden");
    submitBtn.disabled = true;
    
    const originalText = submitBtn.textContent || "Send Message";
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(form);
      const { data, error } = await actions.contact.submitMessage(formData);

      if (error) {
        if (isInputError(error)) {
          const issue = Object.values(error.fields).flat()[0] || "Invalid input";
          errorMsg.textContent = `> Error: ${issue}`;
        } else {
          errorMsg.textContent = `> Error: ${error.message || "Failed to send"}`;
        }
        errorMsg.classList.remove("hidden");
      } else if (data?.success) {
        successMsg.textContent = `> ${data.message}`;
        successMsg.classList.remove("hidden");
        form.reset();
      }
    } catch {
      errorMsg.textContent = "> Error: Connection failed. Please try again.";
      errorMsg.classList.remove("hidden");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

document.addEventListener("astro:page-load", initContactForm);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForm);
} else {
  initContactForm();
}