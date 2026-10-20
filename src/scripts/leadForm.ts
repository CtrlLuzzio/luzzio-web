import { actions, isInputError } from "astro:actions";

function initLeadForm() {
  const form = document.getElementById("lead-form") as HTMLFormElement | null;
  const submitBtn = document.getElementById("lead-submit-btn") as HTMLButtonElement | null;
  const successMsg = document.getElementById("lead-success-msg");
  const errorMsg = document.getElementById("lead-error-msg");

  if (!form || !submitBtn || !successMsg || !errorMsg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    successMsg.classList.add("hidden");
    errorMsg.classList.add("hidden");
    submitBtn.disabled = true;

    const originalText = submitBtn.textContent || "Submit Request";
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(form);
      const { data, error } = await actions.leads.submitProject(formData);

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

document.addEventListener("astro:page-load", initLeadForm);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLeadForm);
} else {
  initLeadForm();
}