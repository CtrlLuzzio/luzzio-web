import {
  closeAllDropdowns,
  initDropdownGlobalListeners,
  toggleDropdown,
} from "../utils/dropdown";

let isMediaListenerInitialized = false;

function updateActiveUI(theme: string | null) {
  const activeKey = theme === "latte" || theme === "mocha" ? theme : "system";

  const themeBtns = document.querySelectorAll<HTMLButtonElement>("[data-theme-btn]");
  themeBtns.forEach((btn) => {
    const btnTheme = btn.getAttribute("data-theme-btn");
    const isActive = btnTheme === activeKey;

    btn.classList.toggle("bg-catp-base", isActive);
    btn.classList.toggle("text-catp-blue", isActive);
    btn.classList.toggle("font-bold", isActive);
    btn.classList.toggle("text-catp-subtext-0", !isActive);
  });

  const triggerIcons = document.querySelectorAll<SVGElement>("[data-theme-trigger-icon]");
  triggerIcons.forEach((icon) => {
    const iconTheme = icon.getAttribute("data-theme-trigger-icon");
    const isMatch = iconTheme === activeKey;
    icon.classList.toggle("block", isMatch);
    icon.classList.toggle("hidden", !isMatch);
  });
}

function applyTheme(theme: string | null) {
  const systemPrefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  const isLatte = theme === "latte" || (!theme && systemPrefersLight);

  document.documentElement.classList.toggle("theme-latte", isLatte);
  updateActiveUI(theme);
}

function initThemeDropdown() {
  const dropdown = document.querySelector<HTMLElement>('[data-dropdown="theme"]');
  const trigger = dropdown?.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
  const themeBtns = document.querySelectorAll<HTMLButtonElement>("[data-theme-btn]");

  if (!dropdown || !trigger || !themeBtns.length) return;

  initDropdownGlobalListeners();

  const savedTheme = localStorage.getItem("theme");
  updateActiveUI(savedTheme);

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown(dropdown);
  });

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
      closeAllDropdowns();
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

document.addEventListener("astro:page-load", initThemeDropdown);