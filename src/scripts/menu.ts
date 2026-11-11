let isGlobalInitialized = false;

function initMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (!menuToggle || !mobileMenu || !menuBackdrop || !iconOpen || !iconClose) return;

  function setMenuState(isOpen: boolean) {
    if (!menuToggle || !mobileMenu || !menuBackdrop || !iconOpen || !iconClose) return;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.classList.toggle("translate-x-full", !isOpen);
    mobileMenu.classList.toggle("translate-x-0", isOpen);
    mobileMenu.classList.toggle("shadow-none", !isOpen);
    mobileMenu.classList.toggle("shadow-2xl", isOpen);

    menuBackdrop.classList.toggle("opacity-0", !isOpen);
    menuBackdrop.classList.toggle("pointer-events-none", !isOpen);
    menuBackdrop.classList.toggle("opacity-100", isOpen);
    menuBackdrop.classList.toggle("pointer-events-auto", isOpen);

    iconOpen.classList.toggle("block", !isOpen);
    iconOpen.classList.toggle("hidden", isOpen);
    iconClose.classList.toggle("hidden", !isOpen);
    iconClose.classList.toggle("block", isOpen);

    document.body.classList.toggle("overflow-hidden", isOpen);
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isExpanded);
  });

  menuBackdrop.addEventListener("click", () => setMenuState(false));

  if (!isGlobalInitialized) {
    window.addEventListener("keydown", (e) => {
      const toggle = document.getElementById("menu-toggle");
      if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
        setMenuState(false);
      }
    });

    window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
      if (e.matches) setMenuState(false);
    });

    isGlobalInitialized = true;
  }
}

document.addEventListener("astro:page-load", initMenu);