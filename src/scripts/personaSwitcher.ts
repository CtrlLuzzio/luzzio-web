const buttons = document.querySelectorAll<HTMLButtonElement>("[data-switcher]");
const contents = document.querySelectorAll<HTMLElement>("[data-persona]");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.switcher;
    if (!target) return;

    buttons.forEach((b) => {
      const isActive = b === btn;
      b.toggleAttribute("data-active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });

    contents.forEach((content) => {
      const isMatch = content.dataset.persona === target;
      content.classList.toggle("hidden", !isMatch);
      content.classList.toggle("block", isMatch);
      content.classList.toggle("animate-fade-in", isMatch);
    });
  });
});