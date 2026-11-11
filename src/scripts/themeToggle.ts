let isMediaListenerInitialized = false;

function updateActiveUI(theme: string | null) {
  const themeBtns = document.querySelectorAll<HTMLButtonElement>("[data-theme-btn]");
  
  themeBtns.forEach((btn) => {
    const btnTheme = btn.getAttribute("data-theme-btn");
    const isActive =
      (theme === "latte" && btnTheme === "latte") ||
      (theme === "mocha" && btnTheme === "mocha") ||
      (!theme && btnTheme === "system");

    btn.classList.toggle("bg-catp-surface-1", isActive);
    btn.classList.toggle("text-catp-blue", isActive);
    btn.classList.toggle("text-catp-subtext-0", !isActive);
    btn.classList.toggle("hover:text-catp-text", !isActive);
  });
}

function applyTheme(theme: string | null) {
  const systemPrefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;
  const isLatte = theme === "latte" || (!theme && systemPrefersLight);

  document.documentElement.classList.toggle("theme-latte", isLatte);
  updateActiveUI(theme);
}

function initThemeToggle() {
  const themeBtns = document.querySelectorAll<HTMLButtonElement>("[data-theme-btn]");
  if (!themeBtns.length) return;

  const savedTheme = localStorage.getItem("theme");
  updateActiveUI(savedTheme);

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedTheme = btn.getAttribute("data-theme-btn");

      if (selectedTheme === "system") {
        localStorage.removeItem("theme");
        applyTheme(null);
      } else if (selectedTheme) {
        localStorage.setItem("theme", selectedTheme);
        applyTheme(selectedTheme);
      }
    });
  });

  if (!isMediaListenerInitialized) {
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", () => {
        if (!localStorage.getItem("theme")) {
          applyTheme(null);
        }
      });
    isMediaListenerInitialized = true;
  }
}

document.addEventListener("astro:page-load", initThemeToggle);