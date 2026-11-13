import {
  closeAllDropdowns,
  initDropdownGlobalListeners,
  toggleDropdown,
} from "../utils/dropdown";

function initLanguageDropdown() {
  const dropdown = document.querySelector<HTMLElement>('[data-dropdown="lang"]');
  const trigger = dropdown?.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-lang-switch]");

  if (!dropdown || !trigger || !links.length) return;

  initDropdownGlobalListeners();

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown(dropdown);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const selectedLang = link.getAttribute("data-lang-switch");
      if (selectedLang) {
        localStorage.setItem("lang", selectedLang);
      }
      closeAllDropdowns();
    });
  });
}

document.addEventListener("astro:page-load", initLanguageDropdown);