const STORAGE_KEY = "active-persona";

function setPersona(
  target: string,
  buttons: NodeListOf<HTMLButtonElement>,
  contents: NodeListOf<HTMLElement>,
  animate = true
) {
  buttons.forEach((b) => {
    const isActive = b.dataset.switcher === target;
    b.toggleAttribute("data-active", isActive);
    b.setAttribute("aria-pressed", String(isActive));
  });

  contents.forEach((content) => {
    const isMatch = content.dataset.persona === target;
    content.classList.toggle("hidden", !isMatch);
    content.classList.toggle("block", isMatch);
    content.classList.toggle("animate-fade-in", isMatch && animate);
  });
}

function initPersonaSwitcher() {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-switcher]");
  const contents = document.querySelectorAll<HTMLElement>("[data-persona]");

  if (!buttons.length || !contents.length) return;

  const savedPersona = sessionStorage.getItem(STORAGE_KEY);
  if (
    savedPersona === "dev" ||
    savedPersona === "fgc" ||
    savedPersona === "creator"
  ) {
    setPersona(savedPersona, buttons, contents, false);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.switcher;
      if (!target) return;

      sessionStorage.setItem(STORAGE_KEY, target);
      setPersona(target, buttons, contents, true);
    });
  });
}

document.addEventListener("astro:after-swap", () => {
  const savedPersona = sessionStorage.getItem(STORAGE_KEY);
  if (!savedPersona) return;

  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-switcher]");
  const contents = document.querySelectorAll<HTMLElement>("[data-persona]");
  if (buttons.length && contents.length) {
    setPersona(savedPersona, buttons, contents, false);
  }
});

document.addEventListener("astro:page-load", initPersonaSwitcher);