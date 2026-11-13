function initLanguageToggle() {
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-lang-switch]");
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const selectedLang = link.getAttribute("data-lang-switch");
      if (selectedLang) {
        localStorage.setItem("lang", selectedLang);
      }
    });
  });
}

document.addEventListener("astro:page-load", initLanguageToggle);