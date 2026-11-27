import { actions, isInputError } from "astro:actions";

function initLeadForm() {
  const form = document.getElementById("lead-form") as HTMLFormElement | null;
  const submitBtn = document.getElementById("lead-submit-btn") as HTMLButtonElement | null;
  const successMsg = document.getElementById("lead-success-msg");
  const errorMsg = document.getElementById("lead-error-msg");
  const serviceSelect = document.getElementById("service") as HTMLSelectElement | null;
  const quoteSection = document.getElementById("quote");
  const serviceCards = document.querySelectorAll<HTMLElement>("[data-select-service]");

  if (!form || !submitBtn || !successMsg || !errorMsg) return;

  if (serviceSelect) {
    let highlightTimeout: number | undefined;

    const selectService = (value: string, shouldScroll = true) => {
      const isValidOption = Array.from(serviceSelect.options).some(
        (opt) => opt.value === value && !opt.disabled
      );
      if (!isValidOption) return;

      serviceSelect.value = value;
      serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));

      if (shouldScroll) {
        quoteSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      serviceSelect.focus({ preventScroll: true });

      window.clearTimeout(highlightTimeout);
      serviceSelect.classList.add("ring-2", "ring-catp-mauve", "border-catp-mauve");
      highlightTimeout = window.setTimeout(() => {
        serviceSelect.classList.remove("ring-2", "ring-catp-mauve", "border-catp-mauve");
      }, 1200);
    };

    serviceCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const value = card.dataset.selectService;
        if (!value) return;

        e.preventDefault();
        selectService(value, true);
      });
    });

    const preselected = new URLSearchParams(window.location.search).get("service");
    if (preselected) {
      selectService(preselected, true);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    successMsg.classList.add("hidden");
    errorMsg.classList.add("hidden");
    submitBtn.disabled = true;

    const originalText = submitBtn.textContent || "";
    submitBtn.textContent = form.dataset.sendingText || "Sending...";

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
      errorMsg.textContent = `> Error: ${form.dataset.connError || "Connection failed."}`;
      errorMsg.classList.remove("hidden");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

document.addEventListener("astro:page-load", initLeadForm);